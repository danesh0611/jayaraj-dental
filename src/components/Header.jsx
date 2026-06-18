import React, { useEffect, useState } from 'react';
import logo from '../assets/logo.png';

export default function Header({ lang, setLang, clinicName }) {
  const [isLargeFont, setIsLargeFont] = useState(
    document.body.classList.contains('large-text')
  );

  const toggleFontSize = () => {
    const newState = !isLargeFont;
    setIsLargeFont(newState);
    if (newState) {
      document.body.classList.add('large-text');
    } else {
      document.body.classList.remove('large-text');
    }
  };

  return (
    <header className="app-header">
      <div className="logo-section">
        <div className="logo-wrapper">
          <img 
            src={logo} 
            alt={lang === 'en' ? clinicName.en : clinicName.ta} 
            className="logo-image" 
          />
          <span className="logo-subtext">
            {lang === 'en' ? 'Patient Assistant' : 'நோயாளி உதவியாளர்'}
          </span>
        </div>
      </div>

      <div className="header-controls">
        {/* Large font toggle for elderly patients */}
        <button 
          className={`btn-toggle ${isLargeFont ? 'active' : ''}`}
          onClick={toggleFontSize}
          title={lang === 'en' ? 'Toggle Large Text for Readability' : 'பெரிய எழுத்துக்களை மாற்று'}
          aria-label="Toggle Font Size"
        >
          <span style={{ fontWeight: 'bold' }}>A<sup>+</sup></span>
        </button>

        {/* Language Switcher */}
        <button 
          className="btn-toggle"
          onClick={() => setLang(lang === 'en' ? 'ta' : 'en')}
        >
          {lang === 'en' ? 'தமிழ்' : 'English'}
        </button>
      </div>
    </header>
  );
}
