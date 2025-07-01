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

const sideQuests = [
  { id: "resist", label: "Resist Craving (Gollum)", xp: 10 },
  { id: "exercise", label: "Train with Aragorn (Exercise)", xp: 5 },
  { id: "journal", label: "Write in Elven Scroll (Journal)", xp: 5 },
  { id: "support", label: "Speak with Sam (Talk to someone)", xp: 5 },
];

const daysPerStage = 7;
const totalDays = milestones.length * daysPerStage;

export default function LOTRQuest() {
  const [daysClean, setDaysClean] = useState(0);
  const [xp, setXP] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [completedQuests, setCompletedQuests] = useState([]);

  useEffect(() => {
    const storedDays = parseInt(localStorage.getItem("daysClean")) || 0;
    const storedXP = parseInt(localStorage.getItem("xp")) || 0;
    const storedDate = localStorage.getItem("lastUpdated");
    const storedQuests = JSON.parse(localStorage.getItem("completedQuests")) || [];
    const today = new Date().toDateString();

    if (storedDate !== today) {
      localStorage.setItem("lastUpdated", today);
      localStorage.setItem("completedQuests", JSON.stringify([]));
      localStorage.setItem("daysClean", (storedDays + 1).toString());
      setDaysClean(storedDays + 1);
      setCompletedQuests([]);
    } else {
      setDaysClean(storedDays);
      setXP(storedXP);
      setCompletedQuests(storedQuests);
    }
  }, []);

  const currentStageIndex = Math.floor(daysClean / daysPerStage);
  const currentMilestone = milestones[currentStageIndex] || "Victory!";
  const progressPercentage = Math.min((daysClean / totalDays) * 100, 100);
  const level = Math.floor(xp / 50) + 1;

  const completeQuest = (questId, xpReward) => {
    if (!completedQuests.includes(questId)) {
      const newXP = xp + xpReward;
      const updatedQuests = [...completedQuests, questId];
      setXP(newXP);
      setCompletedQuests(updatedQuests);
      localStorage.setItem("xp", newXP.toString());
      localStorage.setItem("completedQuests", JSON.stringify(updatedQuests));
    }
  };

  const resetProgress = () => {
    if (window.confirm("Are you sure you want to reset your journey?")) {
      localStorage.setItem("daysClean", "0");
      localStorage.setItem("lastUpdated", new Date().toDateString());
      localStorage.setItem("xp", "0");
      localStorage.setItem("completedQuests", JSON.stringify([]));
      setDaysClean(0);
      setXP(0);
      setCompletedQuests([]);
    }
  };

  return (
    <div style={{ maxWidth: "700px", margin: "auto", padding: "2rem", textAlign: "center", fontFamily: "serif" }}>
      <img src="/images/lotr-logo.png" alt="LOTR Logo" style={{ width: "200px", marginBottom: "1rem" }} />
      <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>The Quest to Destroy the Nicotine Ring</h1>
      <p>Day {daysClean} - You have reached <strong>{currentMilestone}</strong></p>
      <p style={{ marginTop: "0.25rem" }}>Level {level} | XP: {xp}</p>

      <div style={{ height: "20px", width: "100%", backgroundColor: "#ddd", margin: "20px 0", borderRadius: "10px" }}>
        <div
          style={{
            height: "100%",
            width: `${progressPercentage}%`,
            backgroundColor: "#ffcc00",
            borderRadius: "10px",
            transition: "width 0.3s ease-in-out"
          }}
        />
      </div>

      <h2 style={{ marginTop: "2rem", marginBottom: "0.5rem" }}>Your Journey</h2>
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

      <h2 style={{ marginTop: "2rem", marginBottom: "0.5rem" }}>Daily Side Quests</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", alignItems: "center" }}>
        {sideQuests.map((quest) => (
          <button
            key={quest.id}
            disabled={completedQuests.includes(quest.id)}
            onClick={() => completeQuest(quest.id, quest.xp)}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              backgroundColor: completedQuests.includes(quest.id) ? "#999" : "#4caf50",
              color: "white",
              border: "none",
              cursor: completedQuests.includes(quest.id) ? "not-allowed" : "pointer",
              minWidth: "240px"
            }}
          >
            {completedQuests.includes(quest.id) ? `✔ ${quest.label}` : quest.label}
          </button>
        ))}
      </div>

      <button onClick={resetProgress} style={{ marginTop: "2rem", padding: "0.5rem 1rem", backgroundColor: "#d32f2f", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>
        Reset Journey
      </button>

      <p style={{ marginTop: "1rem", fontSize: "0.85rem", color: "#555" }}>
        Return daily to earn progress, complete side quests, and destroy the Ring.
      </p>
    </div>
  );
}
