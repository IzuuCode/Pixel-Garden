import React from 'react';
import { TOOLS } from '../constants';

const Inventory = ({ selectedTool, onSelectTool }) => {
    const tools = [
        { id: TOOLS.WATER, icon: '💧', label: 'Water' },
        { id: TOOLS.SEED_FLOWER, icon: '🌻', label: 'Flower' },
        { id: TOOLS.SEED_TREE, icon: '🌲', label: 'Tree' },
        { id: TOOLS.SHOVEL, icon: '🥄', label: 'Shovel' },
    ];

    return (
        <div className="flex flex-wrap justify-center gap-4 p-4 bg-[#FDF6E3] border-4 border-[#657B83] rounded-lg mt-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
            {tools.map(tool => (
                <button
                    key={tool.id}
                    onClick={() => onSelectTool(tool.id)}
                    className={`
            flex flex-col items-center justify-center p-2 w-20 h-20 
            border-4 rounded transition-all font-pixel text-[10px] uppercase tracking-wide
            ${selectedTool === tool.id
                            ? 'bg-blue-100 border-blue-500 translate-y-1 shadow-inner'
                            : 'bg-white border-[#93A1A1] hover:bg-gray-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] active:translate-y-1 active:shadow-inner'}
          `}
                >
                    <span className="text-2xl mb-1">{tool.icon}</span>
                    <span>{tool.label}</span>
                </button>
            ))}
        </div>
    );
};

export default Inventory;
