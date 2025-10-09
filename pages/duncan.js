import React, { useState, useEffect } from "react";
import emailjs from "@emailjs/browser";

const EMAILJS_SERVICE_ID = "service_snxpmua";
const EMAILJS_TEMPLATE_ID = "template_f8w3k1m";
const EMAILJS_PUBLIC_KEY = "1YtH3_3L4agOfqLYw";

const Duncan = () => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [today, setToday] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    const stored = localStorage.getItem("seizureEvents");
    if (stored) setEvents(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("seizureEvents", JSON.stringify(events));
  }, [events]);

  const handleDayClick = (date) => {
    const exists = events.find((e) => e.date === date.toDateString());
    if (exists) {
      if (window.confirm("Delete this event?")) {
        setEvents(events.filter((e) => e.date !== date.toDateString()));
      }
    } else {
      setSelectedDate(date);
      setShowAddModal(true);
    }
  };

  const addEvent = () => {
    const newEvent = { date: selectedDate.toDateString() };
    const updated = [...events, newEvent].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
    setEvents(updated);
    setShowAddModal(false);
    sendEmail(selectedDate);
  };

  const sendEmail = (date) => {
    const templateParams = { message: `Seizure logged on ${date.toDateString()}` };
    emailjs
      .send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, EMAILJS_PUBLIC_KEY)
      .then(() => console.log("Email sent successfully"))
      .catch((err) => console.error("Email error:", err));
  };

  const changeMonth = (offset) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + offset);
    setCurrentMonth(newMonth);
  };

  const getCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];

    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const calculateStats = () => {
    if (events.length === 0) return { daysSince: "-", avgInterval: "-" };

    const sorted = events
      .map((e) => new Date(e.date))
      .sort((a, b) => a - b);

    const last = sorted[sorted.length - 1];
    const daysSince = Math.floor((new Date() - last) / (1000 * 60 * 60 * 24));

    const intervals = [];
    for (let i = 1; i < sorted.length; i++) {
      const diff = (sorted[i] - sorted[i - 1]) / (1000 * 60 * 60 * 24);
      intervals.push(diff);
    }

    const avgInterval =
      intervals.length > 0
        ? Math.round(intervals.reduce((a, b) => a + b, 0) / intervals.length)
        : "-";

    return { daysSince, avgInterval };
  };

  const { daysSince, avgInterval } = calculateStats();
  const days = getCalendarDays();
  const monthName = currentMonth.toLocaleString("default", { month: "long" });

  return (
    <div style={{ padding: "1rem", maxWidth: "600px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center" }}>🐾 Duncan’s Seizure Tracker</h1>

      <div style={{ display: "flex", justifyContent: "space-around", margin: "1rem 0" }}>
        <div>
          <strong>Days Since Last:</strong> {daysSince}
        </div>
        <div>
          <strong>Avg Interval:</strong> {avgInterval}
        </div>
      </div>

      <div style={{ textAlign: "center", marginBottom: "0.5rem" }}>
        <button onClick={() => changeMonth(-1)}>⬅️</button>
        <strong style={{ margin: "0 1rem" }}>
          {monthName} {currentMonth.getFullYear()}
        </strong>
        <button onClick={() => changeMonth(1)}>➡️</button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          textAlign: "center",
          gap: "4px",
          fontSize: "0.9rem",
        }}
      >
        {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
          <div key={d} style={{ fontWeight: "bold" }}>
            {d}
          </div>
        ))}
        {days.map((day, idx) => {
          if (!day) return <div key={idx}></div>;

          const hasEvent = events.some((e) => e.date === day.toDateString());
          const isToday =
            day.toDateString() === today.toDateString();

          return (
            <div
              key={idx}
              onClick={() => handleDayClick(day)}
              style={{
                padding: "0.5rem",
                border: isToday ? "2px solid #0070f3" : "1px solid #ddd",
                borderRadius: "8px",
                cursor: "pointer",
                background: hasEvent ? "#fde68a" : "transparent",
              }}
            >
              {day.getDate()} {hasEvent ? "⚠️" : ""}
            </div>
          );
        })}
      </div>

      <div style={{ textAlign: "center", marginTop: "1rem", fontSize: "0.9rem" }}>
        <span>⚠️ Seizure</span>
      </div>

      <h3 style={{ marginTop: "1.5rem" }}>📅 Past Events</h3>
      {events.length === 0 ? (
        <p>No events yet.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {[...events]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map((e, i) => (
              <li key={i} style={{ padding: "4px 0", borderBottom: "1px solid #ddd" }}>
                {new Date(e.date).toDateString()}
              </li>
            ))}
        </ul>
      )}

      {showAddModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "1rem",
              borderRadius: "10px",
              textAlign: "center",
              width: "80%",
              maxWidth: "300px",
            }}
          >
            <p>Add event for {selectedDate?.toDateString()}?</p>
            <button onClick={addEvent}>Add</button>
            <button onClick={() => setShowAddModal(false)} style={{ marginLeft: "1rem" }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Duncan;
