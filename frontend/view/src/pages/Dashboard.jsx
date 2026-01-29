import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { issuesAPI } from '../services/api';
import { FaExclamationTriangle, FaCheckCircle, FaClock, FaPlus, FaBullhorn, FaSearch, FaSignOutAlt, FaUser } from 'react-icons/fa';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0 });
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await issuesAPI.getIssues();
      const issuesList = response.data.results || response.data || [];

      setIssues(issuesList);
      setStats({
        total: issuesList.length,
        pending: issuesList.filter(i => !['resolved', 'closed'].includes(i.status)).length,
        resolved: issuesList.filter(i => i.status === 'resolved').length
      });
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p style={{ marginTop: '16px', color: '#666' }}>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-content">
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <FaExclamationTriangle /> Hostel Tracker
          </h1>
          <div className="navbar-right">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaUser />
              <span>{user?.first_name || user?.username}</span>
            </div>
            <button
              onClick={logout}
              className="btn-secondary"
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: '2px solid white',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container" style={{ paddingTop: '40px' }}>
        {/* Page Title */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '8px' }}>
            Welcome back, {user?.first_name || user?.username}! 👋
          </h2>
          <p style={{ color: '#666', fontSize: '16px' }}>
            Here's what's happening with your hostel today
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-3" style={{ marginBottom: '40px' }}>
          <div className="stat-card stat-blue">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3>Total Issues</h3>
                <p className="stat-number" style={{ color: '#3b82f6' }}>
                  {stats.total}
                </p>
              </div>
              <FaExclamationTriangle style={{ fontSize: '48px', color: '#3b82f6', opacity: 0.2 }} />
            </div>
          </div>

          <div className="stat-card stat-yellow">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3>Pending Issues</h3>
                <p className="stat-number" style={{ color: '#fbbf24' }}>
                  {stats.pending}
                </p>
              </div>
              <FaClock style={{ fontSize: '48px', color: '#fbbf24', opacity: 0.2 }} />
            </div>
          </div>

          <div className="stat-card stat-green">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3>Resolved Issues</h3>
                <p className="stat-number" style={{ color: '#10b981' }}>
                  {stats.resolved}
                </p>
              </div>
              <FaCheckCircle style={{ fontSize: '48px', color: '#10b981', opacity: 0.2 }} />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card" style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '20px' }}>
            Quick Actions
          </h3>
          <div className="grid grid-2">
            <button
              onClick={() => navigate('/issues')}
              style={{
                padding: '24px',
                border: '2px solid #e0e0e0',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.3s',
                background: 'white',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#667eea';
                e.currentTarget.style.background = '#f9f9ff';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e0e0e0';
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <FaExclamationTriangle style={{ fontSize: '24px', color: '#667eea' }} />
                <h4 style={{ fontWeight: '600', fontSize: '18px' }}>View All Issues</h4>
              </div>
              <p style={{ color: '#666', fontSize: '14px' }}>
                Browse and manage all reported issues
              </p>
            </button>

            <button
              onClick={() => navigate('/announcements')}
              style={{
                padding: '24px',
                border: '2px solid #e0e0e0',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.3s',
                background: 'white',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#667eea';
                e.currentTarget.style.background = '#f9f9ff';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e0e0e0';
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <FaBullhorn style={{ fontSize: '24px', color: '#667eea' }} />
                <h4 style={{ fontWeight: '600', fontSize: '18px' }}>Announcements</h4>
              </div>
              <p style={{ color: '#666', fontSize: '14px' }}>
                Check latest hostel announcements
              </p>
            </button>

            <button
              onClick={() => navigate('/lost-found')}
              style={{
                padding: '24px',
                border: '2px solid #e0e0e0',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.3s',
                background: 'white',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#667eea';
                e.currentTarget.style.background = '#f9f9ff';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e0e0e0';
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <FaSearch style={{ fontSize: '24px', color: '#667eea' }} />
                <h4 style={{ fontWeight: '600', fontSize: '18px' }}>Lost & Found</h4>
              </div>
              <p style={{ color: '#666', fontSize: '14px' }}>
                Report or search for lost items
              </p>
            </button>

            {user?.role === 'student' && (
              <button
                onClick={() => navigate('/issues/create')}
                style={{
                  padding: '24px',
                  border: '2px solid #667eea',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  textAlign: 'left',
                  color: 'white'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(102, 126, 234, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <FaPlus style={{ fontSize: '24px' }} />
                  <h4 style={{ fontWeight: '600', fontSize: '18px' }}>Report New Issue</h4>
                </div>
                <p style={{ fontSize: '14px', opacity: 0.9 }}>
                  Submit a new hostel issue or complaint
                </p>
              </button>
            )}
          </div>
        </div>

        {/* Recent Issues Table */}
        {issues.length > 0 && (
          <div className="card">
            <h3 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '20px' }}>
              Recent Issues
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e0e0e0', textAlign: 'left' }}>
                    <th style={{ padding: '16px', fontWeight: '600', color: '#666' }}>Title</th>
                    <th style={{ padding: '16px', fontWeight: '600', color: '#666' }}>Category</th>
                    <th style={{ padding: '16px', fontWeight: '600', color: '#666' }}>Status</th>
                    <th style={{ padding: '16px', fontWeight: '600', color: '#666' }}>Priority</th>
                    <th style={{ padding: '16px', fontWeight: '600', color: '#666' }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {issues.slice(0, 5).map((issue) => (
                    <tr
                      key={issue.id}
                      style={{
                        borderBottom: '1px solid #f0f0f0',
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#f9f9ff'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                      onClick={() => navigate(`/issues/${issue.id}`)}
                    >
                      <td style={{ padding: '16px', fontWeight: '500' }}>{issue.title}</td>
                      <td style={{ padding: '16px' }}>
                        <span style={{
                          padding: '6px 12px',
                          borderRadius: '16px',
                          background: '#e0e0e0',
                          fontSize: '13px',
                          fontWeight: '500',
                          textTransform: 'capitalize'
                        }}>
                          {issue.category}
                        </span>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span style={{
                          padding: '6px 12px',
                          borderRadius: '16px',
                          background: issue.status === 'resolved' ? '#d1fae5' : '#fef3c7',
                          color: issue.status === 'resolved' ? '#065f46' : '#92400e',
                          fontSize: '13px',
                          fontWeight: '500',
                          textTransform: 'capitalize'
                        }}>
                          {issue.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span style={{
                          padding: '6px 12px',
                          borderRadius: '16px',
                          background: issue.priority === 'high' || issue.priority === 'emergency' ? '#fee2e2' : '#dbeafe',
                          color: issue.priority === 'high' || issue.priority === 'emergency' ? '#991b1b' : '#1e40af',
                          fontSize: '13px',
                          fontWeight: '500',
                          textTransform: 'capitalize'
                        }}>
                          {issue.priority}
                        </span>
                      </td>
                      <td style={{ padding: '16px', color: '#666', fontSize: '14px' }}>
                        {new Date(issue.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {issues.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <FaExclamationTriangle style={{ fontSize: '64px', color: '#e0e0e0', marginBottom: '16px' }} />
            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>
              No issues reported yet
            </h3>
            <p style={{ color: '#666', marginBottom: '24px' }}>
              Get started by reporting your first issue
            </p>
            {user?.role === 'student' && (
              <button
                onClick={() => navigate('/issues/create')}
                className="btn-primary"
              >
                <FaPlus style={{ marginRight: '8px' }} />
                Report New Issue
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;