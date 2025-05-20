
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
  // Extended fields for patient data (not in current DB schema)
  affected_area?: string;
  symptom_description?: string;
  pain_level?: number;
  difficulty_level?: number;
  symptom_start_date?: string;
  aggravating_factors?: string;
  relieving_factors?: string;
  functional_limitations?: string;
  treatment_history?: string;
  rehab_goals?: string;
  activity_level?: string;
  occupation?: string;
}

// Define rehabilitation program types
export interface RehabProgram {
  id: string;
  patientId: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'pending';
  days: RehabDay[];
  createdAt: string;
}

export interface RehabDay {
  id: string;
  dayNumber: number;
  date: string;
  exercises: RehabExercise[];
  completed: boolean;
  hasPhysiotherapistSession?: boolean;
}

export interface RehabExercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  phase: 'isometric' | 'concentric' | 'eccentric' | 'plyometric';
  difficulty: number;
  source: string;
  videoUrl: string;
}
