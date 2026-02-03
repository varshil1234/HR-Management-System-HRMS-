import { useState } from 'react';
import lockIcon from '../assets/lock.png'; // Reusing the lock icon

// Eye Icon Component (Local definition)
const EyeIcon = ({ visible, onClick }) => (
  <svg 
    onClick={onClick}
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    className="password-icon"
  >
    {visible ? (
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    ) : (
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
    )}
    {visible && <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />}
  </svg>
);

function CreateNewPassword({ onBackToLoginClick, onPasswordReset }) {
  // State for input values
  const [passwords, setPasswords] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  // State for toggling visibility of each field independently
  const [showPass, setShowPass] = useState({
    new: false,
    confirm: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const toggleShow = (field) => {
    setShowPass((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log('Password Reset Submitted', passwords);
    if (onPasswordReset) onPasswordReset();
  };

  return (
    <>
      <div className="card-header">
        <img src={lockIcon} alt="Lock Icon" className="header-icon" />
        <h1 className="title" style={{ marginTop: '10px' }}>Create new password</h1>
        <p className="subtitle">Your new password must be different from previous passwords</p>
      </div>

      <form onSubmit={handleSubmit} className="login-form">
        {/* New Password Field */}
        <div className="form-group">
          <label htmlFor="newPassword">New password</label>
          <div className="password-input-wrapper">
            <input
              type={showPass.new ? 'text' : 'password'}
              id="newPassword"
              name="newPassword"
              placeholder="Enter new password"
              value={passwords.newPassword}
              onChange={handleChange}
              required
            />
            <EyeIcon visible={showPass.new} onClick={() => toggleShow('new')} />
          </div>
        </div>

        {/* Confirm Password Field */}
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm password</label>
          <div className="password-input-wrapper">
            <input
              type={showPass.confirm ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Re-enter new password"
              value={passwords.confirmPassword}
              onChange={handleChange}
              required
            />
            <EyeIcon visible={showPass.confirm} onClick={() => toggleShow('confirm')} />
          </div>
        </div>

        <button type="submit" className="primary-button">Reset password</button>

        <div className="footer-action">
          <button type="button" className="link-button-center" onClick={onBackToLoginClick}>
            Back to Login
          </button>
        </div>
      </form>
    </>
  );
}

export default CreateNewPassword;