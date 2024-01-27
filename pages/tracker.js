import React, { useState, useEffect } from "react";

const Tracker = () => {
  const [count, setCount] = useState(0);
  const [timeline, setTimeline] = useState([]);
  const [hourCounters, setHourCounters] = useState(Array(24).fill(0));
  const [shiftTotal, setShiftTotal] = useState(0);

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

  const getCurrentHourlyTotal = () => {
    const currentHour = new Date().getHours();
    return hourCounters[currentHour];
  };

  return (
    <div style={{ textAlign: "center", paddingTop: "80px" }}>
      <h1>Tracker Page</h1>
      <div>
        <h2>Hourly Counters</h2>
        <div style={{ display: "flex", justifyContent: "center" }}>
          {hourCounters.map((counter, hour) => (
            <div key={hour} style={{ margin: "0 10px", position: "relative" }}>
              <p>{hour % 12 || 12} {hour < 12 ? "AM" : "PM"}</p>
              <p className="counter" title={`Times: ${getHourlyTimes(hour)}`}>{counter}</p>
            </div>
          ))}
        </div>
      </div>
      <div style={{ textAlign: "center", paddingBottom: "80px" }}>
        <h2>Shift Total</h2>
        <p>{shiftTotal}</p>
      </div>
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <button className="action-btn" onClick={handleSubtract}>-</button>
        <button className="action-btn" onClick={handleAdd}>+</button>
      </div>
      <div style={{ marginTop: "20px" }}>
        <button className="action-btn bottom-left" onClick={handleReset}>Reset</button>
      </div>
      <style jsx>{`
        .action-btn {
          margin: 5px;
          padding: 10px;
          font-size: 16px;
        }

        .bottom-left {
          position: absolute;
          bottom: 0;
          left: 0;
        }

        .counter:hover:after {
          content: attr(title);
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          padding: 5px;
          background-color: #fff;
          border: 1px solid #ccc;
          border-radius: 5px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          white-space: nowrap;
          z-index: 1;
        }
      `}</style>
    </div>
  );
};

export default Tracker;
