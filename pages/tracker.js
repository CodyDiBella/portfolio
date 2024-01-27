import React, { useState, useEffect } from "react";

const Tracker = () => {
  const [count, setCount] = useState(0);
  const [timeline, setTimeline] = useState([]);
  const [hourCounters, setHourCounters] = useState(Array(12).fill(0));

  const handleAdd = () => {
    const now = new Date();
    setCount(count + 1);
    setTimeline([...timeline, now]);
    setHourCounters((prevCounters) => {
      const updatedCounters = [...prevCounters];
      updatedCounters[now.getHours() % 12] += 1;
      return updatedCounters;
    });
  };

  const handleSubtract = () => {
    if (count > 0) {
      const lastMark = timeline[timeline.length - 1];
      setCount(count - 1);
      setTimeline(timeline.slice(0, -1));
      setHourCounters((prevCounters) => {
        const updatedCounters = [...prevCounters];
        updatedCounters[lastMark.getHours() % 12] -= 1;
        return updatedCounters;
      });
    }
  };

  const handleReset = () => {
    setCount(0);
    setTimeline([]);
    setHourCounters(Array(12).fill(0));
  };

  return (
    <div>
      <h1>Tracker Page</h1>
      <div>
        <p>Count: {count}</p>
        <button onClick={handleAdd}>Add</button>
        <button onClick={handleSubtract}>Subtract</button>
        <button onClick={handleReset}>Reset</button>
      </div>
      <div style={{ textAlign: "center" }}>
        <h2>Hourly Counters</h2>
        <div style={{ display: "flex", justifyContent: "center" }}>
          {hourCounters.map((counter, hour) => (
            <div key={hour} style={{ margin: "0 10px" }}>
              <p>{(hour % 12) || 12} {hour < 12 ? "AM" : "PM"}</p>
              <p>{counter}</p>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h2>Timeline</h2>
        <ul>
          {timeline.map((mark, index) => (
            <li key={index}>{mark.toLocaleTimeString()}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Tracker;
