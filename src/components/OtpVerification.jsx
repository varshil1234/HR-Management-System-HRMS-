import { useState, useRef } from 'react';
import lockIcon from '../assets/lock.png'; // Reusing the same lock icon

function OtpVerification({ onBackToLoginClick, onVerifySubmit }) {
  // State to store the 6 digits
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  
  // Refs to manage focus for the 6 inputs
  const inputRefs = useRef([]);

  const handleChange = (index, value) => {
    // Only allow numbers
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1); // Only take the last char entered
    setOtp(newOtp);

    // Move to next input if a digit was entered
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Move to previous input on Backspace if current is empty
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalOtp = otp.join('');
    console.log('OTP Submitted:', finalOtp);
    // Trigger the verify action passed from App.jsx
    if (onVerifySubmit) onVerifySubmit();
  };

  return (
    <>
      <div className="card-header">
        <img src={lockIcon} alt="Lock Icon" className="header-icon" />
        <h1 className="title" style={{ marginTop: '10px' }}>OTP Verification</h1>
        <p className="subtitle">Enter the 6-digit OTP sent to your registered email or mobile</p>
      </div>

      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
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
                maxLength={1} // Limit to 1 character per box
              />
            ))}
          </div>
        </div>

        <p className="resend-text">
          Didn't receive the code? <span className="resend-link">Resend</span>
        </p>

        <button type="submit" className="primary-button">Verify OTP</button>

        <div className="footer-action">
          <button type="button" className="link-button-center" onClick={onBackToLoginClick}>
            Back to Login
          </button>
        </div>
      </form>
    </>
  );
}

export default OtpVerification;