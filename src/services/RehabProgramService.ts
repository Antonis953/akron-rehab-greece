
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

// Comprehensive validation functions
const validateAndSanitizeNumber = (value: any, min: number, max: number, defaultValue: number): number => {
  if (typeof value === 'number' && !isNaN(value) && value >= min && value <= max) {
    return value;
  }
  return defaultValue;
};

const validateAndSanitizeString = (value: any, defaultValue: string): string => {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value.trim();
  }
  return defaultValue;
};

const validatePhase = (phase: any): 'isometric' | 'concentric' | 'eccentric' | 'plyometric' => {
  const validPhases: ('isometric' | 'concentric' | 'eccentric' | 'plyometric')[] = [
    'isometric', 'concentric', 'eccentric', 'plyometric'
  ];
  
  if (typeof phase === 'string') {
    const normalizedPhase = phase.toLowerCase().trim() as 'isometric' | 'concentric' | 'eccentric' | 'plyometric';
    if (validPhases.includes(normalizedPhase)) {
      return normalizedPhase;
    }
  }
  
  return 'isometric'; // Default phase
};

// Comprehensive exercise sanitization function
const sanitizeExercise = (exercise: any, programId: string): TablesInsert<'program_exercises'> => {
  console.log('Original exercise data:', exercise);
  
  // Sanitize all fields with proper validation
  const sanitizedExercise: TablesInsert<'program_exercises'> = {
    program_id: programId,
    exercise_name: validateAndSanitizeString(exercise.name || exercise.exercise_name, 'Γενική άσκηση'),
    sets: validateAndSanitizeNumber(exercise.sets, 1, 10, 2),
    reps: validateAndSanitizeNumber(exercise.reps, 1, 50, 10),
    phase: validatePhase(exercise.phase),
    difficulty_level: validateAndSanitizeNumber(exercise.difficulty || exercise.difficulty_level, 1, 10, 1),
    pain_level: validateAndSanitizeNumber(exercise.painLevel || exercise.pain_level, 1, 10, 1),
    video_link: validateAndSanitizeString(exercise.video_link || exercise.videoUrl, '')
  };
  
  console.log('Sanitized exercise data:', sanitizedExercise);
  return sanitizedExercise;
};

// Final validation before database insertion
const validateExerciseForDatabase = (exercise: TablesInsert<'program_exercises'>): boolean => {
  // Check all required fields are present and valid
  if (!exercise.program_id || typeof exercise.program_id !== 'string') {
    console.error('Invalid program_id:', exercise.program_id);
    return false;
  }
  
  if (!exercise.exercise_name || typeof exercise.exercise_name !== 'string' || exercise.exercise_name.trim().length === 0) {
    console.error('Invalid exercise_name:', exercise.exercise_name);
    return false;
  }
  
  if (!exercise.phase || !['isometric', 'concentric', 'eccentric', 'plyometric'].includes(exercise.phase)) {
    console.error('Invalid phase:', exercise.phase);
    return false;
  }
  
  if (typeof exercise.sets !== 'number' || exercise.sets < 1 || exercise.sets > 10) {
    console.error('Invalid sets:', exercise.sets);
    return false;
  }
  
  if (typeof exercise.reps !== 'number' || exercise.reps < 1 || exercise.reps > 50) {
    console.error('Invalid reps:', exercise.reps);
    return false;
  }
  
  if (exercise.difficulty_level !== null && (typeof exercise.difficulty_level !== 'number' || exercise.difficulty_level < 1 || exercise.difficulty_level > 10)) {
    console.error('Invalid difficulty_level:', exercise.difficulty_level);
    return false;
  }
  
  if (exercise.pain_level !== null && (typeof exercise.pain_level !== 'number' || exercise.pain_level < 1 || exercise.pain_level > 10)) {
    console.error('Invalid pain_level:', exercise.pain_level);
    return false;
  }
  
  return true;
};

