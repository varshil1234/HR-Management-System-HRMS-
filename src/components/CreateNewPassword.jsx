import { useState } from 'react';
import lockIcon from '../assets/lock.png';

function CreateNewPassword({ onBackToLoginClick, onPasswordReset }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  // Helper function to check rules
  const validatePassword = (pwd) => {
    if (pwd.length < 8) return "Password must be at least 8 characters.";
    if (!/[A-Z]/.test(pwd)) return "Must contain at least 1 Uppercase letter.";
    if (!/[a-z]/.test(pwd)) return "Must contain at least 1 Lowercase letter.";
    if (!/[@$!%*?&]/.test(pwd)) return "Must contain at least 1 Special character.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    const validationError = validatePassword(password);
    if (validationError) {
      setError(validationError);
      return;
    }

    const empId = sessionStorage.getItem('current_employee_id');
    if (!empId) {
      setError("Session expired. Please start over.");
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/reset-password/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          employee_id: empId, 
          new_password: password 
        }),
      });
      
      const data = await response.json();

      if (response.ok) {
        if (onPasswordReset) onPasswordReset();
      } else {
        setError(data.error || 'Failed to reset password.');
      }
    } catch (err) {
      setError('Connection failed');
    }
  };

  return (
    <>
      <div className="card-header">
        <img src={lockIcon} alt="Lock Icon" className="header-icon" />
        <h1 className="title" style={{ marginTop: '10px' }}>New Password</h1>
        <p className="subtitle">Create a new secure password</p>
      </div>

      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label>New Password</label>
          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        {error && <p style={{ color: 'red', fontSize: '14px', textAlign:'center', marginBottom:'10px' }}>{error}</p>}

        <button type="submit" className="primary-button">Reset Password</button>

        <div className="footer-action">
          <button type="button" className="link-button-center" onClick={onBackToLoginClick}>Back to Login</button>
        </div>
      </form>
    </>
  );
}

export default CreateNewPassword;