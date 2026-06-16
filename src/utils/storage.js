import { defaultTreatments } from '../data/defaultTreatments';

const KEYS = {
  TREATMENTS: 'jayaraj_dental_treatments',
  CLINIC_DETAILS: 'jayaraj_dental_clinic_details',
  FEEDBACK: 'jayaraj_dental_feedback'
};

const DEFAULT_CLINIC_DETAILS = {
  name: {
    en: "Jayaraj Dental Care",
    ta: "ஜெயராஜ் பல் மருத்துவமனை"
  },
  doctor: {
    en: "Dr. P.B. Anand",
    ta: "டாக்டர் பி.பி. ஆனந்த்"
  },
  tagline: {
    en: "Your Smile, Our Care",
    ta: "உங்கள் புன்னகை, எங்கள் கவனிப்பு"
  },
  address: {
    en: "No.15, 2, E Mada St, opp. to ICICI Bank, Vinayaka Nagar Colony, Mylapore, Chennai, Tamil Nadu 600004",
    ta: "எண்.15, 2, கிழக்கு மாட வீதி, ஐசிஐசிஐ வங்கி எதிரில், விநாயகா நகர் காலனி, மயிலாப்பூர், சென்னை, தமிழ்நாடு 600004"
  }
};

export const getTreatments = () => {
  try {
    const raw = localStorage.getItem(KEYS.TREATMENTS);
    if (!raw) {
      localStorage.setItem(KEYS.TREATMENTS, JSON.stringify(defaultTreatments));
      return defaultTreatments;
    }
    return JSON.parse(raw);
  } catch (error) {
    console.error("Error reading treatments from localStorage", error);
    return defaultTreatments;
  }
};

export const saveTreatments = (treatments) => {
  try {
    localStorage.setItem(KEYS.TREATMENTS, JSON.stringify(treatments));
    return true;
  } catch (error) {
    console.error("Error saving treatments to localStorage", error);
    return false;
  }
};

export const getClinicDetails = () => {
  try {
    const raw = localStorage.getItem(KEYS.CLINIC_DETAILS);
    if (!raw) {
      localStorage.setItem(KEYS.CLINIC_DETAILS, JSON.stringify(DEFAULT_CLINIC_DETAILS));
      return DEFAULT_CLINIC_DETAILS;
    }
    return JSON.parse(raw);
  } catch (error) {
    console.error("Error reading clinic details from localStorage", error);
    return DEFAULT_CLINIC_DETAILS;
  }
};

export const saveClinicDetails = (details) => {
  try {
    localStorage.setItem(KEYS.CLINIC_DETAILS, JSON.stringify(details));
    return true;
  } catch (error) {
    console.error("Error saving clinic details to localStorage", error);
    return false;
  }
};

export const getFeedback = () => {
  try {
    const raw = localStorage.getItem(KEYS.FEEDBACK);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error("Error reading feedback from localStorage", error);
    return [];
  }
};

export const addFeedback = (item) => {
  try {
    const feedbackList = getFeedback();
    const newFeedback = {
      ...item,
      id: Date.now().toString(),
      date: new Date().toISOString()
    };
    feedbackList.push(newFeedback);
    localStorage.setItem(KEYS.FEEDBACK, JSON.stringify(feedbackList));
    return newFeedback;
  } catch (error) {
    console.error("Error adding feedback to localStorage", error);
    return null;
  }
};

export const clearAllData = () => {
  localStorage.removeItem(KEYS.TREATMENTS);
  localStorage.removeItem(KEYS.CLINIC_DETAILS);
  localStorage.removeItem(KEYS.FEEDBACK);
  window.location.reload();
};
