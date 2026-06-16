import React, { useState } from 'react';
import { saveClinicDetails, saveTreatments, getFeedback } from '../utils/storage';

export default function AdminPanel({ lang, treatments, setTreatments, clinicDetails, setClinicDetails, navigateTo }) {
  const [activeTab, setActiveTab] = useState('settings'); // settings, treatments, feedback
  
  // Clinic Details state
  const [clinicNameEn, setClinicNameEn] = useState(clinicDetails.name.en);
  const [clinicNameTa, setClinicNameTa] = useState(clinicDetails.name.ta);
  const [clinicAddressEn, setClinicAddressEn] = useState(clinicDetails.address.en);
  const [clinicAddressTa, setClinicAddressTa] = useState(clinicDetails.address.ta);
  const [settingsStatus, setSettingsStatus] = useState('');

  // Manage Treatments state
  const [editingTreatmentId, setEditingTreatmentId] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [treatmentStatus, setTreatmentStatus] = useState('');

  // Form states for adding/editing a treatment
  const [formId, setFormId] = useState('');
  const [formTitleEn, setFormTitleEn] = useState('');
  const [formTitleTa, setFormTitleTa] = useState('');
  const [formDescEn, setFormDescEn] = useState('');
  const [formDescTa, setFormDescTa] = useState('');
  const [formExpectEn, setFormExpectEn] = useState('');
  const [formExpectTa, setFormExpectTa] = useState('');
  const [formDosEn, setFormDosEn] = useState('');
  const [formDosTa, setFormDosTa] = useState('');
  const [formDontsEn, setFormDontsEn] = useState('');
  const [formDontsTa, setFormDontsTa] = useState('');
  const [formMedicineEn, setFormMedicineEn] = useState('');
  const [formMedicineTa, setFormMedicineTa] = useState('');

  // Feedback details
  const feedbackList = getFeedback();
  const totalFeedback = feedbackList.length;
  const avgRating = totalFeedback > 0 
    ? (feedbackList.reduce((acc, curr) => acc + curr.rating, 0) / totalFeedback).toFixed(1)
    : 0;

  // Save Clinic Details
  const handleSaveSettings = (e) => {
    e.preventDefault();
    const updatedDetails = {
      name: { en: clinicNameEn, ta: clinicNameTa },
      tagline: clinicDetails.tagline,
      address: { en: clinicAddressEn, ta: clinicAddressTa }
    };
    saveClinicDetails(updatedDetails);
    setClinicDetails(updatedDetails);
    setSettingsStatus(lang === 'en' ? 'Settings saved successfully!' : 'அமைப்புகள் வெற்றிகரமாகச் சேமிக்கப்பட்டன!');
    setTimeout(() => setSettingsStatus(''), 3000);
  };

  // Open Form to Edit Treatment
  const startEditing = (t) => {
    setEditingTreatmentId(t.id);
    setIsAddingNew(false);
    setFormId(t.id);
    setFormTitleEn(t.title.en);
    setFormTitleTa(t.title.ta);
    setFormDescEn(t.description?.en || '');
    setFormDescTa(t.description?.ta || '');
    setFormExpectEn(t.expect?.en?.join('\n') || '');
    setFormExpectTa(t.expect?.ta?.join('\n') || '');
    setFormDosEn(t.dos?.en?.join('\n') || '');
    setFormDosTa(t.dos?.ta?.join('\n') || '');
    setFormDontsEn(t.donts?.en?.join('\n') || '');
    setFormDontsTa(t.donts?.ta?.join('\n') || '');
    setFormMedicineEn(t.medicine?.en?.join('\n') || '');
    setFormMedicineTa(t.medicine?.ta?.join('\n') || '');
  };

  // Open Form to Add New Treatment
  const startAddingNew = () => {
    setIsAddingNew(true);
    setEditingTreatmentId(null);
    setFormId('');
    setFormTitleEn('');
    setFormTitleTa('');
    setFormDescEn('');
    setFormDescTa('');
    setFormExpectEn('');
    setFormExpectTa('');
    setFormDosEn('');
    setFormDosTa('');
    setFormDontsEn('');
    setFormDontsTa('');
    setFormMedicineEn('');
    setFormMedicineTa('');
  };

  // Cancel Edit
  const cancelForm = () => {
    setEditingTreatmentId(null);
    setIsAddingNew(false);
  };

  // Save or Add Treatment
  const handleSaveTreatment = (e) => {
    e.preventDefault();
    if (!formTitleEn || !formTitleTa) {
      alert(lang === 'en' ? 'Title is required in both English and Tamil!' : 'ஆங்கிலம் மற்றும் தமிழ் இரண்டிலும் தலைப்பு தேவை!');
      return;
    }

    const newTreatmentId = formId ? formId : formTitleEn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    // Parse newline separation to arrays
    const parseList = (text) => text.split('\n').map(item => item.trim()).filter(Boolean);

    const updatedTreatment = {
      id: newTreatmentId,
      title: { en: formTitleEn, ta: formTitleTa },
      description: { en: formDescEn, ta: formDescTa },
      expect: { en: parseList(formExpectEn), ta: parseList(formExpectTa) },
      dos: { en: parseList(formDosEn), ta: parseList(formDosTa) },
      donts: { en: parseList(formDontsEn), ta: parseList(formDosTa) }, // maps correctly to lists
      donts: { en: parseList(formDontsEn), ta: parseList(formDontsTa) },
      medicine: { en: parseList(formMedicineEn), ta: parseList(formMedicineTa) }
    };

    let updatedList = [];
    if (isAddingNew) {
      // Check duplicate ID
      if (treatments.some(t => t.id === newTreatmentId)) {
        alert(lang === 'en' ? 'A treatment with this name already exists.' : 'இந்த பெயரில் ஏற்கனவே ஒரு சிகிச்சை உள்ளது.');
        return;
      }
      updatedList = [...treatments, updatedTreatment];
    } else {
      updatedList = treatments.map(t => t.id === editingTreatmentId ? updatedTreatment : t);
    }

    saveTreatments(updatedList);
    setTreatments(updatedList);
    setEditingTreatmentId(null);
    setIsAddingNew(false);

    setTreatmentStatus(lang === 'en' ? 'Treatment saved successfully!' : 'சிகிச்சை வெற்றிகரமாகச் சேமிக்கப்பட்டது!');
    setTimeout(() => setTreatmentStatus(''), 3000);
  };

  // Delete Treatment
  const handleDeleteTreatment = (id) => {
    const confirmMsg = lang === 'en' 
      ? 'Are you sure you want to delete this treatment?' 
      : 'இந்த சிகிச்சையை நீக்க விரும்புகிறீர்களா?';
    
    if (window.confirm(confirmMsg)) {
      const updatedList = treatments.filter(t => t.id !== id);
      saveTreatments(updatedList);
      setTreatments(updatedList);
      setEditingTreatmentId(null);
      setIsAddingNew(false);
      setTreatmentStatus(lang === 'en' ? 'Treatment deleted.' : 'சிகிச்சை நீக்கப்பட்டது.');
      setTimeout(() => setTreatmentStatus(''), 3000);
    }
  };

  // Helper to open QR in new window for printing
  const printQRCode = (treatment) => {
    const rootUrl = `${window.location.origin}${window.location.pathname}`;
    const treatmentUrl = `${rootUrl}#/treatment/${treatment.id}`;
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(treatmentUrl)}`;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>QR Card - ${treatment.title.en}</title>
          <style>
            body {
              font-family: system-ui, sans-serif;
              text-align: center;
              padding: 40px;
              color: #0f172a;
            }
            .card {
              border: 3px solid #0284c7;
              border-radius: 16px;
              padding: 30px;
              display: inline-block;
              max-width: 380px;
              background-color: white;
              box-shadow: 0 4px 6px rgba(0,0,0,0.05);
            }
            .clinic-name {
              font-size: 24px;
              font-weight: 800;
              margin-bottom: 5px;
              color: #0369a1;
            }
            .tagline {
              font-size: 14px;
              color: #64748b;
              margin-bottom: 20px;
              font-style: italic;
            }
            .qr-code {
              margin: 10px 0;
              border: 1px solid #e2e8f0;
              padding: 10px;
            }
            .treatment-name {
              font-size: 20px;
              font-weight: 700;
              margin-top: 15px;
              color: #0f172a;
            }
            .instructions {
              font-size: 13px;
              color: #475569;
              margin-top: 15px;
              border-top: 1px dashed #cbd5e1;
              padding-top: 15px;
            }
            @media print {
              .no-print { display: none; }
              body { padding: 0; }
              .card { border: 2px solid #000; box-shadow: none; }
            }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="clinic-name">${clinicDetails.name.en}</div>
            <div class="clinic-name" style="font-size: 18px;">${clinicDetails.name.ta}</div>
            <div class="tagline">Scan for Care Instructions Guide</div>
            
            <img class="qr-code" src="${qrImageUrl}" width="240" height="240" alt="QR Link" />
            
            <div class="treatment-name">${treatment.title.en}</div>
            <div class="treatment-name" style="font-size: 16px; font-weight: 600; margin-top: 4px;">${treatment.title.ta}</div>
            
            <div class="instructions">
              Point your camera or QR scanner at the code to receive complete care instructions, do's & don'ts, and medicine details.
            </div>
          </div>
          <br /><br />
          <div class="no-print">
            <button onclick="window.print()" style="padding: 12px 24px; font-size: 16px; font-weight: bold; background: #0284c7; color: white; border: none; border-radius: 8px; cursor: pointer;">
              Print Card
            </button>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const copyLink = (id) => {
    const rootUrl = `${window.location.origin}${window.location.pathname}`;
    const treatmentUrl = `${rootUrl}#/treatment/${id}`;
    navigator.clipboard.writeText(treatmentUrl);
    alert(lang === 'en' ? 'Link copied to clipboard!' : 'இணைப்பு நகலெடுக்கப்பட்டது!');
  };

  return (
    <div className="animate-fade-in">
      <div className="card" style={{ padding: '16px 20px', marginBottom: '20px' }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--primary)' }}>
          {lang === 'en' ? 'Clinic Administration' : 'நிர்வாகப் பகுதி'}
        </h1>
        <p style={{ fontSize: '0.85rem', margin: '4px 0 0 0' }}>
          {lang === 'en' ? 'Manage post-care instructions and view patient feedback.' : 'சிகிச்சைக்குப் பிந்தைய வழிகாட்டுதல்களை நிர்வகிக்கவும் மற்றும் நோயாளியின் கருத்துக்களைப் பார்க்கவும்.'}
        </p>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <div 
          className={`admin-tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => { setActiveTab('settings'); cancelForm(); }}
        >
          {lang === 'en' ? 'Clinic Settings' : 'அமைப்புகள்'}
        </div>
        <div 
          className={`admin-tab ${activeTab === 'treatments' ? 'active' : ''}`}
          onClick={() => { setActiveTab('treatments'); cancelForm(); }}
        >
          {lang === 'en' ? 'Treatments' : 'சிகிச்சைகள்'}
        </div>
        <div 
          className={`admin-tab ${activeTab === 'feedback' ? 'active' : ''}`}
          onClick={() => { setActiveTab('feedback'); cancelForm(); }}
        >
          {lang === 'en' ? 'Feedback' : 'கருத்துகள்'} ({totalFeedback})
        </div>
      </div>

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="animate-fade-in">
          {settingsStatus && <div className="success-box">{settingsStatus}</div>}
          
          <form onSubmit={handleSaveSettings} className="card">
            <h2>{lang === 'en' ? 'Edit Clinic Details' : 'மருத்துவமனை விவரங்கள்'}</h2>
            
            <div className="form-group">
              <label className="form-label">{lang === 'en' ? 'Clinic Name (English)' : 'மருத்துவமனை பெயர் (ஆங்கிலம்)'}</label>
              <input 
                type="text" 
                className="form-input" 
                value={clinicNameEn} 
                onChange={(e) => setClinicNameEn(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">{lang === 'en' ? 'Clinic Name (Tamil)' : 'மருத்துவமனை பெயர் (தமிழ்)'}</label>
              <input 
                type="text" 
                className="form-input" 
                value={clinicNameTa} 
                onChange={(e) => setClinicNameTa(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">{lang === 'en' ? 'Clinic Address (English)' : 'முகவரி (ஆங்கிலம்)'}</label>
              <textarea 
                className="form-textarea" 
                value={clinicAddressEn} 
                onChange={(e) => setClinicAddressEn(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">{lang === 'en' ? 'Clinic Address (Tamil)' : 'முகவரி (தமிழ்)'}</label>
              <textarea 
                className="form-textarea" 
                value={clinicAddressTa} 
                onChange={(e) => setClinicAddressTa(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary">
              {lang === 'en' ? 'Save Settings' : 'அமைப்புகளைச் சேமி'}
            </button>
          </form>
        </div>
      )}

      {/* Treatments Tab */}
      {activeTab === 'treatments' && (
        <div className="animate-fade-in">
          {treatmentStatus && <div className="success-box">{treatmentStatus}</div>}

          {/* List/Form Switcher */}
          {!editingTreatmentId && !isAddingNew ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3>{lang === 'en' ? 'Active Treatments' : 'செயலில் உள்ள சிகிச்சைகள்'}</h3>
                <button className="btn btn-primary" onClick={startAddingNew} style={{ width: 'auto', padding: '8px 16px', fontSize: '0.9rem' }}>
                  + {lang === 'en' ? 'Add Treatment' : 'சேர்க்கவும்'}
                </button>
              </div>

              {treatments.map((t) => {
                const rootUrl = `${window.location.origin}${window.location.pathname}`;
                const treatmentUrl = `${rootUrl}#/treatment/${t.id}`;
                const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(treatmentUrl)}`;

                return (
                  <div key={t.id} className="card" style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '1.15rem' }}>{lang === 'en' ? t.title.en : t.title.ta}</h3>
                        <span className="badge badge-neutral" style={{ fontSize: '0.7rem', marginTop: '4px' }}>ID: {t.id}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button className="btn btn-outline" onClick={() => startEditing(t)} style={{ width: 'auto', padding: '6px 12px', fontSize: '0.8rem' }}>
                          {lang === 'en' ? 'Edit' : 'தொகு'}
                        </button>
                        <button className="btn btn-danger" onClick={() => handleDeleteTreatment(t.id)} style={{ width: 'auto', padding: '6px 12px', fontSize: '0.8rem' }}>
                          {lang === 'en' ? 'Delete' : 'நீக்கு'}
                        </button>
                      </div>
                    </div>

                    {/* QR Code and Actions */}
                    <div className="qr-container" style={{ marginTop: '14px', padding: '16px' }}>
                      <img className="qr-image" src={qrUrl} alt="QR Code" style={{ width: '130px', height: '130px', marginBottom: '10px' }} />
                      <div className="qr-text" style={{ fontSize: '0.75rem', marginBottom: '12px' }}>{treatmentUrl}</div>
                      
                      <div style={{ display: 'flex', gap: '8px', width: '100%', maxWidth: '280px' }}>
                        <button className="btn btn-secondary" onClick={() => printQRCode(t)} style={{ flex: 1, padding: '8px 12px', fontSize: '0.85rem' }}>
                          {lang === 'en' ? 'Print QR Card' : 'அச்சிடு'}
                        </button>
                        <button className="btn btn-outline" onClick={() => copyLink(t.id)} style={{ flex: 1, padding: '8px 12px', fontSize: '0.85rem' }}>
                          {lang === 'en' ? 'Copy Link' : 'நகலெடு'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Form for Add/Edit */
            <form onSubmit={handleSaveTreatment} className="card">
              <h2>
                {isAddingNew 
                  ? (lang === 'en' ? 'Add New Treatment' : 'புதிய சிகிச்சை சேர்க்க') 
                  : (lang === 'en' ? 'Edit Treatment' : 'சிகிச்சை திருத்துக')}
              </h2>

              <div className="form-group">
                <label className="form-label">{lang === 'en' ? 'Treatment Title (English)' : 'சிகிச்சை பெயர் (ஆங்கிலம்)'}</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={formTitleEn} 
                  onChange={(e) => setFormTitleEn(e.target.value)}
                  placeholder="e.g. Tooth Extraction"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">{lang === 'en' ? 'Treatment Title (Tamil)' : 'சிகிச்சை பெயர் (தமிழ்)'}</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={formTitleTa} 
                  onChange={(e) => setFormTitleTa(e.target.value)}
                  placeholder="எ.கா. பல் பிடுங்குதல்"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">{lang === 'en' ? 'Short Description (English)' : 'சுருக்க விபரம் (ஆங்கிலம்)'}</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={formDescEn} 
                  onChange={(e) => setFormDescEn(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">{lang === 'en' ? 'Short Description (Tamil)' : 'சுருக்க விபரம் (தமிழ்)'}</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={formDescTa} 
                  onChange={(e) => setFormDescTa(e.target.value)}
                />
              </div>

              <div style={{ borderTop: '1px solid var(--border)', margin: '20px 0', paddingTop: '10px' }}>
                <p style={{ fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '8px' }}>
                  {lang === 'en' ? 'Instructions (Write each item on a new line)' : 'அறிவுறுத்தல்கள் (ஒவ்வொரு குறிப்பையும் தனித்தனி வரியில் எழுதவும்)'}
                </p>

                {/* What to Expect Form */}
                <div className="field-pair">
                  <div className="form-group">
                    <label className="form-label">{lang === 'en' ? 'What to Expect (English)' : 'எதிர்பார்ப்பவை (ஆங்கிலம்)'}</label>
                    <textarea 
                      className="form-textarea" 
                      value={formExpectEn} 
                      onChange={(e) => setFormExpectEn(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{lang === 'en' ? 'What to Expect (Tamil)' : 'எதிர்பார்ப்பவை (தமிழ்)'}</label>
                    <textarea 
                      className="form-textarea" 
                      value={formExpectTa} 
                      onChange={(e) => setFormExpectTa(e.target.value)}
                    />
                  </div>
                </div>

                {/* Do's Form */}
                <div className="field-pair">
                  <div className="form-group">
                    <label className="form-label">{lang === 'en' ? "Do's (English)" : 'செய்ய வேண்டியவை (ஆங்கிலம்)'}</label>
                    <textarea 
                      className="form-textarea" 
                      value={formDosEn} 
                      onChange={(e) => setFormDosEn(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{lang === 'en' ? "Do's (Tamil)" : 'செய்ய வேண்டியவை (தமிழ்)'}</label>
                    <textarea 
                      className="form-textarea" 
                      value={formDosTa} 
                      onChange={(e) => setFormDosTa(e.target.value)}
                    />
                  </div>
                </div>

                {/* Don'ts Form */}
                <div className="field-pair">
                  <div className="form-group">
                    <label className="form-label">{lang === 'en' ? "Don'ts (English)" : 'தவிர்க்க வேண்டியவை (ஆங்கிலம்)'}</label>
                    <textarea 
                      className="form-textarea" 
                      value={formDontsEn} 
                      onChange={(e) => setFormDontsEn(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{lang === 'en' ? "Don'ts (Tamil)" : 'தவிர்க்க வேண்டியவை (தமிழ்)'}</label>
                    <textarea 
                      className="form-textarea" 
                      value={formDontsTa} 
                      onChange={(e) => setFormDontsTa(e.target.value)}
                    />
                  </div>
                </div>

                {/* Medicines Form */}
                <div className="field-pair">
                  <div className="form-group">
                    <label className="form-label">{lang === 'en' ? "Medicines (Use format Name:Desc on each line)" : 'மருந்துகள் (பெயர்:விபரம் வடிவத்தில் எழுதவும்)'}</label>
                    <textarea 
                      className="form-textarea" 
                      value={formMedicineEn} 
                      onChange={(e) => setFormMedicineEn(e.target.value)}
                      placeholder="e.g. Painkiller:Take after food"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{lang === 'en' ? "Medicines (Tamil)" : 'மருந்துகள் (தமிழ்)'}</label>
                    <textarea 
                      className="form-textarea" 
                      value={formMedicineTa} 
                      onChange={(e) => setFormMedicineTa(e.target.value)}
                      placeholder="எ.கா. வலி நிவாரணி:உணவுக்குப் பின்"
                    />
                  </div>
                </div>

              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  {lang === 'en' ? 'Save Treatment' : 'சேமி'}
                </button>
                <button type="button" className="btn btn-outline" onClick={cancelForm} style={{ flex: 1 }}>
                  {lang === 'en' ? 'Cancel' : 'ரத்து செய்'}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Feedback Tab */}
      {activeTab === 'feedback' && (
        <div className="animate-fade-in">
          {/* Summary Board */}
          <div className="field-pair" style={{ marginBottom: '20px' }}>
            <div className="card" style={{ textAlign: 'center', padding: '16px' }}>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary)' }}>{totalFeedback}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {lang === 'en' ? 'Total Submissions' : 'மொத்த கருத்துகள்'}
              </div>
            </div>
            <div className="card" style={{ textAlign: 'center', padding: '16px' }}>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: '#fbbf24' }}>
                {avgRating} <span style={{ fontSize: '1rem', fontWeight: '400', color: 'var(--text-muted)' }}>/ 5</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {lang === 'en' ? 'Average Rating' : 'சராசரி மதிப்பீடு'}
              </div>
            </div>
          </div>

          <h3>{lang === 'en' ? 'Recent Submissions' : 'சமீபத்திய கருத்துக்கள்'}</h3>
          <div className="feedback-list">
            {feedbackList.length > 0 ? (
              [...feedbackList].reverse().map((item) => (
                <div key={item.id} className="feedback-card">
                  <div className="feedback-header">
                    <span style={{ fontWeight: 'bold', color: 'var(--primary-dark)' }}>
                      {lang === 'en' ? item.treatmentTitle?.en : item.treatmentTitle?.ta}
                    </span>
                    <span className="feedback-date">
                      {new Date(item.date).toLocaleDateString(lang === 'en' ? 'en-US' : 'ta-IN')}
                    </span>
                  </div>
                  
                  <div className="feedback-stars">
                    {'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}
                  </div>
                  
                  {item.comment && (
                    <div className="feedback-comment" style={{ marginTop: '8px' }}>
                      "{item.comment}"
                    </div>
                  )}
                  
                  <div className="feedback-meta">
                    ID: {item.id}
                  </div>
                </div>
              ))
            ) : (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px 0' }}>
                {lang === 'en' ? 'No feedback submitted yet.' : 'கருத்துக்கள் எதுவும் இன்னும் பெறப்படவில்லை.'}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
