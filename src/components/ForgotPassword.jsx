import { useState } from 'react';
import lockIcon from '../assets/lock.png'; // Import the image

function ForgotPassword({ onBackToLoginClick }) {
  const [formData, setFormData] = useState({ username: '', verificationMethod: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Verification Request:', formData);
  };

  return (
    <>
      <div className="card-header">
        {/* Replaced SVG with the Image */}
        <img src={lockIcon} alt="Lock Icon" className="header-icon" />
        
        <h1 className="title" style={{ marginTop: '10px' }}>Forgot password</h1>
        <p className="subtitle">Enter your employee ID and choose a verification method</p>
      </div>

      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="fp-username">Username</label>
          <input
            type="text"
            id="fp-username"
            name="username"
            placeholder="Enter your employee ID"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group verification-group">
            <label>Receive verification code via</label>
            <div className="radio-options">
                <label className="radio-label">
                    <input type="radio" name="verificationMethod" value="mobile" onChange={handleChange} />
                    Mobile Number
                </label>
                <label className="radio-label">
                    <input type="radio" name="verificationMethod" value="email" onChange={handleChange} />
                    Email Address
                </label>
                <label className="radio-label">
                    <input type="radio" name="verificationMethod" value="both" onChange={handleChange} />
                    Both
                </label>
            </div>
        </div>

        <button type="submit" className="primary-button">Send verification code</button>

        <div className="footer-action">
          <button type="button" className="link-button-center" onClick={onBackToLoginClick}>
            Back to Login
          </button>
        </div>
      </form>
    </>
  );
}

export default ForgotPassword;