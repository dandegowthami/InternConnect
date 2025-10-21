// src/pages/Notifications.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

function Notifications() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/notifications/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(res.data);
    };
    fetch();
  }, []);

  return (
    <div className="container p-4">
      <h3>Notifications</h3>
      {notes.length === 0 && <p>No notifications</p>}
      <div className="list-group">
        {notes.map(n => (
          <div key={n._id} className="list-group-item">
            <strong>{n.title}</strong>
            <div className="text-muted">{n.message}</div>
            <small className="text-muted">{new Date(n.createdAt).toLocaleString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notifications;
