
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
