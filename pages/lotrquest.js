import React, { useState, useEffect, useRef } from "react";

const milestones = [
  "The Shire",
  "The Old Forest",
  "Bree",
  "Rivendell",
  "Mines of Moria",
  "Lothlórien",
  "Anduin River",
  "Amon Hen",
  "Dead Marshes",
  "Minas Morgul",
  "Mount Doom",
  "The Grey Havens",
];

const daysPerStage = 7;
const totalDays = milestones.length * daysPerStage;

export default function LOTRQuest() {
  // Game refs and state
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [xp, setXP] = useState(0);
  const [daysClean, setDaysClean] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [jumping, setJumping] = useState(false);
  const [playerY, setPlayerY] = useState(0); // 0 means on ground, negative is jump height
  const [obstacles, setObstacles] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const gravity = 1.5;
  const jumpStrength = 20;
  const obstacleSpeed = 6;
  const obstacleFrequency = 90; // frames

  // Track frames for game loop
  const frameRef = useRef(0);
  const velocityRef = useRef(0);
  const playerYRef = useRef(0);
  const obstaclesRef = useRef([]);
  const scoreRef = useRef(0);

  // Load progress from localStorage on mount
  useEffect(() => {
    const storedDays = parseInt(localStorage.getItem("daysClean")) || 0;
    const storedXP = parseInt(localStorage.getItem("xp")) || 0;
    const storedDate = localStorage.getItem("lastUpdated");
    const today = new Date().toDateString();

    if (storedDate !== today) {
      localStorage.setItem("lastUpdated", today);
      localStorage.setItem("daysClean", (storedDays + 1).toString());
      setDaysClean(storedDays + 1);
    } else {
      setDaysClean(storedDays);
    }
    setXP(storedXP);

    // Reset score each day
    setScore(0);
    scoreRef.current = 0;
    setGameOver(false);
    setGameStarted(false);
    setPlayerY(0);
    playerYRef.current = 0;
    velocityRef.current = 0;
    setObstacles([]);
    obstaclesRef.current = [];
    frameRef.current = 0;
  }, []);

  // Game logic loop
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const width = canvas.width;
    const height = canvas.height;

    let animationFrameId;

    const playerX = 50;
    const playerRadius = 20;
    const groundY = height - 50;

    const jump = () => {
      if (!jumping && playerYRef.current === 0) {
        velocityRef.current = -jumpStrength;
        setJumping(true);
      }
    };

    const drawPlayer = (y) => {
      ctx.beginPath();
      ctx.fillStyle = "#8b4513"; // Brown (Frodo)
      ctx.shadowColor = "gold";
      ctx.shadowBlur = 10;
      ctx.arc(playerX, groundY + y, playerRadius, 0, 2 * Math.PI);
      ctx.fill();

      // Draw ring on finger (small yellow ring on circle)
      ctx.beginPath();
      ctx.strokeStyle = "yellow";
      ctx.lineWidth = 3;
      ctx.arc(playerX + 8, groundY + y + 10, 6, 0, 2 * Math.PI);
      ctx.stroke();
    };

    const drawObstacle = (x) => {
      ctx.beginPath();
      ctx.fillStyle = "black"; // Ringwraith
      ctx.shadowColor = "red";
      ctx.shadowBlur = 10;
      ctx.rect(x, groundY - 40, 20, 40);
      ctx.fill();
    };

    const update = () => {
      frameRef.current++;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Update player position
      velocityRef.current += gravity;
      playerYRef.current += velocityRef.current;
      if (playerYRef.current > 0) {
        playerYRef.current = 0;
        velocityRef.current = 0;
        setJumping(false);
      }
      setPlayerY(playerYRef.current);

      // Draw ground
      ctx.fillStyle = "#654321";
      ctx.fillRect(0, groundY + playerRadius, width, height - groundY - playerRadius);

      // Draw player
      drawPlayer(playerYRef.current);

      // Handle obstacles
      if (frameRef.current % obstacleFrequency === 0) {
        const newObstacle = width;
        obstaclesRef.current.push(newObstacle);
      }

      // Move obstacles and check collisions
      const newObstacles = [];
      let collision = false;

      for (let x of obstaclesRef.current) {
        const newX = x - obstacleSpeed;

        // Check collision (simple box vs circle approximation)
        if (
          newX < playerX + playerRadius &&
          newX + 20 > playerX - playerRadius &&
          playerYRef.current > -playerRadius // player is low enough to hit obstacle
        ) {
          collision = true;
        }

        if (newX > -20) {
          newObstacles.push(newX);
          drawObstacle(newX);
        } else {
          // Passed obstacle, increase score
          scoreRef.current++;
          setScore(scoreRef.current);
        }
      }
      obstaclesRef.current = newObstacles;
      setObstacles(newObstacles);

      if (collision) {
        setGameOver(true);
        // Save XP progress (score * 2)
        const gainedXP = scoreRef.current * 2;
        const newXP = xp + gainedXP;
        setXP(newXP);
        localStorage.setItem("xp", newXP.toString());
      } else {
        animationFrameId = requestAnimationFrame(update);
      }
    };

    animationFrameId = requestAnimationFrame(update);

    return () => cancelAnimationFrame(animationFrameId);
  }, [gameStarted, gameOver, xp]);

  const startGame = () => {
    if (!gameOver) setGameStarted(true);
  };

  const resetJourney = () => {
    if (window.confirm("Are you sure you want to reset your journey?")) {
      localStorage.setItem("daysClean", "0");
      localStorage.setItem("xp", "0");
      localStorage.setItem("lastUpdated", new Date().toDateString());
      setDaysClean(0);
      setXP(0);
      setScore(0);
      setGameOver(false);
      setGameStarted(false);
      setPlayerY(0);
      playerYRef.current = 0;
      velocityRef.current = 0;
      setObstacles([]);
      obstaclesRef.current = [];
      frameRef.current = 0;
      setJumping(false);
    }
  };

  // Calculate milestone and progress
  const currentStageIndex = Math.floor(daysClean / daysPerStage);
  const currentMilestone = milestones[currentStageIndex] || "Victory!";
  const progressPercentage = Math.min((daysClean / totalDays) * 100, 100);
  const level = Math.floor(xp / 50) + 1;

  // Keyboard & touch controls
  useEffect(() => {
    const handleKey = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        if (!gameOver) startGame();
        if (!jumping) setJumping(true);
        velocityRef.current = -jumpStrength;
      }
    };

    const handleTouch = (e) => {
      e.preventDefault();
      if (!gameOver) startGame();
      if (!jumping) setJumping(true);
      velocityRef.current = -jumpStrength;
    };

    window.addEventListener("keydown", handleKey);
    window.addEventListener("touchstart", handleTouch);

    return () => {
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("touchstart", handleTouch);
    };
  }, [gameOver, jumping]);

  return (
    <div style={{ maxWidth: "700px", margin: "auto", padding: "1rem", fontFamily: "'Cinzel', serif", textAlign: "center" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem", color: "#ccaa00", textShadow: "1px 1px 4px #000" }}>
        LOTR Nicotine Quest: Ring Runner
      </h1>

      <canvas
        ref={canvasRef}
        width={700}
        height={200}
        style={{ border: "3px solid #663300", borderRadius: "10px", backgroundColor: "#222", display: "block", margin: "auto" }}
        aria-label="Ring Runner game canvas"
      />

      {gameOver ? (
        <div style={{ marginTop: "1rem", color: "#cc4444", fontWeight: "bold" }}>
          <p>You were caught by a Ringwraith! You gained {score * 2} XP this run.</p>
          <button
            onClick={() => {
              setScore(0);
              scoreRef.current = 0;
              setGameOver(false);
              setGameStarted(false);
              setPlayerY(0);
              playerYRef.current = 0;
              velocityRef.current = 0;
              setObstacles([]);
              obstaclesRef.current = [];
              frameRef.current = 0;
              setJumping(false);
            }}
            style={{
              marginTop: "0.5rem",
              padding: "0.5rem 1rem",
              backgroundColor: "#ccaa00",
              color: "#000",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Play Again
          </button>
        </div>
      ) : (
        <button
          onClick={startGame}
          disabled={gameStarted}
          style={{
            marginTop: "1rem",
            padding: "0.5rem 1rem",
            backgroundColor: gameStarted ? "#999" : "#ccaa00",
            color: "#000",
            border: "none",
            borderRadius: "5px",
            cursor: gameStarted ? "not-allowed" : "pointer",
            fontWeight: "bold",
          }}
        >
          {gameStarted ? "Running..." : "Start Running (Tap or Press Space)"}
        </button>
      )}

      <div style={{ marginTop: "1.5rem", textAlign: "left", maxWidth: "700px", marginLeft: "auto", marginRight: "auto" }}>
        <h2 style={{ color: "#ccaa00" }}>Your Journey Progress</h2>
        <p>
          Day {daysClean} - You have reached <strong>{currentMilestone}</strong>
        </p>
        <p>Level {level} | XP: {xp}</p>

        <div style={{ height: "20px", width: "100%", backgroundColor: "#ddd", margin: "10px 0", borderRadius: "10px" }}>
          <div
            style={{
              height: "100%",
              width: `${progressPercentage}%`,
              backgroundColor: "#ffcc00",
              borderRadius: "10px",
              transition: "width 0.3s ease-in-out",
            }}
          />
        </div>

        <button
          onClick={resetJourney}
          style={{
            marginTop: "1rem",
            padding: "0.5rem 1rem",
            backgroundColor: "#cc4444",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "bold",
            width: "100%",
          }}
        >
          Reset Journey
        </button>
      </div>

      <p style={{ marginTop: "1rem", color: "#ccc", fontSize: "0.85rem" }}>
        Tap the screen or press spacebar to jump over Ringwraiths. Each one avoided adds XP to your quest to destroy nicotine’s power.
      </p>
    </div>
  );
}
