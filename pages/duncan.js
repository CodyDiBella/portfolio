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
  const ar = (ah >> 16) & 0xff, ag = (ah >> 8) & 0xff, ab = ah & 0xff;
  const br = (bh >> 16) & 0xff, bg = (bh >> 8) & 0xff, bb = bh & 0xff;
  const rr = Math.round(ar + (br - ar) * t);
  const rg = Math.round(ag + (bg - ag) * t);
  const rb = Math.round(ab + (bb - ab) * t);
  return `rgb(${rr}, ${rg}, ${rb})`;
}

export default function DuncanSeizureDashboard() {
  // ---------- 1) Seed data: full dataset (from your notes) ----------
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

  // Convert seed to objects preserving times/ER where we have them:
  // For the seeded entries where you gave times/ER in the notes, I'll inject them here:
  // (If you want exact per-row times from your note, we can refine; these are just included where provided.)
  const seededObjects = useMemo(() => {
    const map = {};
    seed.forEach(d => {
      map[d] = map[d] || [];
      map[d].push({ date: d });
    });

    // override or insert exact ones we had times/er for in your note:
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

    // Build flat array of event objects
    const out = [];
    seed.forEach(d => {
      if (extras[d]) {
        if (Array.isArray(extras[d])) extras[d].forEach(o => out.push(o));
        else out.push(extras[d]);
      } else {
        // keep as a simple object
        out.push({ date: d });
      }
    });
    return out;
  }, [seed]);

  // seizures state: initialized from seededObjects
  const [seizures, setSeizures] = useState(seededObjects);
  const [showList, setShowList] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null); // for modal form
  const [modalOpen, setModalOpen] = useState(false);

  // calendar month state (Date with day=1)
  const [calendarMonth, setCalendarMonth] = useState(() => {
    // start on October 2025 like you used earlier
    return new Date(2025, 9, 1);
  });

  // ---------- Prediction model ----------
  // Build frequency by day-of-month (1..31) across all past data.
  // We'll use this as a simple likelihood estimate for that day-of-month.
  const predictionsByDayOfMonth = useMemo(() => {
    const counts = Array(32).fill(0); // index 1..31
    seizures.forEach(ev => {
      const d = new Date(ev.date + "T00:00:00"); // parse safe
      if (isNaN(d)) return;
      // only use past data for frequency (we use history to predict future)
      // Consider all historical events up to now.
      const today = new Date();
      if (d > today) return; // ignore future seeded events (if any)
      counts[d.getDate()] += 1;
    });
    const max = Math.max(...counts);
    const probs = Array(32).fill(0);
    if (max <= 0) return probs;
    for (let i = 1; i <= 31; i++) {
      // raw probability: count/max scaled to [0.05..1] for visibility
      const p = counts[i] / max;
      probs[i] = p; // 0..1
    }
    return probs;
  }, [seizures]);

  // Also estimate probable hour-of-day for predicted seizure times using histogram
  const hourDistribution = useMemo(() => {
    const buckets = Array(24).fill(0);
    seizures.forEach(ev => {
      if (!ev.times) return;
      ev.times.forEach(t => {
        // attempt parse hour from formats like "10:00 PM" or "6:45 AM"
        const m = t.match(/(\\d{1,2}):(\\d{2})\\s*(AM|PM)?/i);
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
    return buckets.map(b => b / max); // normalized 0..1
  }, [seizures]);

  // Helper: probability of a given date (future) based on day-of-month frequency
  function getProbabilityForDate(dateObj) {
    const day = dateObj.getDate();
    return predictionsByDayOfMonth[day] || 0; // 0..1
  }

  // ---------- Calendar helpers ----------
  function startOfMonth(d) {
    return new Date(d.getFullYear(), d.getMonth(), 1);
  }
  function daysInMonth(d) {
    return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  }

  // Build calendar grid (with previous-month tail and next-month head) - Sunday-first
  function buildCalendarGrid(monthDate) {
    const first = startOfMonth(monthDate);
    const firstDow = first.getDay(); // 0=Sun..6=Sat
    const dim = daysInMonth(monthDate);

    // compute previous month tail
    const prev = new Date(monthDate.getFullYear(), monthDate.getMonth() - 1, 1);
    const prevDim = daysInMonth(prev);

    const cells = [];

    // previous month tail
    for (let i = 0; i < firstDow; i++) {
      const dayNum = prevDim - firstDow + 1 + i;
      const dateObj = new Date(monthDate.getFullYear(), monthDate.getMonth() - 1, dayNum);
      cells.push({ dateObj, inMonth: false });
    }

    // current month
    for (let d = 1; d <= dim; d++) {
      const dateObj = new Date(monthDate.getFullYear(), monthDate.getMonth(), d);
      cells.push({ dateObj, inMonth: true });
    }

    // next month head so total cells multiple of 7
    while (cells.length % 7 !== 0) {
      const nextDay = cells.length - firstDow - dim + 1;
      const dateObj = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, nextDay);
      cells.push({ dateObj, inMonth: false });
    }

    return cells;
  }

  // find events for a given date (YYYY-MM-DD)
  function eventsForDate(dateObj) {
    const target = fmtDate(dateObj);
    return seizures.filter(s => s.date === target);
  }

  // add new event (from modal)
  function addEvent(dateStr, timeStr, erFlag, notes) {
    const ev = { date: dateStr };
    if (timeStr) ev.times = [timeStr];
    if (erFlag) ev.er = true;
    if (notes) ev.notes = notes;
    setSeizures(prev => [...prev, ev]);

    // send email via EmailJS (client-side). You must configure ids above.
    if (EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY) {
      // load emailjs (lightweight script) if not loaded
      if (!window.emailjs) {
        // attempt to load emailjs SDK
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

  // ---------- Modal form ----------

  function openAddModal(dateObj) {
    setSelectedDate(dateObj);
    setModalOpen(true);
  }

  function closeModal() {
    setSelectedDate(null);
    setModalOpen(false);
  }

  // ---------- UI render ----------
  const calendarCells = useMemo(() => buildCalendarGrid(calendarMonth), [calendarMonth, seizures, predictionsByDayOfMonth]);

  const today = new Date();
  const currentYMD = fmtDate(today);

  return (
    <div style={{ background: "#0f1724", minHeight: "100vh", color: "#fff", padding: 16, fontFamily: "system-ui, Arial" }}>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <header style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
          <svg width="26" height="26" viewBox="0 0 24 24" style={{ fill: "purple" }}>
            <path d="M12 2c1.104 0 2 .896 2 2s-.896 2-2 2-2-.896-2-2 .896-2 2-2zm-7 6c1.104 0 2 .896 2 2s-.896 2-2 2-2-.896-2-2 .896-2 2-2zm14 0c1.104 0 2 .896 2 2s-.896 2-2 2-2-.896-2-2 .896-2 2-2zM6.5 18C5.12 18 4 19.12 4 20.5S5.12 23 6.5 23 9 21.88 9 20.5 7.88 18 6.5 18zM12 16c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3z" />
          </svg>
          <h1 style={{ fontSize: 20 }}>Duncan’s Seizure Dashboard</h1>
        </header>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 12 }}>
          <div style={{ background: "#111827", padding: 12, borderRadius: 8 }}>
            <div style={{ color: "#c7f9cc", fontWeight: 600 }}>Days Since Last Seizure</div>
            <div style={{ fontSize: 24, fontWeight: 700, marginTop: 8 }}>
              {
                (() => {
                  // compute days since last seizure
                  const past = seizures.filter(s => new Date(s.date) <= today);
                  if (past.length === 0) return "—";
                  const latest = past.reduce((a,b)=> new Date(a.date) > new Date(b.date) ? a : b);
                  const diff = Math.ceil((today - new Date(latest.date)) / (1000*60*60*24));
                  return diff;
                })()
              }
            </div>
          </div>

          <div style={{ background: "#111827", padding: 12, borderRadius: 8 }}>
            <div style={{ color: "#cde7ff", fontWeight: 600 }}>Average Interval (days)</div>
            <div style={{ fontSize: 24, fontWeight: 700, marginTop: 8 }}>
              {
                (() => {
                  // compute average interval between historical seizures
                  const pastDates = seizures
                    .map(s => new Date(s.date))
                    .filter(d => d <= today)
                    .sort((a,b) => a - b);
                  if (pastDates.length < 2) return "—";
                  let total = 0;
                  for (let i = 1; i < pastDates.length; i++) {
                    total += (pastDates[i] - pastDates[i-1]) / (1000*60*60*24);
                  }
                  return Math.round(total / (pastDates.length - 1));
                })()
              }
            </div>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))} style={{ padding: "6px 10px", borderRadius: 6, background: "#0b1220", color: "#fff" }}>◀</button>
            <div style={{ fontWeight: 700 }}>{calendarMonth.toLocaleString(undefined, { month: "long", year: "numeric" })}</div>
            <button onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))} style={{ padding: "6px 10px", borderRadius: 6, background: "#0b1220", color: "#fff" }}>▶</button>
          </div>

          <div>
            <button onClick={() => setShowList(true)} style={{ padding: "8px 12px", borderRadius: 6, background: "#1f2937", color: "#fff" }}>Show Past Events</button>
          </div>
        </div>

        {/* Calendar header (days of week) */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6, marginTop: 10 }}>
          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
            <div key={d} style={{ textAlign: "center", color: "#94a3b8", fontSize: 12 }}>{d}</div>
          ))}
        </div>

        {/* Calendar grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6, marginTop: 4 }}>
          {calendarCells.map((cell, idx) => {
            const { dateObj, inMonth } = cell;
            const ymd = fmtDate(dateObj);
            const events = eventsForDate(dateObj);
            const isToday = ymd === currentYMD;
            const isFuture = dateObj > today;
            // coloring rules:
            // - past day with no seizure => green
            // - past day with seizure(s) => orange for 1, red for >1
            // - current day with no seizure => white
            // - future day => white unless predicted => purple (lighter/darker)
            let bg = "#d1fae5"; // green (no seizure past)
            let fg = "#000";
            if (isToday) {
              bg = "#ffffff"; fg = "#000";
              if (events.length > 0) { // if today has seizures show color
                bg = events.length > 1 ? "#dc2626" : "#f97316";
                fg = "#fff";
              }
            } else if (isFuture) {
              const prob = getProbabilityForDate(dateObj); // 0..1
              if (prob > 0) {
                // map prob (0..1) to color between light purple and deep purple
                bg = lerpColor("#ecdfff", "#5b21b6", prob); // light -> deep purple
                fg = "#fff";
              } else {
                bg = "#ffffff"; fg = "#000"; // future default white
              }
            } else {
              // past
              if (events.length === 0) {
                bg = "#bbf7d0"; // green
                fg = "#000";
              } else {
                bg = events.length > 1 ? "#dc2626" : "#f97316"; // red or orange
                fg = "#fff";
              }
            }

            // small text for times (limited)
            const timesText = events.length ? (events.flatMap(e => e.times || []).slice(0,2).join(", ")) : "";

            return (
              <div
                key={idx}
                onClick={() => {
                  if (inMonth) {
                    // open form to add new event (future OR today OR past) - user asked to add future dates; but allow any
                    openAddModal(dateObj);
                  } else {
                    // if user clicks an out-of-month cell, move calendar to that month and open
                    setCalendarMonth(new Date(dateObj.getFullYear(), dateObj.getMonth(), 1));
                    openAddModal(dateObj);
                  }
                }}
                style={{
                  background: bg,
                  color: fg,
                  padding: 8,
                  minHeight: 64,
                  borderRadius: 8,
                  cursor: "pointer",
                  border: inMonth ? "1px solid rgba(255,255,255,0.04)" : "1px dashed rgba(255,255,255,0.03)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                  <div style={{ fontWeight: 700 }}>{dateObj.getDate()}</div>
                  {!inMonth && <div style={{ fontSize: 11, opacity: 0.5 }}>{dateObj.toLocaleString(undefined, { month: "short" })}</div>}
                </div>

                <div style={{ fontSize: 11, marginTop: 6 }}>
                  {timesText && <div>{timesText}{events.some(e => e.er) ? " • ER" : ""}</div>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal for add/edit */}
        {modalOpen && selectedDate && (
          <AddEventModal
            dateObj={selectedDate}
            onClose={() => { closeModal(); }}
            onSave={(timeStr, erFlag, notes) => {
              const dateStr = fmtDate(selectedDate);
              addEvent(dateStr, timeStr, erFlag, notes);
              closeModal();
            }}
          />
        )}

        {/* Past events overlay */}
        {showList && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(2,6,23,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 60 }}>
            <div style={{ width: "95%", maxWidth: 720, maxHeight: "85vh", overflowY: "auto", background: "#0b1220", padding: 16, borderRadius: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <h3 style={{ margin: 0 }}>Duncan — Past Seizure Events</h3>
                <button onClick={() => setShowList(false)} style={{ background: "transparent", border: "none", color: "#fff", cursor: "pointer" }}>✕</button>
              </div>
              <div>
                {seizures
                  .slice()
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map((s, i) => (
                    <div key={i} style={{ padding: 10, borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                        <div style={{ fontWeight: 700 }}>{s.date}</div>
                        <div style={{ color: "#94a3b8" }}>{s.er ? "ER" : ""}</div>
                      </div>
                      {s.times && <div style={{ marginTop: 6 }}>Time(s): {s.times.join(", ")}</div>}
                      {s.notes && <div style={{ marginTop: 6, color: "#cbd5e1" }}>{s.notes}</div>}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------- AddEventModal component ----------
function AddEventModal({ dateObj, onClose, onSave }) {
  const [time, setTime] = useState("");
  const [er, setEr] = useState(false);
  const [notes, setNotes] = useState("");

  return (
    <div style={{
      position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
      background: "rgba(2,6,23,0.7)", zIndex: 80
    }}>
      <div style={{ width: "95%", maxWidth: 420, background: "#0b1220", padding: 16, borderRadius: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0 }}>Add Seizure — {fmtDate(dateObj)}</h3>
          <button onClick={onClose} style={{ background: "transparent", border: "none", color: "#fff", cursor: "pointer" }}>✕</button>
        </div>

        <div style={{ marginTop: 10 }}>
          <label style={{ display: "block", color: "#94a3b8", fontSize: 13 }}>Time (optional)</label>
          <input placeholder="e.g., 10:30 PM" value={time} onChange={e => setTime(e.target.value)} style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #111827", marginTop: 6 }} />
        </div>

        <div style={{ marginTop: 10 }}>
          <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input type="checkbox" checked={er} onChange={e => setEr(e.target.checked)} />
            <span style={{ color: "#94a3b8" }}>ER visit</span>
          </label>
        </div>

        <div style={{ marginTop: 10 }}>
          <label style={{ display: "block", color: "#94a3b8", fontSize: 13 }}>Notes (optional)</label>
          <textarea rows={3} value={notes} onChange={e=>setNotes(e.target.value)} style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #111827", marginTop: 6 }} />
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
          <button onClick={onClose} style={{ padding: "8px 10px", borderRadius: 6, background: "#1f2937", color: "#fff" }}>Cancel</button>
          <button onClick={() => onSave(time.trim() || null, er, notes.trim() || null)} style={{ padding: "8px 12px", borderRadius: 6, background: "#6d28d9", color: "#fff" }}>Save</button>
        </div>
      </div>
    </div>
  );
}
