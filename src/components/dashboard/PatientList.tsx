
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { BRAND_COLORS } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

// Define the Patient interface
interface Patient {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  created_at: string | null;
}

const PatientList = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchPatients = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching patients from Supabase...');
      
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Σφάλμα κατά τη λήψη των ασθενών:', error);
        return;
      }
      
      console.log('Ανακτήθηκαν ασθενείς:', data);
      setPatients(data || []);
    } catch (error) {
      console.error('Σφάλμα κατά τη λήψη των ασθενών:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchPatients();
    
    // Set up real-time subscription to patients table
    const patientsSubscription = supabase
      .channel('public:patients')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'patients' }, 
        (payload) => {
          console.log('Λήφθηκε αλλαγή σε πίνακα ασθενών:', payload);
          fetchPatients(); // Refresh the list when changes occur
        }
      )
      .subscribe();
    
    // Clean up subscription on unmount
    return () => {
      supabase.removeChannel(patientsSubscription);
    };
  }, []);

  const viewPatient = (patientId: string) => {
    console.log(`Προβολή ασθενή με ID: ${patientId}`);
    // Navigate to patient details page (to be implemented)
    // navigate(`/patients/${patientId}`);
  };

  const createProgram = (patientId: string) => {
    console.log(`Δημιουργία προγράμματος για ασθενή με ID: ${patientId}`);
    // Navigate to program creation page (to be implemented)
    // navigate(`/programs/new?patientId=${patientId}`);
  };

  // Generate initials from patient name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin mb-4" style={{ color: BRAND_COLORS.primary }} />
        <p className="text-gray-600">Φόρτωση ασθενών...</p>
      </div>
    );
  }

  // Render empty state
  if (patients.length === 0) {
    return (
      <div className="bg-white rounded-md shadow p-8 text-center">
        <div className="flex flex-col items-center justify-center">
          <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium mb-2" style={{ color: BRAND_COLORS.primary }}>Δεν βρέθηκαν ασθενείς</h3>
          <p className="text-gray-500 mb-4">Δεν υπάρχουν εγγεγραμμένοι ασθενείς στο σύστημα</p>
          <button 
            onClick={() => navigate('/patients/new')} 
            className="px-4 py-2 rounded-md text-white"
            style={{ backgroundColor: BRAND_COLORS.secondary }}
          >
            Προσθήκη Νέου Ασθενή
          </button>
        </div>
      </div>
    );
  }

  // Render patient list
  return (
    <div className="bg-white rounded-md shadow overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Όνομα</TableHead>
            <TableHead>Κατάσταση</TableHead>
            <TableHead>Πρόοδος</TableHead>
            <TableHead className="hidden md:table-cell">Τελευταία Ενημέρωση</TableHead>
            <TableHead>Ενέργειες</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.map((patient) => {
            const isNew = new Date(patient.created_at || '').getTime() > Date.now() - 86400000; // 24 hours
            const initials = getInitials(patient.full_name);
            const randomProgress = Math.floor(Math.random() * 90) + 10; // Temporary random progress
            const formattedDate = patient.created_at 
              ? new Date(patient.created_at).toLocaleDateString('el-GR')
              : 'Μη διαθέσιμο';

            return (
              <TableRow 
                key={patient.id} 
                className={isNew ? "bg-blue-50" : ""}
              >
                <TableCell>
                  <div className="flex items-center">
                    <div 
                      className="h-8 w-8 rounded-full flex items-center justify-center text-gray-600"
                      style={{ 
                        backgroundColor: isNew ? `${BRAND_COLORS.secondary}40` : 'rgb(229, 231, 235)',
                        color: isNew ? BRAND_COLORS.primary : undefined 
                      }}
                    >
                      {initials}
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">{patient.full_name}</div>
                      <div className="text-xs text-gray-500">{patient.email}</div>
                      {isNew && (
                        <span 
                          className="px-2 py-0.5 mt-1 inline-flex text-xs leading-4 font-medium rounded-full" 
                          style={{ backgroundColor: `${BRAND_COLORS.secondary}30`, color: BRAND_COLORS.primary }}
                        >
                          Νέος ασθενής
                        </span>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {isNew ? (
                    <span 
                      className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" 
                      style={{ backgroundColor: `${BRAND_COLORS.secondary}30`, color: BRAND_COLORS.primary }}
                    >
                      Νέος λογαριασμός
                    </span>
                  ) : (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Σε εξέλιξη
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <Progress value={isNew ? 10 : randomProgress} className="h-2 mb-1" />
                  <span className="text-xs text-gray-600">{isNew ? 10 : randomProgress}%</span>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <span className="text-sm text-gray-500">{formattedDate}</span>
                </TableCell>
                <TableCell>
                  <button 
                    className="hover:text-primary/80 mr-3" 
                    style={{ color: BRAND_COLORS.primary }} 
                    onClick={() => viewPatient(patient.id)}
                  >
                    Προβολή
                  </button>
                  {isNew && (
                    <button 
                      className="hover:text-accent/80" 
                      style={{ color: BRAND_COLORS.secondary }}
                      onClick={() => createProgram(patient.id)}
                    >
                      Δημιουργία προγράμματος
                    </button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default PatientList;
