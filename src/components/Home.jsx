import React, { useState } from 'react';

export default function Home({ lang, treatments, clinicDetails, navigateTo }) {
  const [searchTerm, setSearchTerm] = useState('');

  const t = {
    en: {
      searchPlaceholder: "Search for your treatment...",
      noResults: "No treatments found matching your search.",
      viewInstructions: "View Instructions",
      emergencyTitle: "Having an Emergency?",
      emergencyDesc: "If you experience excessive bleeding or severe swelling, contact us immediately.",
      callClinic: "Call Clinic Now",
      addressTitle: "Our Clinic Location",
      workingHours: "Working Hours: 9:00 AM - 8:00 PM (Mon - Sat)"
    },
    ta: {
      searchPlaceholder: "உங்கள் சிகிச்சைக்கான தேடல்...",
      noResults: "தேடலுக்குரிய சிகிச்சைகள் எதுவும் இல்லை.",
      viewInstructions: "வழிகாட்டுதல்கள்",
      emergencyTitle: "அவசர தேவையா?",
      emergencyDesc: "அதிக இரத்தப்போக்கு அல்லது கடுமையான வீக்கம் இருந்தால், உடனே எங்களைத் தொடர்பு கொள்ளவும்.",
      callClinic: "இப்போதே அழைக்கவும்",
      addressTitle: "முகவரி",
      workingHours: "வேலை நேரம்: காலை 9:00 - இரவு 8:00 (திங்கள் - சனி)"
    }
  }[lang];

  // Filter treatments by search term (case-insensitive, searching both Tamil and English titles)
  const filteredTreatments = treatments.filter(item => {
    const term = searchTerm.toLowerCase();
    const titleEn = (item.title?.en || '').toLowerCase();
    const titleTa = (item.title?.ta || '').toLowerCase();
    return titleEn.includes(term) || titleTa.includes(term);
  });

  const getTreatmentIcon = (id) => {
    switch (id) {
      case 'tooth-extraction':
        return (
          <span className="treatment-icon-wrapper icon-extraction">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 18V9h12v9a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3z" />
              <path d="M9 5h6M12 5V2M10 9h4" />
              <path d="M12 12v4M10 14h4" />
            </svg>
          </span>
        );
      case 'dental-filling':
        return (
          <span className="treatment-icon-wrapper icon-filling">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <g transform="rotate(45 12 12)">
                <rect x="3" y="10" width="18" height="4" rx="1.5" />
                <circle cx="8" cy="12" r="0.8" fill="currentColor" />
                <circle cx="12" cy="12" r="0.8" fill="currentColor" />
                <circle cx="16" cy="12" r="0.8" fill="currentColor" />
              </g>
              <g transform="rotate(-45 12 12)">
                <rect x="3" y="10" width="18" height="4" rx="1.5" />
                <circle cx="8" cy="12" r="0.8" fill="currentColor" />
                <circle cx="12" cy="12" r="0.8" fill="currentColor" />
                <circle cx="16" cy="12" r="0.8" fill="currentColor" />
              </g>
            </svg>
          </span>
        );
      case 'root-canal':
        return (
          <span className="treatment-icon-wrapper icon-rootcanal">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </span>
        );
      case 'dental-scaling':
        return (
          <span className="treatment-icon-wrapper icon-scaling">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v4M12 6c-3 0-4 2-4 4v9a3 3 0 0 0 6 0v-9c0-2-1-4-2-4z" />
              <path d="M9 10h6M6 6c1 0 2 .5 2 1.5M16 6c-1 0-2 .5-2 1.5" />
              <circle cx="19" cy="9" r="1.2" fill="currentColor" />
              <circle cx="21" cy="12" r="1.2" fill="currentColor" />
            </svg>
          </span>
        );
      case 'crown-bridge':
        return (
          <span className="treatment-icon-wrapper icon-crownbridge">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2C8.5 2 7 4.5 6.5 6.5 6 8.5 4.5 10 4.5 13c0 3.5 2 5.5 3.5 6.5 1.5 1 2.5 2.5 4 2.5s2.5-1.5 4-2.5c1.5-1 3.5-3 3.5-6.5 0-3-1.5-4.5-2-6.5C17 4.5 15.5 2 12 2z" />
              <path d="M9 7.5c1 0 1.5-.5 1.5-1s-.5-1-1.5-1-1.5.5-1.5 1 .5 1 1.5 1zM15 7.5c1 0 1.5-.5 1.5-1s-.5-1-1.5-1-1.5.5-1.5 1 .5 1 1.5 1z" />
            </svg>
          </span>
        );
      default:
        return (
          <span className="treatment-icon-wrapper icon-generic">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </span>
        );
    }
  };

  const isButtonFilled = (id) => {
    return id === 'tooth-extraction' || id === 'root-canal' || id === 'crown-bridge';
  };

  return (
    <div className="animate-fade-in custom-home-container">
      
      {/* Search Input */}
      <div className="search-bar-container">
        <div className="search-input-wrapper">
          <input 
            type="text" 
            className="search-input-field" 
            placeholder={t.searchPlaceholder} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-icon-left">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </span>
        </div>
      </div>

      {/* Treatment Grid */}
      <div className="treatment-cards-grid">
        {filteredTreatments.length > 0 ? (
          filteredTreatments.map(item => {
            const isWide = item.id === 'crown-bridge';
            if (isWide) {
              return (
                <div 
                  key={item.id} 
                  className="treatment-card-item card-wide"
                  onClick={() => navigateTo('treatment', item.id)}
                >
                  <div className="card-wide-content">
                    {getTreatmentIcon(item.id)}
                    <div className="card-info-content">
                      <h3 className="card-title-text">
                        {lang === 'en' ? item.title.en : item.title.ta}
                      </h3>
                      <p className="card-description-text">
                        {lang === 'en' ? item.description?.en : item.description?.ta}
                      </p>
                    </div>
                  </div>
                  <button 
                    className="btn btn-view-filled"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateTo('treatment', item.id);
                    }}
                  >
                    {t.viewInstructions}
                  </button>
                </div>
              );
            } else {
              return (
                <div 
                  key={item.id} 
                  className="treatment-card-item card-vertical"
                  onClick={() => navigateTo('treatment', item.id)}
                >
                  <div className="card-vertical-top">
                    {getTreatmentIcon(item.id)}
                    <h3 className="card-title-text">
                      {lang === 'en' ? item.title.en : item.title.ta}
                    </h3>
                    <p className="card-description-text">
                      {lang === 'en' ? item.description?.en : item.description?.ta}
                    </p>
                  </div>
                  <button 
                    className={`btn ${isButtonFilled(item.id) ? 'btn-view-filled' : 'btn-view-outlined'}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateTo('treatment', item.id);
                    }}
                  >
                    {t.viewInstructions}
                  </button>
                </div>
              );
            }
          })
        ) : (
          <p className="no-results-msg">
            {t.noResults}
          </p>
        )}
      </div>

      {/* Emergency Alert Banner */}
      <div className="emergency-banner-box">
        <div className="emergency-left-side">
          <span className="emergency-icon-circle">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </span>
          <div className="emergency-text-content">
            <h4 className="emergency-title-header">{t.emergencyTitle}</h4>
            <p className="emergency-description-body">{t.emergencyDesc}</p>
          </div>
        </div>
        <a href="tel:+914412345678" className="btn btn-emergency-call" onClick={(e) => e.stopPropagation()}>
          {t.callClinic}
        </a>
      </div>

      {/* Clinic Map & Info Footer */}
      <div className="clinic-location-footer">
        <h3 className="footer-clinic-name">
          {lang === 'en' ? clinicDetails.name.en : clinicDetails.name.ta}
        </h3>
        <p className="footer-doctor-name">
          {lang === 'en' ? clinicDetails.doctor?.en : clinicDetails.doctor?.ta}
        </p>
        <p className="footer-address">
          <strong>{t.addressTitle}:</strong> {lang === 'en' ? clinicDetails.address.en : clinicDetails.address.ta}
        </p>
        <p className="footer-hours">
          {t.workingHours}
        </p>

        {/* Google Map Embed */}
        <div className="footer-map-container">
          <iframe
            title="Jayaraj Dental Clinic Map"
            width="100%"
            height="100%"
            style={{ border: 0, display: 'block' }}
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.032698987371!2d80.2713192!3d13.0335897!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5267d47ec53591%3A0x1f80189530f9a23c!2sJayaraj%20Dental%20Clinic!5e0!3m2!1sen!2sin!4v1781204044861!5m2!1sen!2sin"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>

    </div>
  );
}
