import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, ClipboardList, User, CalendarCheck } from 'lucide-react';
import PatientList from '@/components/dashboard/PatientList';

// Brand colors
const PRIMARY_COLOR = "#1B677D";
const SECONDARY_COLOR = "#90B7C2";

const PhysiotherapistDashboard = () => {
  const navigate = useNavigate();
  // Mock data for a basic dashboard
  const patientCount = 12;
  const activePrograms = 8;
  const completedPrograms = 24;
  
  return (
    <DashboardLayout userRole="physiotherapist">
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold" style={{ color: PRIMARY_COLOR }}>Καλώς ήρθατε στο PhysioMind.ai</h1>
          <Button 
            onClick={() => navigate('/patients/new')} 
            style={{ backgroundColor: SECONDARY_COLOR }}
          >
            <Plus className="h-4 w-4 mr-2" /> Νέος Ασθενής
          </Button>
        </div>
        
        <p className="text-gray-600">
          Διαχειριστείτε τους ασθενείς σας και δημιουργήστε εξατομικευμένα προγράμματα αποκατάστασης με τη βοήθεια της τεχνητής νοημοσύνης.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Σύνολο Ασθενών</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" style={{ color: PRIMARY_COLOR }}>{patientCount}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Ενεργά Προγράμματα</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" style={{ color: PRIMARY_COLOR }}>{activePrograms}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Ολοκληρωμένα Προγράμματα</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" style={{ color: PRIMARY_COLOR }}>{completedPrograms}</div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-8 space-y-6">
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5" style={{ color: PRIMARY_COLOR }} />
            <h2 className="text-xl font-semibold" style={{ color: PRIMARY_COLOR }}>Πρόσφατοι Ασθενείς</h2>
          </div>

          {/* Replace the static patient table with our dynamic PatientList component */}
          <PatientList />
        </div>
        
        <div className="mt-8 space-y-4">
          <div className="flex items-center space-x-2">
            <CalendarCheck className="h-5 w-5" style={{ color: PRIMARY_COLOR }} />
            <h2 className="text-xl font-semibold" style={{ color: PRIMARY_COLOR }}>Σημερινά Ραντεβού</h2>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-200">
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 mr-3">
                      ΓΠ
                    </div>
                    <div>
                      <div className="font-medium">Γιώργος Παπαδόπουλος</div>
                      <div className="text-sm text-gray-500">Αξιολόγηση προόδου</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">10:30</div>
                    <div className="text-xs text-gray-500">45 λεπτά</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 mr-3">
                      ΑΠ
                    </div>
                    <div>
                      <div className="font-medium">Αντώνης Παναγιώτου</div>
                      <div className="text-sm text-gray-500">Πρώτη συνεδρία</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">13:15</div>
                    <div className="text-xs text-gray-500">60 λεπτά</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full flex items-center justify-center mr-3" 
                         style={{ backgroundColor: `${SECONDARY_COLOR}40`, color: PRIMARY_COLOR }}>
                      ΜΚ
                    </div>
                    <div>
                      <div className="font-medium">Μαρία Κωνσταντίνου</div>
                      <div className="text-sm text-gray-500">Θεραπεία</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">16:00</div>
                    <div className="text-xs text-gray-500">45 λεπτά</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PhysiotherapistDashboard;
