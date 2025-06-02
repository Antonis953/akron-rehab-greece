
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarPlus, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProgramService, Program } from '@/services/ProgramService';
import { format } from 'date-fns';
import { el } from 'date-fns/locale';

const PRIMARY_COLOR = "#1B677D";
const SECONDARY_COLOR = "#90B7C2";

interface PatientProgramListProps {
  patientId: string;
}

const PatientProgramList = ({ patientId }: PatientProgramListProps) => {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPrograms = async () => {
      setIsLoading(true);
      try {
        const patientPrograms = await ProgramService.getPatientPrograms(patientId);
        setPrograms(patientPrograms);
      } catch (error) {
        console.error('Error fetching programs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrograms();
  }, [patientId]);

  const handleCreateProgram = async () => {
    console.log(`Έλεγχος για υπάρχον πρόγραμμα για ασθενή με ID: ${patientId}`);
    
    try {
      // Check if a program already exists for this patient
      const existingProgram = await ProgramService.getPatientProgram(patientId);
      
      if (existingProgram) {
        console.log('Βρέθηκε υπάρχον πρόγραμμα, μετάβαση σε αυτό:', existingProgram);
        // Navigate to existing program view (this route would need to be implemented)
        navigate(`/programs/${existingProgram.id}`);
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

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy', { locale: el });
    } catch (error) {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: PRIMARY_COLOR }} />
        <span className="ml-2 text-gray-600">Φόρτωση προγραμμάτων...</span>
      </div>
    );
  }

  if (programs.length === 0) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium" style={{ color: PRIMARY_COLOR }}>Προγράμματα Αποκατάστασης</h3>
          <Button 
            onClick={handleCreateProgram}
            style={{ backgroundColor: SECONDARY_COLOR }}
            className="text-white hover:bg-opacity-90"
          >
            <CalendarPlus className="h-4 w-4 mr-2" />
            <span>Δημιουργία Προγράμματος</span>
          </Button>
        </div>
        
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="rounded-full w-16 h-16 bg-gray-100 mx-auto flex items-center justify-center">
                <CalendarPlus className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="font-medium text-lg" style={{ color: PRIMARY_COLOR }}>Δεν υπάρχουν ακόμη προγράμματα</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Δημιουργήστε το πρώτο εβδομαδιαίο πρόγραμμα αποκατάστασης για τον ασθενή σας, αξιοποιώντας την τεχνολογία AI.
              </p>
              <div className="pt-2">
                <Button 
                  onClick={handleCreateProgram}
                  style={{ backgroundColor: SECONDARY_COLOR }}
                  className="text-white hover:bg-opacity-90"
                >
                  <CalendarPlus className="h-4 w-4 mr-2" />
                  <span>Δημιουργία Εβδομαδιαίου Προγράμματος</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
          <p className="text-sm text-blue-700 text-center">
            <strong>Σημείωση:</strong> Το περιεχόμενο θα παράγεται δυναμικά από εξωτερική AI λογική. Θα ενεργοποιηθεί μετά την τεχνική σύνδεση με OpenAI και πηγές όπως Physiotutors, Prehab Guys και Adam Meakins.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium" style={{ color: PRIMARY_COLOR }}>Προγράμματα Αποκατάστασης</h3>
        <Button 
          onClick={handleCreateProgram}
          style={{ backgroundColor: SECONDARY_COLOR }}
          className="text-white hover:bg-opacity-90"
        >
          <CalendarPlus className="h-4 w-4 mr-2" />
          <span>Νέο Πρόγραμμα</span>
        </Button>
      </div>
      
      <div className="space-y-4">
        {programs.map((program) => (
          <Card key={program.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800">Ενεργό</Badge>
                    <span className="text-sm text-gray-500">
                      {formatDate(program.program_start_date)} - {formatDate(program.program_end_date)}
                    </span>
                  </div>
                  <p className="text-gray-600">{program.notes || 'Εβδομαδιαίο πρόγραμμα αποκατάστασης'}</p>
                </div>
                <Button 
                  variant="outline"
                  onClick={() => navigate(`/programs/${program.id}`)}
                  style={{ borderColor: PRIMARY_COLOR, color: PRIMARY_COLOR }}
                >
                  Προβολή
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PatientProgramList;
