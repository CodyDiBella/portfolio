import React, { useState, useEffect } from 'react';

const GRID_SIZE = 6;
const NUM_TRAPS = 6;
const NUM_COINS = 8;
const NUM_RELICS = 3;
const MAX_HEALTH = 3;

const generateEmptyGrid = () => {
  return Array(GRID_SIZE).fill(null).map((_, y) =>
    Array(GRID_SIZE).fill(null).map((_, x) => ({
      x,
      y,
      revealed: false,
      flagged: false,
      type: 'empty',
      adjacentTraps: 0,
    }))
  );
};

const placeRandom = (grid, type, count) => {
  let placed = 0;
  while (placed < count) {
    const y = Math.floor(Math.random() * GRID_SIZE);
    const x = Math.floor(Math.random() * GRID_SIZE);
    if (grid[y][x].type === 'empty') {
      grid[y][x].type = type;
      placed++;
    }
  }
};

const countAdjacents = (grid) => {
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      if (grid[y][x].type === 'trap') continue;
      let count = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const ny = y + dy;
          const nx = x + dx;
          if (ny >= 0 && ny < GRID_SIZE && nx >= 0 && nx < GRID_SIZE && grid[ny][nx].type === 'trap') {
            count++;
          }
        }
      }
      grid[y][x].adjacentTraps = count;
    }
  }
};

export default function LOTRQuest() {
  const [grid, setGrid] = useState([]);
  const [health, setHealth] = useState(MAX_HEALTH);
  const [coins, setCoins] = useState(() => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem('lotr_coins') || '0');
    }
    return 0;
  });
  const [relics, setRelics] = useState(() => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem('lotr_relics') || '0');
    }
    return 0;
  });
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('Tap a tile to reveal the path through Mordor.');

  const startNewGame = () => {
    const newGrid = generateEmptyGrid();
    placeRandom(newGrid, 'trap', NUM_TRAPS);
    placeRandom(newGrid, 'coin', NUM_COINS);
    placeRandom(newGrid, 'relic', NUM_RELICS);
    countAdjacents(newGrid);
    setGrid(newGrid);
    setHealth(MAX_HEALTH);
    setGameOver(false);
    setMessage('Tap a tile to reveal the path through Mordor.');
  };

  useEffect(() => {
    startNewGame();
  }, []);

  const revealTile = (tile) => {
    if (gameOver || tile.revealed) return;
    const newGrid = [...grid];
    const newTile = { ...tile, revealed: true };
    newGrid[tile.y][tile.x] = newTile;

    if (tile.type === 'trap') {
      const newHealth = health - 1;
      setHealth(newHealth);
      setMessage('You triggered an Orc trap!');
      if (newHealth <= 0) {
        setGameOver(true);
        setMessage('You succumbed to the dangers of Mordor...');
      }
    } else if (tile.type === 'coin') {
      const newCoins = coins + 1;
      setCoins(newCoins);
      if (typeof window !== 'undefined') {
        localStorage.setItem('lotr_coins', newCoins);
      }
      setMessage('You found gold coins!');
    } else if (tile.type === 'relic') {
      const newRelics = relics + 1;
      setRelics(newRelics);
      if (typeof window !== 'undefined') {
        localStorage.setItem('lotr_relics', newRelics);
      }
      setMessage('You discovered an ancient relic!');
    } else {
      setMessage(`Safe. ${tile.adjacentTraps} traps nearby.`);
    }

    setGrid(newGrid);
  };

  return (
    <div style={{ fontFamily: 'Cinzel, serif', padding: '1rem', backgroundColor: '#111', color: '#eee', minHeight: '100vh' }}>
      <h1 style={{ color: '#ccaa00', textAlign: 'center' }}>Path Through Mordor</h1>
      <p style={{ textAlign: 'center', marginBottom: '1rem' }}>{message}</p>

      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${GRID_SIZE}, 48px)`, justifyContent: 'center', gap: '4px' }}>
        {grid.flat().map((tile) => (
          <div
            key={`${tile.x}-${tile.y}`}
            onClick={() => revealTile(tile)}
            style={{
              width: '48px',
              height: '48px',
              backgroundColor: tile.revealed ? (tile.type === 'trap' ? '#922' : tile.type === 'coin' ? '#cc0' : tile.type === 'relic' ? '#0cf' : '#444') : '#222',
              border: '1px solid #333',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.9rem',
              cursor: 'pointer',
            }}
          >
            {tile.revealed ?
              tile.type === 'trap' ? '💀'
              : tile.type === 'coin' ? '🪙'
              : tile.type === 'relic' ? '🧿'
              : tile.adjacentTraps > 0 ? tile.adjacentTraps : ''
              : ''}
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
        <p>❤️ Health: {health} / {MAX_HEALTH}</p>
        <p>🪙 Gold Coins: {coins}</p>
        <p>🧿 Relics: {relics}</p>
        <button
          onClick={startNewGame}
          style={{
            marginTop: '1rem',
            backgroundColor: '#ccaa00',
            color: '#000',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '5px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          New Quest
        </button>
      </div>
    </div>
  );
}
