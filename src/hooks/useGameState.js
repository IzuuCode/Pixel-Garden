import { useState, useEffect, useCallback } from 'react';
import { PLANT_TYPES, GRID_SIZE, WATER_DURATION, TICK_RATE, TOOLS } from '../constants';

const SAVE_KEY = 'pixel_garden_data';
const INITIAL_GRID = Array(GRID_SIZE).fill(null);

export const useGameState = () => {
    const [tick, setTick] = useState(0); // Add tick to force re-renders
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

    // Game Loop
    useEffect(() => {
        const interval = setInterval(() => {
            setTick(t => t + 1); // Force update every tick
            setGrid(currentGrid => {
                const now = Date.now();
                let changed = false;
                const newGrid = currentGrid.map(plant => {
                    if (!plant) return null;

                    const isWet = (now - plant.lastWatered) < WATER_DURATION;
                    const typeDef = PLANT_TYPES[plant.type];
                    if (!typeDef) return plant;

                    const maxGrowth = (typeDef.stages.length - 1) * typeDef.growthTime;
                    const isFullyGrown = plant.accumulatedGrowth >= maxGrowth;

                    if (isWet && !isFullyGrown) {
                        // We always return a new object if we want to ensure state updates 
                        // but actually 'changed' flag is enough for React optimization.
                        // However, since we update 'tick', the component WILL re-render anyway.
                        // We just need to update the grid data correctly.
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
    }, [grid, tick]); // Save on tick too? Maybe unnecessary IO. Save on grid change. 
    // Actually, saving on every tick (1s) is fine for local helper, but maybe too much.
    // 'grid' updates if growth happens. If no growth, grid doesn't update.
    // But we want to save 'lastSave' so that if user closes tab, we know when they left.
    // If we only save when 'grid' changes, and they leave when grid is stable (dry), we might lose time reference?
    // No, if they leave, 'grid' state is the same. 'lastSave' will be the timestamp of that last save.
    // Ideally save on unload, but that's flaky.
    // Saving every 5s or so is better. For now, on 'grid' change is fine.

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
                if (!cell) {
                    const typeKey = tool === TOOLS.SEED_FLOWER ? 'FLOWER' : 'TREE';
                    newGrid[index] = {
                        type: typeKey,
                        plantedAt: now,
                        lastWatered: 0,
                        accumulatedGrowth: 0
                    };
                }
            }
            return newGrid;
        });
    }, []);

    return { grid, interact, tick };
};
