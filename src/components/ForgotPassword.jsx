import { useState } from 'react';
import lockIcon from '../assets/lock.png';

function ForgotPassword({ onBackToLoginClick, onOtpSent }) {
  const [employeeId, setEmployeeId] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');
    setIsLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/generate-otp/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employee_id: employeeId }), // Matches Backend
      });

      const data = await response.json();

      if (response.ok) {
        // IMPORTANT: Save ID so the next page knows who to verify
        sessionStorage.setItem('current_employee_id', employeeId);
        
        alert(`OTP sent to your email!`);
        if (onOtpSent) onOtpSent();
      } else {
        setStatus(data.error || 'User not found');
      }
    } catch (error) {
      setStatus('Server connection failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="card-header">
        <img src={lockIcon} alt="Lock Icon" className="header-icon" />
        <h1 className="title" style={{ marginTop: '10px' }}>Forgot password</h1>
        <p className="subtitle">Enter your Employee ID to receive an OTP</p>
      </div>

      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="fp-id">Employee ID</label>
          <input
            type="text"
            id="fp-id"
            placeholder="Enter your Employee ID"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            required
          />
        </div>

        {status && <p style={{ color: 'red', fontSize: '14px', textAlign:'center', marginBottom: '10px' }}>{status}</p>}

        <button type="submit" className="primary-button" disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send Verification Code'}
        </button>

        <div className="footer-action">
          <button type="button" className="link-button-center" onClick={onBackToLoginClick}>Back to Login</button>
        </div>
      </form>
    </>
  );
}

export default ForgotPassword;