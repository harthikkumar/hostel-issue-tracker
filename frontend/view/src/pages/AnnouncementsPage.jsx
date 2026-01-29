import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const AnnouncementsPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <nav className="navbar">
        <div className="navbar-content">
          <h1>Hostel Tracker</h1>
        </div>
      </nav>
      <div className="container" style={{ paddingTop: '40px' }}>
        <button onClick={() => navigate('/dashboard')} className="btn-secondary" style={{ marginBottom: '24px' }}>
          <FaArrowLeft /> Back to Dashboard
        </button>
        <h2 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '24px' }}>Announcements</h2>
        <div className="card">
          <p>Announcements will be displayed here</p>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementsPage;