import React, { useState } from 'react';
// import './Auth.css';

const OtpVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '']);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 3) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    alert('OTP Verified: ' + otp.join(''));
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>OTP Verification</h2>
        <p className="otp-info">Enter the 4-digit code sent to your email.</p>
        <form onSubmit={handleSubmit} className="otp-form">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength="1"
              value={digit}
              onChange={e => handleChange(e, index)}
              className="otp-input"
            />
          ))}
          <button type="submit" className="btn">Verify</button>
        </form>
      </div>
    </div>
  );
};

export default OtpVerification;
