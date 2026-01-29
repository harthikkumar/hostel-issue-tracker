import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaHome, FaUser, FaLock } from 'react-icons/fa';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(credentials);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        padding: '48px',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        width: '100%',
        maxWidth: '450px'
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)'
          }}>
            <FaHome style={{ fontSize: '36px', color: 'white' }} />
          </div>
          <h2 style={{
            fontSize: '36px',
            fontWeight: '800',
            marginBottom: '8px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Hostel Tracker
          </h2>
          <p style={{ color: '#666', fontSize: '16px' }}>
            Smart Issue Management System
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="alert alert-error" style={{ marginBottom: '24px' }}>
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#333',
              fontSize: '14px'
            }}>
              Username
            </label>
            <div style={{ position: 'relative' }}>
              <FaUser style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#999'
              }} />
              <input
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                className="input-field"
                style={{ paddingLeft: '48px' }}
                placeholder="Enter your username"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#333',
              fontSize: '14px'
            }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <FaLock style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#999'
              }} />
              <input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                className="input-field"
                style={{ paddingLeft: '48px' }}
                placeholder="Enter your password"
                required
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', fontSize: '18px' }}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Register Link */}
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <p style={{ color: '#666', fontSize: '14px' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{
              color: '#667eea',
              fontWeight: '600',
              textDecoration: 'none'
            }}>
              Register here
            </Link>
          </p>
        </div>

        {/* Demo Credentials */}
        <div style={{
          marginTop: '32px',
          padding: '20px',
          background: '#f9fafb',
          borderRadius: '12px',
          border: '1px solid #e5e7eb'
        }}>
          <p style={{
            fontWeight: '700',
            marginBottom: '12px',
            color: '#333',
            fontSize: '14px'
          }}>
            📌 Demo Credentials:
          </p>
          <div style={{ fontSize: '13px', color: '#666', lineHeight: '1.8' }}>
            <p><strong>Student:</strong> student1 / password123</p>
            <p><strong>Caretaker:</strong> caretaker1 / password123</p>
            <p><strong>Management:</strong> manager1 / password123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;