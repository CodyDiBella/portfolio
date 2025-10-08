import React, { useState, useMemo } from "react";

/*
  DuncanSeizureDashboard.jsx
  - Click days to add event modal
  - List view overlay
  - Predictions for future days (purple intensity)
  - EmailJS integration (client-side) - fill in your service/template/public key
*/

const EMAILJS_SERVICE_ID = "service_snxpmua";
const EMAILJS_TEMPLATE_ID = "template_f8w3k1m";
const EMAILJS_PUBLIC_KEY = "1YtH3_3L4agOfqLYw";

// Simple helper: format date YYYY-MM-DD
function fmtDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// Color interpolation between two hex colors (0..1)
function lerpColor(a, b, t) {
  const ah = parseInt(a.replace("#", ""), 16);
  const bh = parseInt(b.replace("#", ""), 16);
  const ar = (ah >> 16) & 0xff,
    ag = (ah >> 8) & 0xff,
    ab = ah & 0xff;
  const br = (bh >> 16) & 0xff,
    bg = (bh >> 8) & 0xff,
    bb = bh & 0xff;
  const rr = Math.round(ar + (br - ar) * t);
  const rg = Math.round(ag + (bg - ag) * t);
  const rb = Math.round(ab + (bb - ab) * t);
  return `rgb(${rr}, ${rg}, ${rb})`;
}

export default function DuncanSeizureDashboard() {
  const seed = [
    // 2023
    "2023-01-17","2023-01-20","2023-01-28","2023-01-29",
    "2023-02-16","2023-03-04","2023-03-04","2023-03-05","2023-03-19",
    "2023-04-22","2023-04-23","2023-05-03","2023-05-07","2023-05-19","2023-06-03",
    "2023-07-01","2023-07-17","2023-08-06","2023-08-24","2023-08-30",
    "2023-09-21","2023-09-21","2023-09-21","2023-10-09","2023-10-15","2023-10-15",
    "2023-11-03","2023-11-06","2023-11-06","2023-12-12","2023-12-12","2023-12-15","2023-12-16",
    // 2024
    "2024-01-10","2024-01-11","2024-01-11","2024-01-11",
    "2024-05-12","2024-05-13","2024-05-13","2024-05-13","2024-07-31",
    "2024-09-29","2024-11-01","2024-11-26","2024-12-23","2024-12-31",
    // 2025
    "2025-01-11","2025-01-11","2025-01-11","2025-01-11",
    "2025-02-20","2025-04-10","2025-05-17","2025-07-08","2025-09-04","2025-10-03"
  ];

  const seededObjects = useMemo(() => {
    const map = {};
    seed.forEach(d => {
      map[d] = map[d] || [];
      map[d].push({ date: d });
    });

    const extras = {
      "2024-01-10": { date: "2024-01-10", times: ["5:00 PM"] },
      "2024-01-11": [
        { date: "2024-01-11", times: ["2:00 AM"] },
        { date: "2024-01-11", times: ["5:00 AM"] },
        { date: "2024-01-11", times: ["6:00 AM"], er: true }
      ],
      "2024-05-13": [
        { date: "2024-05-13" },
        { date: "2024-05-13" },
        { date: "2024-05-13", er: true }
      ],
      "2024-12-23": { date: "2024-12-23", times: ["3:50 PM"] },
      "2024-12-31": { date: "2024-12-31", times: ["12:15 AM"] },
      "2025-01-11": [
        { date: "2025-01-11", times: ["6:45 AM"], er: true },
        { date: "2025-01-11", times: ["6:45 AM"] },
        { date: "2025-01-11", times: ["6:45 AM"] },
        { date: "2025-01-11", times: ["6:45 AM"] }
      ],
      "2025-02-20": { date: "2025-02-20", times: ["10:00 PM"] },
      "2025-04-10": { date: "2025-04-10", times: ["10:00 PM"] },
      "2025-05-17": { date: "2025-05-17", times: ["11:00 PM"] },
      "2025-07-08": { date: "2025-07-08", times: ["8:00 PM"] },
      "2025-09-04": { date: "2025-09-04", times: ["11:50 PM"] },
      "2025-10-03": { date: "2025-10-03", times: ["10:00 PM"] }
    };

    const out = [];
    seed.forEach(d => {
      if (extras[d]) {
        if (Array.isArray(extras[d])) extras[d].forEach(o => out.push(o));
        else out.push(extras[d]);
      } else {
        out.push({ date: d });
      }
    });
    return out;
  }, [seed]);

  const [seizures, setSeizures] = useState(seededObjects);
  const [showList, setShowList] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date(2025, 9, 1));

  const predictionsByDayOfMonth = useMemo(() => {
    const counts = Array(32).fill(0);
    seizures.forEach(ev => {
      const d = new Date(ev.date + "T00:00:00");
      if (isNaN(d)) return;
      const today = new Date();
      if (d > today) return;
      counts[d.getDate()] += 1;
    });
    const max = Math.max(...counts);
    const probs = Array(32).fill(0);
    if (max <= 0) return probs;
    for (let i = 1; i <= 31; i++) {
      probs[i] = counts[i] / max;
    }
    return probs;
  }, [seizures]);

  const hourDistribution = useMemo(() => {
    const buckets = Array(24).fill(0);
    seizures.forEach(ev => {
      if (!ev.times) return;
      ev.times.forEach(t => {
        const m = t.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
        if (m) {
          let hour = parseInt(m[1], 10);
          const ampm = (m[3] || "").toUpperCase();
          if (ampm === "PM" && hour < 12) hour += 12;
          if (ampm === "AM" && hour === 12) hour = 0;
          buckets[hour] += 1;
        }
      });
    });
    const max = Math.max(...buckets, 1);
    return buckets.map(b => b / max);
  }, [seizures]);

  function getProbabilityForDate(dateObj) {
    const day = dateObj.getDate();
    return predictionsByDayOfMonth[day] || 0;
  }

  function startOfMonth(d) {
    return new Date(d.getFullYear(), d.getMonth(), 1);
  }
  function daysInMonth(d) {
    return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  }

  function buildCalendarGrid(monthDate) {
    const first = startOfMonth(monthDate);
    const firstDow = first.getDay();
    const dim = daysInMonth(monthDate);
    const prev = new Date(monthDate.getFullYear(), monthDate.getMonth() - 1, 1);
    const prevDim = daysInMonth(prev);

    const cells = [];
    for (let i = 0; i < firstDow; i++) {
      const dayNum = prevDim - firstDow + 1 + i;
      const dateObj = new Date(monthDate.getFullYear(), monthDate.getMonth() - 1, dayNum);
      cells.push({ dateObj, inMonth: false });
    }
    for (let d = 1; d <= dim; d++) {
      const dateObj = new Date(monthDate.getFullYear(), monthDate.getMonth(), d);
      cells.push({ dateObj, inMonth: true });
    }
    while (cells.length % 7 !== 0) {
      const nextDay = cells.length - firstDow - dim + 1;
      const dateObj = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, nextDay);
      cells.push({ dateObj, inMonth: false });
    }
    return cells;
  }

  function eventsForDate(dateObj) {
    const target = fmtDate(dateObj);
    return seizures.filter(s => s.date === target);
  }

  function addEvent(dateStr, timeStr, erFlag, notes) {
    const ev = { date: dateStr };
    if (timeStr) ev.times = [timeStr];
    if (erFlag) ev.er = true;
    if (notes) ev.notes = notes;
    setSeizures(prev => [...prev, ev]);

    if (EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY) {
      if (!window.emailjs) {
        const s = document.createElement("script");
        s.src = "https://cdn.jsdelivr.net/npm/emailjs-com@3/dist/email.min.js";
        s.onload = () => {
          if (window.emailjs && window.emailjs.init) {
            window.emailjs.init(EMAILJS_PUBLIC_KEY);
            sendEmail(ev);
          }
        };
        document.body.appendChild(s);
      } else {
        sendEmail(ev);
      }
    }

    function sendEmail(ev) {
      const templateParams = {
        to_name: "You",
        dog_name: "Duncan",
        date: ev.date,
        times: ev.times ? ev.times.join(", ") : "N/A",
        er: ev.er ? "Yes" : "No",
        notes: ev.notes || ""
      };
      window.emailjs
        .send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
        .then(() => console.log("Email sent"), err => console.error("Email fail", err));
    }
  }

  function nextMonth() {
    setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1));
  }
  function prevMonth() {
    setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1));
  }

  const todayStr = fmtDate(new Date());

  return (
    <div
      style={{
        background: "#0f1724",
        minHeight: "100vh",
        color: "#fff",
        padding: 16,
        fontFamily: "system-ui, Arial",
        marginTop: "80px" // push below navbar
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: 12 }}>Duncan Seizure Tracker</h1>

      <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
        <div style={{ padding: 12, background: "#111827", borderRadius: 8 }}>Days Since Last: {/* compute */}</div>
        <div style={{ padding: 12, background: "#111827", borderRadius: 8 }}>Average Interval: {/* compute */}</div>
      </div>

      {/* Sticky legend */}
      <div
        style={{
          position: "sticky",
          top: 80,
          zIndex: 10,
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          alignItems: "center",
          justifyContent: "center",
          background: "#111827",
          padding: "10px 12px",
          borderRadius: 8,
          marginTop: 16,
          fontSize: 13
        }}
      >
        <div>
          <span
            style={{
              display: "inline-block",
              width: 14,
              height: 14,
              background: "#bbf7d0",
              borderRadius: 3,
              marginRight: 6
            }}
          ></span>
          No Seizure (Past)
        </div>
        <div>
          <span
            style={{
              display: "inline-block",
              width: 14,
              height: 14,
              background: "#f97316",
              borderRadius: 3,
              marginRight: 6
            }}
          ></span>
          1 Seizure
        </div>
        <div>
          <span
            style={{
              display: "inline-block",
              width: 14,
              height: 14,
              background: "#dc2626",
              borderRadius: 3,
              marginRight: 6
            }}
          ></span>
          Multiple Seizures
        </div>
        <div>
          <span
            style={{
              display: "inline-block",
              width: 14,
              height: 14,
              background: "#c084fc",
              borderRadius: 3,
              marginRight: 6
            }}
          ></span>
          Predicted Risk
        </div>
        <div>
          <span
            style={{
              display: "inline-block",
              width: 14,
              height: 14,
              background: "#ffffff",
              border: "1px solid #ccc",
              borderRadius: 3,
              marginRight: 6
            }}
          ></span>
          Future (No Prediction)
        </div>
        <div>
          <span
            style={{
              display: "inline-block",
              width: 14,
              height: 14,
              background: "#ec4899",
              borderRadius: 3,
              marginRight: 6
            }}
          ></span>
          Today
        </div>
      </div>

      {/* Calendar */}
      <div style={{ marginTop: 16, overflowX: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <button onClick={prevMonth}>{"<"}</button>
          <h2>{calendarMonth.toLocaleString("default", { month: "long", year: "numeric" })}</h2>
          <button onClick={nextMonth}>{">"}</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 40px)", gap: 4, justifyContent: "center" }}>
          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
            <div key={d} style={{ textAlign: "center", fontWeight: "bold" }}>{d}</div>
          ))}

          {buildCalendarGrid(calendarMonth).map(({ dateObj, inMonth }, idx) => {
            const dateStr = fmtDate(dateObj);
            const events = eventsForDate(dateObj);
            const isToday = dateStr === todayStr;
            const isFuture = dateObj > new Date();

            // Coloring rules
            let bg = "#bbf7d0"; // default past no seizure
            let fg = "#000";

            if (isToday) {
              bg = "#ec4899"; // pink
              fg = "#fff";
              if (events.length > 0) {
                bg = events.length > 1 ? "#dc2626" : "#f97316";
                fg = "#fff";
              }
            } else if (isFuture) {
              const prob = getProbabilityForDate(dateObj);
              if (prob > 0.3) {
                bg = lerpColor("#e9d5ff", "#5b21b6", prob);
                fg = "#fff";
              } else {
                bg = "#ffffff";
                fg = "#000";
              }
            } else {
              if (events.length === 0) {
                bg = "#bbf7d0";
                fg = "#000";
              } else {
                bg = events.length > 1 ? "#dc2626" : "#f97316";
                fg = "#fff";
              }
            }

            return (
              <div
                key={idx}
                style={{
                  width: 40,
                  height: 40,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  background: bg,
                  color: fg,
                  borderRadius: 4,
                  cursor: "pointer",
                  opacity: inMonth ? 1 : 0.4,
                  border: "1px solid #555"
                }}
                onClick={() => {
                  setSelectedDate(dateStr);
                  setModalOpen(true);
                }}
              >
                {dateObj.getDate()}
              </div>
            );
          })}
        </div>
      </div>

      {/* List Modal */}
      {modalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 50,
            color: "#fff",
            padding: 16
          }}
        >
          <div style={{ background: "#111827", padding: 16, borderRadius: 8, width: "100%", maxWidth: 400 }}>
            <h3>{selectedDate}</h3>
            <ul>
              {eventsForDate(new Date(selectedDate)).map((ev, idx) => (
                <li key={idx}>{ev.times ? ev.times.join(", ") : "No time logged"} {ev.er ? "(ER)" : ""}</li>
              ))}
            </ul>
            <button onClick={() => setModalOpen(false)} style={{ marginTop: 12 }}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

