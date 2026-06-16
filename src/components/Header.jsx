import React, { useEffect, useState } from 'react';

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
        <div className="logo-icon">
          {/* Custom Medical Tooth SVG */}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C8 2 6.5 4.5 6 6.5C5.5 8.5 4 10 4 13C4 16.5 6 18.5 7.5 19.5C9 20.5 10 22 12 22C14 22 15 20.5 16.5 19.5C18 18.5 20 16.5 20 13C20 10 18.5 8.5 18 6.5C17.5 4.5 16 2 12 2ZM9 8.5C8.45 8.5 8 8.05 8 7.5C8 6.95 8.45 6.5 9 6.5C9.55 6.5 10 6.95 10 7.5C10 8.05 9.55 8.5 9 8.5ZM15 8.5C14.45 8.5 14 8.05 14 7.5C14 6.95 14.45 6.5 15 6.5C15.55 6.5 16 6.95 16 7.5C16 8.05 15.55 8.5 15 8.5Z" />
          </svg>
        </div>
        <div>
          <span className="logo-text">{lang === 'en' ? clinicName.en : clinicName.ta}</span>
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
