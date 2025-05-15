
export type UserRole = 'physiotherapist' | 'patient';

export interface Patient {
  id: string;
  name: string;
  age: number;
  email: string;
  phoneNumber: string;
  condition: string;
  painLevel: number;
  limitations: string;
  goals: string;
  medicalHistory: string;
  problemArea: string;
  problemDescription: string;
  createdAt: string;
  updatedAt: string;
  nextAppointment: string | null;
  status: 'new' | 'active' | 'inactive' | 'completed';
  physiotherapistId: string;
}

export interface Physiotherapist {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  specialization: string;
  licenseNumber: string;
  clinic: string;
  bio: string;
  createdAt: string;
  updatedAt: string;
}

export type ExercisePhase = 'isometric' | 'concentric' | 'eccentric' | 'plyometric';

export interface Exercise {
  id: string;
  name: string;
  description: string;
  videoUrl: string;
  phase: ExercisePhase;
  intensity: string;
  sets: number;
  reps: number;
  duration: number;
  source: string;
  sourceUrl: string;
  progression: string;
}

export interface RehabProgram {
  id: string;
  patientId: string;
  physiotherapistId: string;
  startDate: string;
  endDate: string;
  title: string;
  description: string;
  exercises: Exercise[];
  createdAt: string;
  updatedAt: string;
}

export interface PatientCreationFormData {
  name: string;
  age: number;
  gender: string;
  email: string;
  phoneNumber: string;
  problemArea: string;
  problemDescription: string;
  injuryDate: Date | null;
  painLevel: number;
  morningPain: boolean;
  nightPain: boolean;
  worseningFactors: string;
  relievingFactors: string;
  nextAppointment: Date | null;
}
