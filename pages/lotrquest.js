import React, { useState, useEffect } from "react";

const COLS = 13;
const ROWS = 10;
const CENTER_X = Math.floor(COLS / 2);
const CENTER_Y = Math.floor(ROWS / 2);
const SMAUG_STRENGTH = 15;
const START_HEALTH = 5;
const XP_PER_LEVEL = 5;
const MAX_HEALTH_CAP = 15;
const PALANTIRI_COUNT = 2;

const ENEMIES = [
  { name: "Goblin", emoji: "👺", maxStrength: 3 },
  { name: "Orc", emoji: "👹", maxStrength: 5 },
  { name: "Warg", emoji: "🐺", maxStrength: 7 },
  { name: "Troll", emoji: "🧌", maxStrength: 9 },
];

function randomInt(max) {
  return Math.floor(Math.random() * max);
}

function generateEnemy() {
  const enemyType = ENEMIES[randomInt(ENEMIES.length)];
  return {
    type: enemyType.name,
    emoji: enemyType.emoji,
    strength: 1 + randomInt(enemyType.maxStrength),
    defeated: false,
  };
}

function createGrid() {
  // Create empty grid with enemies, Smaug in center, and palantiri
  const grid = Array(ROWS)
    .fill()
    .map((_, y) =>
      Array(COLS)
        .fill()
        .map((_, x) => {
          if (x === CENTER_X && y === CENTER_Y)
            return {
              x,
              y,
              type: "smaug",
              emoji: "🐉",
              strength: SMAUG_STRENGTH,
              revealed: true,
              defeated: false,
              adjacentSum: null,
            };
          else
            return {
              x,
              y,
              ...generateEnemy(),
              revealed: false,
              adjacentSum: null,
            };
        })
    );

  // Place palantiri randomly (but not on Smaug)
  let placed = 0;
  while (placed < PALANTIRI_COUNT) {
    const px = randomInt(COLS);
    const py = randomInt(ROWS);
    if (
      (px !== CENTER_X || py !== CENTER_Y) &&
      !grid[py][px].palantir &&
      !grid[py][px].revealed
    ) {
      grid[py][px] = {
        x: px,
        y: py,
        type: "palantir",
        emoji: "🔮",
        revealed: true,
        defeated: false,
        adjacentSum: null,
      };
      placed++;
    }
  }
  return grid;
}

function getNeighbors(x, y) {
  const neighbors = [];
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue;
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && nx < COLS && ny >= 0 && ny < ROWS) neighbors.push([nx, ny]);
    }
  }
  return neighbors;
}

