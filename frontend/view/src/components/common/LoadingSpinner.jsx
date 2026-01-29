import React from 'react';

const LoadingSpinner = ({ text = 'Loading...' }) => {
  return (
    <div className="loading">
      <div className="spinner"></div>
      {text && <p style={{ marginTop: '16px', color: '#666' }}>{text}</p>}
    </div>
  );
};

export default LoadingSpinner;