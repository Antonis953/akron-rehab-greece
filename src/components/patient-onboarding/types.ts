
// Types for the onboarding flow
export type OnboardingStep = 
  | 'personal'
  | 'medical'
  | 'problem-area'
  | 'symptoms'
  | 'lifestyle'
  | 'appointment'
  | 'review';
  
export interface FormData {
  // Personal Info
  name: string;
  age: number;
  gender: string;
  email: string;
  phoneNumber: string;
  
  // Medical History
  previousInjuries: string;
  chronicConditions: string;
  medications: string;
  
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
  
  // Lifestyle
  dailyActivity: string;
  occupation: string;
  sleepQuality: string;
  stressLevel: number;
  
  // Appointment
  nextAppointment: Date | null;
}

export const requiredFieldsByStep: Record<OnboardingStep, Array<keyof FormData>> = {
  'personal': ['name', 'age', 'gender', 'email'],
  'medical': [], // All fields are optional
  'problem-area': ['problemArea', 'problemDescription'],
  'symptoms': ['painLevel'],
  'lifestyle': ['dailyActivity', 'occupation'],
  'appointment': ['nextAppointment'],
  'review': []
};

export const stepLabels: Record<OnboardingStep, string> = {
  'personal': 'Προσωπικά Στοιχεία',
  'medical': 'Ιατρικό Ιστορικό',
  'problem-area': 'Προβληματική Περιοχή',
  'symptoms': 'Συμπτώματα & Πόνος',
  'lifestyle': 'Συνήθειες Ζωής',
  'appointment': 'Επόμενη Συνεδρία',
  'review': 'Ανασκόπηση'
};
