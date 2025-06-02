import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BRAND_COLORS } from '@/lib/utils';
import { Loader2, Eye, CalendarPlus, User } from 'lucide-react';
import PatientSupabaseService from '@/services/PatientSupabaseService';
import { ProgramService } from '@/services/ProgramService';
import { Patient } from '@/types/patient';
import { format } from 'date-fns';
import { el } from 'date-fns/locale';
import { toast } from 'sonner';

const PatientList = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPatients = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Φόρτωση ασθενών από Supabase...');
      
      const data = await PatientSupabaseService.getAllPatients();
      console.log('Ανακτήθηκαν ασθενείς:', data);
      setPatients(data);
    } catch (error) {
      console.error('Σφάλμα κατά τη λήψη των ασθενών:', error);
      setError('Σφάλμα κατά τη λήψη των ασθενών. Παρακαλώ δοκιμάστε ξανά.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
    
    const unsubscribe = PatientSupabaseService.subscribeToPatients(() => {
      console.log('Ενημέρωση λίστας ασθενών μέσω real-time...');
      fetchPatients();
    });
    
    return () => {
      unsubscribe();
    };
  }, []);

  const viewPatient = (patientId: string) => {
    console.log(`Προβολή ασθενή με ID: ${patientId}`);
    navigate(`/patients/${patientId}`);
  };

  const createOrViewProgram = async (patientId: string) => {
    console.log(`Έλεγχος για υπάρχον πρόγραμμα για ασθενή με ID: ${patientId}`);
    
    try {
      // Check if a program already exists for this patient
      const existingProgram = await ProgramService.getPatientProgram(patientId);
      
      if (existingProgram) {
        console.log('Βρέθηκε υπάρχον πρόγραμμα, μετάβαση στο:', existingProgram);
        // Navigate to existing program view (this route would need to be implemented)
        navigate(`/programs/${existingProgram.id}`);
        toast.success('Μετάβαση στο υπάρχον πρόγραμμα του ασθενή');
      } else {
        console.log('Δεν βρέθηκε πρόγραμμα, δημιουργία νέου');
        // Navigate to program creation
        navigate(`/programs/new/${patientId}`);
      }
    } catch (error) {
      console.error('Σφάλμα κατά τον έλεγχο προγράμματος:', error);
      // Fallback to program creation if there's an error
      navigate(`/programs/new/${patientId}`);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDateInGreek = (dateString: string | null) => {
    if (!dateString) return 'Μη ορισμένη';
    try {
      return format(new Date(dateString), 'dd MMMM yyyy', { locale: el });
    } catch (error) {
      console.error('Σφάλμα μορφοποίησης ημερομηνίας:', error);
      return 'Μη έγκυρη ημερομηνία';
    }
  };

  const getPatientProgramStatus = (patientId: string) => {
    const statuses = ['active', 'pending', 'completed'];
    const randomIndex = Math.floor(Math.random() * statuses.length);
    return statuses[randomIndex] as 'active' | 'pending' | 'completed';
  };

  const renderStatusBadge = (status: 'active' | 'pending' | 'completed') => {
    if (status === 'active') {
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Σε εξέλιξη</Badge>;
    } else if (status === 'pending') {
      return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">Εκκρεμεί</Badge>;
    } else {
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Ολοκληρώθηκε</Badge>;
    }
  };

  if (error) {
    return (
      <div className="bg-white rounded-md shadow p-8 text-center">
        <div className="flex flex-col items-center justify-center">
          <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium mb-2" style={{ color: BRAND_COLORS.primary }}>{error}</h3>
          <button 
            onClick={() => fetchPatients()} 
            className="px-4 py-2 mt-4 rounded-md text-white"
            style={{ backgroundColor: BRAND_COLORS.secondary }}
          >
            Δοκιμάστε ξανά
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin mb-4" style={{ color: BRAND_COLORS.primary }} />
        <p className="text-gray-600">Φόρτωση ασθενών...</p>
      </div>
    );
  }

  if (patients.length === 0) {
    return (
      <div className="bg-white rounded-md shadow p-8 text-center">
        <div className="flex flex-col items-center justify-center">
          <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <User className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium mb-2" style={{ color: BRAND_COLORS.primary }}>Δεν βρέθηκαν ασθενείς</h3>
          <p className="text-gray-500 mb-4">Δεν υπάρχουν εγγεγραμμένοι ασθενείς στο σύστημα</p>
          <Button 
            onClick={() => navigate('/patients/new')} 
            style={{ backgroundColor: BRAND_COLORS.secondary }}
            className="hover:bg-opacity-90"
          >
            Προσθήκη Νέου Ασθενή
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-md shadow overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Ονοματεπώνυμο</TableHead>
              <TableHead>Κατάσταση Προγράμματος</TableHead>
              <TableHead className="hidden md:table-cell">Επόμενη Συνεδρία</TableHead>
              <TableHead>Ενέργειες</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.map((patient) => {
              const isNew = new Date(patient.created_at || '').getTime() > Date.now() - 86400000;
              const initials = getInitials(patient.full_name);
              const programStatus = getPatientProgramStatus(patient.id);
              
              return (
                <TableRow 
                  key={patient.id} 
                  className={isNew ? "bg-blue-50" : ""}
                >
                  <TableCell>
                    <div className="flex items-center">
                      <div 
                        className="h-9 w-9 rounded-full flex items-center justify-center text-sm"
                        style={{ 
                          backgroundColor: isNew ? `${BRAND_COLORS.secondary}40` : 'rgb(229, 231, 235)',
                          color: isNew ? BRAND_COLORS.primary : undefined 
                        }}
                      >
                        {initials}
                      </div>
                      <div className="ml-3">
                        <div className="font-medium text-gray-900">{patient.full_name}</div>
                        <div className="text-xs text-gray-500">{patient.email}</div>
                        {patient.phone && <div className="text-xs text-gray-500">{patient.phone}</div>}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {isNew ? (
                      <Badge variant="outline" className="border-dashed" style={{ borderColor: BRAND_COLORS.secondary, color: BRAND_COLORS.primary }}>
                        Νέος ασθενής
                      </Badge>
                    ) : (
                      renderStatusBadge(programStatus)
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className="text-sm text-gray-500">{formatDateInGreek(patient.next_session_date)}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex items-center gap-1 text-xs"
                        style={{ color: BRAND_COLORS.primary, borderColor: BRAND_COLORS.secondary }}
                        onClick={() => viewPatient(patient.id)}
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Προβολή</span>
                      </Button>
                      
                      <Button 
                        size="sm"
                        className="flex items-center gap-1 text-xs text-white"
                        style={{ backgroundColor: BRAND_COLORS.secondary }}
                        onClick={() => createOrViewProgram(patient.id)}
                      >
                        <CalendarPlus className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Πρόγραμμα</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PatientList;
