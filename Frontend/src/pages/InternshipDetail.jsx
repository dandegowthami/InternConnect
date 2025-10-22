import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/pages/InternshipDetail.css";

function InternshipDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInternship = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5000/api/internships/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setInternship(res.data);
      } catch (error) {
        console.error("Error fetching internship:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInternship();
  }, [id]);

  const handleApply = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/applications/apply/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Successfully applied for this internship!");
      navigate("/applications");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to apply");
    }
  };

  if (loading) return <p className="loading">Loading internship...</p>;
  if (!internship) return <p className="error">Internship not found.</p>;

  return (
    <div className="internship-detail-page">
      <div className="container py-5">
        <div className="card internship-detail-card shadow-lg p-4">
          <h2 className="text-cyan">{internship.title}</h2>
          <h5 className="company">{internship.company}</h5>
          <p className="location">📍 {internship.location}</p>

          {internship.stipend && <p><strong>💰 Stipend:</strong> {internship.stipend}</p>}
          {internship.duration && <p><strong>⏱ Duration:</strong> {internship.duration}</p>}

          <h5 className="mt-4">📝 Description</h5>
          <p className="description">{internship.description}</p>

          {internship.skills?.length > 0 && (
            <>
              <h5>🧠 Required Skills</h5>
              <ul className="skills-list">
                {internship.skills.map((skill, idx) => (
                  <li key={idx}>{skill}</li>
                ))}
              </ul>
            </>
          )}

          <div className="text-center mt-4">
            <button className="btn btn-apply-now" onClick={handleApply}>
              🚀 Apply Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InternshipDetail;
