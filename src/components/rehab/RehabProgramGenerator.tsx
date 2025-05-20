
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Dumbbell, Info, Loader2 } from 'lucide-react';
import RehabExerciseCard from './RehabExerciseCard';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Brand colors
const PRIMARY_COLOR = "#1B677D";
const SECONDARY_COLOR = "#90B7C2";

// Mock data for days
const createMockDay = (dayNumber: number) => {
  const date = new Date();
  date.setDate(date.getDate() + dayNumber);
  
  // Create 2-4 exercises for each day
  const numExercises = Math.floor(Math.random() * 3) + 2;
  const exercises = [];
  
  const phases = ['isometric', 'concentric', 'eccentric', 'plyometric'];
  const sources = ['Physiotutors', 'Prehab Guys', 'Adam Meakins', 'PhysioNetwork'];
  
  for (let i = 0; i < numExercises; i++) {
    exercises.push({
      id: `ex-${dayNumber}-${i}`,
      name: `Άσκηση ${i + 1} - Ημέρα ${dayNumber}`,
      sets: Math.floor(Math.random() * 3) + 1,
      reps: Math.floor(Math.random() * 10) + 5,
      phase: phases[Math.floor(Math.random() * phases.length)] as 'isometric' | 'concentric' | 'eccentric' | 'plyometric',
      difficulty: Math.floor(Math.random() * 10) + 1,
      source: sources[Math.floor(Math.random() * sources.length)],
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder video URL
    });
  }
  
  return {
    id: `day-${dayNumber}`,
    dayNumber,
    date: date.toISOString().split('T')[0],
    exercises,
    completed: false,
  };
};

const mockDays = Array.from({ length: 7 }, (_, i) => createMockDay(i));

const RehabProgramGenerator = () => {
  const [days, setDays] = useState(mockDays);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleGenerateProgram = () => {
    setIsGenerating(true);
    
    // Simulate API call to generate program
    setTimeout(() => {
      setIsGenerating(false);
      // In a real implementation, this would update with data from the AI
    }, 2000);
  };
  
  const markDayCompleted = (dayId: string) => {
    setDays(prevDays => 
      prevDays.map(day => 
        day.id === dayId ? { ...day, completed: true } : day
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold" style={{ color: PRIMARY_COLOR }}>Εβδομαδιαίο Πρόγραμμα</h2>
        <Button
          onClick={handleGenerateProgram}
          style={{ backgroundColor: SECONDARY_COLOR }}
          className="text-white hover:bg-opacity-90 w-full sm:w-auto"
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span>Δημιουργία...</span>
            </>
          ) : (
            <span>Δημιουργία Εβδομαδιαίου Προγράμματος</span>
          )}
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex justify-between items-center" style={{ color: PRIMARY_COLOR }}>
            <span>Πρόγραμμα Ασκήσεων</span>
            <Badge 
              variant="ai" 
              className="ml-2 text-xs cursor-help"
              withTooltip={true}
              tooltipText="Το περιεχόμενο παράγεται από AI με βάση τις κλινικές πληροφορίες του ασθενή"
            >
              AI-Generated
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {days.map((day, index) => (
              <AccordionItem key={day.id} value={day.id} className={day.completed ? "bg-green-50" : ""}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex justify-between items-center w-full pr-4">
                    <div className="flex items-center">
                      <Badge 
                        variant="outline" 
                        className="mr-3 flex items-center gap-1"
                        style={{ 
                          borderColor: day.completed ? '#22c55e' : SECONDARY_COLOR,
                          color: day.completed ? '#22c55e' : PRIMARY_COLOR 
                        }}
                      >
                        {day.completed ? 
                          <Check className="h-3 w-3" /> : 
                          <Dumbbell className="h-3 w-3" />
                        }
                        Ημέρα {index + 1}
                      </Badge>
                      <span className="text-sm">
                        {new Date(day.date).toLocaleDateString('el-GR', { 
                          weekday: 'long', 
                          day: '2-digit', 
                          month: 'long' 
                        })}
                      </span>
                    </div>
                    {day.completed && (
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                        Ολοκληρώθηκε
                      </Badge>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 py-2">
                    {day.exercises.map(exercise => (
                      <RehabExerciseCard key={exercise.id} exercise={exercise} />
                    ))}
                    
                    {!day.completed && (
                      <div className="flex justify-end mt-4">
                        <Button 
                          onClick={() => markDayCompleted(day.id)}
                          className="text-white"
                          style={{ backgroundColor: '#22c55e' }}
                        >
                          <Check className="mr-2 h-4 w-4" />
                          Ολοκληρώθηκε
                        </Button>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
      
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
        <div className="text-sm text-blue-700 text-center">
          <div className="flex flex-col items-center gap-2">
            <p>
              <strong>Σημείωση:</strong> Το περιεχόμενο θα παράγεται δυναμικά από εξωτερική AI λογική. 
              Θα ενεργοποιηθεί μετά την τεχνική σύνδεση με OpenAI και πηγές όπως Physiotutors, Prehab Guys και Adam Meakins.
            </p>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="link" className="text-blue-700 p-0 h-auto">
                  Μάθε περισσότερα
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="text-center" style={{ color: PRIMARY_COLOR }}>Πώς λειτουργεί η AI τεχνολογία</DialogTitle>
                </DialogHeader>
                <DialogDescription className="text-center">
                  <div className="space-y-4 py-4">
                    <p>
                      Το σύστημα AI χρησιμοποιεί δεδομένα από τις κλινικές πληροφορίες του ασθενή για να δημιουργήσει 
                      εξατομικευμένα προγράμματα αποκατάστασης.
                    </p>
                    <p>
                      Οι ασκήσεις επιλέγονται από μια βάση δεδομένων που περιέχει περιεχόμενο από αξιόπιστες πηγές όπως 
                      το Physiotutors, Prehab Guys και Adam Meakins.
                    </p>
                    <p>
                      Κάθε πρόγραμμα προσαρμόζεται στις ανάγκες του ασθενή λαμβάνοντας υπόψη παράγοντες όπως:
                    </p>
                    <ul className="list-disc list-inside text-left">
                      <li>Είδος τραυματισμού</li>
                      <li>Επίπεδο πόνου</li>
                      <li>Στάδιο αποκατάστασης</li>
                      <li>Ιστορικό προηγούμενων τραυματισμών</li>
                    </ul>
                  </div>
                </DialogDescription>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RehabProgramGenerator;
