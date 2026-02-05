import { useState, useEffect, useRef } from 'react';
// import checkIcon from '../assets/check.png'; 

function VerifyIdentity({ onBackToLoginClick, onVerifySubmit }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [status, setStatus] = useState('Sending verification code...');
  const [userEmail, setUserEmail] = useState('');
  
  // Timer State
  const [timer, setTimer] = useState(60); 
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef([]);
  const hasFetched = useRef(false);

  // 1. Initial Load
  useEffect(() => {
    if (hasFetched.current) return;
    
    const email = sessionStorage.getItem('current_employee_email') || 'your registered email';
    const empId = sessionStorage.getItem('current_employee_id');
    setUserEmail(email);

    if (empId) {
      hasFetched.current = true;
      sendOtp(empId);
    } else {
      setStatus('Error: User not identified. Please login again.');
    }
  }, []);

  // 2. Countdown Timer Logic
  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true); // Enable button when timer hits 0
    }
    return () => clearInterval(interval);
  }, [timer]);

  const sendOtp = async (empId) => {
    setCanResend(false);
    setTimer(60); // Reset timer to 60 seconds
    setStatus('Sending new code...');

    try {
      await fetch('http://127.0.0.1:8000/api/generate-otp/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employee_id: empId }),
      });
      setStatus('Verification code sent!');
    } catch (error) {
      setStatus('Failed to send code.');
      setCanResend(true); // Allow retry if failed immediately
    }
  };

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    const empId = sessionStorage.getItem('current_employee_id');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/verify-otp/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employee_id: empId, otp: otpCode }),
      });

      if (response.ok) {
        if (onVerifySubmit) onVerifySubmit();
      } else {
        setStatus('Invalid code. Please try again.');
      }
    } catch (error) {
      setStatus('Connection failed.');
    }
  };

  const maskEmail = (email) => {
    if (!email || !email.includes('@')) return email;
    const [name, domain] = email.split('@');
    return `${name.substring(0, 2)}***@${domain}`;
  };

  return (
    <>
      <div className="card-header">
        <div className="icon-wrapper" style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
          <div style={{ 
            fontSize: '40px', 
            background: '#e0f2fe', 
            width: '60px', 
            height: '60px', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: '#0284c7' 
          }}>
            ✔
          </div>
        </div>
        <h1 className="title" style={{ marginTop: '10px' }}>Verify your identity</h1>
        
        <p className="subtitle">
          Enter the 6-digit verification code sent to <br/>
          <strong style={{ color: '#333' }}>{maskEmail(userEmail)}</strong>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="login-form">
        <div className="otp-container">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              className="otp-input"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
            />
          ))}
        </div>

        {status && <p style={{ color: status.includes('sent') ? 'green' : 'red', fontSize: '14px', textAlign:'center', margin:'10px 0' }}>{status}</p>}

        <div className="resend-container">
          <span>Didn't receive the code? </span>
          <button 
            type="button" 
            className="link-button" 
            onClick={() => sendOtp(sessionStorage.getItem('current_employee_id'))}
            disabled={!canResend}
            style={{ 
              cursor: canResend ? 'pointer' : 'not-allowed', 
              color: canResend ? '#0284c7' : '#999' 
            }}
          >
            {canResend ? "Resend" : `Resend in ${timer}s`}
          </button>
        </div>

        <button type="submit" className="primary-button">Verify & continue</button>

        <div className="footer-action">
          <button type="button" className="link-button-center" onClick={onBackToLoginClick}>Back to Login</button>
        </div>
      </form>
    </>
  );
}

export default VerifyIdentity;