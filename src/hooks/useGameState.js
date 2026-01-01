import { useState, useEffect, useCallback } from 'react';
import { PLANT_TYPES, GRID_SIZE, WATER_DURATION, TICK_RATE, TOOLS } from '../constants';

const SAVE_KEY = 'pixel_garden_data';
const INITIAL_GRID = Array(GRID_SIZE).fill(null);

export const useGameState = () => {
    const [grid, setGrid] = useState(() => {
        const saved = localStorage.getItem(SAVE_KEY);
        const now = Date.now();
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                const savedGrid = parsed.grid || INITIAL_GRID;
                const lastSave = parsed.lastSave || now;
                const elapsed = now - lastSave;

                return savedGrid.map(plant => {
                    if (!plant) return null;

                    // Calculate if it grew while away
                    // Logic: Water remaining at save time was (LastWatered + Duration) - LastSave
                    // Growth accrued is min(TimeAway, WaterRemaining)

                    // However, if lastWatered was 0 (never), it should be big negative, so max(0, ...) works.
                    const timeSinceWateredAtSave = lastSave - plant.lastWatered;
                    const waterRemainingAtSave = Math.max(0, WATER_DURATION - timeSinceWateredAtSave);
                    const growthDuringAbsence = Math.min(elapsed, waterRemainingAtSave);

                    return {
                        ...plant,
                        accumulatedGrowth: plant.accumulatedGrowth + growthDuringAbsence
                    };
                });
            } catch (e) {
                console.error("Failed to load save", e);
                return INITIAL_GRID;
            }
        }
        return INITIAL_GRID;
    });

    // Game Loop for Active Growth
    useEffect(() => {
        const interval = setInterval(() => {
            setGrid(currentGrid => {
                const now = Date.now();
                let changed = false;
                const newGrid = currentGrid.map(plant => {
                    if (!plant) return null;

                    const isWet = (now - plant.lastWatered) < WATER_DURATION;
                    const typeDef = PLANT_TYPES[plant.type];
                    // Safety check if typeDef is missing (e.g. valid save but code changed)
                    if (!typeDef) return plant;

                    const maxGrowth = (typeDef.stages.length - 1) * typeDef.growthTime;
                    const isFullyGrown = plant.accumulatedGrowth >= maxGrowth;

                    if (isWet && !isFullyGrown) {
                        changed = true;
                        return {
                            ...plant,
                            accumulatedGrowth: plant.accumulatedGrowth + TICK_RATE
                        };
                    }
                    return plant;
                });
                return changed ? newGrid : currentGrid;
            });
        }, TICK_RATE);
        return () => clearInterval(interval);
    }, []);

    // Save State
    useEffect(() => {
        const state = {
            grid,
            lastSave: Date.now()
        };
        localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    }, [grid]);

    const interact = useCallback((index, tool) => {
        setGrid(prev => {
            const newGrid = [...prev];
            const cell = newGrid[index];
            const now = Date.now();

            if (tool === TOOLS.SHOVEL) {
                newGrid[index] = null;
            } else if (tool === TOOLS.WATER) {
                if (cell) {
                    newGrid[index] = { ...cell, lastWatered: now };
                }
            } else if (tool === TOOLS.SEED_FLOWER || tool === TOOLS.SEED_TREE) {
                // Can only plant in empty spot
                if (!cell) {
                    const typeKey = tool === TOOLS.SEED_FLOWER ? 'FLOWER' : 'TREE';
                    newGrid[index] = {
                        type: typeKey,
                        plantedAt: now,
                        lastWatered: 0, // Starts dry, needs water
                        accumulatedGrowth: 0
                    };
                }
            }
            return newGrid;
        });
    }, []);

    return { grid, interact };
};
