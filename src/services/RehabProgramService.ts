
import { Patient } from '@/types/patient';
import { supabase } from '@/integrations/supabase/client';

// Example exercise categories based on body regions
const exercisesByRegion: Record<string, string[]> = {
  'back': ['Ασκήσεις σταθεροποίησης κορμού', 'Διατάσεις οσφυϊκής μοίρας', 'Ενδυνάμωση ραχιαίων μυών'],
  'knee': ['Ισομετρικές ασκήσεις τετρακεφάλου', 'Ασκήσεις εύρους κίνησης γόνατος', 'Ενδυνάμωση τετρακεφάλου'],
  'shoulder': ['Ασκήσεις κινητικότητας ώμου', 'Ασκήσεις σταθεροποίησης ωμοπλάτης', 'Ενδυνάμωση στροφικού πετάλου'],
  'neck': ['Ισομετρικές ασκήσεις αυχένα', 'Διατάσεις αυχενικών μυών', 'Ασκήσεις κινητικότητας αυχένα'],
  'ankle': ['Ασκήσεις κινητικότητας ποδοκνημικής', 'Ασκήσεις ιδιοδεκτικότητας', 'Ενδυνάμωση περονιαίων'],
  'hip': ['Ασκήσεις κινητικότητας ισχίου', 'Ενδυνάμωση απαγωγών', 'Διατάσεις καμπτήρων ισχίου'],
};

// Default exercises for when specific region data is missing
const defaultExercises = [
  'Ήπιες διατάσεις', 
  'Ασκήσεις αναπνοής και χαλάρωσης', 
  'Ασκήσεις κινητικότητας χαμηλής έντασης'
];

export interface ExtendedPatientData extends Patient {
  affected_area?: string;
  symptom_description?: string;
  pain_level?: number;
  difficulty_level?: number;
  symptom_start_date?: string;
  aggravating_factors?: string;
  relieving_factors?: string;
  functional_limitations?: string;
  treatment_history?: string;
  rehab_goals?: string;
  activity_level?: string;
  occupation?: string;
}

export interface GeneratedProgram {
  summary: string;
  weeklyGoals: string[];
  days: {
    dayNumber: number;
    date: string;
    exercises: {
      name: string;
      sets: number;
      reps: number;
      phase: 'isometric' | 'concentric' | 'eccentric' | 'plyometric';
      difficulty: number;
      painLevel: number;
      source: string;
    }[];
    hasPhysiotherapistSession: boolean;
  }[];
}

