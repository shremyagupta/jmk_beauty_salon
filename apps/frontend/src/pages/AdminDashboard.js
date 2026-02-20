import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Admin.css';

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
});

const AdminDashboard = () => {
  const [overview, setOverview] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/admin/login';
      return;
    }

    const fetchData = async () => {
      try {
        setError('');
        setLoading(true);
        const [overviewRes, appointmentsRes, testimonialsRes] = await Promise.all([
          axios.get('/api/admin/analytics/overview', { headers: getAuthHeaders() }),
          axios.get('/api/appointments', { headers: getAuthHeaders() }),
          axios.get('/api/testimonials/admin/all', { headers: getAuthHeaders() }),
        ]);
        setOverview(overviewRes.data || null);
        setAppointments(appointmentsRes.data || []);
        setTestimonials(testimonialsRes.data || []);
      } catch (err) {
        const msg = err.response?.data?.error || 'Failed to load admin data';
        setError(msg);
        if (err.response && err.response.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/admin/login';
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      const res = await axios.put(`/api/appointments/${id}`, { status }, { headers: getAuthHeaders() });
      const updated = res.data;
      setAppointments((prev) => prev.map((a) => (a._id === id ? updated : a)));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update status');
    }
  };

  const handleApproveTestimonial = async (id, isApproved) => {
    try {
      const testimonial = testimonials.find((t) => t._id === id);
      if (!testimonial) return;
      const res = await axios.put(
        `/api/testimonials/${id}`,
        { ...testimonial, isApproved },
        { headers: getAuthHeaders() }
      );
      const updated = res.data;
      setTestimonials((prev) => prev.map((t) => (t._id === id ? updated : t)));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update testimonial');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/admin/login';
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-card">
          <h2>Admin Dashboard</h2>
          <p>Loading data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page">
        <div className="admin-card">
          <h2>Admin Dashboard</h2>
          <p className="admin-error">{error}</p>
          <button className="admin-button" onClick={logout}>Back to Login</button>
        </div>
      </div>
    );
  }

  const appointmentStats = overview?.appointments || {};
  const smartStats = overview?.smartBookings || {};
  const testimonialStats = overview?.testimonials || {};

  const pendingTestimonials = testimonials.filter((t) => !t.isApproved);

  return (
    <div className="admin-page">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <button className="admin-button" onClick={logout}>Logout</button>
      </header>

      <section className="admin-section">
        <h2>Overview Analytics</h2>
        <div className="admin-grid">
          <div className="admin-stat-card">
            <h3>Total Appointments</h3>
            <p className="stat-main">{appointmentStats.total || 0}</p>
            <p className="stat-sub">Today: {appointmentStats.today || 0}</p>
          </div>
          <div className="admin-stat-card">
            <h3>Appointment Status</h3>
            <p className="stat-sub">Pending: {appointmentStats.byStatus?.pending || 0}</p>
            <p className="stat-sub">Confirmed: {appointmentStats.byStatus?.confirmed || 0}</p>
            <p className="stat-sub">Completed: {appointmentStats.byStatus?.completed || 0}</p>
            <p className="stat-sub">Cancelled: {appointmentStats.byStatus?.cancelled || 0}</p>
          </div>
          <div className="admin-stat-card">
            <h3>Smart Bookings</h3>
            <p className="stat-main">{smartStats.total || 0}</p>
            <p className="stat-sub">Revenue: ₹{(smartStats.revenue || 0).toFixed(0)}</p>
            <p className="stat-sub">Avg Value: ₹{(smartStats.averageBookingValue || 0).toFixed(0)}</p>
            <p className="stat-sub">Cancellation: {smartStats.cancellationRate?.toFixed(1) || 0}%</p>
          </div>
          <div className="admin-stat-card">
            <h3>Testimonials & Ratings</h3>
            <p className="stat-main">Avg Rating: {(testimonialStats.avgRating || 0).toFixed(1)}★</p>
            <p className="stat-sub">Approved: {testimonialStats.approved || 0}</p>
            <p className="stat-sub">Pending: {testimonialStats.pending || 0}</p>
          </div>
        </div>
      </section>

      <section className="admin-section">
        <h2>Recent Appointments</h2>
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Service</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Change Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.slice(0, 20).map((a) => (
                <tr key={a._id}>
                  <td>{a.name}</td>
                  <td>{a.service}</td>
                  <td>{new Date(a.date).toLocaleDateString()}</td>
                  <td>{a.time}</td>
                  <td className={`status-${a.status}`}>{a.status}</td>
                  <td>
                    <select
                      value={a.status}
                      onChange={(e) => handleStatusChange(a._id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="admin-section">
        <h2>Pending Testimonials (Ratings)</h2>
        {pendingTestimonials.length === 0 ? (
          <p>No pending testimonials. All caught up!</p>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Rating</th>
                  <th>Text</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingTestimonials.map((t) => (
                  <tr key={t._id}>
                    <td>{t.name}</td>
                    <td>{'★'.repeat(t.rating || 5)}</td>
                    <td>{t.text}</td>
                    <td>
                      <button
                        className="admin-button small"
                        onClick={() => handleApproveTestimonial(t._id, true)}
                      >
                        Approve
                      </button>
                      <button
                        className="admin-button small secondary"
                        onClick={() => handleApproveTestimonial(t._id, false)}
                      >
                        Keep Pending
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminDashboard;
