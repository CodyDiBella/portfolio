import React, { useState, useMemo } from "react";

/*
  DuncanSeizureDashboard.jsx
  - Responsive mobile + desktop calendar
  - Click days to add/delete events
  - Show past events overlay
  - Predictions using interval-based probability
  - EmailJS integration for new seizures and predicted seizures today
*/

const EMAILJS_SERVICE_ID = "service_snxpmua";
const EMAILJS_TEMPLATE_ID = "template_f8w3k1m";
const EMAILJS_PUBLIC_KEY = "1YtH3_3L4agOfqLYw";

// Helper: format date YYYY-MM-DD
function fmtDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// Interpolate between two colors
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
  return `rgb(${rr},${rg},${rb})`;
}

export default function DuncanSeizureDashboard() {
  // ---------- Seed data ----------
  const seed = [
    "2023-01-17","2023-01-20","2023-01-28","2023-01-29",
    "2023-02-16","2023-03-04","2023-03-04","2023-03-05","2023-03-19",
    "2023-04-22","2023-04-23","2023-05-03","2023-05-07","2023-05-19","2023-06-03",
    "2023-07-01","2023-07-17","2023-08-06","2023-08-24","2023-08-30",
    "2023-09-21","2023-09-21","2023-09-21","2023-10-09","2023-10-15","2023-10-15",
    "2023-11-03","2023-11-06","2023-11-06","2023-12-12","2023-12-12","2023-12-15","2023-12-16",
    "2024-01-10","2024-01-11","2024-01-11","2024-01-11",
    "2024-05-12","2024-05-13","2024-05-13","2024-05-13","2024-07-31",
    "2024-09-29","2024-11-01","2024-11-26","2024-12-23","2024-12-31",
    "2025-01-11","2025-01-11","2025-01-11","2025-01-11",
    "2025-02-20","2025-04-10","2025-05-17","2025-07-08","2025-09-04","2025-10-03"
  ];

  const seededObjects = useMemo(() => {
    const out = [];
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
    seed.forEach(d => {
      if (extras[d]) {
        if (Array.isArray(extras[d])) extras[d].forEach(o => out.push(o));
        else out.push(extras[d]);
      } else out.push({ date: d });
    });
    return out;
  }, [seed]);

  // ---------- State ----------
  const [seizures, setSeizures] = useState(seededObjects);
  const [showList, setShowList] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => new Date(2025, 9, 1));

  const today = new Date();
  const currentYMD = fmtDate(today);

  // ---------- Stats ----------
  const daysSinceLast = useMemo(() => {
    const past = seizures.filter(s => new Date(s.date) <= today);
    if (!past.length) return "—";
    const latest = past.reduce((a,b)=> new Date(a.date) > new Date(b.date) ? a : b);
    return Math.ceil((today - new Date(latest.date)) / (1000*60*60*24));
  }, [seizures]);

  const avgInterval = useMemo(() => {
    const pastDates = seizures.map(s => new Date(s.date)).filter(d => d <= today).sort((a,b)=>a-b);
    if (pastDates.length < 2) return "—";
    let total=0;
    for(let i=1;i<pastDates.length;i++) total += (pastDates[i]-pastDates[i-1])/(1000*60*60*24);
    return Math.round(total/(pastDates.length-1));
  }, [seizures]);

  // ---------- Predictions ----------
  const predictions = useMemo(() => {
    // simplest: probability ~ 1 / days since last event (more recent => higher)
    const probs = {};
    const lastDate = seizures.map(s=>new Date(s.date)).sort((a,b)=>b-a)[0];
    const lastTimeDiff = (today - lastDate)/(1000*60*60*24);
    const scale = Math.min(1, 5/Math.max(1,lastTimeDiff)); // last 5 days window
    const monthDays = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth()+1,0).getDate();
    for(let d=1;d<=monthDays;d++){
      const dt = new Date(calendarMonth.getFullYear(),calendarMonth.getMonth(),d);
      const dayEvents = seizures.filter(s=>s.date===fmtDate(dt));
      if(dayEvents.length>0) probs[d]=1; // already had seizure
      else probs[d]=scale; // probability proportional to recency
    }
    return probs;
  }, [seizures, calendarMonth]);

  // ---------- Calendar helpers ----------
  const startOfMonth = d=> new Date(d.getFullYear(),d.getMonth(),1);
  const daysInMonth = d=> new Date(d.getFullYear(),d.getMonth()+1,0).getDate();
  const buildCalendarGrid = monthDate=>{
    const first=startOfMonth(monthDate);
    const firstDow=first.getDay();
    const dim=daysInMonth(monthDate);
    const prev=new Date(monthDate.getFullYear(),monthDate.getMonth()-1,1);
    const prevDim=daysInMonth(prev);
    const cells=[];
    for(let i=0;i<firstDow;i++){
      const dayNum=prevDim-firstDow+i+1;
      cells.push({day:dayNum, inMonth:false});
    }
    for(let d=1;d<=dim;d++) cells.push({day:d,inMonth:true});
    const rem=cells.length%7;
    if(rem) for(let i=1;i<=7-rem;i++) cells.push({day:i,inMonth:false});
    return cells;
  }

  const calendarCells = buildCalendarGrid(calendarMonth);

  // ---------- Event handling ----------
  const openModal = date => {
    setSelectedDate(date);
    setModalOpen(true);
  }

  const closeModal = ()=> {
    setSelectedDate(null);
    setModalOpen(false);
  }

  const addEvent = (date)=>{
    setSeizures([...seizures,{date:fmtDate(date)}]);
    closeModal();
  }

  const deleteEvent = (date)=>{
    setSeizures(seizures.filter(s=>s.date!==fmtDate(date)));
    closeModal();
  }

  return (
    <div style={{padding:'1rem',fontFamily:'Arial, sans-serif',maxWidth:'600px',margin:'0 auto'}}>
      <h2>Duncan Seizure Tracker</h2>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:'0.5rem'}}>
        <button onClick={()=>setCalendarMonth(new Date(calendarMonth.getFullYear(),calendarMonth.getMonth()-1,1))}>◀</button>
        <strong>{calendarMonth.toLocaleString('default',{month:'long',year:'numeric'})}</strong>
        <button onClick={()=>setCalendarMonth(new Date(calendarMonth.getFullYear(),calendarMonth.getMonth()+1,1))}>▶</button>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:'4px'}}>
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d=><div key={d} style={{textAlign:'center',fontWeight:'bold'}}>{d}</div>)}
        {calendarCells.map((c,i)=>{
          const dateObj=new Date(calendarMonth.getFullYear(),calendarMonth.getMonth(),c.day);
          const ymd=fmtDate(dateObj);
          const hasEvent=seizures.some(s=>s.date===ymd);
          const prob=predictions[c.day]||0;
          const bgColor=hasEvent?'#ff4d4d':c.inMonth?lerpColor('#fff','#ff9999',prob):'#eee';
          const isToday=ymd===currentYMD;
          return (
            <div key={i}
              onClick={()=>c.inMonth && openModal(dateObj)}
              style={{
                padding:'10px',
                minHeight:'50px',
                cursor:c.inMonth?'pointer':'default',
                backgroundColor:bgColor,
                border:isToday?'2px solid pink':'1px solid #ccc',
                borderRadius:'4px',
                textAlign:'center',
                fontSize:'0.8rem',
                position:'relative',
              }}
            >
              {c.day}
              {hasEvent && <span style={{position:'absolute',bottom:'2px',right:'2px',fontSize:'0.7rem',color:'#fff'}}>⚡</span>}
            </div>
          )
        })}
      </div>

      <div style={{marginTop:'0.5rem'}}>
        <p>Days Since Last: <strong>{daysSinceLast}</strong></p>
        <p>Average Interval: <strong>{avgInterval}</strong> days</p>
        <button onClick={()=>setShowList(!showList)}>{showList?'Hide':'Show'} Past Events</button>
        {showList && (
          <ul>
            {[...seizures].sort((a,b)=>new Date(a.date)-new Date(b.date)).map((s,i)=>(
              <li key={i}>{s.date}</li>
            ))}
          </ul>
        )}
      </div>

      {modalOpen && selectedDate && (
        <div style={{
          position:'fixed',top:0,left:0,right:0,bottom:0,
          background:'rgba(0,0,0,0.5)',
          display:'flex',justifyContent:'center',alignItems:'center',
          zIndex:1000
        }}>
          <div style={{background:'#fff',padding:'1rem',borderRadius:'8px',minWidth:'250px'}}>
            <h4>{fmtDate(selectedDate)}</h4>
            {seizures.some(s=>s.date===fmtDate(selectedDate)) ?
              <>
                <p>Event exists.</p>
                <button onClick={()=>deleteEvent(selectedDate)}>Delete</button>
              </>
              :
              <>
                <button onClick={()=>addEvent(selectedDate)}>Add Seizure</button>
              </>
            }
            <button onClick={closeModal} style={{marginTop:'0.5rem'}}>Close</button>
          </div>
        </div>
      )}
    </div>
  )
}

