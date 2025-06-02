import { Patient } from '@/types/patient';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { TablesInsert } from '@/lib/supabase/types';

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

// Function to sanitize exercise data before saving to database
const sanitizeExercise = (exercise: any) => {
  // Define valid phases and ensure they match database expectations exactly
  const validPhases = ['isometric', 'concentric', 'eccentric', 'plyometric'];
  
  // Get the phase from the exercise, convert to lowercase for case-insensitive comparison
  const phaseInput = exercise.phase ? String(exercise.phase).toLowerCase() : '';
  
  // Validate if the phase is among valid phases, default to 'isometric' if not
  const phase = validPhases.includes(phaseInput) ? phaseInput : 'isometric';
  
  return {
    exercise_name: exercise.name || 'Γενική άσκηση',
    sets: typeof exercise.sets === 'number' && exercise.sets >= 1 ? exercise.sets : 2,
    reps: typeof exercise.reps === 'number' && exercise.reps >= 1 ? exercise.reps : 10,
    phase: phase,
    difficulty_level: typeof exercise.difficulty === 'number' && exercise.difficulty >= 1 && exercise.difficulty <= 10 
      ? exercise.difficulty 
      : 1,
    pain_level: typeof exercise.painLevel === 'number' && exercise.painLevel >= 1 && exercise.painLevel <= 10 
      ? exercise.painLevel 
      : 1,
    video_link: exercise.video_link || 'https://youtube.com/placeholder'
  };
};

// Helper function to validate an exercise object
const isValidExercise = (exercise: any): boolean => {
  return (
    exercise && 
    typeof exercise.exercise_name === 'string' && 
    exercise.exercise_name.length > 0 && 
    typeof exercise.sets === 'number' && 
    typeof exercise.reps === 'number' &&
    typeof exercise.phase === 'string' &&
    typeof exercise.difficulty_level === 'number' && 
    typeof exercise.pain_level === 'number'
  );
};

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
      const programInsert: TablesInsert<'programs'> = {
        patient_id: patientId,
        program_start_date: startDate,
        program_end_date: end.toISOString().split('T')[0],
        notes
      };
      
      const { data: programData, error: programError } = await supabase
        .from('programs')
        .insert(programInsert)
        .select()
        .single();
        
      if (programError) throw programError;
      
      if (!programData) {
        throw new Error('Program creation failed - no data returned');
      }
      
      // Prepare exercise data for insertion with full validation
      const exercisesToInsert: TablesInsert<'program_exercises'>[] = program.days.flatMap(day => 
        day.exercises.map(exercise => {
          // Apply comprehensive sanitization to each exercise
          const sanitizedExercise = sanitizeExercise({
            ...exercise,
            program_id: programData.id,
          });
          
          return {
            program_id: programData.id,
            ...sanitizedExercise
          };
        })
      );
      
      // Console log for debugging
      console.log('Inserting exercises:', exercisesToInsert);
      
      // Validate all exercises before insertion
      const allExercisesValid = exercisesToInsert.every(ex => isValidExercise(ex));
      
      if (!allExercisesValid) {
        console.error('Some exercises are invalid:', exercisesToInsert);
        toast.error("Αποτυχία αποθήκευσης προγράμματος. Ελέγξτε τα δεδομένα.");
        throw new Error("Invalid exercise data detected");
      }
      
      // Insert exercises
      try {
        const { error: exercisesError } = await supabase
          .from('program_exercises')
          .insert(exercisesToInsert);
          
        if (exercisesError) {
          console.error('Error inserting exercises:', exercisesError);
          toast.error("Αποτυχία αποθήκευσης προγράμματος. Ελέγξτε τα δεδομένα.");
          throw exercisesError;
        }
        
        // Show success toast
        toast.success("Το πρόγραμμα αποθηκεύτηκε με επιτυχία.");
        
        return programData;
      } catch (insertError) {
        console.error('Error during exercise insertion:', insertError);
        toast.error("Αποτυχία αποθήκευσης προγράμματος. Ελέγξτε τα δεδομένα.");
        throw insertError;
      }
    } catch (error) {
      console.error('Error saving program:', error);
      toast.error("Αποτυχία αποθήκευσης προγράμματος. Ελέγξτε τα δεδομένα.");
      throw error;
    }
  }
};

export default RehabProgramService;
