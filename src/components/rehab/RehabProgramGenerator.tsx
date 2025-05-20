
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Dumbbell, Info, Loader2, Calendar } from 'lucide-react';
import RehabExerciseCard from './RehabExerciseCard';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from 'sonner';
import { RehabDay, RehabExercise } from '@/types/patient';
import RehabProgramService, { GeneratedProgram } from '@/services/RehabProgramService';

// Brand colors
const PRIMARY_COLOR = "#1B677D";
const SECONDARY_COLOR = "#90B7C2";

interface RehabProgramGeneratorProps {
  patientId: string;
  startDate: string;
  onProgramGenerated?: (program: GeneratedProgram) => void;
}

const RehabProgramGenerator: React.FC<RehabProgramGeneratorProps> = ({ 
  patientId, 
  startDate,
  onProgramGenerated
}) => {
  const [days, setDays] = useState<RehabDay[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [programSummary, setProgramSummary] = useState<string>('');
  const [weeklyGoals, setWeeklyGoals] = useState<string[]>([]);

  const handleGenerateProgram = async () => {
    if (!patientId || !startDate) {
      toast.error('Δεν έχουν οριστεί όλες οι απαραίτητες πληροφορίες');
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Generate program using our service
      const program = await RehabProgramService.generateProgram(patientId, startDate);
      
      // Transform the generated program to match our UI structure
      const transformedDays: RehabDay[] = program.days.map(day => {
        const transformedExercises: RehabExercise[] = day.exercises.map((exercise, index) => ({
          id: `ex-${day.dayNumber}-${index}`,
          name: exercise.name,
          sets: exercise.sets,
          reps: exercise.reps,
          phase: exercise.phase,
          difficulty: exercise.difficulty,
          source: exercise.source,
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder
        }));
        
        return {
          id: `day-${day.dayNumber}`,
          dayNumber: day.dayNumber,
          date: day.date,
          exercises: transformedExercises,
          completed: false,
          hasPhysiotherapistSession: day.hasPhysiotherapistSession,
        };
      });
      
      // Update state
      setDays(transformedDays);
      setProgramSummary(program.summary);
      setWeeklyGoals(program.weeklyGoals);
      
      // Notify parent component
      if (onProgramGenerated) {
        onProgramGenerated(program);
      }
      
      toast.success('Το πρόγραμμα δημιουργήθηκε με επιτυχία!');
    } catch (error) {
      console.error('Error generating program:', error);
      toast.error('Σφάλμα κατά τη δημιουργία του προγράμματος');
    } finally {
      setIsGenerating(false);
    }
  };
  
  const markDayCompleted = (dayId: string) => {
    setDays(prevDays => 
      prevDays.map(day => 
        day.id === dayId ? { ...day, completed: true } : day
      )
    );
  };

  // If patientId or startDate changes, we should clear the current program
  useEffect(() => {
    setDays([]);
    setProgramSummary('');
    setWeeklyGoals([]);
  }, [patientId, startDate]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold" style={{ color: PRIMARY_COLOR }}>Εβδομαδιαίο Πρόγραμμα</h2>
        <Button
          onClick={handleGenerateProgram}
          style={{ backgroundColor: SECONDARY_COLOR }}
          className="text-white hover:bg-opacity-90 w-full sm:w-auto"
          disabled={isGenerating || !patientId || !startDate}
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
      
      {programSummary && (
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="font-semibold mb-2" style={{ color: PRIMARY_COLOR }}>Σύνοψη</h3>
          <p className="text-sm text-gray-700">{programSummary}</p>
          
          {weeklyGoals.length > 0 && (
            <div className="mt-3">
              <h4 className="font-semibold mb-1 text-sm" style={{ color: PRIMARY_COLOR }}>Εβδομαδιαίοι Στόχοι</h4>
              <ul className="list-disc list-inside text-sm text-gray-700">
                {weeklyGoals.map((goal, index) => (
                  <li key={index}>{goal}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg" style={{ color: PRIMARY_COLOR }}>
            Πρόγραμμα Ασκήσεων
          </CardTitle>
          <Badge 
            variant="ai" 
            className="text-xs cursor-help"
            withTooltip={true}
            tooltipText="Το περιεχόμενο παράγεται από AI με βάση τις κλινικές πληροφορίες του ασθενή"
          >
            AI-Generated
          </Badge>
        </CardHeader>
        <CardContent>
          {days.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {days.map((day) => (
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
                          Ημέρα {day.dayNumber}
                        </Badge>
                        <span className="text-sm">
                          {new Date(day.date).toLocaleDateString('el-GR', { 
                            weekday: 'long', 
                            day: '2-digit', 
                            month: 'long' 
                          })}
                        </span>
                        
                        {day.hasPhysiotherapistSession && (
                          <Badge className="ml-2 bg-blue-100 text-blue-800 border-blue-200">
                            <Calendar className="h-3 w-3 mr-1" />
                            Συνεδρία
                          </Badge>
                        )}
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
          ) : (
            <div className="text-center py-8">
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-gray-100 p-3">
                  <Dumbbell className="h-8 w-8 text-gray-400" />
                </div>
              </div>
              <h3 className="text-lg font-medium mb-2" style={{ color: PRIMARY_COLOR }}>
                Δεν υπάρχει πρόγραμμα ασκήσεων
              </h3>
              <p className="text-sm text-gray-500 max-w-md mx-auto mb-4">
                Πατήστε το κουμπί "Δημιουργία Εβδομαδιαίου Προγράμματος" για να δημιουργήσετε ένα
                εξατομικευμένο πρόγραμμα για τον ασθενή με βάση τα στοιχεία του.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
        <div className="text-sm text-blue-700 text-center">
          <div className="flex flex-col items-center gap-2">
            <p>
              <strong>Σημείωση:</strong> Το περιεχόμενο παράγεται δυναμικά από εξωτερική AI λογική. 
              Θα ενεργοποιηθεί πλήρως μετά την τεχνική σύνδεση με OpenAI και πηγές όπως Physiotutors, Prehab Guys και Adam Meakins.
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
