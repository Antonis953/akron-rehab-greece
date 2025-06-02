
import { supabase } from '@/integrations/supabase/client';

export interface Program {
  id: string;
  patient_id: string;
  program_start_date: string;
  program_end_date: string;
  notes?: string;
  created_at: string;
}

export const ProgramService = {
  /**
   * Check if a program exists for a given patient
   */
  getPatientProgram: async (patientId: string): Promise<Program | null> => {
    try {
      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching patient program:', error);
        return null;
      }

      if (!data) {
        console.log(`No program found for patient ID: ${patientId}`);
        return null;
      }

      console.log('Found existing program for patient:', data);
      return data;
    } catch (error) {
      console.error('Error in getPatientProgram:', error);
      return null;
    }
  },

  /**
   * Get all programs for a patient
   */
  getPatientPrograms: async (patientId: string): Promise<Program[]> => {
    try {
      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching patient programs:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getPatientPrograms:', error);
      return [];
    }
  }
};
