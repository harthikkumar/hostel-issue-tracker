import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { issuesAPI, authAPI } from '../services/api';
import { FaArrowLeft, FaExclamationTriangle } from 'react-icons/fa';

const CreateIssuePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [hostels, setHostels] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'plumbing',
    priority: 'medium',
    is_public: true,
    hostel: user?.hostel?.id || '',
    block: user?.block || '',
    room_number: user?.room_number || '',
    floor: '',
    location_type: 'room',
    contact_number: user?.phone_number || '',
    people_affected: '1',
    is_recurring: 'no',
    recurring_details: '',
    preferred_time: 'anytime',
    emergency_reason: '',
    expected_resolution: 'flexible',
    additional_notes: '',
    permission_to_enter: false
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadHostels();
  }, []);

  const loadHostels = async () => {
    try {
      const response = await authAPI.getHostels();
      setHostels(response.data);
    } catch (error) {
      console.error('Error loading hostels:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await issuesAPI.createIssue(formData);
      setSuccess('Issue reported successfully!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create issue. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <nav className="navbar">
        <div className="navbar-content">
          <h1>Hostel Tracker</h1>
        </div>
      </nav>

      <div className="container" style={{ paddingTop: '40px', maxWidth: '900px' }}>
        <button
          onClick={() => navigate('/dashboard')}
          className="btn-secondary"
          style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <FaArrowLeft /> Back to Dashboard
        </button>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FaExclamationTriangle style={{ fontSize: '28px', color: 'white' }} />
            </div>
            <div>
              <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '4px' }}>
                Report New Issue
              </h2>
              <p style={{ color: '#666' }}>Fill out the form below to report a hostel issue</p>
            </div>
          </div>

          {error && (
            <div className="alert alert-error" style={{ marginBottom: '20px' }}>
              {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success" style={{ marginBottom: '20px' }}>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Issue Title */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                Issue Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g., Water leakage in bathroom"
                required
              />
            </div>

            {/* Description */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="input-field"
                rows="4"
                placeholder="Describe the issue in detail..."
                required
                style={{ resize: 'vertical', fontFamily: 'inherit' }}
              />
            </div>

            {/* Category and Priority */}
            <div className="grid grid-2" style={{ marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="plumbing">🚰 Plumbing</option>
                  <option value="electrical">⚡ Electrical</option>
                  <option value="cleanliness">🧹 Cleanliness</option>
                  <option value="internet">📶 Internet</option>
                  <option value="furniture">🪑 Furniture</option>
                  <option value="security">🔒 Security</option>
                  <option value="other">📋 Other</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                  Priority *
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="low">🟢 Low</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="high">🟠 High</option>
                  <option value="emergency">🔴 Emergency</option>
                </select>
              </div>
            </div>

            {/* Location Details - Hostel, Block, Room */}
            <div className="grid grid-3" style={{ marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                  Hostel *
                </label>
                <select
                  name="hostel"
                  value={formData.hostel}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="">Select Hostel</option>
                  {hostels.map(hostel => (
                    <option key={hostel.id} value={hostel.id}>{hostel.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                  Block/Wing *
                </label>
                <input
                  type="text"
                  name="block"
                  value={formData.block}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g., A, B, North Wing"
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                  Room Number *
                </label>
                <input
                  type="text"
                  name="room_number"
                  value={formData.room_number}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g., 101, 205"
                  required
                />
              </div>
            </div>

            {/* Floor and Location Type */}
            <div className="grid grid-2" style={{ marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                  Floor Number
                </label>
                <input
                  type="text"
                  name="floor"
                  value={formData.floor}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g., Ground, 1st, 2nd"
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                  Location Type
                </label>
                <select
                  name="location_type"
                  value={formData.location_type}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="room">🛏️ Room</option>
                  <option value="bathroom">🚿 Bathroom</option>
                  <option value="common_area">👥 Common Area</option>
                  <option value="corridor">🚪 Corridor</option>
                  <option value="kitchen">🍳 Kitchen</option>
                  <option value="laundry">🧺 Laundry Room</option>
                  <option value="terrace">🏠 Terrace</option>
                  <option value="parking">🚗 Parking Area</option>
                </select>
              </div>
            </div>

            {/* Contact and People Affected */}
            <div className="grid grid-2" style={{ marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                  Contact Number
                </label>
                <input
                  type="tel"
                  name="contact_number"
                  value={formData.contact_number}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Your phone number"
                  pattern="[0-9]{10}"
                />
                <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                  📞 For updates and follow-up
                </p>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                  Number of People Affected
                </label>
                <input
                  type="number"
                  name="people_affected"
                  value={formData.people_affected}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g., 1, 4"
                  min="1"
                />
              </div>
            </div>

            {/* Recurring Issue */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                Is this a recurring issue?
              </label>
              <select
                name="is_recurring"
                value={formData.is_recurring}
                onChange={handleChange}
                className="input-field"
              >
                <option value="no">❌ No, first time</option>
                <option value="yes">🔄 Yes, has occurred before</option>
              </select>
            </div>

            {/* Recurring Details - Conditional */}
            {formData.is_recurring === 'yes' && (
              <div style={{ marginBottom: '20px', padding: '16px', background: '#fff3cd', borderRadius: '8px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                  Previous Issue Details
                </label>
                <textarea
                  name="recurring_details"
                  value={formData.recurring_details}
                  onChange={handleChange}
                  className="input-field"
                  rows="2"
                  placeholder="When did this issue occur before? Was it resolved?"
                  style={{ resize: 'vertical', fontFamily: 'inherit' }}
                />
              </div>
            )}

            {/* Preferred Time */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                Best Time to Visit/Fix (Optional)
              </label>
              <select
                name="preferred_time"
                value={formData.preferred_time}
                onChange={handleChange}
                className="input-field"
              >
                <option value="anytime">⏰ Anytime</option>
                <option value="morning">🌅 Morning (8 AM - 12 PM)</option>
                <option value="afternoon">☀️ Afternoon (12 PM - 4 PM)</option>
                <option value="evening">🌆 Evening (4 PM - 8 PM)</option>
                <option value="weekend">📅 Weekend Only</option>
              </select>
            </div>

            {/* Emergency Reason - Conditional */}
            {formData.priority === 'emergency' && (
              <div style={{ marginBottom: '20px', padding: '16px', background: '#fee', borderRadius: '8px', border: '2px solid #dc2626' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#dc2626' }}>
                  🚨 Emergency Reason *
                </label>
                <textarea
                  name="emergency_reason"
                  value={formData.emergency_reason}
                  onChange={handleChange}
                  className="input-field"
                  rows="2"
                  placeholder="Why is this an emergency? Is anyone in immediate danger?"
                  required
                  style={{ 
                    resize: 'vertical', 
                    fontFamily: 'inherit',
                    borderColor: '#dc2626'
                  }}
                />
              </div>
            )}

            {/* Expected Resolution Time */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                Expected Resolution Time
              </label>
              <select
                name="expected_resolution"
                value={formData.expected_resolution}
                onChange={handleChange}
                className="input-field"
              >
                <option value="flexible">🔄 Flexible</option>
                <option value="urgent_today">⚡ Today (Urgent)</option>
                <option value="within_3_days">📅 Within 3 days</option>
                <option value="within_week">📆 Within a week</option>
                <option value="within_month">🗓️ Within a month</option>
              </select>
            </div>

            {/* Additional Notes */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                Additional Notes/Comments (Optional)
              </label>
              <textarea
                name="additional_notes"
                value={formData.additional_notes}
                onChange={handleChange}
                className="input-field"
                rows="3"
                placeholder="Any additional information that might help resolve this issue faster..."
                style={{ resize: 'vertical', fontFamily: 'inherit' }}
              />
            </div>

            {/* Permission to Enter */}
            <div style={{ marginBottom: '20px', padding: '16px', background: '#f0f9ff', borderRadius: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="permission_to_enter"
                  checked={formData.permission_to_enter}
                  onChange={handleChange}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <span style={{ fontWeight: '600' }}>
                  🔑 I give permission to enter my room if I'm not available
                </span>
              </label>
              <p style={{ color: '#666', fontSize: '14px', marginTop: '4px', marginLeft: '26px' }}>
                This helps maintenance staff resolve issues faster
              </p>
            </div>

            {/* Public/Private Toggle */}
            <div style={{ marginBottom: '24px', padding: '16px', background: '#f9fafb', borderRadius: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="is_public"
                  checked={formData.is_public}
                  onChange={handleChange}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <span style={{ fontWeight: '600' }}>
                  👁️ Make this issue public
                </span>
              </label>
              <p style={{ color: '#666', fontSize: '14px', marginTop: '4px', marginLeft: '26px' }}>
                Public issues are visible to all users in your hostel
              </p>
            </div>

            {/* Submit Buttons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
                style={{ flex: 1 }}
              >
                {loading ? '⏳ Submitting...' : '✅ Submit Issue'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateIssuePage;