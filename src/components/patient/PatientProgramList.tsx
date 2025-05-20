
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Brand colors
const PRIMARY_COLOR = "#1B677D";
const SECONDARY_COLOR = "#90B7C2";

interface PatientProgramListProps {
  patientId: string;
}

const PatientProgramList = ({ patientId }: PatientProgramListProps) => {
  const navigate = useNavigate();
  // This is a mock component that would be replaced with real data
  // In a real implementation, we would fetch programs from Supabase

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium" style={{ color: PRIMARY_COLOR }}>Προγράμματα Αποκατάστασης</h3>
        <Button 
          onClick={() => navigate(`/programs/new/${patientId}`)}
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
                onClick={() => navigate(`/programs/new/${patientId}`)}
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
};

export default PatientProgramList;
