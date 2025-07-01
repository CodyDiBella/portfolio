import { useEffect, useState } from "react";
import Head from "next/head";

const GRID_WIDTH = 13;
const GRID_HEIGHT = 10;
const INITIAL_HP = 5;
const SMOAG_POWER = 15;
const XP_PER_LEVEL = 5;
const MAX_HEALTH = 15;

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateGrid() {
  const grid = [];
  const totalTiles = GRID_WIDTH * GRID_HEIGHT;

  for (let y = 0; y < GRID_HEIGHT; y++) {
    const row = [];
    for (let x = 0; x < GRID_WIDTH; x++) {
      row.push({
        x,
        y,
        type: "unknown",
        revealed: false,
        enemyPower: 0,
        adjacentPower: 0,
        defeated: false,
      });
    }
    grid.push(row);
  }

  const centerY = Math.floor(GRID_HEIGHT / 2);
  const centerX = Math.floor(GRID_WIDTH / 2);
  grid[centerY][centerX].type = "smaug";
  grid[centerY][centerX].enemyPower = SMOAG_POWER;

  // Place 1 Palantír in a random corner
  const palantirX = getRandomInt(0, 2);
  const palantirY = getRandomInt(0, 2);
  grid[palantirY][palantirX].type = "palantir";
  grid[palantirY][palantirX].revealed = true;

  // Place healing tiles
  for (let i = 0; i < 3; i++) {
    let x, y;
    do {
      x = getRandomInt(0, GRID_WIDTH - 1);
      y = getRandomInt(0, GRID_HEIGHT - 1);
    } while (grid[y][x].type !== "unknown");
    grid[y][x].type = "heal";
  }

  // Place enemies
  for (let i = 0; i < Math.floor(totalTiles * 0.25); i++) {
    let x, y;
    do {
      x = getRandomInt(0, GRID_WIDTH - 1);
      y = getRandomInt(0, GRID_HEIGHT - 1);
    } while (grid[y][x].type !== "unknown");
    grid[y][x].type = "enemy";
    grid[y][x].enemyPower = getRandomInt(1, 9);
  }

  // Remaining are empty
  for (let y = 0; y < GRID_HEIGHT; y++) {
    for (let x = 0; x < GRID_WIDTH; x++) {
      const cell = grid[y][x];
      if (cell.type === "unknown") {
        cell.type = "empty";
      }
    }
  }

  return grid;
}

