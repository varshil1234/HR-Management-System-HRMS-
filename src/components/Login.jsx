import { useState } from 'react';
import arrowIcon from '../assets/arrow.png';

const EyeIcon = ({ visible, onClick }) => (
  <svg onClick={onClick} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="password-icon">
    {visible ? (
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    ) : (
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
    )}
    {visible && <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />}
  </svg>
);

function Login({ onForgotPasswordClick, onLoginSuccess }) {
  const [formData, setFormData] = useState({
    employee_id: '',
    password: '',
    rememberMe: false,
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employee_id: formData.employee_id, 
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // UPDATED: Save Email to session storage
        sessionStorage.setItem('current_employee_id', data.employee_id);
        sessionStorage.setItem('current_employee_email', data.email); 
        
        if (onLoginSuccess) onLoginSuccess();
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Connection error. Is backend running?');
    }
  };

  return (
    <>
      <div className="card-header">
        <img src={arrowIcon} alt="Arrow Icon" className="header-icon" />
        <h1 className="title">Let's get you <span className="highlight">signed</span> in</h1>
        <p className="subtitle">Pick up where you left off—sign in to continue</p>
      </div>

      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="employee_id">Employee ID</label>
          <input
            type="text"
            id="employee_id"
            name="employee_id"
            placeholder="Enter your Employee ID"
            value={formData.employee_id}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="password-input-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              placeholder="Enter Your Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <EyeIcon visible={showPassword} onClick={() => setShowPassword(!showPassword)} />
          </div>
        </div>

        {error && <p style={{ color: 'red', fontSize: '14px', marginBottom:'10px' }}>{error}</p>}

        <div className="form-actions">
          <label className="checkbox-label">
            <input type="checkbox" name="rememberMe" checked={formData.rememberMe} onChange={handleChange} />
            Remember me
          </label>
          <button type="button" className="link-button" onClick={onForgotPasswordClick}>Forgot password?</button>
        </div>

        <button type="submit" className="primary-button">Login</button>
      </form>
    </>
  );
}

export default Login;