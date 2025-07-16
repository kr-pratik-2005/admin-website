import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

function getTodayDateString() {
  const today = new Date();
  return today.toISOString().slice(0, 10);
}

export default function ViewReport() {
  const { studentId } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const today = getTodayDateString();

  useEffect(() => {
    const fetchReport = async () => {
      const reportId = `${studentId}_${today}`;
      const reportRef = doc(db, "daily_reports", reportId);
      const reportSnap = await getDoc(reportRef);
      if (reportSnap.exists()) {
        setReport(reportSnap.data());
      } else {
        setReport(null);
      }
      setLoading(false);
    };
    fetchReport();
  }, [studentId, today]);

  if (loading) return <div style={{ textAlign: "center", marginTop: "3rem" }}>Loading...</div>;

  if (!report) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={styles.title}>Daily Report</h2>
          <p style={{ margin: "1rem 0" }}>No report found for today.</p>
          <button style={styles.button} onClick={() => navigate("/fees")}>Back</button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Daily Report for {report.name}</h2>

        {renderRow("Date", report.date)}
        {renderRow("In Time", report.inTime)}
        {renderRow("Out Time", report.outTime)}
        {renderRow("Snacks", report.snacks)}
        {renderRow("Meal", report.meal)}
        {renderRow("Slept", report.sleep ? "No" : `${report.sleepFrom} - ${report.sleepTo}`)}
        {renderRow("Diaper Changed", report.diaperChanged ? "Yes" : "No")}
        {renderRow("No Diaper", report.noDiaper ? "Yes" : "No")}
        {renderRow("Diaper Times", report.diaperTimes)}
        {renderRow("Poops", report.poops)}
        {renderRow("Feelings", report.feelings?.join(", ") || "None")}
        {renderRow("Learning", report.learning || "N/A")}
        {renderRow("Teacher Note", report.teacherNote || "N/A")}

        <hr style={styles.hr} />
        <h4>Ouch Report</h4>
        {renderRow("Student", report.ouch?.student || "N/A")}
        {renderRow("Incident", report.ouch?.incident || "N/A")}
        {renderRow("Comment", report.ouch?.comment || "N/A")}

        <hr style={styles.hr} />
        <h4>Incident Report</h4>
        {renderRow("Student", report.incident?.student || "N/A")}
        {renderRow("Description", report.incident?.description || "N/A")}
        {renderRow("Comment", report.incident?.comment || "N/A")}

        <hr style={styles.hr} />
        <h4>Theme</h4>
        {report.theme?.length > 0 ? (
          report.theme.map((tag, i) =>
            renderRow(tag, report.themeDetails?.[i] || "No detail")
          )
        ) : (
          <p>No themes taught today.</p>
        )}

        <button style={styles.button} onClick={() => navigate("/fees")}>Back</button>
      </div>
    </div>
  );
}

function renderRow(label, value) {
  return (
    <div style={styles.row}>
      <strong>{label}:</strong> <span>{value}</span>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    padding: "2rem",
    backgroundColor: "#f3f4f6",
    minHeight: "100vh"
  },
  card: {
    background: "#fff",
    padding: "2rem",
    borderRadius: "8px",
    width: "100%",
    maxWidth: "600px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)"
  },
  title: {
    textAlign: "center",
    marginBottom: "1.5rem"
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    margin: "0.5rem 0",
    borderBottom: "1px solid #eee",
    paddingBottom: "0.25rem"
  },
  hr: {
    margin: "1.5rem 0"
  },
  button: {
    marginTop: "2rem",
    padding: "0.6rem 1.5rem",
    backgroundColor: "#6366f1",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    alignSelf: "center"
  }
};
