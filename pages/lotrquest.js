import React, { useState, useEffect } from "react";

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
  const [daysClean, setDaysClean] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    const storedDays = parseInt(localStorage.getItem("daysClean")) || 0;
    const storedDate = localStorage.getItem("lastUpdated");
    const today = new Date().toDateString();

    if (storedDate !== today) {
      localStorage.setItem("lastUpdated", today);
      if (storedDate) {
        localStorage.setItem("daysClean", (storedDays + 1).toString());
        setDaysClean(storedDays + 1);
      } else {
        localStorage.setItem("daysClean", storedDays.toString());
        setDaysClean(storedDays);
      }
    } else {
      setDaysClean(storedDays);
    }
  }, []);

  const currentStageIndex = Math.floor(daysClean / daysPerStage);
  const currentMilestone = milestones[currentStageIndex] || "Victory!";
  const progressPercentage = Math.min((daysClean / totalDays) * 100, 100);

  const resetProgress = () => {
    if (window.confirm("Are you sure you want to reset your journey?")) {
      localStorage.setItem("daysClean", "0");
      localStorage.setItem("lastUpdated", new Date().toDateString());
      setDaysClean(0);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "2rem", textAlign: "center", fontFamily: "serif" }}>
      <img src="/images/lotr-logo.png" alt="LOTR Logo" style={{ width: "200px", marginBottom: "1rem" }} />
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>The Quest to Destroy the Nicotine Ring</h1>
      <p>Day {daysClean} - You have reached <strong>{currentMilestone}</strong></p>

      <div style={{ height: "20px", width: "100%", backgroundColor: "#ddd", margin: "20px 0", borderRadius: "10px" }}>
        <div
          style={{
            height: "100%",
            width: `${progressPercentage}%`,
            backgroundColor: "#4caf50",
            borderRadius: "10px",
            transition: "width 0.3s ease-in-out"
          }}
        />
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", justifyContent: "center", fontSize: "0.9rem" }}>
        {milestones.map((milestone, index) => (
          <div
            key={milestone}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              backgroundColor: index === currentStageIndex ? "#ffe082" : index < currentStageIndex ? "#81c784" : "#ccc",
              color: index <= currentStageIndex ? "#000" : "#555"
            }}
          >
            {milestone}
          </div>
        ))}
      </div>

      <button onClick={resetProgress} style={{ marginTop: "2rem", padding: "0.5rem 1rem", backgroundColor: "#d32f2f", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>
        Reset Journey
      </button>

      <p style={{ marginTop: "1rem", fontSize: "0.8rem", color: "#777" }}>
        Stay clean and return daily to move forward. One day = one step closer to freedom.
      </p>
    </div>
  );
}
