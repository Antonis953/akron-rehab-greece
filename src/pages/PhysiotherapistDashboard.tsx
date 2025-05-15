
import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, ClipboardList, User, CalendarCheck } from 'lucide-react';

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
          <h1 className="text-2xl font-bold">Καλώς ήρθατε στο PhysioMind.ai</h1>
          <Button 
            onClick={() => navigate('/patients/new')} 
            className="bg-accent hover:bg-accent/90"
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
              <div className="text-3xl font-bold text-primary">{patientCount}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Ενεργά Προγράμματα</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{activePrograms}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Ολοκληρωμένα Προγράμματα</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{completedPrograms}</div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-8 space-y-6">
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Πρόσφατοι Ασθενείς</h2>
          </div>

          <div className="bg-white rounded-md shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Όνομα</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Κατάσταση</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Πρόοδος</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Τελευταία Ενημέρωση</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ενέργειες</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                        ΓΠ
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">Γιώργος Παπαδόπουλος</div>
                        <div className="text-xs text-gray-500">45 ετών</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Σε εξέλιξη
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: "75%" }}></div>
                    </div>
                    <span className="text-xs text-gray-600">75%</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    14/05/2025
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="text-primary hover:text-primary/80">Προβολή</button>
                  </td>
                </tr>
                <tr className="bg-blue-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-blue-200 flex items-center justify-center text-blue-600">
                        ΜΚ
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">Μαρία Κωνσταντίνου</div>
                        <div className="text-xs text-gray-500">32 ετών</div>
                        <span className="px-2 py-0.5 mt-1 inline-flex text-xs leading-4 font-medium rounded-full bg-blue-100 text-blue-800">
                          Νέος ασθενής
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      Νέος λογαριασμός
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: "10%" }}></div>
                    </div>
                    <span className="text-xs text-gray-600">10%</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    13/05/2025
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="text-primary hover:text-primary/80 mr-3">Προβολή</button>
                    <button className="text-accent hover:text-accent/80">Δημιουργία προγράμματος</button>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                        ΑΠ
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">Αντώνης Παναγιώτου</div>
                        <div className="text-xs text-gray-500">57 ετών</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                      Αξιολόγηση
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: "40%" }}></div>
                    </div>
                    <span className="text-xs text-gray-600">40%</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    10/05/2025
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="text-primary hover:text-primary/80">Προβολή</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="mt-8 space-y-4">
          <div className="flex items-center space-x-2">
            <CalendarCheck className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Σημερινά Ραντεβού</h2>
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
                    <div className="h-10 w-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-600 mr-3">
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
