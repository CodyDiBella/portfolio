import { useState } from "react";
import emailjs from "@emailjs/browser";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function DuncanSeizureDashboard() {
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 9, 1));
  const [showList, setShowList] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [seizures, setSeizures] = useState([
    { date: "2025-09-04", times: ["11:50 PM"] },
    { date: "2025-10-03", times: ["10:00 PM"] },
    { date: "2025-01-11", times: ["6:45 AM"], er: true },
    { date: "2024-12-31", times: ["12:15 AM"] },
    { date: "2024-12-23", times: ["3:50 PM"] },
  ]);

  // Month navigation
  const prevMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  const nextMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );

  // Calendar helpers
  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();
  const today = new Date();
  const todayKey = today.toISOString().split("T")[0];

  // Stats
  const sortedSeizures = [...seizures].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );
  const lastSeizure =
    sortedSeizures.length > 0
      ? Math.floor((today - new Date(sortedSeizures[0].date)) / (1000 * 60 * 60 * 24))
      : "—";

  const intervals = sortedSeizures
    .slice(1)
    .map((s, i) =>
      Math.floor(
        (new Date(sortedSeizures[i].date) - new Date(s.date)) /
          (1000 * 60 * 60 * 24)
      )
    );
  const avgInterval =
    intervals.length > 0
      ? Math.round(intervals.reduce((a, b) => a + b, 0) / intervals.length)
      : "—";

  // Prediction model (simple recurrence based on gaps)
  const predictDays = () => {
    if (intervals.length === 0) return [];
    const avg = Math.round(
      intervals.reduce((a, b) => a + b, 0) / intervals.length
    );
    const nextPredicted = new Date(sortedSeizures[0].date);
    nextPredicted.setDate(nextPredicted.getDate() + avg);
    return [nextPredicted.toISOString().split("T")[0]];
  };
  const predictedDays = predictDays();

  // Handle click
  const handleDayClick = (day) => {
    const key = `${currentMonth.getFullYear()}-${String(
      currentMonth.getMonth() + 1
    ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const existing = seizures.find((s) => s.date === key);
    if (existing) {
      if (confirm("Delete this event?")) {
        setSeizures(seizures.filter((s) => s.date !== key));
      }
    } else {
      const time = prompt("Enter time of seizure (e.g., 10:00 PM):");
      if (!time) return;
      const er = confirm("Did Duncan need to go to the ER?");
      const newSeizure = { date: key, times: [time], er };
      setSeizures([...seizures, newSeizure]);

      // Email alert
      emailjs.send(
        "YOUR_EMAILJS_SERVICE_ID",
        "YOUR_EMAILJS_TEMPLATE_ID",
        {
          date: key,
          time,
          er: er ? "Yes" : "No",
        },
        "YOUR_EMAILJS_PUBLIC_KEY"
      );
    }
  };

  const renderDay = (day) => {
    const key = `${currentMonth.getFullYear()}-${String(
      currentMonth.getMonth() + 1
    ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const isSeizure = seizures.some((s) => s.date === key);
    const isPredicted = predictedDays.includes(key);
    const isToday = key === todayKey;

    let emoji = "✅";
    if (isSeizure) emoji = "🧠";
    else if (isPredicted) emoji = "⚠️";
    if (isToday) emoji = "📅";

    return (
      <div
        key={day}
        onClick={() => handleDayClick(day)}
        className="cursor-pointer text-center p-2 border rounded hover:bg-gray-100"
      >
        <div className="font-semibold">{day}</div>
        <div>{emoji}</div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-4">
      <div className="max-w-lg mx-auto space-y-6 pt-16">
        <h1 className="text-2xl font-bold text-center">🐾 Duncan’s Seizure Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-white shadow">
            <CardHeader className="font-medium text-center">Days Since Last</CardHeader>
            <CardContent className="text-3xl text-center font-bold text-green-600">
              {lastSeizure}
            </CardContent>
          </Card>
          <Card className="bg-white shadow">
            <CardHeader className="font-medium text-center">Avg Interval</CardHeader>
            <CardContent className="text-3xl text-center font-bold text-blue-600">
              {avgInterval}
            </CardContent>
          </Card>
        </div>

        {/* Calendar */}
        <div className="flex justify-between items-center mt-4">
          <button onClick={prevMonth} className="text-lg">←</button>
          <h2 className="text-lg font-semibold">
            {currentMonth.toLocaleString("default", { month: "long" })}{" "}
            {currentMonth.getFullYear()}
          </h2>
          <button onClick={nextMonth} className="text-lg">→</button>
        </div>

        <div className="grid grid-cols-7 gap-2 mt-2 text-center">
          {[...Array(daysInMonth).keys()].map((i) => renderDay(i + 1))}
        </div>

        {/* Legend */}
        <div className="mt-4 text-sm">
          <p>📅 = Today</p>
          <p>✅ = No seizure</p>
          <p>🧠 = Seizure</p>
          <p>⚠️ = Predicted risk</p>
        </div>

        {/* List */}
        <button
          onClick={() => setShowList(!showList)}
          className="w-full bg-purple-200 text-purple-900 font-semibold py-2 rounded"
        >
          {showList ? "Hide Past Events" : "Show Past Events"}
        </button>

        {showList && (
          <div className="space-y-2 mt-2 bg-white p-4 rounded shadow">
            {sortedSeizures.length === 0 ? (
              <p className="text-center text-gray-500">No events yet</p>
            ) : (
              sortedSeizures.map((s, i) => (
                <div key={i} className="flex justify-between border-b pb-1">
                  <span>{s.date}</span>
                  <span>{s.times ? s.times.join(", ") : ""}</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
