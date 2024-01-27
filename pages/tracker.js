import React, { useState, useEffect } from "react";

const Tracker = () => {
  const [count, setCount] = useState(0);
  const [timeline, setTimeline] = useState([]);
  const [hourCounters, setHourCounters] = useState(Array(24).fill(0));
  const [shiftTotal, setShiftTotal] = useState(0);
  const [showOverlay, setShowOverlay] = useState(false);

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

  const handleToggleOverlay = () => {
    setShowOverlay(!showOverlay);
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
        <div style={{ display: "flex", justifyContent: "center", paddingTop: "30px" }}>
          {hourCounters.map((counter, hour) => (
            <div key={hour} style={{ margin: "0 10px" }}>
              <p>{hour % 12 || 12} {hour < 12 ? "AM" : "PM"}</p>
              <p style={{ fontSize: "20px" }}>{counter}</p>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "center", textAlign: "center", fontSize: "24px", paddingTop: "30px" }}>
        <h2>Shift Total</h2>
        <p style={{ fontSize: "60px" }}>{shiftTotal}</p>
        <h2>Hourly Total</h2>
        <p style={{ fontSize: "80px" }}>{getCurrentHourlyTotal()}</p>
      </div>
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <button className="action-btn" onClick={handleSubtract}>-</button>
        <button className="action-btn" onClick={handleAdd}>+</button>
      </div>
      <div style={{ marginTop: "20px" }}>
        <button className="action-btn bottom-left" onClick={handleReset}>Reset</button>
        <button className="action-btn bottom-right" onClick={handleToggleOverlay}>Show Times</button>
      </div>
      {showOverlay && (
        <div className="overlay">
          <button onClick={handleToggleOverlay}>X</button>
          <ul>
            {timeline.map((mark, index) => (
              <li key={index}>{mark.toLocaleTimeString()}</li>
            ))}
          </ul>
        </div>
      )}
      <style jsx>{`
        .overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .overlay button {
          margin-bottom: 10px;
        }

        .action-btn {
          margin: 10px;
          padding: 20px;
          font-size: 20px;
        }

        .bottom-left {
          position: absolute;
          bottom: 0;
          left: 0;
        }

        .bottom-right {
          position: absolute;
          bottom: 0;
          right: 0;
        }
      `}</style>
    </div>
  );
};

export default Tracker;
