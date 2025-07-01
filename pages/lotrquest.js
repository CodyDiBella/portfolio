import React, { useState, useEffect } from 'react';

const GRID_SIZE = 7;
const CENTER = Math.floor(GRID_SIZE / 2);

const createInitialGrid = () => {
  const grid = [];
  for (let y = 0; y < GRID_SIZE; y++) {
    const row = [];
    for (let x = 0; x < GRID_SIZE; x++) {
      row.push({
        x,
        y,
        revealed: false,
        type: 'empty',
        damage: 0,
        xp: 0,
      });
    }
    grid.push(row);
  }

  // Place the dragon in the center
  grid[CENTER][CENTER] = {
    x: CENTER,
    y: CENTER,
    revealed: true,
    type: 'dragon',
    damage: 13,
    xp: 50,
  };

  // Place random enemies around
  let placed = 0;
  while (placed < 12) {
    const x = Math.floor(Math.random() * GRID_SIZE);
    const y = Math.floor(Math.random() * GRID_SIZE);
    if (x === CENTER && y === CENTER) continue;
    const cell = grid[y][x];
    if (cell.type === 'empty') {
      cell.type = 'enemy';
      cell.damage = Math.ceil(Math.random() * 4);
      cell.xp = cell.damage * 2;
      placed++;
    }
  }

  // Place 4 crystal balls (scouting tools)
  placed = 0;
  while (placed < 4) {
    const x = Math.floor(Math.random() * GRID_SIZE);
    const y = Math.floor(Math.random() * GRID_SIZE);
    const cell = grid[y][x];
    if (cell.type === 'empty') {
      cell.type = 'crystal';
      placed++;
    }
  }

  return grid;
};

export default function LOTRQuest() {
  const [grid, setGrid] = useState([]);
  const [health, setHealth] = useState(5);
  const [xp, setXP] = useState(0);
  const [message, setMessage] = useState('Scout the land using the crystal balls...');
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    setGrid(createInitialGrid());
  }, []);

  const revealArea = (x, y) => {
    const offsets = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],          [0, 1],
      [1, -1], [1, 0], [1, 1],
    ];

    const newGrid = [...grid];
    for (let [dx, dy] of offsets) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && nx < GRID_SIZE && ny >= 0 && ny < GRID_SIZE) {
        newGrid[ny][nx].revealed = true;
      }
    }
    newGrid[y][x].revealed = true;
    setGrid(newGrid);
    setMessage('Scouted nearby tiles. Plan your next move.');
  };

  const attackTile = (x, y) => {
    if (gameOver) return;
    const newGrid = [...grid];
    const cell = newGrid[y][x];
    if (!cell.revealed || cell.type === 'crystal') return;
    if (cell.type === 'enemy' || cell.type === 'dragon') {
      if (health > cell.damage) {
        setHealth(health - cell.damage);
        setXP(xp + cell.xp);
        setMessage(`You defeated ${cell.type === 'dragon' ? 'the Dragon!' : 'an enemy'} and gained ${cell.xp} XP.`);
        cell.type = 'defeated';
        cell.revealed = true;
        setGrid(newGrid);
        if (cell.type === 'dragon') {
          setGameOver(true);
        }
      } else {
        setHealth(0);
        setMessage('You were defeated... The darkness prevails.');
        setGameOver(true);
      }
    }
  };

  const renderTile = (cell) => {
    let content = '';
    if (cell.revealed) {
      if (cell.type === 'dragon') content = `🔥${cell.damage}`;
      else if (cell.type === 'enemy') content = `👹${cell.damage}`;
      else if (cell.type === 'crystal') content = '🔮';
      else if (cell.type === 'defeated') content = '💀';
    } else {
      content = '❓';
    }
    return (
      <div
        key={`${cell.x}-${cell.y}`}
        onClick={() => {
          if (cell.type === 'crystal') revealArea(cell.x, cell.y);
          else if (cell.revealed) attackTile(cell.x, cell.y);
        }}
        style={{
          width: 44,
          height: 44,
          backgroundColor: cell.revealed ? '#333' : '#111',
          border: '1px solid #555',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.9rem',
          cursor: gameOver ? 'default' : 'pointer',
        }}
      >
        {content}
      </div>
    );
  };

  return (
    <div style={{ fontFamily: 'serif', background: '#000', color: '#eee', padding: '1rem', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', color: '#ccaa00' }}>💍 LOTR: Dragonsweeper Quest</h1>
      <p style={{ textAlign: 'center' }}>{message}</p>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${GRID_SIZE}, 44px)`, justifyContent: 'center', gap: '4px', marginBottom: '1rem' }}>
        {grid.flat().map(renderTile)}
      </div>
      <div style={{ textAlign: 'center' }}>
        <p>❤️ Health: {health}</p>
        <p>✨ XP: {xp}</p>
        {gameOver && <p style={{ color: '#f55' }}>Game Over</p>}
        <button
          onClick={() => {
            setGrid(createInitialGrid());
            setHealth(5);
            setXP(0);
            setGameOver(false);
            setMessage('Scout the land using the crystal balls...');
          }}
          style={{ background: '#ccaa00', border: 'none', padding: '0.5rem 1rem', borderRadius: 4, marginTop: '1rem', cursor: 'pointer' }}
        >
          Restart Quest
        </button>
      </div>
    </div>
  );
}
