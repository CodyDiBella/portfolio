import React, { useState, useEffect } from "react";
import Image from "next/image";
import trackerImg from "../public/assets/games/trackerImg.png";

const Tracker = () => {
  const [count, setCount] = useState(0);
  const [timeline, setTimeline] = useState([]);
  const [hourCounters, setHourCounters] = useState(Array(24).fill(0));
  const [shiftTotal, setShiftTotal] = useState(0);
  const [hoveredHour, setHoveredHour] = useState(null);

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
      <h1>New Ticket Tracking Buddy</h1>
       <div style={{ display: "flex", padding: "30px", justifyContent: "center", alignItems: "center" }}>
        <Image
          src={trackerImg}
          alt="Tracker Image"
          width={200}
        />
      </div>
      <div>
        <h2>Hourly Counters</h2>
        <div style={{ display: "flex", justifyContent: "center", paddingTop: "30px" }}>
          {hourCounters.map((counter, hour) => (
            <div key={hour} style={{ margin: "0 10px" }} onMouseEnter={() => handleToggleBubble(hour)} onMouseLeave={() => handleToggleBubble(hour)}>
              <p>{hour % 12 || 12} {hour < 12 ? "AM" : "PM"}</p>
              <p style={{ fontSize: "20px" }}>{counter !== 0 ? counter : ""}</p>
              {hoveredHour === hour && counter !== 0 && (
                <div className="bubble">
                  <ul>
                    {timeline
                      .filter((mark) => mark.getHours() === hour)
                      .map((mark, index) => (
                        <li key={index}>{mark.toLocaleTimeString()}</li>
                      ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center", fontSize: "24px", paddingTop: "30px" }}>
        <div>
          <h2>Shift Total</h2>
          <p style={{ fontSize: "60px" }}>{shiftTotal}</p>
        </div>
        <div>
          <h2>Hourly Total</h2>
          <p style={{ fontSize: "80px" }}>{getCurrentHourlyTotal()}</p>
        </div>
      </div>
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <button className="action-btn" onClick={handleAdd}>+</button>
      </div>
      <div style={{ marginTop: "20px" }}>
        <button className="action-btn bottom-left" onClick={handleSubtract}>-</button>
        <button className="action-btn bottom-right" onClick={handleReset}>Reset</button>
      </div>
      <style jsx>{`
        .bubble {
          position: absolute;
          background-color: white;
          border: 1px solid #ccc;
          padding: 10px;
          z-index: 1;
        }

        .bubble ul {
          list-style: none;
          padding: 0;
        }

        .bubble li {
          margin: 5px;
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
