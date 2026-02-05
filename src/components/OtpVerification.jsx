import { useState } from 'react';
import lockIcon from '../assets/lock.png';

function OtpVerification({ onBackToLoginClick, onVerifySubmit }) {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Retrieve the Employee ID saved in the previous step
    const empId = sessionStorage.getItem('current_employee_id');

    if (!empId) {
      setError("Session expired. Please start over.");
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/verify-otp/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          employee_id: empId, 
          otp: otp 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (onVerifySubmit) onVerifySubmit();
      } else {
        setError(data.error || 'Invalid OTP');
      }
    } catch (err) {
      setError('Connection failed');
    }
  };

  return (
    <>
      <div className="card-header">
        <img src={lockIcon} alt="Lock Icon" className="header-icon" />
        <h1 className="title" style={{ marginTop: '10px' }}>OTP Verification</h1>
        <p className="subtitle">Enter the code sent to your email</p>
      </div>

      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="otp">Enter OTP</label>
          <input
            type="text"
            id="otp"
            placeholder="6-digit code"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength="6"
            required
          />
        </div>

        {error && <p style={{ color: 'red', fontSize: '14px', textAlign:'center', marginBottom:'10px' }}>{error}</p>}

        <button type="submit" className="primary-button">Verify & Proceed</button>

        <div className="footer-action">
          <button type="button" className="link-button-center" onClick={onBackToLoginClick}>Back to Login</button>
        </div>
      </form>
    </>
  );
}

export default OtpVerification;