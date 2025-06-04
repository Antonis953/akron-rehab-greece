
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/lib/supabase/types';

export interface Program {
  id: string;
  patient_id: string | null;
  program_start_date: string;
  program_end_date: string | null;
  notes?: string | null;
  created_at: string | null;
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
      
      // Safely cast the data to our Program interface
      return {
        id: data.id,
        patient_id: data.patient_id,
        program_start_date: data.program_start_date,
        program_end_date: data.program_end_date,
        notes: data.notes,
        created_at: data.created_at
      };
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

      if (!data || data.length === 0) {
        return [];
      }

      // Safely map the data to our Program interface
      return data.map((program): Program => ({
        id: program.id,
        patient_id: program.patient_id,
        program_start_date: program.program_start_date,
        program_end_date: program.program_end_date,
        notes: program.notes,
        created_at: program.created_at
      }));
    } catch (error) {
      console.error('Error in getPatientPrograms:', error);
      return [];
    }
  }
};
