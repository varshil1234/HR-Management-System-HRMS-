import { useState } from 'react';
import './App.css';
import technodhaLogo from './assets/technodha.png';

// Import all 5 components
import Login from './components/Login';
import VerifyIdentity from './components/VerifyIdentity'; // LOGIN OTP
import ForgotPassword from './components/ForgotPassword';
import OtpVerification from './components/OtpVerification'; // RESET OTP
import CreateNewPassword from './components/CreateNewPassword';

function App() {
  const [currentView, setCurrentView] = useState('login'); 

  const handleLoginSuccess = () => {
    setCurrentView('verify-identity');
  };

  const handleIdentityVerified = () => {
    alert("LOGIN SUCCESSFUL! Redirecting to Dashboard...");
    // setCurrentView('dashboard'); 
  };

  return (
    <div className="app-container">
      <img src={technodhaLogo} alt="Technodha Logo" className="brand-logo" />

      <div className="login-card">
        
        {/* === MAIN LOGIN SCREEN === */}
        {currentView === 'login' && (
          <Login 
            onForgotPasswordClick={() => setCurrentView('forgot-password')} 
            onLoginSuccess={handleLoginSuccess} 
          />
        )}

        {/* === LOGIN FLOW: 2FA SCREEN === */}
        {currentView === 'verify-identity' && (
          <VerifyIdentity 
            onBackToLoginClick={() => setCurrentView('login')}
            onVerifySubmit={handleIdentityVerified}
          />
        )}

        {/* ============================================== */}
        {/* === FORGOT PASSWORD FLOW === */}
        {/* ============================================== */}

        {/* Step 1: Enter Employee ID */}
        {currentView === 'forgot-password' && (
          <ForgotPassword 
            onBackToLoginClick={() => setCurrentView('login')} 
            // THIS IS THE FIX: Ensuring the name matches what we call in ForgotPassword.jsx
            onOtpSent={() => setCurrentView('reset-otp')} 
          />
        )}

        {/* Step 2: OTP for Reset */}
        {currentView === 'reset-otp' && (
          <OtpVerification 
            onBackToLoginClick={() => setCurrentView('login')}
            onVerifySubmit={() => setCurrentView('create-new-password')}
          />
        )}

        {/* Step 3: Create New Password */}
        {currentView === 'create-new-password' && (
          <CreateNewPassword 
            onBackToLoginClick={() => setCurrentView('login')}
            onPasswordReset={() => {
              alert("Password Reset Successfully!");
              setCurrentView('login');
            }}
          />
        )}

      </div>
    </div>
  );
}

export default App;