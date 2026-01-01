import React, { useState } from 'react';
import { useGameState } from './hooks/useGameState';
import Grid from './components/Grid';
import Inventory from './components/Inventory';
import { TOOLS } from './constants';

function App() {
  const { grid, interact } = useGameState();
  const [selectedTool, setSelectedTool] = useState(TOOLS.WATER);

  const resetGame = () => {
    localStorage.removeItem('pixel_garden_data');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#FDF6E3] flex flex-col items-center justify-center p-4 font-pixel text-[#657B83] select-none">
      <div className="absolute inset-0 pointer-events-none opacity-5 bg-[radial-gradient(#657B83_1px,transparent_1px)] [background-size:16px_16px]"></div>

      <h1 className="text-3xl md:text-5xl mb-8 text-[#B58900] drop-shadow-[2px_2px_0px_rgba(0,0,0,0.1)] z-10 text-center leading-relaxed">
        Pixel Garden
      </h1>

      <div className="flex flex-col items-center md:flex-row gap-8 items-start z-10">
        <Grid grid={grid} selectedTool={selectedTool} onInteract={interact} />

        <div className="hidden md:block w-0.5 h-64 bg-[#93A1A1] opacity-20 mx-4"></div>

        <div className="flex flex-col items-center">
          <div className="bg-white p-4 rounded-lg border-2 border-[#93A1A1] shadow-md max-w-xs text-xs z-10 mb-4">
            <p className="font-bold mb-2 text-[#586E75]">How to Play:</p>
            <ul className="list-disc pl-4 space-y-2">
              <li>Select a <span className="text-[#2AA198]">Seed</span> and click an empty pot.</li>
              <li>Select <span className="text-[#268BD2]">Water</span> and click plants to keep them wet.</li>
              <li>Plants only grow when wet! (Wait 10-30s)</li>
              <li>They will dry out 🥀 if ignored.</li>
            </ul>
          </div>

          <Inventory selectedTool={selectedTool} onSelectTool={setSelectedTool} />
        </div>
      </div>

      {/* Mobile Instructions */}
      <div className="md:hidden mt-8 bg-white p-4 rounded-lg border-2 border-[#93A1A1] shadow-md max-w-xs text-xs z-10">
        <p className="font-bold mb-2 text-[#586E75]">How to Play:</p>
        <ul className="list-disc pl-4 space-y-2">
          <li>Plant seeds 🌱</li>
          <li>Water often 💧</li>
          <li>Watch them bloom 🌻</li>
        </ul>
      </div>

      <button
        onClick={resetGame}
        className="mt-12 text-xs text-[#93A1A1] underline hover:text-red-400 z-10 transition-colors"
      >
        Reset Garden
      </button>
    </div>
  );
}

export default App;
