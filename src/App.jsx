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

  // --- FLOW HANDLERS ---

  // 1. Called when user clicks "Login" button with correct password
  const handleLoginSuccess = () => {
    // Move to the 2FA Check (Blue Checkmark Screen)
    setCurrentView('verify-identity');
  };

  // 2. Called when the 2FA is correct
  const handleIdentityVerified = () => {
    alert("LOGIN SUCCESSFUL! Redirecting to Dashboard...");
    // In a real app, this is where you redirect to the main page
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

        {/* === LOGIN FLOW: 2FA SCREEN (Blue Checkmark) === */}
        {currentView === 'verify-identity' && (
          <VerifyIdentity 
            onBackToLoginClick={() => setCurrentView('login')}
            onVerifySubmit={handleIdentityVerified}
          />
        )}


        {/* ============================================== */}
        {/* === FORGOT PASSWORD FLOW (Completely separate) === */}
        {/* ============================================== */}

        {/* Step 1: Enter Employee ID */}
        {currentView === 'forgot-password' && (
          <ForgotPassword 
            onBackToLoginClick={() => setCurrentView('login')} 
            onCodeSent={() => setCurrentView('reset-otp')} 
          />
        )}

        {/* Step 2: OTP for Reset (Lock Icon) */}
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