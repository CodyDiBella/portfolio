import React, { useState, useEffect } from 'react';

const GRID_SIZE = 5;
const MAX_ENERGY = 3;
const MAX_HEALTH = 3;

const generateGrid = () => {
  const grid = [];
  for (let y = 0; y < GRID_SIZE; y++) {
    const row = [];
    for (let x = 0; x < GRID_SIZE; x++) {
      const rand = Math.random();
      let type = 'empty';
      if (rand < 0.1) type = 'trap';
      else if (rand < 0.25) type = 'loot';
      else if (rand < 0.3) type = 'exit';
      row.push({ x, y, type, revealed: false });
    }
    grid.push(row);
  }
  // Ensure center is start and one exit exists
  grid[2][2] = { x: 2, y: 2, type: 'start', revealed: true };
  const exitX = Math.floor(Math.random() * GRID_SIZE);
  const exitY = Math.floor(Math.random() * GRID_SIZE);
  grid[exitY][exitX] = { ...grid[exitY][exitX], type: 'exit' };
  return grid;
};

export default function LOTRQuest() {
  const [grid, setGrid] = useState(generateGrid());
  const [pos, setPos] = useState({ x: 2, y: 2 });
  const [gold, setGold] = useState(0);
  const [health, setHealth] = useState(MAX_HEALTH);
  const [energy, setEnergy] = useState(3);
  const [message, setMessage] = useState('Explore the Mines of Moria...');
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedEnergy = parseInt(localStorage.getItem('lotr_energy') || '3');
      setEnergy(storedEnergy);
    }
  }, []);

  const directions = {
    ArrowUp: { x: 0, y: -1 },
    ArrowDown: { x: 0, y: 1 },
    ArrowLeft: { x: -1, y: 0 },
    ArrowRight: { x: 1, y: 0 },
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (!directions[e.key] || gameOver) return;
      move(directions[e.key]);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [pos, gameOver]);

  const move = (dir) => {
    const newX = pos.x + dir.x;
    const newY = pos.y + dir.y;
    if (newX < 0 || newX >= GRID_SIZE || newY < 0 || newY >= GRID_SIZE) return;

    const tile = grid[newY][newX];
    tile.revealed = true;
    setPos({ x: newX, y: newY });
    setGrid([...grid]);

    if (tile.type === 'loot') {
      setGold(gold + 10);
      setMessage('You found gold! +10');
    } else if (tile.type === 'trap') {
      setHealth(health - 1);
      setMessage('A trap! You lost 1 health.');
      if (health - 1 <= 0) {
        setMessage('You were defeated in the mines...');
        setGameOver(true);
      }
    } else if (tile.type === 'exit') {
      setMessage('You escaped with your loot!');
      setGameOver(true);
    } else {
      setMessage('You explore further...');
    }
  };

  const startNewRun = () => {
    if (energy <= 0) {
      setMessage("You're too tired to enter again today.");
      return;
    }
    const newEnergy = energy - 1;
    if (typeof window !== 'undefined') {
      localStorage.setItem('lotr_energy', newEnergy);
    }
    setEnergy(newEnergy);
    setGrid(generateGrid());
    setPos({ x: 2, y: 2 });
    setHealth(MAX_HEALTH);
    setGold(0);
    setGameOver(false);
    setMessage('You enter the mines...');
  };

  return (
    <div
      style={{
        fontFamily: 'Cinzel, serif',
        padding: '1rem',
        color: '#eee',
        backgroundColor: '#111',
        minHeight: '100vh',
        textAlign: 'center',
      }}
    >
      <h1 style={{ color: '#ccaa00' }}>Loot Rush: Mines of Moria</h1>
      <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>{message}</p>

      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${GRID_SIZE}, 50px)`, gap: '4px', justifyContent: 'center', marginBottom: '1rem' }}>
        {grid.flat().map((tile) => (
          <div
            key={`${tile.x},${tile.y}`}
            style={{
              width: '50px',
              height: '50px',
              backgroundColor: tile.revealed ? (tile.type === 'trap' ? '#922' : tile.type === 'loot' ? '#cc0' : tile.type === 'exit' ? '#0c0' : '#444') : '#222',
              border: pos.x === tile.x && pos.y === tile.y ? '2px solid #fff' : '1px solid #333',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.8rem',
            }}
          >
            {tile.revealed ? (tile.type === 'trap' ? '💥' : tile.type === 'loot' ? '💰' : tile.type === 'exit' ? '🚪' : '') : ''}
          </div>
        ))}
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <p>❤️ Health: {health} / {MAX_HEALTH}</p>
        <p>⚡ Willpower: {energy} / {MAX_ENERGY}</p>
        <p>🪙 Gold: {gold}</p>
      </div>

      <button
        onClick={startNewRun}
        disabled={gameOver === false && energy > 0}
        style={{
          backgroundColor: '#ccaa00',
          color: '#000',
          border: 'none',
          padding: '0.5rem 1rem',
          borderRadius: '5px',
          fontWeight: 'bold',
          cursor: 'pointer',
        }}
      >
        {energy <= 0 ? 'No Energy Left Today' : gameOver ? 'Start New Run' : 'Exploring...'}
      </button>

      <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#888' }}>
        Use arrow keys to move. Tap Start Run when cravings hit.
      </p>
    </div>
  );
}
