import React from 'react';
import Plot from './Plot';

const Grid = ({ grid, selectedTool, onInteract }) => {
    return (
        <div className="grid grid-cols-3 gap-3 bg-[#8B5A2B] p-3 border-4 border-[#5D4037] rounded-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,0.15)]">
            {grid.map((plant, index) => (
                <Plot
                    key={index}
                    index={index}
                    plant={plant}
                    selectedTool={selectedTool}
                    onInteract={onInteract}
                />
            ))}
        </div>
    );
};

export default Grid;
