
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { PatientFormData, Patient } from '@/types/patient';
import { Database } from '@/integrations/supabase/types';

type PatientInsert = Database['public']['Tables']['patients']['Insert'];

export const PatientSupabaseService = {
  /**
   * Create a new patient in the Supabase database
   * @param patientData The patient data to insert
   * @returns The created patient data or null if there was an error
   */
  async createPatient(patientData: PatientFormData): Promise<Patient | null> {
    try {
      // Format the next appointment date properly for Supabase (YYYY-MM-DD)
      const formatDate = (date: Date): string => {
        return date.toISOString().split('T')[0];
      };
      
      // Map from our internal form schema to Supabase table schema
      const patientRecord: PatientInsert = {
        full_name: patientData.name,
        email: patientData.email,
        phone: patientData.phoneNumber || null,
        next_session_date: patientData.nextAppointment ? formatDate(patientData.nextAppointment) : null
      };
      
      console.log('Creating patient in Supabase:', patientRecord);
      
      const { data, error } = await supabase
        .from('patients')
        .insert(patientRecord)
        .select()
        .single();
      
      if (error) {
        console.error('Supabase error:', error);
        toast.error(`Προέκυψε ένα σφάλμα: ${error.message}`);
        return null;
      }
      
      console.log('Patient created successfully:', data);
      return data as Patient;
    } catch (error) {
      console.error('Error creating patient:', error);
      toast.error('Προέκυψε ένα σφάλμα κατά τη δημιουργία του λογαριασμού.');
      return null;
    }
  },
  
  /**
   * Get all patients from the Supabase database
   * @returns An array of patients or empty array if there was an error
   */
  async getAllPatients(): Promise<Patient[]> {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching patients:', error);
        return [];
      }
      
      return data as Patient[];
    } catch (error) {
      console.error('Error fetching patients:', error);
      return [];
    }
  },
  
  /**
   * Subscribe to real-time updates on the patients table
   * @param onUpdate Callback to execute when the patients table is updated
   * @returns A function to unsubscribe from the real-time updates
   */
  subscribeToPatients(onUpdate: () => void) {
    const channel = supabase
      .channel('public:patients')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'patients' },
        () => {
          console.log('Patient table changed, refreshing data...');
          onUpdate();
        }
      )
      .subscribe();
    
    // Return unsubscribe function
    return () => {
      supabase.removeChannel(channel);
    };
  }
};

export default PatientSupabaseService;