export const RehabProgramService = {
  /**
   * Generate a personalized rehabilitation program based on patient data
   */
  generateProgram: async (patientId: string, startDate: string): Promise<GeneratedProgram> => {
    try {
      console.log('Generating program for patient:', patientId, 'start date:', startDate);
      
      // Fetch patient data from Supabase
      const { data: patient, error } = await supabase
        .from('patients')
        .select('*')
        .eq('id', patientId)
        .single();

      if (error) {
        console.error('Error fetching patient:', error);
        throw new Error(`Αποτυχία ανάκτησης στοιχείων ασθενή: ${error.message}`);
      }

      if (!patient) {
        throw new Error('Δεν βρέθηκε ο ασθενής');
      }

      console.log('Patient data:', patient);

      // Set up patient data with defaults
      const patientData: ExtendedPatientData = patient;
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
      
      // Generate days with exercises
      const days = Array.from({ length: 7 }, (_, i) => {
        const currentDate = new Date(start);
        currentDate.setDate(start.getDate() + i);
        
        const isSessionDay = nextSessionDate && 
          currentDate.getDate() === nextSessionDate.getDate() && 
          currentDate.getMonth() === nextSessionDate.getMonth() && 
          currentDate.getFullYear() === nextSessionDate.getFullYear();
        
        // Select exercises based on affected area or use defaults
        const availableExercises = exercisesByRegion[affectedArea.toLowerCase()] || defaultExercises;
        
        // Generate 2-3 exercises per day
        const numExercises = Math.floor(Math.random() * 2) + 2; // 2-3 exercises
        const exercises = Array.from({ length: numExercises }, (_, j) => {
          const exerciseIndex = (i + j) % availableExercises.length;
          const phases: ('isometric' | 'concentric' | 'eccentric' | 'plyometric')[] = ['isometric', 'concentric', 'eccentric', 'plyometric'];
          const sources = ['Physiotutors', 'Prehab Guys', 'Adam Meakins'];
          
          // Adjust difficulty based on session day and pain level
          const dayFactor = isSessionDay ? 1 : 0.8; // Sessions days can be more challenging
          const painFactor = Math.max(1 - (painLevel / 10), 0.4); // Higher pain means lower intensity
          const adjustedDifficulty = Math.max(1, Math.min(10, Math.round(difficultyLevel * dayFactor * painFactor)));
          const adjustedPainLevel = Math.max(1, Math.min(10, Math.round(painLevel * 0.8))); // Target pain level during exercise
          
          return {
            name: availableExercises[exerciseIndex],
            sets: Math.max(1, Math.min(4, Math.round(3 * dayFactor * painFactor))),
            reps: Math.max(5, Math.min(15, Math.round(10 * dayFactor * painFactor))),
            phase: phases[Math.floor(Math.random() * phases.length)],
            difficulty: adjustedDifficulty,
            painLevel: adjustedPainLevel,
            source: sources[Math.floor(Math.random() * sources.length)]
          };
        });
        
        return {
          dayNumber: i + 1,
          date: currentDate.toISOString().split('T')[0],
          exercises,
          hasPhysiotherapistSession: isSessionDay
        };
      });
      
      console.log('Generated program successfully');
      
      return {
        summary,
        weeklyGoals,
        days
      };
    } catch (error) {
      console.error('Error generating program:', error);
      toast.error(`Σφάλμα κατά τη δημιουργία του προγράμματος: ${error instanceof Error ? error.message : 'Άγνωστο σφάλμα'}`);
      throw error;
    }
  },
  
  /**
   * Save a generated program to Supabase with comprehensive validation
   */
  saveProgram: async (patientId: string, startDate: string, notes: string, program: GeneratedProgram) => {
    try {
      console.log('Starting program save process');
      console.log('Patient ID:', patientId);
      console.log('Start Date:', startDate);
      console.log('Program:', program);
      
      // Validate input parameters
      if (!patientId || typeof patientId !== 'string') {
        throw new Error('Μη έγκυρο ID ασθενή');
      }
      
      if (!startDate || typeof startDate !== 'string') {
        throw new Error('Μη έγκυρη ημερομηνία έναρξης');
      }
      
      if (!program || !program.days || !Array.isArray(program.days)) {
        throw new Error('Μη έγκυρα δεδομένα προγράμματος');
      }
      
      // Calculate end date (start date + 6 days = 7 days total)
      const start = new Date(startDate);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      
      // Create program record
      const programInsert: TablesInsert<'programs'> = {
        patient_id: patientId,
        program_start_date: startDate,
        program_end_date: end.toISOString().split('T')[0],
        notes: notes || ''
      };
      
      console.log('Inserting program:', programInsert);
      
      // Insert program
      const { data: programData, error: programError } = await supabase
        .from('programs')
        .insert(programInsert)
        .select()
        .single();
        
      if (programError) {
        console.error('Program insertion error:', programError);
        throw new Error(`Αποτυχία δημιουργίας προγράμματος: ${programError.message}`);
      }
      
      if (!programData || !programData.id) {
        throw new Error('Δεν ελήφθησαν δεδομένα προγράμματος από τη βάση');
      }
      
      console.log('Program created with ID:', programData.id);
      
      // Prepare and validate all exercises
      const exercisesToInsert: TablesInsert<'program_exercises'>[] = [];
      
      for (const day of program.days) {
        if (!day.exercises || !Array.isArray(day.exercises)) {
          console.warn('Skipping day with invalid exercises:', day);
          continue;
        }
        
        for (const exercise of day.exercises) {
          try {
            // Sanitize and validate each exercise
            const sanitizedExercise = sanitizeExercise(exercise, programData.id);
            
            // Final validation before adding to insert array
            if (validateExerciseForDatabase(sanitizedExercise)) {
              exercisesToInsert.push(sanitizedExercise);
            } else {
              console.error('Exercise failed validation:', sanitizedExercise);
              throw new Error(`Μη έγκυρα δεδομένα άσκησης: ${sanitizedExercise.exercise_name}`);
            }
          } catch (exerciseError) {
            console.error('Error processing exercise:', exercise, exerciseError);
            throw new Error(`Σφάλμα επεξεργασίας άσκησης: ${exerciseError instanceof Error ? exerciseError.message : 'Άγνωστο σφάλμα'}`);
          }
        }
      }
      
      if (exercisesToInsert.length === 0) {
        throw new Error('Δεν υπάρχουν έγκυρες ασκήσεις για εισαγωγή');
      }
      
      console.log(`Inserting ${exercisesToInsert.length} exercises:`, exercisesToInsert);
      
      // Insert all exercises
      const { error: exercisesError } = await supabase
        .from('program_exercises')
        .insert(exercisesToInsert);
        
      if (exercisesError) {
        console.error('Exercises insertion error:', exercisesError);
        
        // Try to cleanup the created program if exercise insertion fails
        try {
          await supabase
            .from('programs')
            .delete()
            .eq('id', programData.id);
          console.log('Cleaned up program after exercise insertion failure');
        } catch (cleanupError) {
          console.error('Failed to cleanup program:', cleanupError);
        }
        
        throw new Error(`Αποτυχία αποθήκευσης ασκήσεων: ${exercisesError.message}`);
      }
      
      console.log('All exercises inserted successfully');
      
      // Show success message
      toast.success("Το πρόγραμμα αποθηκεύτηκε με επιτυχία!");
      
      return programData;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Άγνωστο σφάλμα';
      console.error('Error saving program:', error);
      toast.error(`Αποτυχία αποθήκευσης προγράμματος: ${errorMessage}`);
      throw error;
    }
  }
};

export default RehabProgramService;
