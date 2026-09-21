import React from 'react';
import './App.css';

export default function App() {
  return (
    <div className="prototype-container">
      <div className="phone-screen">
        {/* Header Stats */}
        <div className="quiz-header">
          <span>Question 1/10</span>
          <span className="score">SCORE: 0</span>
        </div>

        {/* Progress Bar */}
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: '10%' }}></div>
        </div>

        {/* Main Content */}
        <div className="quiz-body">
          <p className="prompt">What note is this?</p>

          <div className="staff-card">
            <svg viewBox="0 0 300 180" className="staff-svg">
              {/* Quarter Note Centered */}
              <ellipse cx="150" cy="95" rx="9" ry="7" fill="#000" transform="rotate(-20 150 95)" />
              <line x1="158" y1="95" x2="158" y2="60" stroke="#000" strokeWidth="3" />
              <path d="M 158 60 Q 168 67 168 77" fill="none" stroke="#000" strokeWidth="3" />
            </svg>
          </div>
        </div>

        {/* Option Selection */}
        <div className="quiz-footer">
          <div className="options-row">
            <button className="option-btn selected">C</button>
            <button className="option-btn">D</button>
            <button className="option-btn">G</button>
          </div>
          <p className="footer-tip">TAP THE CORRECT NOTE</p>
        </div>
      </div>
    </div>
  );
}