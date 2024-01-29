import React, { useState, useEffect } from "react";
import Image from "next/image";
import trackerImg from "../public/assets/games/trackerImg.png";

const Tracker = () => {
  const [count, setCount] = useState(0);
  const [timeline, setTimeline] = useState([]);
  const [hourCounters, setHourCounters] = useState(Array(24).fill(0));
  const [shiftTotal, setShiftTotal] = useState(0);
  const [hoveredHour, setHoveredHour] = useState(null);

  useEffect(() => {
    const storedData = localStorage.getItem("trackerData");
    if (storedData) {
      const { count, timeline, hourCounters, shiftTotal } = JSON.parse(storedData);
      setCount(count);
      setTimeline(timeline);
      setHourCounters(hourCounters);
      setShiftTotal(shiftTotal);
    }
  }, []);

  useEffect(() => {
    const dataToStore = JSON.stringify({ count, timeline, hourCounters, shiftTotal });
    localStorage.setItem("trackerData", dataToStore);
  }, [count, timeline, hourCounters, shiftTotal]);

  const handleAdd = () => {
    const now = new Date();
    setCount(count + 1);
    setShiftTotal(shiftTotal + 1);
    setTimeline([...timeline, now]);
    setHourCounters((prevCounters) => {
      const updatedCounters = [...prevCounters];
      updatedCounters[now.getHours()] += 1;
      return updatedCounters;
    });
  };

  const handleSubtract = () => {
    if (count > 0) {
      const lastMark = timeline[timeline.length - 1];
      setCount(count - 1);
      setShiftTotal(shiftTotal - 1);
      setTimeline(timeline.slice(0, -1));
      setHourCounters((prevCounters) => {
        const updatedCounters = [...prevCounters];
        updatedCounters[lastMark.getHours()] -= 1;
        return updatedCounters;
      });
    }
  };

  const handleReset = () => {
    setCount(0);
    setShiftTotal(0);
    setTimeline([]);
    setHourCounters(Array(24).fill(0));
  };

  const handleToggleBubble = (hour) => {
    setHoveredHour(hoveredHour === hour ? null : hour);
  };

  const getCurrentHourlyTotal = () => {
    const currentHour = new Date().getHours();
    return hourCounters[currentHour];
  };

  return (
    <div style={{ textAlign: "center", paddingTop: "80px" }}>
      {/* ... (unchanged JSX) ... */}
    </div>
  );
};

export default Tracker;
