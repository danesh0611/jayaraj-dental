import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Home from './components/Home';
import TreatmentDetail from './components/TreatmentDetail';
import ChatAssistant from './components/ChatAssistant';
import { getTreatments, getClinicDetails } from './utils/storage';

function App() {
  const [lang, setLang] = useState('en'); // 'en' (English) or 'ta' (Tamil)
  const [view, setView] = useState('home'); // 'home', 'treatment'
  const [subViewId, setSubViewId] = useState(null); // active treatment id
  
  const [treatments, setTreatments] = useState([]);
  const [clinicDetails, setClinicDetails] = useState(null);

  // Address & treatments migration hook: automatically clears legacy cache and updates details and treatments
  useEffect(() => {
    const currentDetails = getClinicDetails();
    if (currentDetails && currentDetails.address && !currentDetails.address.en.includes("Mylapore")) {
      localStorage.removeItem('jayaraj_dental_clinic_details');
      localStorage.removeItem('jayaraj_dental_treatments');
      window.location.reload();
      return;
    }
    const cachedTreatments = localStorage.getItem('jayaraj_dental_treatments');
    if (cachedTreatments && !cachedTreatments.includes('crown-bridge')) {
      localStorage.removeItem('jayaraj_dental_treatments');
      window.location.reload();
      return;
    }
    setTreatments(getTreatments());
    setClinicDetails(getClinicDetails());
  }, []);

  // Hash-based client router for robust, configuration-free deep linking and browser history
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || '#/';
      if (hash.startsWith('#/treatment/')) {
        const id = hash.replace('#/treatment/', '');
        setView('treatment');
        setSubViewId(id);
      } else {
        setView('home');
        setSubViewId(null);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Execute initially to catch loading URL

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (targetView, id = null) => {
    if (targetView === 'treatment') {
      window.location.hash = `#/treatment/${id}`;
    } else {
      window.location.hash = `#/`;
    }
  };

  // Render a simple loading shell while storage defaults are writing
  if (!clinicDetails) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: 'sans-serif',
        color: '#0ea5e9',
        fontWeight: 'bold'
      }}>
        Loading Jayaraj Dental Care Assistant...
      </div>
    );
  }

  const activeTreatment = view === 'treatment' ? treatments.find(t => t.id === subViewId) : null;

  return (
    <>
      <div className="app-container">
        {/* Clinic Header with Accessibility Controls and Language Toggles */}
        <Header 
          lang={lang} 
          setLang={setLang} 
          clinicName={clinicDetails.name}
        />

        {/* Primary Page Router */}
        <main className="app-main">
          {view === 'home' && (
            <Home 
              lang={lang} 
              treatments={treatments} 
              clinicDetails={clinicDetails} 
              navigateTo={navigateTo} 
            />
          )}
          {view === 'treatment' && (
            <TreatmentDetail 
              lang={lang} 
              treatment={activeTreatment} 
              clinicDetails={clinicDetails} 
              navigateTo={navigateTo} 
            />
          )}
        </main>
      </div>

      {/* Floating LLM Chat Assistant */}
      <ChatAssistant 
        lang={lang}
        activeTreatment={activeTreatment}
        clinicDetails={clinicDetails}
      />
    </>
  );
}

export default App;
