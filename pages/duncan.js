// pages/duncan.js
import React, { useEffect, useMemo, useState } from "react";

/*
  Duncan Seizure Dashboard - full working version
  - Dark theme
  - Stats (Days since last, Average interval)
  - Responsive calendar (Sunday-first)
  - Month navigation
  - Legend (sticky)
  - Add / Delete events via modal
  - Time dropdown (standardized times)
  - ER checkbox and notes
  - Persist to localStorage under key 'duncan_seizures_v1'
  - EmailJS send on add (replace IDs with your own)
*/

const LOCAL_STORAGE_KEY = "duncan_seizures_v1";

// Replace with your values (already included previously)
const EMAILJS_SERVICE_ID = "service_snxpmua";
const EMAILJS_TEMPLATE_ID = "template_f8w3k1m";
const EMAILJS_PUBLIC_KEY = "1YtH3_3L4agOfqLYw";

// Helper format YYYY-MM-DD
function fmtYMD(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// Build standardized time options (hourly and common half-hours)
const TIME_OPTIONS = (() => {
  const opts = [];
  for (let h = 0; h < 24; h++) {
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    const ampm = h < 12 ? "AM" : "PM";
    opts.push(`${hour12}:00 ${ampm}`);
    opts.push(`${hour12}:30 ${ampm}`);
  }
  // remove duplicate 12:00 AM twice? it's fine; keep all.
  return opts;
})();

// seeded historical events (from your notes), with some times/er info where available
const SEEDED = [
  { date: "2023-01-17" }, { date: "2023-01-20" }, { date: "2023-01-28" }, { date: "2023-01-29" },
  { date: "2023-02-16" }, { date: "2023-03-04" }, { date: "2023-03-04" }, { date: "2023-03-05" }, { date: "2023-03-19" },
  { date: "2023-04-22" }, { date: "2023-04-23" }, { date: "2023-05-03" }, { date: "2023-05-07" }, { date: "2023-05-19" }, { date: "2023-06-03" },
  { date: "2023-07-01" }, { date: "2023-07-17" }, { date: "2023-08-06" }, { date: "2023-08-24" }, { date: "2023-08-30" },
  { date: "2023-09-21" }, { date: "2023-09-21" }, { date: "2023-09-21" }, { date: "2023-10-09" }, { date: "2023-10-15" }, { date: "2023-10-15" },
  { date: "2023-11-03" }, { date: "2023-11-06" }, { date: "2023-11-06" }, { date: "2023-12-12" }, { date: "2023-12-12" }, { date: "2023-12-15" }, { date: "2023-12-16" },
  { date: "2024-01-10", times: ["5:00 PM"] },
  { date: "2024-01-11", times: ["2:00 AM"] },
  { date: "2024-01-11", times: ["5:00 AM"] },
  { date: "2024-01-11", times: ["6:00 AM"], er: true },
  { date: "2024-05-12" }, { date: "2024-05-13" }, { date: "2024-05-13" }, { date: "2024-05-13", er: true }, { date: "2024-07-31" },
  { date: "2024-09-29" }, { date: "2024-11-01" }, { date: "2024-11-26" }, { date: "2024-12-23", times: ["3:50 PM"] }, { date: "2024-12-31", times: ["12:15 AM"] },
  { date: "2025-01-11", times: ["6:45 AM"], er: true }, { date: "2025-01-11", times: ["6:45 AM"] }, { date: "2025-01-11", times: ["6:45 AM"] }, { date: "2025-01-11", times: ["6:45 AM"] },
  { date: "2025-02-20", times: ["10:00 PM"] }, { date: "2025-04-10", times: ["10:00 PM"] }, { date: "2025-05-17", times: ["11:00 PM"] }, { date: "2025-07-08", times: ["8:00 PM"] },
  { date: "2025-09-04", times: ["11:50 PM"] }, { date: "2025-10-03", times: ["10:00 PM"] }
];

export default function DuncanPage() {
  // state: seizures list
  const [seizures, setSeizures] = useState(() => {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* ignore */ }
    return SEEDED.slice();
  });

  // persist to localStorage whenever seizures change
  useEffect(() => {
    try { localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(seizures)); } catch(e) {}
  }, [seizures]);

  // calendar month state (start at current month)
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const now = new Date();
    // default to current month
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  // modal / form state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDate, setModalDate] = useState(null); // Date object
  const [modalTime, setModalTime] = useState("");
  const [modalEr, setModalEr] = useState(false);
  const [modalNotes, setModalNotes] = useState("");

  const [showList, setShowList] = useState(false);

  const today = new Date();
  const todayYMD = fmtYMD(today);

  // ---- stats: days since last, avg interval ----
  const daysSinceLast = useMemo(() => {
    const past = seizures.filter(s => new Date(s.date) <= today).map(s => new Date(s.date));
    if (!past.length) return "—";
    const latest = past.reduce((a,b) => a > b ? a : b);
    const diff = Math.ceil((today - latest) / (1000*60*60*24));
    return diff;
  }, [seizures]);

  const avgInterval = useMemo(() => {
    const past = seizures.filter(s => new Date(s.date) <= today).map(s => new Date(s.date)).sort((a,b)=>a-b);
    if (past.length < 2) return "—";
    let total = 0;
    for (let i = 1; i < past.length; i++) {
      total += (past[i] - past[i-1]) / (1000*60*60*24);
    }
    return Math.round(total / (past.length - 1));
  }, [seizures]);

  // ---- calendar helpers ----
  function startOfMonth(d){ return new Date(d.getFullYear(), d.getMonth(), 1); }
  function daysInMonth(d){ return new Date(d.getFullYear(), d.getMonth()+1, 0).getDate(); }

  function buildCellsForMonth(monthDate){
    const first = startOfMonth(monthDate);
    const firstDow = first.getDay(); // 0..6
    const dim = daysInMonth(monthDate);
    const cells = [];
    // previous month tail
    const prev = new Date(monthDate.getFullYear(), monthDate.getMonth()-1, 1);
    const prevDim = daysInMonth(prev);
    for (let i=0;i<firstDow;i++){
      const dayNum = prevDim - firstDow + 1 + i;
      const d = new Date(monthDate.getFullYear(), monthDate.getMonth()-1, dayNum);
      cells.push({ dateObj: d, inMonth: false });
    }
    for (let d=1; d<=dim; d++){
      const dateObj = new Date(monthDate.getFullYear(), monthDate.getMonth(), d);
      cells.push({ dateObj, inMonth: true });
    }
    while (cells.length % 7 !== 0){
      const nextDay = cells.length - firstDow - dim + 1;
      const d = new Date(monthDate.getFullYear(), monthDate.getMonth()+1, nextDay);
      cells.push({ dateObj: d, inMonth: false });
    }
    return cells;
  }

  const calendarCells = useMemo(()=> buildCellsForMonth(calendarMonth), [calendarMonth, seizures]);

  // ---- prediction logic (improved but simple): recency-weighted day-of-month freq + time histogram ----
  // Build day-of-month frequency from full historical data (past only)
  const dayOfMonthCounts = useMemo(() => {
    const counts = Array(32).fill(0); // 1..31
    const now = new Date();
    seizures.forEach(ev => {
      const d = new Date(ev.date + "T00:00:00");
      if (isNaN(d)) return;
      if (d > now) return; // ignore future
      counts[d.getDate()] += 1;
    });
    return counts;
  }, [seizures]);

  const dayOfMonthProb = useMemo(() => {
    const max = Math.max(...dayOfMonthCounts, 1);
    const probs = Array(32).fill(0);
    for (let i=1;i<=31;i++){
      probs[i] = dayOfMonthCounts[i] / max; // 0..1
    }
    return probs;
  }, [dayOfMonthCounts]);

  // Hour distribution normalized 0..1 (use seeded times if present)
  const hourDist = useMemo(() => {
    const buckets = Array(24).fill(0);
    seizures.forEach(ev => {
      if (!ev.times) return;
      ev.times.forEach(t => {
        const m = t.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
        if (m){
          let hr = parseInt(m[1],10);
          const ampm = (m[3]||"").toUpperCase();
          if (ampm === "PM" && hr < 12) hr += 12;
          if (ampm === "AM" && hr === 12) hr = 0;
          if (hr >=0 && hr <24) buckets[hr] += 1;
        }
      });
    });
    const max = Math.max(...buckets, 1);
    return buckets.map(b => b / max);
  }, [seizures]);

  // Combined probability for a given date (for future days only)
  function probabilityForDate(dateObj){
    const todayNow = new Date();
    if (dateObj <= todayNow) return 0;
    const dom = dateObj.getDate();
    // base from day-of-month probability
    const base = dayOfMonthProb[dom] || 0;
    // recency factor: if recent seizures occurred, boost probability for near future
    const sortedPast = seizures.map(s=>new Date(s.date)).filter(d=>d<=todayNow).sort((a,b)=>b-a);
    const mostRecent = sortedPast[0] || null;
    let recencyBoost = 1;
    if (mostRecent){
      const daysAgo = (todayNow - mostRecent)/(1000*60*60*24);
      // if last seizure was within 7 days, boost probabilities up to factor 1.5
      recencyBoost = 1 + Math.max(0, (7 - Math.min(daysAgo,7)) / 14); // 1..1.5
    }
    // final
    let p = Math.min(1, base * recencyBoost);
    return p;
  }

  // ------------ UI helpers: open modal for a date ------------
  function openAddModalFor(dateObj){
    setModalDate(dateObj);
    setModalTime(""); setModalEr(false); setModalNotes("");
    setModalOpen(true);
  }

  // check if date has events; returns array of events (there may be multiple entries per date)
  function eventsFor(dateObj){
    const key = fmtYMD(dateObj);
    return seizures.filter(s => s.date === key);
  }

  // add full event object with time/er/notes and send email
  function saveEvent(dateObj, timeStr, erFlag, notes){
    const ymd = fmtYMD(dateObj);
    // store standardized times as chosen option or null
    const ev = { date: ymd };
    if (timeStr) ev.times = [timeStr];
    if (erFlag) ev.er = true;
    if (notes) ev.notes = notes;
    setSeizures(prev => {
      const next = [...prev, ev];
      return next;
    });

    // send email via EmailJS if configured (client-side)
    try {
      if (EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY && typeof window !== "undefined") {
        // load emailjs if necessary
        if (!window.emailjs) {
          const s = document.createElement("script");
          s.src = "https://cdn.jsdelivr.net/npm/emailjs-com@3/dist/email.min.js";
          s.onload = () => {
            if (window.emailjs && window.emailjs.init) {
              window.emailjs.init(EMAILJS_PUBLIC_KEY);
              sendEmail();
            }
          };
          document.body.appendChild(s);
        } else {
          sendEmail();
        }
        function sendEmail(){
          const templateParams = {
            to_name: "You",
            dog_name: "Duncan",
            date: ev.date,
            times: ev.times ? ev.times.join(", ") : "N/A",
            er: ev.er ? "Yes" : "No",
            notes: ev.notes || ""
          };
          window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
            .then(()=> console.log("Email sent"))
            .catch(err=> console.error("Email fail", err));
        }
      }
    } catch(e){ console.warn("emailjs error", e); }

    setModalOpen(false);
  }

  function removeEvent(dateObj, index = 0){
    // remove one matching event for that date; index selects which if multiple (default first)
    const ymd = fmtYMD(dateObj);
    setSeizures(prev => {
      // find occurrences and remove the one at the given index among that date
      const idxs = [];
      prev.forEach((p, i) => { if (p.date === ymd) idxs.push(i); });
      const removeIndex = idxs[index] ?? idxs[0];
      if (removeIndex === undefined) return prev;
      const next = prev.slice(0, removeIndex).concat(prev.slice(removeIndex+1));
      return next;
    });
    setModalOpen(false);
  }

  // ---- month navigation ----
  function goPrevMonth(){ setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth()-1, 1)); }
  function goNextMonth(){ setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth()+1, 1)); }

  // ---- sort past events for list (most recent first) ----
  const pastEventsSortedDesc = useMemo(()=>{
    return seizures.slice().sort((a,b)=> new Date(b.date) - new Date(a.date));
  }, [seizures]);

  // ---- small color helpers ----
  function colorForCell(dateObj){
    const ymd = fmtYMD(dateObj);
    const now = new Date();
    const isToday = ymd === todayYMD;
    const events = eventsFor(dateObj);
    if (isToday) {
      if (events.length === 0) return { bg: "#fff", fg: "#000", special: "today" }; // white today if no event
      // if today has events, show red or black cluster
      if (events.length === 1) return { bg: "#dc2626", fg: "#fff", special: "seizure" };
      return { bg: "#000", fg: "#fff", special: "cluster" };
    }
    if (dateObj > now) {
      // future: only color if probability is high
      const p = probabilityForDate(dateObj);
      if (p >= 0.45) {
        // darker purple for higher probabilities
        const purpleLight = [230,210,255];
        const purpleDark = [91,33,182];
        const t = Math.min(1, (p - 0.45)/0.55);
        const rr = Math.round(purpleLight[0] + (purpleDark[0]-purpleLight[0])*t);
        const rg = Math.round(purpleLight[1] + (purpleDark[1]-purpleLight[1])*t);
        const rb = Math.round(purpleLight[2] + (purpleDark[2]-purpleLight[2])*t);
        return { bg: `rgb(${rr},${rg},${rb})`, fg: "#fff", special: "predicted", prob: p };
      }
      // default future white
      return { bg: "#111827", fg: "#fff", special: "future" }; // dark card background to fit theme
    }
    // past day:
    if (events.length === 0) return { bg: "#063E1E", fg: "#bbf7d0", special: "past-clear" }; // dark green
    if (events.length === 1) return { bg: "#dc2626", fg: "#fff", special: "seizure" }; // red
    return { bg: "#000000", fg: "#fff", special: "cluster" }; // black for clusters
  }

  // ---- small utility to format a nice label for predicted time (from hourDist) ----
  function probableTimeLabel(){
    const bestHour = hourDist.map((v,i)=>({v,i})).sort((a,b)=>b.v-a.v)[0];
    if (!bestHour || bestHour.v === 0) return null;
    const h = bestHour.i;
    const ampm = h < 12 ? "AM" : "PM";
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    return `${hour12}:00 ${ampm}`;
  }

  // ---- JSX ----
  return (
    <div style={{ minHeight: "100vh", background: "#071025", color: "#E6EEF6", paddingTop: 100, paddingBottom: 40 }}>
      <div style={{ maxWidth: 980, margin: "0 auto", padding: "0 12px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 8, background: "#6d28d9", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
              🐾
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>Duncan — Seizure Dashboard</div>
              <div style={{ fontSize: 12, color: "#94a3b8" }}>Overview & predictions (client-only)</div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setShowList(s => !s)} style={btnStyle}>Past Events</button>
            <button onClick={() => {
              // quick-export: download events JSON
              const blob = new Blob([JSON.stringify(seizures, null, 2)], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url; a.download = "duncan-seizures.json"; a.click();
              URL.revokeObjectURL(url);
            }} style={btnStyle}>Export</button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
          <div style={{ background: "#0b1220", padding: 12, borderRadius: 10 }}>
            <div style={{ fontSize: 12, color: "#9fb6ff" }}>Days Since Last Seizure</div>
            <div style={{ fontSize: 24, fontWeight: 700, marginTop: 6 }}>{daysSinceLast}</div>
          </div>
          <div style={{ background: "#0b1220", padding: 12, borderRadius: 10 }}>
            <div style={{ fontSize: 12, color: "#9ff5c6" }}>Average Interval (days)</div>
            <div style={{ fontSize: 24, fontWeight: 700, marginTop: 6 }}>{avgInterval}</div>
          </div>
        </div>

        {/* Legend (sticky) */}
        <div style={{
          position: "sticky",
          top: 72,
          marginTop: 16,
          zIndex: 40,
          background: "linear-gradient(180deg, rgba(11,17,24,0.9), rgba(11,17,24,0.6))",
          padding: 12,
          borderRadius: 8,
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          alignItems: "center"
        }}>
          <LegendItem color="#063E1E" label="Past no seizure" /> 
          <LegendItem color="#dc2626" label="Seizure (past day)" />
          <LegendItem color="#000000" label="Cluster (multiple seizures)" textColor="#fff" />
          <LegendItem color="#b794f6" label="Predicted (future)" />
          <LegendItem color="#ffffff" label="Future (no prediction)" textColor="#000" />
          <LegendItem color="#ff8bb6" label="Today" />
          <div style={{ marginLeft: "auto", color: "#94a3b8", fontSize: 13 }}>
            Predicted time (most likely): <strong>{probableTimeLabel() ?? "n/a"}</strong>
          </div>
        </div>

        {/* Month nav */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button onClick={goPrevMonth} style={navBtnStyle}>◀</button>
            <div style={{ fontWeight: 700 }}>{calendarMonth.toLocaleString(undefined, { month: "long", year: "numeric" })}</div>
            <button onClick={goNextMonth} style={navBtnStyle}>▶</button>
          </div>

          <div style={{ color: "#94a3b8", fontSize: 13 }}>
            Click a day to add/delete events. Future predictions shown for the most likely days.
          </div>
        </div>

        {/* Calendar grid */}
        <div style={{ marginTop: 12, overflowX: "auto" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, minmax(44px, 1fr))",
            gap: 8,
            alignItems: "start"
          }}>
            {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
              <div key={d} style={{ textAlign: "center", fontWeight: 700, color: "#9fb6ff" }}>{d}</div>
            ))}

            {calendarCells.map((cell, idx) => {
              const dateObj = cell.dateObj;
              const ymd = fmtYMD(dateObj);
              const meta = colorForCell(dateObj);
              const events = eventsFor(dateObj);
              const isToday = ymd === todayYMD;
              const inMonth = cell.inMonth;
              return (
                <div
                  key={idx}
                  onClick={() => inMonth && openAddModalFor(dateObj)}
                  style={{
                    padding: 10,
                    minHeight: 72,
                    borderRadius: 8,
                    background: meta.bg,
                    color: meta.fg,
                    border: isToday ? "2px solid #ff8bb6" : "1px solid rgba(255,255,255,0.04)",
                    opacity: inMonth ? 1 : 0.5,
                    cursor: inMonth ? "pointer" : "default",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ fontWeight: 700 }}>{dateObj.getDate()}</div>
                    { !inMonth && <div style={{ fontSize: 11, opacity: 0.6 }}>{dateObj.toLocaleString(undefined,{month:"short"})}</div> }
                  </div>
                  <div style={{ fontSize: 12, color: meta.fg }}>
                    {events.length>0 ? `${events.length} event${events.length>1?"s":""}` : (meta.special==="predicted" ? `Predicted` : "")}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Past events list (toggle) */}
        {showList && (
          <div style={{ marginTop: 18, background: "#071824", padding: 12, borderRadius: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0 }}>Past Seizure Events</h3>
              <button onClick={() => setShowList(false)} style={btnSmall}>Close</button>
            </div>
            <div style={{ marginTop: 10 }}>
              {pastEventsSortedDesc.map((ev, i) => (
                <div key={i} style={{ padding: 8, borderBottom: "1px solid rgba(255,255,255,0.03)", display: "flex", justifyContent: "space-between", gap: 8 }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{ev.date}</div>
                    {ev.times && <div style={{ fontSize: 13, color: "#9fb6ff" }}>Time: {ev.times.join(", ")}</div>}
                    {ev.er && <div style={{ fontSize: 13, color: "#fca5a5" }}>ER visit</div>}
                    {ev.notes && <div style={{ fontSize: 13, color: "#94a3b8" }}>{ev.notes}</div>}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {/* delete this specific event (find index among events for that date) */}
                    <button style={btnSmall} onClick={()=>{
                      // find index among seizures that match this date and remove the first occurrence
                      const idx = seizures.findIndex(s => s.date === ev.date);
                      if (idx >= 0) {
                        const next = seizures.slice(0, idx).concat(seizures.slice(idx+1));
                        setSeizures(next);
                      }
                    }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal: add/delete for a specific date */}
        {modalOpen && modalDate && (
          <div style={{
            position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(2,6,23,0.7)", zIndex: 9999, padding: 12
          }}>
            <div style={{ width: "100%", maxWidth: 420, background: "#071025", padding: 16, borderRadius: 10, border: "1px solid rgba(255,255,255,0.04)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ margin: 0, color: "#fff" }}>{fmtYMD(modalDate)}</h3>
                <button onClick={() => setModalOpen(false)} style={btnSmall}>Close</button>
              </div>

              <div style={{ marginTop: 12 }}>
                <label style={{ fontSize: 13, color: "#9fb6ff" }}>Time</label>
                <select value={modalTime} onChange={e => setModalTime(e.target.value)} style={{ width: "100%", marginTop: 6, padding: 8, borderRadius: 6, background: "#061226", color: "#fff", border: "1px solid rgba(255,255,255,0.04)" }}>
                  <option value="">-- select time (optional) --</option>
                  {TIME_OPTIONS.map((t, i) => <option key={i} value={t}>{t}</option>)}
                </select>
              </div>

              <div style={{ marginTop: 8 }}>
                <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input type="checkbox" checked={modalEr} onChange={e=>setModalEr(e.target.checked)} />
                  <span style={{ color: "#94a3b8" }}>ER visit</span>
                </label>
              </div>

              <div style={{ marginTop: 8 }}>
                <label style={{ fontSize: 13, color: "#9fb6ff" }}>Notes (optional)</label>
                <textarea value={modalNotes} onChange={e=>setModalNotes(e.target.value)} rows={3} style={{ width: "100%", marginTop: 6, padding: 8, borderRadius: 6, background: "#061226", color: "#fff", border: "1px solid rgba(255,255,255,0.04)" }} />
              </div>

              <div style={{ display: "flex", gap: 8, marginTop: 12, justifyContent: "flex-end" }}>
                {/* if events exist for this date, show delete buttons for each */}
                {eventsFor(modalDate).length > 0 ? (
                  <>
                    {eventsFor(modalDate).map((ev, idx) => (
                      <button key={idx} onClick={() => removeEvent(modalDate, idx)} style={btnDanger}>Delete</button>
                    ))}
                  </>
                ) : null}
                <button onClick={() => {
                  // save event with specified data
                  saveEvent(modalDate, modalTime || null, modalEr, modalNotes || null);
                  // reset modal form
                  setModalTime(""); setModalEr(false); setModalNotes("");
                }} style={btnPrimary}>Save</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

/* ---------- small presentational subcomponents / styles ---------- */

function LegendItem({ color = "#fff", label = "", textColor = "#fff" }){
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <div style={{ width: 14, height: 14, background: color, borderRadius: 4, border: "1px solid rgba(255,255,255,0.06)" }} />
      <div style={{ color: textColor, fontSize: 13 }}>{label}</div>
    </div>
  )
}

const btnStyle = {
  padding: "8px 12px",
  background: "#0b1220",
  color: "#fff",
  borderRadius: 8,
  border: "1px solid rgba(255,255,255,0.04)",
  cursor: "pointer"
};

const btnSmall = {
  padding: "6px 8px",
  background: "#0b1220",
  color: "#fff",
  borderRadius: 6,
  border: "1px solid rgba(255,255,255,0.04)",
  cursor: "pointer",
  fontSize: 13
};

const btnPrimary = {
  padding: "8px 12px",
  background: "#6d28d9",
  color: "#fff",
  borderRadius: 8,
  border: "none",
  cursor: "pointer"
};

const btnDanger = {
  padding: "8px 12px",
  background: "#8b1d1d",
  color: "#fff",
  borderRadius: 8,
  border: "none",
  cursor: "pointer"
};

const navBtnStyle = {
  padding: "6px 10px",
  borderRadius: 6,
  background: "#071025",
  color: "#fff",
  border: "1px solid rgba(255,255,255,0.04)",
  cursor: "pointer"
};
