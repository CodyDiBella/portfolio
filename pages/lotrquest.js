import React, { useEffect, useState } from 'react';

const GRID_SIZE = 7;
const CENTER = Math.floor(GRID_SIZE / 2);
const MAX_HEALTH = 20;
const INITIAL_HEALTH = 5;
const DRAGON_DAMAGE = 13;
const XP_FOR_HEALTH_UPGRADE = 10;

const generateGrid = () => {
  const grid = [];

  for (let y = 0; y < GRID_SIZE; y++) {
    const row = [];
    for (let x = 0; x < GRID_SIZE; x++) {
      row.push({
        x,
        y,
        revealed: false,
        type: 'enemy',
        damage: Math.ceil(Math.random() * 4),
        defeated: false,
        xp: 0
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
    damage: DRAGON_DAMAGE,
    defeated: false,
    xp: 50
  };

  // Place 4 palantíri (scouts)
  let placed = 0;
  while (placed < 4) {
    const x = Math.floor(Math.random() * GRID_SIZE);
    const y = Math.floor(Math.random() * GRID_SIZE);
    const cell = grid[y][x];
    if ((x !== CENTER || y !== CENTER) && cell.type === 'enemy') {
      grid[y][x] = {
        x,
        y,
        revealed: true,
        type: 'palantir',
        damage: 0,
        defeated: false,
        xp: 0
      };
      placed++;
    }
  }

  return grid;
};

export default function LOTRDragonsweeper() {
  const [grid, setGrid] = useState([]);
  const [health, setHealth] = useState(INITIAL_HEALTH);
  const [maxHealth, setMaxHealth] = useState(INITIAL_HEALTH);
  const [xp, setXP] = useState(0);
  const [message, setMessage] = useState("Scout the battlefield and prepare your strength!");
  const [gameOver, setGameOver] = useState(false);
  const [victory, setVictory] = useState(false);

  useEffect(() => {
    setGrid(generateGrid());
  }, []);

  const revealArea = (x, y) => {
    const newGrid = [...grid];
    const dirs = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],          [0, 1],
      [1, -1], [1, 0], [1, 1]
    ];
    dirs.forEach(([dx, dy]) => {
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && ny >= 0 && nx < GRID_SIZE && ny < GRID_SIZE) {
        newGrid[ny][nx].revealed = true;
      }
    });
    setGrid(newGrid);
    setMessage("The palantír reveals nearby threats!");
  };

  const attack = (x, y) => {
    const newGrid = [...grid];
    const cell = newGrid[y][x];
    if (cell.defeated || cell.type === 'palantir') return;

    if (health > cell.damage) {
      setHealth(health - cell.damage);
      setXP(xp + (cell.type === 'dragon' ? cell.xp : cell.damage * 2));
      cell.defeated = true;
      cell.revealed = true;
      setMessage(`Defeated ${cell.type === 'dragon' ? 'the Dragon!' : 'a foe'} and gained XP!`);
      if (cell.type === 'dragon') {
        setVictory(true);
        setGameOver(true);
        setMessage("Victory! You have vanquished the Dragon!");
      }
    } else {
      setHealth(0);
      setGameOver(true);
      setMessage("You were slain by a powerful foe. The quest ends here.");
    }
    setGrid(newGrid);
  };

  const upgradeHealth = () => {
    if (xp >= XP_FOR_HEALTH_UPGRADE && maxHealth < MAX_HEALTH) {
      setXP(xp - XP_FOR_HEALTH_UPGRADE);
      setMaxHealth(maxHealth + 2);
      setHealth(health + 2);
      setMessage("You feel stronger. Max health increased!");
    } else {
      setMessage("Not enough XP or already at max health.");
    }
  };

  const restart = () => {
    setGrid(generateGrid());
    setHealth(INITIAL_HEALTH);
    setMaxHealth(INITIAL_HEALTH);
    setXP(0);
    setGameOver(false);
    setVictory(false);
    setMessage("Scout the battlefield and prepare your strength!");
  };

  const renderTile = (cell) => {
    let content = '❓';
    if (cell.revealed || cell.defeated || cell.type === 'palantir') {
      if (cell.type === 'dragon') content = `🔥${cell.damage}`;
      else if (cell.type === 'enemy') content = cell.defeated ? '💀' : `👹${cell.damage}`;
      else if (cell.type === 'palantir') content = '🔮';
    }
    return (
      <div
        key={`${cell.x}-${cell.y}`}
        onClick={() => {
          if (gameOver) return;
          if (cell.type === 'palantir') revealArea(cell.x, cell.y);
          else attack(cell.x, cell.y);
        }}
        style={{
          width: 46,
          height: 46,
          backgroundColor: cell.revealed || cell.defeated ? '#333' : '#111',
          border: '1px solid #555',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.85rem',
          cursor: gameOver ? 'default' : 'pointer',
        }}
      >
        {content}
      </div>
    );
  };

  return (
    <div style={{ fontFamily: 'serif', background: '#000', color: '#eee', padding: '1rem', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', color: '#ccaa00' }}>LOTR: Dragonsweeper</h1>
      <p style={{ textAlign: 'center' }}>{message}</p>

      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${GRID_SIZE}, 46px)`, justifyContent: 'center', gap: '4px', marginBottom: '1rem' }}>
        {grid.flat().map(renderTile)}
      </div>

      <div style={{ textAlign: 'center' }}>
        <p>❤️ Health: {health} / {maxHealth}</p>
        <p>✨ XP: {xp}</p>
        <button
          onClick={upgradeHealth}
          disabled={gameOver}
          style={{ margin: '0.5rem', padding: '0.5rem 1rem', background: '#224', color: '#fff', border: 'none', borderRadius: '4px' }}
        >
          Upgrade Health (10 XP)
        </button>
        <button
          onClick={restart}
          style={{ margin: '0.5rem', padding: '0.5rem 1rem', background: '#aa0', color: '#000', border: 'none', borderRadius: '4px' }}
        >
          Restart Quest
        </button>
        {gameOver && !victory && <p style={{ color: '#f55' }}>Game Over</p>}
        {victory && <p style={{ color: '#0f0' }}>Victory!</p>}
      </div>
    </div>
  );
}

