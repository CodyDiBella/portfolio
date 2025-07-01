import React, { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

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

export default function LOTRQuitQuest() {
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
    if (confirm("Are you sure you want to reset your journey?")) {
      localStorage.setItem("daysClean", "0");
      localStorage.setItem("lastUpdated", new Date().toDateString());
      setDaysClean(0);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 text-center">
      <img src="/images/lotr-logo.png" alt="LOTR Logo" className="w-48 mb-6" />
      <h1 className="text-3xl font-bold mb-2">The Quest to Destroy the Nicotine Ring</h1>
      <p className="mb-4 text-lg">Day {daysClean} - You have reached <strong>{currentMilestone}</strong></p>
      <Progress value={progressPercentage} className="w-full max-w-lg h-6 mb-6" />
      <div className="flex flex-wrap justify-center gap-3">
        {milestones.map((milestone, index) => (
          <div
            key={milestone}
            className={`rounded-xl p-3 w-40 text-sm shadow-lg ${
              index === currentStageIndex ? "bg-yellow-300 text-black" : index < currentStageIndex ? "bg-green-600 text-white" : "bg-gray-300 text-gray-700"
            }`}
          >
            {milestone}
          </div>
        ))}
      </div>
      <Button variant="destructive" onClick={resetProgress} className="mt-8">
        Reset Journey
      </Button>
      <p className="mt-6 text-sm text-gray-500">Stay clean and return daily to move forward. One day = one step closer to freedom.</p>
    </div>
  );
}
