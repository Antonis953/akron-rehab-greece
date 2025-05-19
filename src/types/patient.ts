
export interface PatientFormData {
  // Personal Info
  name: string;
  age: number;
  gender: string;
  email: string;
  phoneNumber: string;
  
  // Problem Area
  problemArea: string;
  problemDescription: string;
  injuryDate: Date | null;
  
  // Symptoms & Pain
  painLevel: number;
  morningPain: boolean;
  nightPain: boolean;
  worseningFactors: string;
  relievingFactors: string;
  
  // Appointment
  nextAppointment: Date | null;
}

export type OnboardingStep = 
  | 'personal'
  | 'problem-area'
  | 'symptoms'
  | 'appointment';

export const stepLabels = {
  'personal': 'Προσωπικά Στοιχεία',
  'problem-area': 'Προβληματική Περιοχή',
  'symptoms': 'Συμπτώματα & Πόνος',
  'appointment': 'Επόμενη Συνεδρία'
};

export const requiredFieldsByStep = {
  'personal': ['name', 'email'],
  'problem-area': ['problemArea', 'problemDescription'],
  'symptoms': ['painLevel'],
  'appointment': [], // Made empty to allow skipping appointment date
};

// Add a new interface that matches the Supabase patients table exactly
export interface Patient {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  next_session_date: string | null;
  created_at: string | null;
}
