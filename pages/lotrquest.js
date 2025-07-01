import React, { useState, useEffect } from 'react';

const COLS = 13;
const ROWS = 10;
const CENTER_X = Math.floor(COLS / 2);
const CENTER_Y = Math.floor(ROWS / 2);
const SMAUG_DAMAGE = 15;
const START_HEALTH = 5;
const MAX_HEALTH_CAP = 15;
const XP_PER_HEALTH = 10;

const ENEMY_TYPES = [
  { name: 'Goblin', emoji: '👺', max: 3 },
  { name: 'Orc', emoji: '👹', max: 5 },
  { name: 'Warg', emoji: '🐺', max: 7 },
  { name: 'Troll', emoji: '🧌', max: 9 },
];

function randEnemy() {
  const t = ENEMY_TYPES[Math.floor(Math.random() * ENEMY_TYPES.length)];
  const str = 1 + Math.floor(Math.random() * t.max);
  return { type: t.name, emoji: t.emoji, strength: str, defeated: false };
}

function makeGrid() {
  const g = Array(ROWS).fill().map((_, y) =>
    Array(COLS).fill().map((_, x) =>
      x === CENTER_X && y === CENTER_Y
        ? { x, y, revealed: true, type: 'smaug', emoji: '🐉', strength: SMAUG_DAMAGE, defeated: false }
        : { x, y, revealed: false, ...randEnemy() }
    )
  );

  // Place 2 palantíri
  let placed = 0;
  while (placed < 2) {
    const px = Math.floor(Math.random() * COLS);
    const py = Math.floor(Math.random() * ROWS);
    if ((px !== CENTER_X || py !== CENTER_Y) && !g[py][px].palantir && !g[py][px].revealed) {
      g[py][px] = { x: px, y: py, revealed: true, type: 'palantir', emoji: '🔮' };
      placed++;
    }
  }
  return g;
}

export default function LOTRDragonsweeper() {
  const [grid, setGrid] = useState([]);
  const [hp, setHP] = useState(START_HEALTH);
  const [maxHP, setMaxHP] = useState(START_HEALTH);
  const [xp, setXP] = useState(0);
  const [msg, setMsg] = useState('Use a Palantír to scout, then prepare your assault.');
  const [gameOver, setGameOver] = useState(false);
  const [victory, setVictory] = useState(false);

  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = () => {
    setGrid(makeGrid());
    setHP(START_HEALTH);
    setMaxHP(START_HEALTH);
    setXP(0);
    setMsg('Use a Palantír to scout, then prepare your assault.');
    setGameOver(false);
    setVictory(false);
  };

  const revealArea = (x, y) => {
    const g = grid.map(row => row.map(cell => ({ ...cell })));
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const nx = x + dx, ny = y + dy;
        if (nx >= 0 && nx < COLS && ny >= 0 && ny < ROWS) {
          g[ny][nx].revealed = true;
        }
      }
    }
    setGrid(g);
    setMsg('Palantír reveals nearby threats.');
  };

  const adjacentSum = (x, y) => {
    let sum = 0;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const nx = x + dx, ny = y + dy;
        if ((dx || dy) && nx >= 0 && nx < COLS && ny >= 0 && ny < ROWS) {
          const c = grid[ny][nx];
          if (c.revealed && !c.defeated && c.type !== 'palantir') sum += c.strength;
        }
      }
    }
    return sum;
  };

  const attack = (x, y) => {
    if (gameOver) return;
    const g = grid.map(row => row.map(cell => ({ ...cell })));
    const cell = g[y][x];
    if (!cell.revealed || cell.type === 'palantir' || cell.defeated) return;

    if (hp > cell.strength) {
      const newHP = hp - cell.strength;
      const gainXP = cell.strength * 2;
      setHP(newHP);
      setXP(prev => prev + gainXP);
      cell.defeated = true;
      setMsg(`${cell.type} defeated! +${gainXP} XP. Adjacent foes = ${adjacentSum(x, y)}.`);
      if (cell.type === 'smaug') {
        setMsg('🏆 You have slain Smaug! Victory is yours!');
        setVictory(true);
        setGameOver(true);
      }
    } else {
      setHP(0);
      setMsg('You were slain... The quest is lost.');
      setGameOver(true);
    }
    cell.revealed = true;
    setGrid(g);
  };

  const upgradeHP = () => {
    if (xp >= XP_PER_HEALTH && maxHP < MAX_HEALTH_CAP) {
      setXP(prev => prev - XP_PER_HEALTH);
      setMaxHP(prev => prev + 1);
      setHP(prev => prev + 1);
      setMsg('Your heart grows braver. +1 Max HP.');
    } else {
      setMsg('Need more XP or reached max health.');
    }
  };

  return (
    <div style={{ fontFamily: 'serif', background: '#000', color: '#eee', padding: '1rem', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', color: '#ccaa00' }}>LOTR Dragonsweeper</h1>
      <p style={{ textAlign: 'center' }}>{msg}</p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${COLS}, 40px)`,
        justifyContent: 'center',
        gap: '2px',
        marginBottom: '1rem'
      }}>
        {grid.flat().map(cell => (
          <div
            key={`${cell.x}-${cell.y}`}
            onClick={() => cell.type === 'palantir' ? revealArea(cell.x, cell.y) : attack(cell.x, cell.y)}
            style={{
              width: 40, height: 40,
              backgroundColor: cell.revealed || cell.defeated ? '#333' : '#111',
              border: '1px solid #555',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.85rem',
              cursor: gameOver ? 'default' : 'pointer'
            }}
          >
            {cell.revealed || cell.defeated
              ? cell.type === 'palantir' ? '🔮' :
                cell.type === 'smaug' ? `🐉${cell.strength}` :
                cell.defeated ? '💀' :
                cell.strength
              : ''}
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center' }}>
        <p>❤️ HP: {hp} / {maxHP} &nbsp;&nbsp; XP: {xp}</p>
        <button
          onClick={upgradeHP}
          disabled={gameOver || xp < XP_PER_HEALTH || maxHP >= MAX_HEALTH_CAP}
          style={{ margin: '0 5px', padding: '5px 10px' }}
        >
          Upgrade HP (10 XP)
        </button>
        <button onClick={resetGame} style={{ margin: '0 5px', padding: '5px 10px' }}>Restart</button>
        {gameOver && (
          <p style={{ color: victory ? '#8f8' : '#f88' }}>{victory ? 'Victory!' : 'Game Over'}</p>
        )}
      </div>
    </div>
  );
}
