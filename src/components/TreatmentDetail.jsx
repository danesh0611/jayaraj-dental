import React, { useState } from 'react';
import { addFeedback } from '../utils/storage';

export default function TreatmentDetail({ lang, treatment, clinicDetails, navigateTo }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);

  if (!treatment) {
    return (
      <div className="card" style={{ textAlign: 'center', marginTop: '24px' }}>
        <p>{lang === 'en' ? 'Treatment not found.' : 'சிகிச்சை விவரம் கண்டறியப்படவில்லை.'}</p>
        <button className="btn btn-primary" onClick={() => navigateTo('home')}>
          {lang === 'en' ? 'Back to Home' : 'முகப்புக்குச் செல்லவும்'}
        </button>
      </div>
    );
  }

  const t = {
    en: {
      backBtn: "Back to Home",
      expectTitle: "What to Expect",
      dosTitle: "Do's (Follow These)",
      dontsTitle: "Don'ts (Avoid These)",
      medicineTitle: "Medicine Reminders",
      feedbackTitle: "Was this guide helpful?",
      feedbackSub: "Help us improve our patient care by sharing your quick feedback.",
      feedbackLabel: "Comments / Suggestions",
      feedbackPlaceholder: "Write your feedback here...",
      feedbackSubmit: "Submit Feedback",
      feedbackSuccess: "Thank you for your feedback! It helps us improve our service.",
      ratingRequired: "Please select a rating before submitting."
    },
    ta: {
      backBtn: "முகப்புக்குச் செல்லவும்",
      expectTitle: "எதை எதிர்பார்க்கலாம்",
      dosTitle: "செய்ய வேண்டியவை",
      dontsTitle: "தவிர்க்க வேண்டியவை",
      medicineTitle: "மருந்து நினைவூட்டல்கள்",
      feedbackTitle: "இந்த வழிகாட்டி உங்களுக்கு உதவியதா?",
      feedbackSub: "உங்கள் கருத்துக்களைப் பகிர்வதன் மூலம் எங்களது வழிகாட்டலை மேம்படுத்த உதவுங்கள்.",
      feedbackLabel: "கருத்துகள் / ஆலோசனைகள்",
      feedbackPlaceholder: "உங்கள் கருத்துக்களை இங்கே எழுதவும்...",
      feedbackSubmit: "கருத்தைச் சமர்ப்பிக்கவும்",
      feedbackSuccess: "உங்கள் கருத்துக்களுக்கு நன்றி! இது எங்களது சேவையை மேம்படுத்த உதவும்.",
      ratingRequired: "சமர்ப்பிப்பதற்கு முன் மதிப்பீட்டைத் (Rating) தேர்ந்தெடுக்கவும்."
    }
  }[lang];

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert(t.ratingRequired);
      return;
    }

    const feedbackData = {
      treatmentId: treatment.id,
      treatmentTitle: treatment.title,
      rating,
      comment
    };

    addFeedback(feedbackData);
    setFeedbackSubmitted(true);
    setRating(0);
    setComment('');
  };

  return (
    <div className="animate-fade-in">
      {/* Back Navigation Bar */}
      <button 
        className="btn-toggle" 
        onClick={() => navigateTo('home')} 
        style={{ marginBottom: '20px', display: 'inline-flex', alignSelf: 'flex-start' }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        {t.backBtn}
      </button>

      {/* Treatment Title Card */}
      <div className="card" style={{ borderLeft: '4px solid var(--primary)', padding: '24px 20px', marginBottom: '24px' }}>
        <span className="badge badge-primary" style={{ marginBottom: '10px' }}>
          {lang === 'en' ? 'Post-Care Instructions' : 'சிகிச்சைக்குப் பிந்தைய வழிகாட்டி'}
        </span>
        <h1 style={{ marginBottom: '8px', fontSize: '1.8rem' }}>
          {lang === 'en' ? treatment.title.en : treatment.title.ta}
        </h1>
        <p style={{ marginBottom: '0', fontSize: '0.95rem' }}>
          {lang === 'en' ? treatment.description?.en : treatment.description?.ta}
        </p>
      </div>

      {/* What to Expect */}
      {treatment.expect && treatment.expect[lang]?.length > 0 && (
        <div className="card card-expect">
          <h2 className="detail-section-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--primary)' }}>
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            {t.expectTitle}
          </h2>
          <ul className="list-expect">
            {treatment.expect[lang].map((item, idx) => (
              <li key={idx} className="list-item">{item}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Do's & Don'ts */}
      <div className="field-pair">
        {/* Do's */}
        {treatment.dos && treatment.dos[lang]?.length > 0 && (
          <div className="card card-dos">
            <h2 className="detail-section-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--success)' }}>
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              {t.dosTitle}
            </h2>
            <ul className="list-dos">
              {treatment.dos[lang].map((item, idx) => (
                <li key={idx} className="list-item">{item}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Don'ts */}
        {treatment.donts && treatment.donts[lang]?.length > 0 && (
          <div className="card card-donts">
            <h2 className="detail-section-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--danger)' }}>
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
              {t.dontsTitle}
            </h2>
            <ul className="list-donts">
              {treatment.donts[lang].map((item, idx) => (
                <li key={idx} className="list-item">{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Medicine Reminders */}
      {treatment.medicine && treatment.medicine[lang]?.length > 0 && (
        <div className="card card-medicine">
          <h2 className="detail-section-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--indigo-500)' }}>
              <path d="M4.82 4.82A8 8 0 0 1 19.18 19.18M19.18 4.82A8 8 0 0 0 4.82 19.18"></path>
              <line x1="12" y1="4" x2="12" y2="20"></line>
            </svg>
            {t.medicineTitle}
          </h2>
          {treatment.medicine[lang].map((item, idx) => {
            const parts = item.split(':');
            const title = parts[0];
            const desc = parts.slice(1).join(':').trim();
            return (
              <div key={idx} className="medicine-card">
                <div className="medicine-title">{title}</div>
                {desc && <div className="medicine-desc">{desc}</div>}
              </div>
            );
          })}
        </div>
      )}

      {/* Feedback Form */}
      <div className="card" style={{ marginTop: '32px' }}>
        <h2>{t.feedbackTitle}</h2>
        <p style={{ fontSize: '0.9rem' }}>{t.feedbackSub}</p>

        {feedbackSubmitted ? (
          <div className="success-box animate-fade-in" style={{ margin: '12px 0' }}>
            {t.feedbackSuccess}
          </div>
        ) : (
          <form onSubmit={handleFeedbackSubmit}>
            {/* Interactive Stars Rating */}
            <div className="form-group">
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`star-btn ${star <= (hoveredStar || rating) ? 'active' : ''}`}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    aria-label={`Rate ${star} star`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            {/* Comments Field */}
            <div className="form-group">
              <label className="form-label">{t.feedbackLabel}</label>
              <textarea
                className="form-textarea"
                placeholder={t.feedbackPlaceholder}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary">
              {t.feedbackSubmit}
            </button>
          </form>
        )}
      </div>

      {/* Navigation Footer */}
      <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'center' }}>
        <button 
          className="btn btn-outline" 
          onClick={() => navigateTo('home')} 
          style={{ maxWidth: '200px' }}
        >
          {t.backBtn}
        </button>
      </div>
    </div>
  );
}
