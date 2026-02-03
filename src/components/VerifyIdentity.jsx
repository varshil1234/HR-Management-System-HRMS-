import { useState, useRef } from 'react';

// The Blue Checkmark Icon from the image
const CheckIcon = () => (
  <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="header-icon-svg">
    <circle cx="30" cy="30" r="30" fill="white"/>
    <path d="M30 5C16.193 5 5 16.193 5 30C5 43.807 16.193 55 30 55C43.807 55 55 43.807 55 30C55 16.193 43.807 5 30 5ZM25.333 42.5L14.5 31.666L18.041 28.125L25.333 35.417L41.958 18.792L45.5 22.333L25.333 42.5Z" fill="#1e90ff"/>
  </svg>
);

function VerifyIdentity({ onBackToLoginClick, onVerifySubmit }) {
  // State to store the 6 digits
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  
  // Refs to manage focus for the 6 inputs
  const inputRefs = useRef([]);

  const handleChange = (index, value) => {
    if (isNaN(value)) return; // Only allow numbers

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1); // Take last char
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Backspace logic: move to previous box
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalOtp = otp.join('');
    console.log('Identity Verified:', finalOtp);
    if (onVerifySubmit) onVerifySubmit();
  };

  return (
    <>
      <div className="card-header">
        <CheckIcon />
        <h1 className="title" style={{ marginTop: '10px' }}>Verify your identity</h1>
        <p className="subtitle">Enter the 6-digit verification code sent to your registered contact</p>
      </div>

      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          {/* Reusing the same OTP container styles from App.css */}
          <div className="otp-container">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                className="otp-input"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                maxLength={1} 
              />
            ))}
          </div>
        </div>

        <p className="resend-text">
          Didn't receive the code? <span className="resend-link">Resend</span>
        </p>

        <button type="submit" className="primary-button">Verify & continue</button>

        <div className="footer-action">
          <button type="button" className="link-button-center" onClick={onBackToLoginClick}>
            Back to Login
          </button>
        </div>
      </form>
    </>
  );
}

export default VerifyIdentity;