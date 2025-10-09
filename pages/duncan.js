// pages/duncan.js
import { useState, useEffect } from "react";

const EMAILJS_SERVICE_ID = "service_snxpmua";
const EMAILJS_TEMPLATE_ID = "template_f8w3k1m";
const EMAILJS_PUBLIC_KEY = "1YtH3_3L4agOfqLYw";

const Duncan = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [events, setEvents] = useState(() => {
    const stored = localStorage.getItem("duncanEvents");
    return stored ? JSON.parse(stored) : {};
  });

  const [lastEventDays, setLastEventDays] = useState(0);
  const [averageInterval, setAverageInterval] = useState(0);

  // Helper functions
  const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

  const formatDateKey = (year, month, day) =>
    `${year}-${month + 1}-${day}`;

  const updateStats = () => {
    const eventDates = Object.keys(events)
      .map((key) => new Date(key))
      .sort((a, b) => a - b);
    if (eventDates.length === 0) {
      setLastEventDays(0);
      setAverageInterval(0);
      return;
    }
    const lastEvent = eventDates[eventDates.length - 1];
    const diff = Math.floor(
      (today - lastEvent) / (1000 * 60 * 60 * 24)
    );
    setLastEventDays(diff);

    if (eventDates.length < 2) {
      setAverageInterval(0);
      return;
    }

    let totalInterval = 0;
    for (let i = 1; i < eventDates.length; i++) {
      totalInterval += (eventDates[i] - eventDates[i - 1]) / (1000 * 60 * 60 * 24);
    }
    setAverageInterval(Math.round(totalInterval / (eventDates.length - 1)));
  };

  useEffect(() => {
    updateStats();
    localStorage.setItem("duncanEvents", JSON.stringify(events));
  }, [events]);

  const toggleEvent = (day) => {
    const key = formatDateKey(currentYear, currentMonth, day);
    setEvents((prev) => {
      const newEvents = { ...prev };
      if (newEvents[key]) {
        delete newEvents[key];
      } else {
        newEvents[key] = true;
      }
      return newEvents;
    });
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else setCurrentMonth((m) => m + 1);
  };

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else setCurrentMonth((m) => m - 1);
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Render
  const renderCalendar = () => {
    const totalDays = daysInMonth(currentMonth, currentYear);
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();

    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(<div key={`empty-${i}`} />);

    for (let day = 1; day <= totalDays; day++) {
      const key = formatDateKey(currentYear, currentMonth, day);
      const hasEvent = events[key];
      const isToday =
        day === today.getDate() &&
        currentMonth === today.getMonth() &&
        currentYear === today.getFullYear();

      days.push(
        <div
          key={key}
          onClick={() => toggleEvent(day)}
          style={{
            padding: "10px",
            margin: "2px",
            border: "1px solid #ccc",
            borderRadius: "6px",
            textAlign: "center",
            cursor: "pointer",
            backgroundColor: hasEvent ? "#ffe0b2" : "#f9f9f9",
            fontWeight: isToday ? "bold" : "normal",
          }}
        >
          {day} {hasEvent ? "🐾" : ""}
        </div>
      );
    }

    return <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>{days}</div>;
  };

  const renderPastEvents = () => {
    const sortedKeys = Object.keys(events).sort((a, b) => new Date(b) - new Date(a));
    if (sortedKeys.length === 0) return <p>No past events</p>;

    return (
      <ul>
        {sortedKeys.map((key) => (
          <li key={key}>
            {key} 🐾
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Duncan Calendar 🗓️</h1>

      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <div>
          <strong>Days Since Last Event:</strong> {lastEventDays}
        </div>
        <div>
          <strong>Average Interval:</strong> {averageInterval}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
        <button onClick={prevMonth}>◀️ Prev</button>
        <h2>{monthNames[currentMonth]} {currentYear}</h2>
        <button onClick={nextMonth}>Next ▶️</button>
      </div>

      {renderCalendar()}

      <h3 style={{ marginTop: "20px" }}>Past Events:</h3>
      {renderPastEvents()}
    </div>
  );
};

export default Duncan;
