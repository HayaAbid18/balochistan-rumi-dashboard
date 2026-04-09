import React, { useState } from 'react';
import SignupForm from './components/SignupForm';
import BalochistanDashboard from './components/BalochistanDashboard';
import './App.css';

function App() {
  const [showDashboard, setShowDashboard] = useState(false);

  return (
    <div className="app">
      {showDashboard ? (
        <>
          <BalochistanDashboard />
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <button
              onClick={() => setShowDashboard(false)}
              style={{
                padding: '10px 20px',
                fontSize: '14px',
                background: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              ← Back to Signup
            </button>
          </div>
        </>
      ) : (
        <>
          <SignupForm />
          <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
            <button
              onClick={() => setShowDashboard(true)}
              style={{
                padding: '10px 20px',
                fontSize: '14px',
                background: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                marginTop: '20px'
              }}
            >
              View Dashboard →
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