export default function LOTRDragonsweeper() {
  const [grid, setGrid] = useState([]);
  const [playerHP, setPlayerHP] = useState(INITIAL_HP);
  const [playerXP, setPlayerXP] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [victory, setVictory] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = () => {
    setGrid(generateGrid());
    setPlayerHP(INITIAL_HP);
    setPlayerXP(0);
    setLevel(1);
    setGameOver(false);
    setVictory(false);
    setMessage("Use the Palantír to begin your journey");
  };

  const revealAdjacentPower = (x, y, newGrid) => {
    let totalPower = 0;
    const dirs = [
      [-1, -1], [0, -1], [1, -1],
      [-1, 0],           [1, 0],
      [-1, 1], [0, 1], [1, 1],
    ];
    dirs.forEach(([dx, dy]) => {
      const nx = x + dx;
      const ny = y + dy;
      if (
        nx >= 0 && nx < GRID_WIDTH &&
        ny >= 0 && ny < GRID_HEIGHT &&
        ["enemy", "smaug"].includes(newGrid[ny][nx].type) &&
        !newGrid[ny][nx].defeated
      ) {
        totalPower += newGrid[ny][nx].enemyPower;
      }
    });
    newGrid[y][x].adjacentPower = totalPower;
    newGrid[y][x].revealed = true;
    newGrid[y][x].type = "cleared";
  };

  const handleCellClick = (cell) => {
    if (gameOver || victory || cell.revealed) return;
    const newGrid = [...grid.map((row) => [...row])];

    if (cell.type === "palantir") {
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const nx = cell.x + dx;
          const ny = cell.y + dy;
          if (nx >= 0 && nx < GRID_WIDTH && ny >= 0 && ny < GRID_HEIGHT) {
            newGrid[ny][nx].revealed = true;
          }
        }
      }
      setMessage("The Palantír reveals nearby dangers");
    } else if (cell.type === "heal") {
      newGrid[cell.y][cell.x].revealed = true;
      setPlayerHP((hp) => Math.min(MAX_HEALTH, hp + 1));
      setMessage("You found Lembas Bread and healed 1 HP!");
    } else if (["enemy", "smaug"].includes(cell.type)) {
      if (cell.enemyPower >= playerHP) {
        setMessage("That foe was too strong. You fell in battle.");
        setGameOver(true);
        return;
      }
      newGrid[cell.y][cell.x].defeated = true;
      revealAdjacentPower(cell.x, cell.y, newGrid);
      const xpGain = Math.ceil(cell.enemyPower * 1.5);
      const newXP = playerXP + xpGain;
      let newLevel = level;
      let newMaxHP = playerHP;
      if (newXP >= level * XP_PER_LEVEL) {
        newLevel++;
        newMaxHP = Math.min(MAX_HEALTH, newMaxHP + 1);
        setMessage(`You leveled up to ${newLevel} and gained +1 max HP!`);
      } else {
        setMessage(`You defeated a foe and gained ${xpGain} XP.`);
      }
      setPlayerXP(newXP);
      setLevel(newLevel);
      setPlayerHP(newMaxHP - cell.enemyPower);
      if (cell.type === "smaug") {
        setVictory(true);
        setMessage("You defeated Smaug and won the game!");
      }
    } else {
      revealAdjacentPower(cell.x, cell.y, newGrid);
      setMessage("Explored empty land. Plan your next move.");
    }

    setGrid(newGrid);
  };

  return (
    <div style={{ padding: 10, maxWidth: 800, margin: "auto", fontFamily: "serif" }}>
      <Head>
        <title>LOTR Dragonsweeper</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <h2 style={{ textAlign: "center" }}>🧙 LOTR: Dragonsweeper Quest 🐉</h2>
      <p style={{ textAlign: "center" }}>{message}</p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${GRID_WIDTH}, 30px)`,
          gap: 2,
          justifyContent: "center",
        }}
      >
        {grid.flat().map((cell) => (
          <div
            key={`${cell.x}-${cell.y}`}
            onClick={() => handleCellClick(cell)}
            style={{
              width: 30,
              height: 30,
              fontSize: 18,
              backgroundColor: cell.revealed ? "#eee" : "#222",
              color: cell.revealed ? "black" : "white",
              border: "1px solid #999",
              textAlign: "center",
              lineHeight: "30px",
              cursor: gameOver || victory ? "default" : "pointer",
              userSelect: "none",
            }}
          >
            {cell.revealed
              ? cell.type === "heal"
                ? "💖"
                : cell.type === "palantir"
                ? "🔮"
                : cell.type === "smaug" && cell.defeated
                ? cell.adjacentPower || "✔️"
                : cell.defeated
                ? cell.adjacentPower || "✔️"
                : cell.type === "cleared"
                ? cell.adjacentPower || ""
                : "?"
              : "?"}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 20, textAlign: "center" }}>
        <p>❤️ HP: {playerHP} &nbsp;&nbsp; ✨ XP: {playerXP} &nbsp;&nbsp; 🧱 Level: {level}</p>
        {(gameOver || victory) && (
          <button
            onClick={resetGame}
            style={{
              padding: "8px 16px",
              fontSize: 16,
              backgroundColor: "#d0a748",
              color: "white",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            {victory ? "🎉 Play Again!" : "🔁 Restart"}
          </button>
        )}
      </div>
    </div>
  );
}
