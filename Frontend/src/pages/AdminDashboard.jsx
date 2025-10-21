import React from "react";
import "../styles/pages/AdminDashboard.css";

function AdminDashboard() {
  return (
    <div className="admin-container">
      <h2>Welcome, Admin!</h2>
      <p>Manage users, internships, and monitor platform activity.</p>

      {/* Users Table */}
      <div className="table-responsive">
        <table className="table table-bordered mt-3">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>John Doe</td>
              <td>john@example.com</td>
              <td>Student</td>
              <td>Active</td>
            </tr>
            <tr>
              <td>Jane Smith</td>
              <td>jane@example.com</td>
              <td>Recruiter</td>
              <td>Active</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;
