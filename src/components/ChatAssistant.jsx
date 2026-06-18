import React, { useState, useEffect, useRef } from 'react';

export default function ChatAssistant({ lang, activeTreatment, clinicDetails }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

  const t = {
    en: {
      botName: "Jayaraj Dental AI Assistant",
      statusOnline: "Online",
      statusDemo: "Demo Mode",
      welcomeMsg: "Hello! I am your Jayaraj Dental Assistant. How can I help you today?",
      welcomeTreatment: (title) => `Hi! I am here to help you with your post-care guidelines for ${title}. Ask me anything!`,
      placeholder: "Ask a question about your care...",
      emergencyNote: "Emergency? Call 044-42101660 immediately.",
      suggestTitle: "Suggested Questions:",
      suggestGeneral: [
        "What are the clinic timings?",
        "Where is the clinic located?",
        "How do I contact the doctor?"
      ],
      suggestExtraction: [
        "How to control bleeding?",
        "When can I eat hot food?",
        "Is severe pain normal?"
      ],
      suggestRCT: [
        "When can I chew on this side?",
        "Is pain normal after root canal?",
        "What medicines should I take?"
      ],
      suggestScaling: [
        "Why are my teeth sensitive?",
        "Can I drink coffee after scaling?",
        "How to brush sensitive teeth?"
      ]
    },
    ta: {
      botName: "ஜெயராஜ் பல் மருத்துவ AI உதவியாளர்",
      statusOnline: "ஆன்லைன்",
      statusDemo: "டெமோ முறை",
      welcomeMsg: "வணக்கம்! நான் உங்கள் ஜெயராஜ் பல் மருத்துவ உதவியாளர். இன்று உங்களுக்கு நான் எவ்வாறு உதவ முடியும்?",
      welcomeTreatment: (title) => `வணக்கம்! ${title} சிகிச்சைக்கான வழிகாட்டுதல்கள் பற்றி உங்களுக்கு உதவ நான் தயாராக உள்ளேன். ஏதேனும் சந்தேகங்கள் இருந்தால் கேட்கவும்!`,
      placeholder: "உங்கள் சிகிச்சை பற்றிய கேள்வியைக் கேட்கவும்...",
      emergencyNote: "அவசர தேவையா? உடனே 044-42101660 என்ற எண்ணை அழைக்கவும்.",
      suggestTitle: "பரிந்துரைக்கப்படும் கேள்விகள்:",
      suggestGeneral: [
        "மருத்துவமனை வேலை நேரம் என்ன?",
        "மருத்துவமனை எங்கு அமைந்துள்ளது?",
        "மருத்துவரை எவ்வாறு தொடர்பு கொள்வது?"
      ],
      suggestExtraction: [
        "இரத்தப்போக்கை எவ்வாறு கட்டுப்படுத்துவது?",
        "சூடான உணவை எப்போது சாப்பிடலாம்?",
        "கடுமையான வலி சாதாரணமா?"
      ],
      suggestRCT: [
        "இந்த பக்கத்தில் எப்போது மெல்லலாம்?",
        "ரூட் கேனாலுக்கு பின் வலி சாதாரணமா?",
        "நான் என்ன மருந்துகளை உட்கொள்ள வேண்டும்?"
      ],
      suggestScaling: [
        "எனது பற்கள் கூச்சமாக இருப்பது ஏன்?",
        "பல் சுத்தம் செய்த பின் காபி குடிக்கலாமா?",
        "கூச்சமுள்ள பற்களை எப்படி துலக்குவது?"
      ]
    }
  }[lang];

  // Initialize welcome message
  useEffect(() => {
    const title = activeTreatment ? (lang === 'en' ? activeTreatment.title.en : activeTreatment.title.ta) : '';
    setMessages([
      {
        sender: 'bot',
        text: activeTreatment ? t.welcomeTreatment(title) : t.welcomeMsg
      }
    ]);
  }, [activeTreatment, lang]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const getSuggestions = () => {
    if (!activeTreatment) return t.suggestGeneral;
    if (activeTreatment.id === 'tooth-extraction') return t.suggestExtraction;
    if (activeTreatment.id === 'root-canal') return t.suggestRCT;
    if (activeTreatment.id === 'dental-scaling') return t.suggestScaling;
    return t.suggestGeneral;
  };

  const getLocalResponse = (query) => {
    const q = query.toLowerCase();
    const isTa = lang === 'ta';

    if (q.includes('extraction') || q.includes('இரத்தம்') || q.includes('பல் பிடுங்குதல்') || q.includes('bleeding') || q.includes('spit') || q.includes('துப்ப')) {
      return isTa
        ? "பல் பிடுங்கிய பின்: \n1. ரத்தக் கசிவைக் கட்டுப்படுத்த பஞ்சை 1 மணி நேரம் கடித்துக் கொண்டிருக்க வேண்டும்.\n2. உமிழ்நீரைத் துப்பக் கூடாது, விழுங்க வேண்டும்.\n3. 24 மணி நேரத்திற்கு சூடான, காரமான அல்லது கடினமான உணவுகளைத் தவிர்க்கவும்; குளிர்ச்சியான உணவுகளைச் சாப்பிடவும்."
        : "After Tooth Extraction:\n1. Keep the cotton pack firmly pressed for 1 hour to control bleeding.\n2. Do NOT spit; swallow your saliva to allow clotting.\n3. Avoid hot, spicy, or hard foods for 24 hours. Eat cold/soft foods like ice cream or curd rice.";
    }
    if (q.includes('rct') || q.includes('root canal') || q.includes('ரூட் கேனால்') || q.includes('chew') || q.includes('மெல்ல')) {
      return isTa
        ? "ரூட் கேனால் சிகிச்சைக்கு பின்: \n1. மரத்துப்போன உணர்வு நீங்கும் வரை சாப்பிட வேண்டாம்.\n2. சிகிச்சை பெற்ற பக்கத்தில் கடினமான உணவுகளை மெல்லக் கூடாது.\n3. லேசான வலி 2-3 நாட்களுக்கு இருப்பது இயல்பானது; மருத்துவர் கொடுத்த மாத்திரைகளை உட்கொள்ளவும்."
        : "After Root Canal Treatment (RCT):\n1. Do not eat until the numbness from anesthesia wears off.\n2. Avoid chewing hard foods on the treated side until the final crown is placed.\n3. Mild tenderness for 2-3 days is normal. Take prescribed pain relievers as directed.";
    }
    if (q.includes('scaling') || q.includes('clean') || q.includes('சுத்தம்') || q.includes('sensitive') || q.includes('கூச்சம்')) {
      return isTa
        ? "பல் சுத்தம் செய்த பின்: \n1. பற்களில் தற்காலிக கூச்சம் 3-7 நாட்கள் வரை இருப்பது இயல்பானது.\n2. காரமான அல்லது அதிக குளிர்ச்சியான/சூடான உணவுகளை சில நாட்களுக்குத் தவிர்க்கவும்.\n3. மென்மையான பிரஷ் கொண்டு பற்களைத் மெதுவாகத் துலக்கவும்."
        : "After Dental Scaling:\n1. Temporary teeth sensitivity is normal for 3-7 days.\n2. Avoid extremely hot, cold, or highly acidic foods/drinks for a few days.\n3. Use a soft-bristled brush and do not scrub aggressively.";
    }
    if (q.includes('time') || q.includes('timing') || q.includes('open') || q.includes('நேரம்') || q.includes('வேலை')) {
      return isTa
        ? "ஜெயராஜ் பல் மருத்துவமனையின் வேலை நேரம்: \nகாலை 9:00 மணி முதல் இரவு 8:00 மணி வரை (திங்கள் முதல் சனிக்கிழமை வரை). ஞாயிற்றுக்கிழமை விடுமுறை."
        : "Jayaraj Dental Clinic is open from 9:00 AM to 8:00 PM (Monday to Saturday). Closed on Sundays.";
    }
    if (q.includes('address') || q.includes('location') || q.includes('where') || q.includes('முகவரி') || q.includes('இடம்')) {
      return isTa
        ? `முகவரி: எண்.15, 2, கிழக்கு மாட வீதி, ஐசிஐசிஐ வங்கி எதிரில், மயிலாப்பூர், சென்னை, தமிழ்நாடு 600004.`
        : `Location: ${clinicDetails.address.en}`;
    }
    if (q.includes('doctor') || q.includes('anand') || q.includes('ஆனந்த்') || q.includes('மருத்துவர்')) {
      return isTa
        ? "முதன்மை மருத்துவர்: டாக்டர் பி.பி. ஆனந்த்."
        : `Chief Dentist: ${clinicDetails.doctor.en}`;
    }
    if (q.includes('phone') || q.includes('number') || q.includes('contact') || q.includes('தொடர்பு') || q.includes('தொலைபேசி')) {
      return isTa
        ? "நீங்கள் எங்களை 044-42101660 அல்லது 044-42101802 என்ற எண்களில் தொடர்பு கொள்ளலாம்."
        : "You can contact the clinic at 044-42101660 or 044-42101802.";
    }

    return isTa
      ? "மன்னிக்கவும், உங்கள் கேள்விக்கு என்னால் துல்லியமான பதிலளிக்க முடியவில்லை. அவசர சந்தேகங்களுக்கு எங்களை 044-42101660 என்ற எண்ணில் அழைக்கவும்."
      : "I'm sorry, I could not find a specific answer to your query. For any urgent questions, please contact the clinic directly at 044-42101660.";
  };

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { sender: 'user', text: query }]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    // If API key is available, use Gemini
    if (apiKey && apiKey !== 'AIzaSy...') {
      try {
        // Build context guidelines
        let context = `You are a helpful dental care AI assistant for Jayaraj Dental Clinic. 
Chief dentist is Dr. P.B. Anand. The clinic address is No.15, 2, E Mada St, Mylapore, Chennai, Tamil Nadu 600004. Contact numbers are 044-42101660 and 044-42101802.
Answer the patient's questions politely, clearly, and concisely. Respond in the language the user asked (English or Tamil).
If you do not know the answer or it is a medical emergency, recommend calling the clinic immediately at 044-42101660.`;

        if (activeTreatment) {
          const title = activeTreatment.title.en;
          const expect = activeTreatment.expect ? activeTreatment.expect.en.join('; ') : '';
          const dos = activeTreatment.dos ? activeTreatment.dos.en.join('; ') : '';
          const donts = activeTreatment.donts ? activeTreatment.donts.en.join('; ') : '';
          context += `\n\nThe patient is currently viewing instructions for "${title}". 
Here are the clinic's official post-care guidelines for this treatment:
- What to expect: ${expect}
- Do's: ${dos}
- Don'ts: ${donts}
Please make sure to reference these specific guidelines if the patient asks about this treatment.`;
        }

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `${context}\n\nUser Question: ${query}\nAssistant Answer:`
                    }
                  ]
                }
              ],
              generationConfig: {
                temperature: 0.5,
                maxOutputTokens: 500
              }
            })
          }
        );

        if (!response.ok) {
          throw new Error('API request failed');
        }

        const data = await response.json();
        const botText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        if (botText) {
          setMessages(prev => [...prev, { sender: 'bot', text: botText.trim() }]);
        } else {
          throw new Error('Empty response');
        }
      } catch (err) {
        console.error("Gemini API Error, falling back to local responder", err);
        const fallbackText = getLocalResponse(query);
        setMessages(prev => [...prev, { sender: 'bot', text: fallbackText }]);
      } finally {
        setIsTyping(false);
      }
    } else {
      // Local fallback mode
      setTimeout(() => {
        const responseText = getLocalResponse(query);
        setMessages(prev => [...prev, { sender: 'bot', text: responseText }]);
        setIsTyping(false);
      }, 750);
    }
  };

  return (
    <div className="assistant-container">
      {/* Floating Toggle Button */}
      <button 
        className={`assistant-trigger ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title={t.botName}
        aria-label="Toggle Assistant"
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        )}
      </button>

      {/* Assistant Chat Window */}
      {isOpen && (
        <div className="assistant-window">
          {/* Header */}
          <div className="assistant-header">
            <div>
              <h4 className="assistant-title">{t.botName}</h4>
              <span className="assistant-status">
                <span className="status-dot"></span>
                {apiKey ? t.statusOnline : t.statusDemo}
              </span>
            </div>
            <button className="assistant-close" onClick={() => setIsOpen(false)}>
              &times;
            </button>
          </div>

          {/* Messages Stream */}
          <div className="assistant-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-bubble-wrapper ${msg.sender}`}>
                <div className={`chat-bubble ${msg.sender}`}>
                  {msg.text.split('\n').map((line, lIdx) => (
                    <p key={lIdx} style={{ margin: 0, marginBottom: lIdx < msg.text.split('\n').length - 1 ? '4px' : '0' }}>{line}</p>
                  ))}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="chat-bubble-wrapper bot">
                <div className="chat-bubble bot typing">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestion Pills */}
          {messages.length === 1 && !isTyping && (
            <div className="assistant-suggestions">
              <span className="suggest-title">{t.suggestTitle}</span>
              <div className="suggest-pills-list">
                {getSuggestions().map((pill, idx) => (
                  <button 
                    key={idx} 
                    className="suggest-pill-btn" 
                    onClick={() => handleSend(pill)}
                  >
                    {pill}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Footer */}
          <form className="assistant-footer" onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
            <input
              type="text"
              className="assistant-input"
              placeholder={t.placeholder}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isTyping}
            />
            <button type="submit" className="assistant-send-btn" disabled={!input.trim() || isTyping}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
          <div className="assistant-warning">
            {t.emergencyNote}
          </div>
        </div>
      )}
    </div>
  );
}
