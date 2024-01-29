import React, { useState, useEffect } from "react";
import Image from "next/image";
import trackerImg from "../public/assets/games/trackerImg.png";

const Tracker = () => {
  const initialState = {
    count: 0,
    timeline: [],
    hourCounters: Array(24).fill(0),
    shiftTotal: 0,
  };

  const [state, setState] = useState(initialState);
  const { count, timeline, hourCounters, shiftTotal } = state;

  useEffect(() => {
    // Retrieve data from localStorage on component mount
    const storedData = localStorage.getItem("trackerData");
    if (storedData) {
      setState(JSON.parse(storedData));
    }
  }, []);

  useEffect(() => {
    // Save data to localStorage whenever it changes
    localStorage.setItem("trackerData", JSON.stringify(state));
  }, [state]);

  const handleAdd = () => {
    const now = new Date();
    setState((prevState) => ({
      ...prevState,
      count: prevState.count + 1,
      shiftTotal: prevState.shiftTotal + 1,
      timeline: [...prevState.timeline, now],
      hourCounters: prevState.hourCounters.map((count, hour) =>
        hour === now.getHours() ? count + 1 : count
      ),
    }));
  };

  const handleSubtract = () => {
    if (count > 0) {
      const lastMark = timeline[timeline.length - 1];
      setState((prevState) => ({
        ...prevState,
        count: prevState.count - 1,
        shiftTotal: prevState.shiftTotal - 1,
        timeline: prevState.timeline.slice(0, -1),
        hourCounters: prevState.hourCounters.map((count, hour) =>
          hour === lastMark.getHours() ? count - 1 : count
        ),
      }));
    }
  };

  const handleReset = () => {
    setState(initialState);
  };

  const handleToggleBubble = (hour) => {
    setState((prevState) => ({
      ...prevState,
      hoveredHour: prevState.hoveredHour === hour ? null : hour,
    }));
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
