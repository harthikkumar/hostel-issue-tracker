import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaArrowLeft, FaUser, FaClock, FaMapMarkerAlt, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import axios from 'axios';

const IssueDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [caretakers, setCaretakers] = useState([]);
  const [selectedCaretaker, setSelectedCaretaker] = useState('');
  const [workNote, setWorkNote] = useState('');

  useEffect(() => {
    loadIssue();
    if (user?.role === 'management') {
      loadCaretakers();
    }
  }, [id]);

  const loadIssue = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/issues/${id}/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
      });
      setIssue(response.data);
    } catch (error) {
      console.error('Error loading issue:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCaretakers = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/auth/users/', {
        params: { role: 'caretaker' },
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
      });
      setCaretakers(response.data);
    } catch (error) {
      console.error('Error loading caretakers:', error);
    }
  };

  const handleAssign = async () => {
    if (!selectedCaretaker) {
      alert('Please select a caretaker');
      return;
    }

    setUpdating(true);
    try {
      await axios.patch(
        `http://localhost:8000/api/issues/${id}/`,
        {
          assigned_to: selectedCaretaker,
          status: 'assigned'
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
        }
      );
      alert('✅ Issue assigned successfully!');
      loadIssue();
      setSelectedCaretaker('');
    } catch (error) {
      alert('❌ Failed to assign issue');
    } finally {
      setUpdating(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    try {
      const updateData = { status: newStatus };
      if (workNote.trim()) {
        updateData.work_note = workNote;
      }

      await axios.patch(
        `http://localhost:8000/api/issues/${id}/`,
        updateData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
        }
      );
      alert(`✅ Status updated to: ${newStatus.replace('_', ' ')}`);
      loadIssue();
      setWorkNote('');
    } catch (error) {
      alert('❌ Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!issue) {
    return (
      <div style={{ minHeight: '100vh', background: '#f5f5f5', padding: '40px' }}>
        <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
          <h2>Issue not found</h2>
          <button onClick={() => navigate('/issues')} className="btn-primary" style={{ marginTop: '20px' }}>
            Back to Issues
          </button>
        </div>
      </div>
    );
  }

  const canEdit = user?.role === 'management' || 
                  (user?.role === 'caretaker' && issue.assigned_to === user.id);

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <nav className="navbar">
        <div className="navbar-content">
          <h1>Hostel Tracker</h1>
        </div>
      </nav>

      <div className="container" style={{ paddingTop: '40px', maxWidth: '1000px' }}>
        <button
          onClick={() => navigate('/issues')}
          className="btn-secondary"
          style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <FaArrowLeft /> Back to Issues
        </button>

        <div className="card">
          {/* Header with Badges */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <span style={{
                padding: '8px 16px',
                borderRadius: '20px',
                background: '#e0e0e0',
                fontSize: '14px',
                fontWeight: '600',
                textTransform: 'capitalize'
              }}>
                📂 {issue.category}
              </span>
              <span style={{
                padding: '8px 16px',
                borderRadius: '20px',
                background: issue.status === 'resolved' ? '#d1fae5' : 
                           issue.status === 'in_progress' ? '#dbeafe' : '#fef3c7',
                color: issue.status === 'resolved' ? '#065f46' : 
                       issue.status === 'in_progress' ? '#1e40af' : '#92400e',
                fontSize: '14px',
                fontWeight: '600',
                textTransform: 'capitalize'
              }}>
                {issue.status === 'resolved' ? '✅' : 
                 issue.status === 'in_progress' ? '🔄' : '⏳'} {issue.status.replace('_', ' ')}
              </span>
              <span style={{
                padding: '8px 16px',
                borderRadius: '20px',
                background: issue.priority === 'emergency' ? '#fee2e2' :
                           issue.priority === 'high' ? '#fed7aa' :
                           issue.priority === 'medium' ? '#fef3c7' : '#dbeafe',
                color: issue.priority === 'emergency' || issue.priority === 'high' ? '#991b1b' : '#1e40af',
                fontSize: '14px',
                fontWeight: '600',
                textTransform: 'capitalize'
              }}>
                {issue.priority === 'emergency' ? '🔴' :
                 issue.priority === 'high' ? '🟠' :
                 issue.priority === 'medium' ? '🟡' : '🟢'} {issue.priority} Priority
              </span>
            </div>

            <h1 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '20px', lineHeight: '1.2' }}>
              {issue.title}
            </h1>

            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', color: '#666', fontSize: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaUser style={{ color: '#667eea' }} />
                <span>
                  Reported by: <strong>{issue.reported_by_details?.first_name} {issue.reported_by_details?.last_name}</strong>
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaMapMarkerAlt style={{ color: '#667eea' }} />
                <span><strong>{issue.block} - Room {issue.room_number}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaClock style={{ color: '#667eea' }} />
                <span>{new Date(issue.created_at).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '2px solid #f0f0f0', margin: '32px 0' }} />

          {/* Description */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#333' }}>
              📝 Description
            </h3>
            <p style={{ 
              color: '#666', 
              lineHeight: '1.8', 
              fontSize: '16px',
              padding: '20px',
              background: '#f9fafb',
              borderRadius: '12px',
              border: '1px solid #e5e7eb'
            }}>
              {issue.description}
            </p>
          </div>

          {/* Assigned To Info */}
          {issue.assigned_to_details && (
            <div style={{ 
              marginBottom: '32px', 
              padding: '20px', 
              background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
              borderRadius: '12px',
              border: '2px solid #667eea'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#667eea' }}>
                👷 Assigned To
              </h3>
              <p style={{ fontSize: '18px', fontWeight: '600', color: '#333' }}>
                {issue.assigned_to_details.first_name} {issue.assigned_to_details.last_name}
              </p>
              <p style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>
                {issue.assigned_to_details.email}
              </p>
            </div>
          )}

          {/* MANAGEMENT ACTIONS */}
          {user?.role === 'management' && issue.status !== 'closed' && (
            <div style={{ 
              marginTop: '32px', 
              padding: '28px', 
              background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
              borderRadius: '16px',
              border: '2px solid #0ea5e9'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px', color: '#0369a1' }}>
                👔 Management Actions
              </h3>

              {!issue.assigned_to ? (
                <div>
                  <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600', fontSize: '16px' }}>
                    Assign to Caretaker
                  </label>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <select
                      value={selectedCaretaker}
                      onChange={(e) => setSelectedCaretaker(e.target.value)}
                      className="input-field"
                      style={{ flex: 1, minWidth: '250px' }}
                    >
                      <option value="">Select Caretaker</option>
                      {caretakers.map(caretaker => (
                        <option key={caretaker.id} value={caretaker.id}>
                          {caretaker.first_name} {caretaker.last_name} ({caretaker.username})
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={handleAssign}
                      className="btn-primary"
                      disabled={updating || !selectedCaretaker}
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      {updating ? '⏳ Assigning...' : '✅ Assign Issue'}
                    </button>
                  </div>
                  {caretakers.length === 0 && (
                    <p style={{ color: '#dc2626', marginTop: '12px', fontSize: '14px' }}>
                      ⚠️ No caretakers available. Please create caretaker accounts first.
                    </p>
                  )}
                </div>
              ) : (
                <div style={{ 
                  padding: '16px', 
                  background: '#dcfce7', 
                  borderRadius: '8px',
                  border: '1px solid #86efac'
                }}>
                  <p style={{ color: '#166534', fontWeight: '600' }}>
                    ✅ Already assigned to {issue.assigned_to_details?.first_name} {issue.assigned_to_details?.last_name}
                  </p>
                </div>
              )}

              <div style={{ marginTop: '20px' }}>
                <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
                  Quick Actions
                </h4>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {issue.status !== 'resolved' && (
                    <button
                      onClick={() => handleStatusChange('resolved')}
                      className="btn-primary"
                      disabled={updating}
                      style={{ background: '#10b981' }}
                    >
                      ✅ Mark as Resolved
                    </button>
                  )}
                  {issue.status === 'resolved' && issue.status !== 'closed' && (
                    <button
                      onClick={() => handleStatusChange('closed')}
                      className="btn-primary"
                      disabled={updating}
                      style={{ background: '#6b7280' }}
                    >
                      🔒 Close Issue
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* CARETAKER ACTIONS */}
          {user?.role === 'caretaker' && issue.assigned_to === user.id && issue.status !== 'closed' && (
            <div style={{ 
              marginTop: '32px', 
              padding: '28px', 
              background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
              borderRadius: '16px',
              border: '2px solid #f59e0b'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px', color: '#92400e' }}>
                🔧 Caretaker Actions
              </h3>

              {/* Work Note */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                  Add Work Note (Optional)
                </label>
                <textarea
                  value={workNote}
                  onChange={(e) => setWorkNote(e.target.value)}
                  className="input-field"
                  rows="3"
                  placeholder="Describe what work was done, materials used, time taken, etc..."
                  style={{ resize: 'vertical', fontFamily: 'inherit' }}
                />
              </div>

              {/* Status Update Buttons */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {issue.status === 'assigned' && (
                  <button
                    onClick={() => handleStatusChange('in_progress')}
                    className="btn-primary"
                    disabled={updating}
                    style={{ background: '#3b82f6' }}
                  >
                    🔄 Start Working (In Progress)
                  </button>
                )}
                {issue.status === 'in_progress' && (
                  <button
                    onClick={() => handleStatusChange('resolved')}
                    className="btn-primary"
                    disabled={updating}
                    style={{ background: '#10b981' }}
                  >
                    ✅ Mark as Resolved
                  </button>
                )}
                {issue.status === 'resolved' && (
                  <div style={{ 
                    padding: '16px', 
                    background: '#dcfce7', 
                    borderRadius: '8px',
                    width: '100%'
                  }}>
                    <p style={{ color: '#166534', fontWeight: '600' }}>
                      ✅ Issue has been marked as resolved. Waiting for management to close.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* No Edit Permission Message */}
          {!canEdit && issue.status !== 'closed' && (
            <div style={{ 
              marginTop: '32px', 
              padding: '20px', 
              background: '#f3f4f6', 
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <p style={{ color: '#666', fontSize: '16px' }}>
                ℹ️ You don't have permission to update this issue.
              </p>
            </div>
          )}

          {/* Closed Issue Message */}
          {issue.status === 'closed' && (
            <div style={{ 
              marginTop: '32px', 
              padding: '24px', 
              background: '#f3f4f6', 
              borderRadius: '12px',
              textAlign: 'center',
              border: '2px solid #9ca3af'
            }}>
              <FaCheckCircle style={{ fontSize: '48px', color: '#10b981', marginBottom: '12px' }} />
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>
                This issue has been closed
              </h3>
              <p style={{ color: '#666' }}>
                No further actions can be taken on this issue.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IssueDetailPage;