import React from 'react';
import { PLANT_TYPES, WATER_DURATION } from '../constants';

const Plot = ({ plant, index, selectedTool, onInteract }) => {
    const now = Date.now();
    let content = null;
    let status = null;

    if (plant) {
        const isWet = (now - plant.lastWatered) < WATER_DURATION;
        const typeDef = PLANT_TYPES[plant.type];

        // Safety check in case type changed
        if (!typeDef) {
            content = <span className="text-xs text-red-500">Error</span>;
        } else {
            const maxStage = typeDef.stages.length - 1;
            const stageIndex = Math.min(
                Math.floor(plant.accumulatedGrowth / typeDef.growthTime),
                maxStage
            );
            const renderStage = typeDef.stages[stageIndex];

            content = <span className="text-4xl select-none filter drop-shadow-sm transition-all transform hover:scale-110">{renderStage}</span>;

            // Status Icons
            if (stageIndex < maxStage) {
                status = isWet ?
                    <span className="absolute top-1 right-1 text-sm animate-pulse" title="Watered">💧</span> :
                    <span className="absolute top-1 right-1 text-sm opacity-70 grayscale" title="Needs Water">🥀</span>;
            } else {
                status = <span className="absolute top-1 right-1 text-sm animate-pulse" title="Ready">✨</span>;
            }

            // Progress Bar (Simple)
            if (stageIndex < maxStage) {
                const currentStageGrowth = stageIndex * typeDef.growthTime;
                const progress = Math.min(100, Math.max(0, ((plant.accumulatedGrowth - currentStageGrowth) / (typeDef.growthTime)) * 100));

                status = (
                    <>
                        {status}
                        <div className="absolute bottom-1 left-1 right-1 h-1 bg-[#5D4037] rounded-full overflow-hidden">
                            <div
                                className={`h-full ${isWet ? 'bg-blue-400' : 'bg-orange-400'} transition-all duration-1000`}
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </>
                )
            }
        }
    }

    return (
        <div
            onClick={() => onInteract(index, selectedTool)}
            className="relative w-24 h-24 bg-[#D8A48F] border-4 border-[#8B5A2B] 
                  cursor-pointer hover:brightness-110 flex items-center justify-center
                  shadow-[inset_2px_2px_4px_rgba(0,0,0,0.2)] rounded-sm transition-transform active:scale-95 group"
        >
            {/* Soil Texture Overlay */}
            <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIi8+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMwMDAiLz4KPC9zdmc+')] pointer-events-none"></div>

            {content}
            {status}

            {!plant && (
                <span className="opacity-0 group-hover:opacity-20 text-3xl select-none">🌱</span>
            )}
        </div>
    );
};

export default Plot;
