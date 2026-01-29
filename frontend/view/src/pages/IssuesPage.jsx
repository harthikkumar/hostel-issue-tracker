// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { FaPlus, FaArrowLeft } from 'react-icons/fa';

// const IssuesPage = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   return (
//     <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
//       <nav className="navbar">
//         <div className="navbar-content">
//           <h1>Hostel Tracker</h1>
//         </div>
//       </nav>

//       <div className="container" style={{ paddingTop: '40px' }}>
//         <button
//           onClick={() => navigate('/dashboard')}
//           className="btn-secondary"
//           style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}
//         >
//           <FaArrowLeft /> Back to Dashboard
//         </button>

//         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
//           <h1 style={{ fontSize: '36px', fontWeight: '700' }}>All Issues</h1>
//           {user?.role === 'student' && (
//             <button
//               onClick={() => navigate('/issues/create')}
//               className="btn-primary"
//               style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
//             >
//               <FaPlus /> Report New Issue
//             </button>
//           )}
//         </div>

//         <div className="card">
//           <p style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
//             Issues list will be displayed here
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default IssuesPage;
















import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { issuesAPI } from '../services/api';
import { FaPlus, FaArrowLeft, FaFilter } from 'react-icons/fa';

const IssuesPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadIssues();
  }, []);

  const loadIssues = async () => {
    try {
      const response = await issuesAPI.getIssues();
      setIssues(response.data.results || response.data || []);
    } catch (error) {
      console.error('Error loading issues:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredIssues = () => {
    if (filter === 'all') return issues;
    if (filter === 'my') return issues.filter(i => i.reported_by === user?.id);
    if (filter === 'pending') return issues.filter(i => !['resolved', 'closed'].includes(i.status));
    if (filter === 'resolved') return issues.filter(i => i.status === 'resolved');
    return issues;
  };

  const filteredIssues = getFilteredIssues();

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <nav className="navbar">
        <div className="navbar-content">
          <h1>Hostel Tracker</h1>
          <div className="navbar-right">
            <span>{user?.first_name || user?.username}</span>
            <button onClick={logout} className="btn-secondary" style={{
              background: 'rgba(255,255,255,0.2)',
              border: '2px solid white',
              color: 'white'
            }}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container" style={{ paddingTop: '40px' }}>
        <button
          onClick={() => navigate('/dashboard')}
          className="btn-secondary"
          style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <FaArrowLeft /> Back to Dashboard
        </button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: '700' }}>All Issues</h1>
          {user?.role === 'student' && (
            <button
              onClick={() => navigate('/issues/create')}
              className="btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <FaPlus /> Report New Issue
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="card" style={{ marginBottom: '24px', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <FaFilter style={{ color: '#666' }} />
            <span style={{ fontWeight: '600', color: '#666' }}>Filter:</span>
            <button
              onClick={() => setFilter('all')}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: filter === 'all' ? '2px solid #667eea' : '2px solid #e0e0e0',
                background: filter === 'all' ? '#f0f4ff' : 'white',
                color: filter === 'all' ? '#667eea' : '#666',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              All ({issues.length})
            </button>
            {user?.role === 'student' && (
              <button
                onClick={() => setFilter('my')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: filter === 'my' ? '2px solid #667eea' : '2px solid #e0e0e0',
                  background: filter === 'my' ? '#f0f4ff' : 'white',
                  color: filter === 'my' ? '#667eea' : '#666',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                My Issues ({issues.filter(i => i.reported_by === user?.id).length})
              </button>
            )}
            <button
              onClick={() => setFilter('pending')}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: filter === 'pending' ? '2px solid #667eea' : '2px solid #e0e0e0',
                background: filter === 'pending' ? '#f0f4ff' : 'white',
                color: filter === 'pending' ? '#667eea' : '#666',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Pending ({issues.filter(i => !['resolved', 'closed'].includes(i.status)).length})
            </button>
            <button
              onClick={() => setFilter('resolved')}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: filter === 'resolved' ? '2px solid #667eea' : '2px solid #e0e0e0',
                background: filter === 'resolved' ? '#f0f4ff' : 'white',
                color: filter === 'resolved' ? '#667eea' : '#666',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Resolved ({issues.filter(i => i.status === 'resolved').length})
            </button>
          </div>
        </div>

        {/* Issues List */}
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        ) : filteredIssues.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>
              No issues found
            </h3>
            <p style={{ color: '#666' }}>
              {filter === 'my' ? 'You have not reported any issues yet.' : 'There are no issues to display.'}
            </p>
          </div>
        ) : (
          <div className="grid" style={{ gap: '16px' }}>
            {filteredIssues.map(issue => (
              <div
                key={issue.id}
                className="card"
                style={{
                  padding: '24px',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onClick={() => navigate(`/issues/${issue.id}`)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>
                      {issue.title}
                    </h3>
                    <p style={{ color: '#666', marginBottom: '16px', lineHeight: '1.6' }}>
                      {issue.description.substring(0, 150)}
                      {issue.description.length > 150 ? '...' : ''}
                    </p>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
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
                      <span style={{ color: '#999', fontSize: '14px' }}>
                        📍 {issue.block} - {issue.room_number}
                      </span>
                      <span style={{ color: '#999', fontSize: '14px' }}>
                        🕒 {new Date(issue.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default IssuesPage;