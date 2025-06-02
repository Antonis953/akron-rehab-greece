import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from "@/components/ui/separator";
import { CalendarPlus, ArrowLeft, User } from 'lucide-react';
import { toast } from 'sonner';
import PatientSupabaseService from '@/services/PatientSupabaseService';
import { ProgramService } from '@/services/ProgramService';
import { Patient } from '@/types/patient';
import { format } from 'date-fns';
import { el } from 'date-fns/locale';
import PatientProgramList from '@/components/patient/PatientProgramList';
import PatientInfo from '@/components/patient/PatientInfo';

// Brand colors
const PRIMARY_COLOR = "#1B677D";
const SECONDARY_COLOR = "#90B7C2";

const PatientDetailPage = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPatient = async () => {
      if (!patientId) {
        toast.error('Δεν βρέθηκε το ID του ασθενή');
        navigate('/dashboard/physiotherapist');
        return;
      }

      setIsLoading(true);
      try {
        const patientData = await PatientSupabaseService.getPatientById(patientId);
        if (patientData) {
          setPatient(patientData);
        } else {
          toast.error('Ο ασθενής δεν βρέθηκε');
          navigate('/dashboard/physiotherapist');
        }
      } catch (error) {
        console.error('Error fetching patient:', error);
        toast.error('Σφάλμα κατά την ανάκτηση των στοιχείων του ασθενή');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatient();
  }, [patientId, navigate]);

  const handleCreateProgram = async () => {
    if (!patientId) return;
    
    console.log(`Έλεγχος για υπάρχον πρόγραμμα για ασθενή με ID: ${patientId}`);
    
    try {
      // Check if a program already exists for this patient
      const existingProgram = await ProgramService.getPatientProgram(patientId);
      
      if (existingProgram) {
        console.log('Βρέθηκε υπάρχον πρόγραμμα, μετάβαση σε αυτό:', existingProgram);
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

  if (isLoading) {
    return (
      <DashboardLayout userRole="physiotherapist">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-t-2" style={{ borderColor: PRIMARY_COLOR }}></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!patient) {
    return (
      <DashboardLayout userRole="physiotherapist">
        <div className="text-center">
          <p className="text-lg text-red-500">Ο ασθενής δεν βρέθηκε</p>
          <Button 
            onClick={() => navigate('/dashboard/physiotherapist')} 
            variant="outline" 
            className="mt-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Επιστροφή στον πίνακα ελέγχου
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole="physiotherapist">
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/dashboard/physiotherapist')}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-2xl font-bold" style={{ color: PRIMARY_COLOR }}>
                {patient.full_name}
              </h1>
            </div>
            <p className="text-gray-500 text-sm ml-8">{patient.email} {patient.phone && `• ${patient.phone}`}</p>
          </div>
          
          <Button 
            onClick={handleCreateProgram} 
            style={{ backgroundColor: SECONDARY_COLOR }}
            className="text-white hover:bg-opacity-90"
          >
            <CalendarPlus className="h-4 w-4 mr-2" /> Δημιουργία Εβδομαδιαίου Προγράμματος
          </Button>
        </div>
        
        <Separator />
        
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="info">Στοιχεία Ασθενή</TabsTrigger>
            <TabsTrigger value="programs">Προγράμματα</TabsTrigger>
          </TabsList>
          <TabsContent value="info">
            <PatientInfo patient={patient} />
          </TabsContent>
          <TabsContent value="programs">
            <PatientProgramList patientId={patient.id} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default PatientDetailPage;
