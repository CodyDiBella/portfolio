import React, { useState, useEffect } from 'react';

const SIZE = 7;
const START = { x: 0, y: SIZE - 1 };
const MAX_ENEMIES = 12;
const MAX_POTS = 5;
const INIT_HEALTH = 5;
const HEALTH_UPGRADE_COST = 10;

const genGrid = () => {
  const grid = Array(SIZE).fill().map((_, y) => Array(SIZE).fill().map((_, x) => ({ x, y, type: 'empty', revealed: false })));
  grid[START.y][START.x].type = 'start';
  for (let i = 0; i < MAX_ENEMIES; i++) {
    let ex, ey;
    do {
      ex = Math.floor(Math.random() * SIZE);
      ey = Math.floor(Math.random() * SIZE);
    } while (grid[ey][ex].type !== 'empty');
    const strength = 1 + Math.floor(Math.random()*4);
    grid[ey][ex] = { x:ex, y:ey, type:'enemy', strength, revealed: false };
  }
  for (let i = 0; i < MAX_POTS; i++) {
    let px, py;
    do {
      px = Math.floor(Math.random() * SIZE);
      py = Math.floor(Math.random() * SIZE);
    } while (grid[py][px].type !== 'empty');
    grid[py][px] = { x:px, y:py, type:'potion', revealed:false };
  }
  return grid;
};

export default function LOTRQuest() {
  const [grid, setGrid] = useState(genGrid());
  const [pos, setPos] = useState(START);
  const [health, setHealth] = useState(INIT_HEALTH);
  const [coins, setCoins] = useState(0);
  const [maxHealth, setMaxHealth] = useState(INIT_HEALTH);
  const [message, setMessage] = useState("Begin your journey!");
  const [gameOver, setGameOver] = useState(false);
  
  const reveal = (x,y) => {
    const cell = grid[y][x];
    if (cell.revealed || gameOver) return;
    cell.revealed = true;
    if (cell.type==='enemy') {
      const strength = cell.strength;
      if (health > strength) {
        setHealth(health - strength);
        setCoins(coins + strength*2);
        setMessage(`You defeated enemy of strength ${strength}!`);
      } else {
        setMessage(`Enemy of strength ${strength} defeated you... Game over.`);
        setGameOver(true);
      }
    }
    if (cell.type==='potion') {
      setHealth(Math.min(maxHealth, health+3));
      setCoins(coins+1);
      setMessage(`Found healing potion! +3 health`);
    }
    if (cell.type==='empty') {
      setMessage("Empty... proceed carefully.");
    }
    setGrid([...grid]);
  };
  
  const move = (dx,dy) => {
    const nx = pos.x + dx, ny = pos.y + dy;
    if (nx<0||ny<0||nx>=SIZE||ny>=SIZE) return;
    reveal(nx,ny);
    setPos({x:nx,y:ny});
  };
  
  const healOrUpgrade = () => {
    if (coins>=HEALTH_UPGRADE_COST) {
      setCoins(coins-HEALTH_UPGRADE_COST);
      setMaxHealth(maxHealth+2);
      setHealth(maxHealth+2);
      setMessage("You gained +2 max health!");
    } else setMessage("Need more coins for upgrades.");
  };
  
  const reset = () => {
    setGrid(genGrid());
    setPos(START);
    setHealth(INIT_HEALTH);
    setMaxHealth(INIT_HEALTH);
    setCoins(0);
    setGameOver(false);
    setMessage("New journey begins.");
  }
  
  return (
    <div style={{fontFamily:'sans-serif',padding:'1rem',background:'#111',color:'#eee'}}>
      <h1 style={{textAlign:'center'}}>Path Through Mordor</h1>
      <p>{message}</p>
      
      <div style={{display:'grid',gridTemplateColumns:`repeat(${SIZE},40px)`,gap:'2px'}}>
      {grid.flat().map(cell=>{
        const isHere = pos.x===cell.x && pos.y===cell.y;
        return <div key={`${cell.x}-${cell.y}`} onClick={()=>{if(!gameOver)reveal(cell.x,cell.y)}} style={{
          width:40,height:40,
          background: cell.revealed
            ? (cell.type==='empty'?'#555':cell.type==='enemy'?'#900': cell.type==='potion'?'#090':'#222')
            : (isHere?'#0a0':'#333'),
          border: isHere?'2px solid #0ff':'1px solid #222',
          display:'flex',alignItems:'center',justifyContent:'center',
          fontSize:'0.8rem',
          cursor: gameOver?'default':'pointer'
        }}>
          {cell.revealed
            ? (cell.type==='enemy'?cell.strength:(cell.type==='potion'?'💧':''))
            : ''}
        </div>
      })}
      </div>
      
      <div style={{marginTop:'1rem'}}>
        <p>Health: {health}/{maxHealth}</p>
        <p>Coins: {coins}</p>
        <button onClick={()=>move(0,-1)} disabled={gameOver}>Up</button>
        <button onClick={()=>move(-1,0)} disabled={gameOver}>Left</button>
        <button onClick={()=>move(1,0)} disabled={gameOver}>Right</button>
        <button onClick={()=>move(0,1)} disabled={gameOver}>Down</button>
      </div>
      <div style={{marginTop:'1rem'}}>
        <button onClick={healOrUpgrade}>Upgrade (+2 max health) ⚔️ 10 coins</button>
      </div>
      <div style={{marginTop:'1rem'}}>
        <button onClick={reset}>Restart Journey</button>
      </div>
    </div>
  );
}

