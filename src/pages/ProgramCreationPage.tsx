
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Calendar, Save, Info } from 'lucide-react';
import { toast } from 'sonner';
import PatientSupabaseService from '@/services/PatientSupabaseService';
import { Patient } from '@/types/patient';
import RehabProgramGenerator from '@/components/rehab/RehabProgramGenerator';

// Brand colors
const PRIMARY_COLOR = "#1B677D";
const SECONDARY_COLOR = "#90B7C2";

const ProgramCreationPage = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [startDate, setStartDate] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // Get today's date in YYYY-MM-DD format for min date attribute
  const today = new Date().toISOString().split('T')[0];

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
          // Default start date to today
          setStartDate(today);
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
  }, [patientId, navigate, today]);

  const handleCreateProgram = () => {
    // This would normally send data to Supabase
    toast.success('Το πρόγραμμα δημιουργήθηκε με επιτυχία!');
    
    // Placeholder for creation logic
    console.log('Creating program with data:', {
      patientId,
      startDate,
      notes
    });
    
    // Navigate back to patient page
    if (patientId) {
      navigate(`/patients/${patientId}`);
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
                onClick={() => navigate(`/patients/${patientId}`)}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-2xl font-bold" style={{ color: PRIMARY_COLOR }}>
                Δημιουργία Προγράμματος
              </h1>
            </div>
            <p className="text-gray-500 text-sm ml-8">Για τον ασθενή: {patient.full_name}</p>
          </div>
          
          <Button 
            onClick={handleCreateProgram} 
            style={{ backgroundColor: PRIMARY_COLOR }}
            className="text-white hover:bg-opacity-90"
          >
            <Save className="h-4 w-4 mr-2" /> Αποθήκευση Προγράμματος
          </Button>
        </div>
        
        <Separator />

        <Alert className="bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-700" />
          <AlertDescription className="text-blue-700">
            Το περιεχόμενο παράγεται δυναμικά από εξωτερική AI λογική. Θα ενεργοποιηθεί μετά την τεχνική σύνδεση με OpenAI και εξειδικευμένες πηγές φυσικοθεραπείας.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Στοιχεία Προγράμματος</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="start-date">Ημερομηνία Έναρξης</Label>
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                  <Input
                    id="start-date"
                    type="date"
                    value={startDate}
                    min={today}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Σημειώσεις</Label>
                <Textarea
                  id="notes"
                  placeholder="Προσθέστε σημειώσεις για το πρόγραμμα..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[150px]"
                />
              </div>
            </CardContent>
          </Card>

          <div className="col-span-1 md:col-span-2">
            <RehabProgramGenerator />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProgramCreationPage;
