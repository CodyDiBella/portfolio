import React, { useState, useEffect } from "react";

const Tracker = () => {
  const [count, setCount] = useState(0);
  const [timeline, setTimeline] = useState([]);
  const [hourCounters, setHourCounters] = useState(Array(24).fill(0));

  const handleAdd = () => {
    const now = new Date();
    setCount(count + 1);
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
    setTimeline([]);
    setHourCounters(Array(24).fill(0));
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
      <div>
        <h2>Timeline</h2>
        <ul>
          {timeline.map((mark, index) => (
            <li key={index}>{mark.toLocaleTimeString()}</li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Hourly Counters</h2>
        <ul>
          {hourCounters.map((counter, hour) => (
            <li key={hour}>
              {hour}:00 - {counter}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Tracker;