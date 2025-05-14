
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const PatientDashboard = () => {
  // Mock data for a patient's exercises
  const todaysExercises = [
    {
      id: '1',
      name: 'Ισομετρική Ενδυνάμωση Τετρακεφάλου',
      description: 'Καθίστε με το πόδι τεντωμένο και σφίξτε το μυ του τετρακέφαλου για να ανυψώσετε ελαφρά το πόδι από το έδαφος.',
      sets: 3,
      reps: 12,
      phase: 'isometric',
      completed: false
    },
    {
      id: '2',
      name: 'Πλάγιες Άρσεις Ποδιού',
      description: 'Σταθείτε όρθιοι και ανασηκώστε το πόδι προς τα έξω, κρατώντας το γόνατο ευθεία.',
      sets: 3,
      reps: 10,
      phase: 'concentric',
      completed: true
    },
    {
      id: '3',
      name: 'Γέφυρες Ισχίων',
      description: 'Ξαπλώστε ανάσκελα με τα γόνατα λυγισμένα και ανυψώστε τη λεκάνη από το έδαφος.',
      sets: 2,
      reps: 15,
      phase: 'concentric',
      completed: false
    }
  ];

  return (
    <DashboardLayout userRole="patient">
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold">Καλώς ήρθατε στο πρόγραμμα αποκατάστασής σας</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Ημέρα Προγράμματος</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">3/7</div>
              <p className="text-sm text-gray-500 mt-1">Εβδομάδα 1</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Πρόοδος Εβδομάδας</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                <div className="bg-accent h-2.5 rounded-full" style={{ width: "43%" }}></div>
              </div>
              <div className="text-xl font-bold text-accent">43%</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Επόμενη Συνάντηση</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-medium">18 Μαΐου</div>
              <p className="text-sm text-gray-500">στις 16:30</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-8">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Σημερινές Ασκήσεις</CardTitle>
                <Button variant="outline" size="sm">Δείτε όλο το πρόγραμμα</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todaysExercises.map((exercise) => (
                  <div key={exercise.id} className={`p-4 border rounded-lg ${exercise.completed ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center ${exercise.completed ? 'bg-green-500' : 'border-2 border-gray-300'}`}>
                          {exercise.completed && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{exercise.name}</h3>
                          <div className="flex items-center mt-1 space-x-2">
                            <span className={`phase-badge phase-${exercise.phase}`}>
                              {exercise.phase === 'isometric' ? 'Ισομετρική' : 
                               exercise.phase === 'concentric' ? 'Ομόκεντρη' : 
                               exercise.phase === 'eccentric' ? 'Έκκεντρη' : 'Πλειομετρική'}
                            </span>
                            <span className="text-sm text-gray-500">{exercise.sets} σετ × {exercise.reps} επαναλήψεις</span>
                          </div>
                        </div>
                      </div>
                      <Button variant={exercise.completed ? "outline" : "default"} size="sm">
                        {exercise.completed ? 'Ολοκληρώθηκε' : 'Έναρξη'}
                      </Button>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">{exercise.description}</p>
                    <div className="mt-3">
                      <a href="#" className="text-sm text-primary font-medium flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Προβολή βίντεο επίδειξης
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Ημερήσια Ερώτηση</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">Πώς αισθάνεστε σήμερα; Παρακαλούμε αξιολογήστε το επίπεδο του πόνου σας.</p>
              <div className="space-y-4">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Χωρίς πόνο</span>
                  <span>Ακραίος πόνος</span>
                </div>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                    <button 
                      key={level} 
                      className={`flex-1 py-2 rounded-md border ${level === 3 ? 'bg-primary text-white border-primary' : 'border-gray-300 hover:border-primary hover:bg-primary/5'}`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
                <Button className="w-full mt-2">Υποβολή</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PatientDashboard;