export const RehabProgramService = {
  /**
   * Generate a personalized rehabilitation program based on patient data
   * This is a placeholder implementation that will be replaced with OpenAI integration
   */
  generateProgram: async (patientId: string, startDate: string): Promise<GeneratedProgram> => {
    try {
      // Fetch patient data from Supabase
      const { data: patient, error } = await supabase
        .from('patients')
        .select('*')
        .eq('id', patientId)
        .single();

      if (error) throw error;

      // In a real implementation, we would fetch all the extended patient data
      // This is a placeholder until the full data model is implemented
      const patientData: ExtendedPatientData = patient;

      // Set default values for missing fields
      const painLevel = patientData.pain_level || 5;
      const difficultyLevel = patientData.difficulty_level || 4;
      const affectedArea = patientData.affected_area || 'general';
      
      // Create date objects for program
      const start = new Date(startDate);
      const nextSessionDate = patientData.next_session_date ? new Date(patientData.next_session_date) : null;
      
      // Generate program summary
      const summary = `Εβδομαδιαίο πρόγραμμα αποκατάστασης για τον/την ${patientData.full_name}. ${
        affectedArea !== 'general' 
          ? `Εστιάζει στην περιοχή: ${affectedArea} με επίπεδο πόνου ${painLevel}/10.` 
          : 'Εστιάζει σε γενική ενδυνάμωση και κινητικότητα.'
      } Σχεδιασμένο με βάση την τρέχουσα κατάσταση και τους προσωπικούς στόχους του ασθενή.`;
      
      // Generate weekly goals
      const weeklyGoals = [
        'Μείωση του πόνου κατά τουλάχιστον 1-2 μονάδες στην κλίμακα 1-10',
        'Βελτίωση της λειτουργικότητας στις καθημερινές δραστηριότητες',
        'Αύξηση του εύρους κίνησης της προβληματικής περιοχής'
      ];
      
      // Generate days
      const days = Array.from({ length: 7 }, (_, i) => {
        const currentDate = new Date(start);
        currentDate.setDate(start.getDate() + i);
        
        const isSessionDay = nextSessionDate && 
          currentDate.getDate() === nextSessionDate.getDate() && 
          currentDate.getMonth() === nextSessionDate.getMonth() && 
          currentDate.getFullYear() === nextSessionDate.getFullYear();
        
        // Select exercises based on affected area or use defaults
        const availableExercises = exercisesByRegion[affectedArea.toLowerCase()] || defaultExercises;
        
        // Generate 1-3 exercises
        const numExercises = Math.floor(Math.random() * 2) + 1; // 1-3 exercises
        const exercises = Array.from({ length: numExercises }, (_, j) => {
          const exerciseIndex = (i + j) % availableExercises.length;
          const phases = ['isometric', 'concentric', 'eccentric', 'plyometric'];
          const sources = ['Physiotutors', 'Prehab Guys', 'Adam Meakins'];
          
          // Adjust difficulty based on session day and pain level
          const dayFactor = isSessionDay ? 1 : 0.7; // Sessions days can be more challenging
          const painFactor = Math.max(1 - (painLevel / 10), 0.3); // Higher pain means lower intensity
          const adjustedDifficulty = Math.max(2, Math.min(10, Math.round(difficultyLevel * dayFactor * painFactor)));
          
          const exercise = {
            name: availableExercises[exerciseIndex],
            sets: Math.max(1, Math.min(4, Math.round(3 * dayFactor * painFactor))),
            reps: Math.max(5, Math.min(15, Math.round(10 * dayFactor * painFactor))),
            phase: phases[Math.floor(Math.random() * phases.length)] as 'isometric' | 'concentric' | 'eccentric' | 'plyometric',
            difficulty: adjustedDifficulty,
            painLevel: Math.max(1, Math.min(painLevel - 1, 8)), // Target pain level during exercise
            source: sources[Math.floor(Math.random() * sources.length)]
          };

          // Ensure default values are set
          if (!exercise.painLevel) exercise.painLevel = 1;
          if (!exercise.difficulty) exercise.difficulty = 1;
          if (!exercise.phase) exercise.phase = 'isometric';
          
          return exercise;
        });
        
        return {
          dayNumber: i + 1,
          date: currentDate.toISOString().split('T')[0],
          exercises,
          hasPhysiotherapistSession: isSessionDay
        };
      });
      
      return {
        summary,
        weeklyGoals,
        days
      };
    } catch (error) {
      console.error('Error generating program:', error);
      throw error;
    }
  },
  
  /**
   * Save a generated program to Supabase
   */
  saveProgram: async (patientId: string, startDate: string, notes: string, program: GeneratedProgram) => {
    try {
      // Calculate end date (start date + 6 days = 7 days total)
      const start = new Date(startDate);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      
      // Insert program
      const { data: programData, error: programError } = await supabase
        .from('programs')
        .insert({
          patient_id: patientId,
          program_start_date: startDate,
          program_end_date: end.toISOString().split('T')[0],
          notes
        })
        .select()
        .single();
        
      if (programError) throw programError;
      
      // Insert exercises
      const exercisesToInsert = program.days.flatMap(day => 
        day.exercises.map(exercise => ({
          program_id: programData.id,
          exercise_name: exercise.name,
          sets: exercise.sets,
          reps: exercise.reps,
          phase: exercise.phase,
          difficulty_level: exercise.difficulty,
          pain_level: exercise.painLevel || 1, // Ensure default values
          video_link: 'https://www.youtube.com/embed/dQw4w9WgXcQ' // Placeholder
        }))
      );
      
      const { error: exercisesError } = await supabase
        .from('program_exercises')
        .insert(exercisesToInsert);
        
      if (exercisesError) throw exercisesError;
      
      return programData;
    } catch (error) {
      console.error('Error saving program:', error);
      throw error;
    }
  }
};

export default RehabProgramService;
