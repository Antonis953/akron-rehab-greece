
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Calendar } from 'lucide-react';
import { Patient } from '@/types/patient';
import { format } from 'date-fns';
import { el } from 'date-fns/locale';

interface PatientInfoProps {
  patient: Patient;
}

const PRIMARY_COLOR = "#1B677D";
const SECONDARY_COLOR = "#90B7C2";

const PatientInfo = ({ patient }: PatientInfoProps) => {
  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Δεν έχει οριστεί';
    try {
      return format(new Date(dateString), 'dd MMMM yyyy', { locale: el });
    } catch (error) {
      return 'Μη έγκυρη ημερομηνία';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg" style={{ color: PRIMARY_COLOR }}>Προσωπικά Στοιχεία</CardTitle>
            <CardDescription>Βασικές πληροφορίες ασθενή</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Pencil className="h-3.5 w-3.5" />
            <span>Επεξεργασία</span>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm font-medium text-gray-500 mb-1">Ονοματεπώνυμο</div>
              <div className="text-base">{patient.full_name}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500 mb-1">Email</div>
              <div className="text-base">{patient.email}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500 mb-1">Τηλέφωνο</div>
              <div className="text-base">{patient.phone || 'Δεν έχει καταχωρηθεί'}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500 mb-1">Ημ/νία Εγγραφής</div>
              <div className="text-base">{formatDate(patient.created_at)}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg" style={{ color: PRIMARY_COLOR }}>Επόμενη Συνεδρία</CardTitle>
            <CardDescription>Προγραμματισμένο ραντεβού</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>Ενημέρωση</span>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-gray-50 rounded-lg">
            {patient.next_session_date ? (
              <div className="flex items-center justify-center flex-col md:flex-row md:justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="h-12 w-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${SECONDARY_COLOR}30`, color: PRIMARY_COLOR }}
                  >
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium">{formatDate(patient.next_session_date)}</div>
                    <div className="text-sm text-gray-500">Επόμενη συνεδρία</div>
                  </div>
                </div>
                <div className="mt-4 md:mt-0">
                  <Button variant="outline" size="sm" className="h-8">
                    Αλλαγή
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500 mb-2">Δεν έχει οριστεί επόμενη συνεδρία</p>
                <Button size="sm" className="h-8" style={{ backgroundColor: SECONDARY_COLOR }}>
                  Προσθήκη συνεδρίας
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg" style={{ color: PRIMARY_COLOR }}>Ιατρικό Ιστορικό</CardTitle>
          <CardDescription>
            Αυτή η ενότητα θα περιέχει το πλήρες ιατρικό ιστορικό του ασθενή
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-gray-500 italic text-center p-4 border border-dashed border-gray-300 rounded-lg">
            Το περιεχόμενο αυτής της ενότητας θα προστεθεί αργότερα από την εφαρμογή
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientInfo;