export default function LOTRQuest() {
  const [grid, setGrid] = useState([]);
  const [hp, setHP] = useState(START_HEALTH);
  const [maxHP, setMaxHP] = useState(START_HEALTH);
  const [xp, setXP] = useState(0);
  const [palantiriLeft, setPalantiriLeft] = useState(PALANTIRI_COUNT);
  const [message, setMessage] = useState(
    "Use a Palantír (🔮) to scout your foes. Click any revealed enemy to fight!"
  );
  const [gameOver, setGameOver] = useState(false);
  const [victory, setVictory] = useState(false);

  useEffect(() => {
    resetGame();
  }, []);

  function resetGame() {
    setGrid(createGrid());
    setHP(START_HEALTH);
    setMaxHP(START_HEALTH);
    setXP(0);
    setPalantiriLeft(PALANTIRI_COUNT);
    setMessage(
      "Use a Palantír (🔮) to scout your foes. Click any revealed enemy to fight!"
    );
    setGameOver(false);
    setVictory(false);
  }

  function revealAround(x, y) {
    if (palantiriLeft <= 0) {
      setMessage("No Palantíri left to use!");
      return;
    }
    if (gameOver) return;

    const newGrid = grid.map((row) => row.map((cell) => ({ ...cell })));

    let revealedCount = 0;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx >= 0 && nx < COLS && ny >= 0 && ny < ROWS) {
          if (!newGrid[ny][nx].revealed) {
            newGrid[ny][nx].revealed = true;
            revealedCount++;
          }
        }
      }
    }

    setGrid(newGrid);
    setPalantiriLeft((p) => p - 1);
    setMessage(
      `Palantír reveals ${revealedCount} cells around (${x + 1}, ${y + 1}).`
    );
  }

  function calculateAdjacentSum(x, y, gridRef) {
    let sum = 0;
    const neighbors = getNeighbors(x, y);
    neighbors.forEach(([nx, ny]) => {
      const c = gridRef[ny][nx];
      if (!c.defeated && c.type !== "palantir") sum += c.strength;
    });
    return sum;
  }

  function fight(x, y) {
    if (gameOver) return;

    const cell = grid[y][x];
    if (!cell.revealed || cell.defeated || cell.type === "palantir") {
      setMessage("Cannot fight that.");
      return;
    }

    if (cell.type === "smaug") {
      if (hp > cell.strength) {
        // Victory!
        const newGrid = grid.map((row) => row.map((c) => ({ ...c })));
        newGrid[y][x].defeated = true;
        setGrid(newGrid);
        setHP(hp - cell.strength);
        setXP((xp) => xp + cell.strength);
        setMessage(
          "🏆 You have slain Smaug! The Lonely Mountain is freed from his terror!"
        );
        setVictory(true);
        setGameOver(true);
      } else {
        // Death by Smaug
        setHP(0);
        setMessage(
          "You fought bravely but Smaug's fire was too much. You have fallen."
        );
        setGameOver(true);
      }
      return;
    }

    if (hp <= cell.strength) {
      // Player dies
      setHP(0);
      setMessage(
        `The ${cell.type} (power ${cell.strength}) overpowered you. You have fallen.`
      );
      setGameOver(true);
      return;
    }

    // Player wins fight
    const newGrid = grid.map((row) => row.map((c) => ({ ...c })));
    newGrid[y][x].defeated = true;
    newGrid[y][x].revealed = true;
    // Show adjacent sum on that cell after defeat
    newGrid[y][x].adjacentSum = calculateAdjacentSum(x, y, newGrid);

    setGrid(newGrid);
    setHP(hp - cell.strength);
    setXP((xp) => xp + cell.strength);
    setMessage(
      `Defeated ${cell.type} (power ${cell.strength}). Gained ${cell.strength} XP. Adjacent foes total power: ${newGrid[y][x].adjacentSum}`
    );
  }

  // Level up if enough XP
  useEffect(() => {
    if (xp >= XP_PER_LEVEL && maxHP < MAX_HEALTH_CAP) {
      setXP((xp) => xp - XP_PER_LEVEL);
      setMaxHP((hp) => hp + 1);
      setHP((hp) => Math.min(hp + 1, maxHP + 1));
      setMessage(
        `Your courage grows! Max HP increased to ${maxHP + 1}. Health restored by 1.`
      );
    }
  }, [xp, maxHP]);

  return (
    <div
      style={{
        fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, serif",
        backgroundColor: "#111111",
        color: "#f0e6d2",
        minHeight: "100vh",
        padding: 16,
        userSelect: "none",
      }}
    >
      <h1 style={{ textAlign: "center", color: "#e2c044", marginBottom: 10 }}>
        LOTR Dragonsweeper Quest
      </h1>

      <p style={{ maxWidth: 480, margin: "auto", marginBottom: 12, fontSize: 16 }}>
        {message}
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${COLS}, 40px)`,
          justifyContent: "center",
          gap: 4,
          marginBottom: 16,
        }}
      >
        {grid.flat().map((cell) => {
          const isDefeated = cell.defeated;
          const isRevealed = cell.revealed;

          // Determine cell content and style
          let content = "";
          let style = {
            width: 40,
            height: 40,
            backgroundColor: "#222",
            color: "#eee",
            borderRadius: 6,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontWeight: "bold",
            fontSize: 18,
            cursor: gameOver ? "default" : "pointer",
            boxShadow: "0 0 4px #000 inset",
            userSelect: "none",
            transition: "background-color 0.2s",
            border: "2px solid #444",
          };

          if (isDefeated) {
            content = "☠️";
            style.backgroundColor = "#660000";
            style.color = "#a88";
            style.cursor = "default";
          } else if (!isRevealed) {
            content = "?";
            style.backgroundColor = "#333";
            style.color = "#555";
          } else if (cell.type === "palantir") {
            content = cell.emoji;
            style.backgroundColor = "#003366";
            style.color = "#99ccff";
          } else if (cell.type === "smaug") {
            content = `${cell.emoji}${cell.strength}`;
            style.backgroundColor = "#440000";
            style.color = "#ffaaaa";
            style.fontWeight = "900";
          } else {
            // Enemy cell revealed and alive
            content = (
              <>
                {cell.emoji}
                {cell.adjacentSum !== null ? cell.adjacentSum : ""}
              </>
            );
            style.backgroundColor = "#222222";
            style.color = "#ffd700";
            style.fontWeight = "700";
          }

          return (
            <div
              key={`${cell.x}-${cell.y}`}
              title={
                isDefeated
                  ? "Defeated enemy"
                  : !isRevealed
                  ? "Unrevealed"
                  : cell.type === "palantir"
                  ? "Palantír - reveals nearby tiles"
                  : `${cell.type} (power ${cell.strength})`
              }
              onClick={() => {
                if (gameOver) return;
                if (cell.type === "palantir") revealAround(cell.x, cell.y);
                else fight(cell.x, cell.y);
              }}
              style={style}
            >
              {content}
            </div>
          );
        })}
      </div>

      <div
        style={{
          maxWidth: 480,
          margin: "auto",
          fontSize: 18,
          marginBottom: 12,
          userSelect: "none",
        }}
      >
        <div>
          ❤️ HP: {hp} / {maxHP} &nbsp;&nbsp; 🌟 XP: {xp} &nbsp;&nbsp; 🔮 Palantíri:{" "}
          {palantiriLeft}
        </div>
      </div>

      {(gameOver || victory) && (
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <button
            onClick={resetGame}
            style={{
              padding: "10px 20px",
              fontSize: 18,
              backgroundColor: "#e2c044",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            {victory ? "Play Again (Victory!)" : "Restart Game"}
          </button>
        </div>
      )}

      <footer
        style={{
          marginTop: 40,
          fontSize: 12,
          textAlign: "center",
          color: "#555",
          userSelect: "none",
        }}
      >
        LOTR Dragonsweeper inspired by Daniel Benmergui’s Dragonsweeper — themed for
        your quitting journey.
      </footer>
    </div>
  );
}
