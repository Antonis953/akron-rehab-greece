
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
import { Check, Loader2 } from 'lucide-react';
import RehabExerciseCard from './RehabExerciseCard';

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
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold" style={{ color: PRIMARY_COLOR }}>Εβδομαδιαίο Πρόγραμμα</h2>
        <Button
          onClick={handleGenerateProgram}
          style={{ backgroundColor: SECONDARY_COLOR }}
          className="text-white hover:bg-opacity-90"
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
            <Badge variant="outline" className="ml-2 text-xs">AI-Generated</Badge>
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
                        className="mr-3"
                        style={{ 
                          borderColor: day.completed ? '#22c55e' : SECONDARY_COLOR,
                          color: day.completed ? '#22c55e' : PRIMARY_COLOR 
                        }}
                      >
                        {day.completed && <Check className="h-3 w-3 mr-1" />}
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
    </div>
  );
};

export default RehabProgramGenerator;
