import React, { useState, useEffect } from "react";
import Image from "next/image";
import trackerImg from "../public/assets/games/trackerImg.png";

const Tracker = () => {
  const initialState = {
    count: 0,
    timeline: [],
    hourCounters: Array(24).fill(0),
    shiftTotal: 0,
    hoveredHour: null, // Add hoveredHour to the initial state
  };

  const [state, setState] = useState(initialState);
  const { count, timeline, hourCounters, shiftTotal, hoveredHour } = state;

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
      <h1>Ticket Tracking Buddy</h1>
      <div style={{ display: "flex", padding: "30px", justifyContent: "center", alignItems: "center" }}>
        <Image
          src={trackerImg}
          alt="Tracker Image"
          width={100}
        />
      </div>
      <div>
        <h2>Hourly Counters</h2>
        <div style={{ display: "flex", justifyContent: "center", paddingTop: "20px" }}>
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
          <p style={{ fontSize: "40px" }}>{shiftTotal}</p>
        </div>
        <div>
          <h2>Hourly Total</h2>
          <p style={{ fontSize: "50px" }}>{getCurrentHourlyTotal()}</p>
        </div>
      </div>
      <div style={{ padding: "10px", marginTop: "10px", textAlign: "center" }}>
        <button className="action-btn larger-btn" onClick={handleAdd}>+</button>
      </div>
      <div style={{ marginTop: "10px" }}>
        <button className="action-btn bottom-left" onClick={handleSubtract}>-</button>
        <button className="action-btn bottom-right" onClick={handleReset}>Reset</button>
      </div>
      <style jsx>{`
        .larger-btn {
          padding: 60px;
          font-size: 200px;
        }
    
        .bubble {
          position: absolute;
          background-color: lightgray;
          border: 1px solid purple;
          padding: 10px;
          z-index: 1;
          border-radius: 15px;
          color: white;
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
