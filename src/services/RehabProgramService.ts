
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

// Valid phase values as per Supabase constraint
const VALID_PHASES = ['isometric', 'concentric', 'eccentric', 'plyometric'] as const;
type ValidPhase = typeof VALID_PHASES[number];

// Sanitization function for exercise data
const sanitizeExercise = (exercise: any, programId: string): TablesInsert<'program_exercises'> => {
  console.log('Sanitizing exercise:', exercise);
  
  // Validate and sanitize exercise_name
  const exerciseName = exercise?.name || exercise?.exercise_name || 'Γενική άσκηση';
  const sanitizedName = typeof exerciseName === 'string' && exerciseName.trim() 
    ? exerciseName.trim() 
    : 'Γενική άσκηση';

  // Validate and sanitize sets (1-10)
  let sets = 2; // default
  if (exercise?.sets !== null && exercise?.sets !== undefined) {
    const parsedSets = Number(exercise.sets);
    if (!isNaN(parsedSets) && parsedSets >= 1 && parsedSets <= 10) {
      sets = Math.round(parsedSets);
    }
  }

  // Validate and sanitize reps (1-50)
  let reps = 10; // default
  if (exercise?.reps !== null && exercise?.reps !== undefined) {
    const parsedReps = Number(exercise.reps);
    if (!isNaN(parsedReps) && parsedReps >= 1 && parsedReps <= 50) {
      reps = Math.round(parsedReps);
    }
  }

  // Validate and sanitize phase - must be exact match from valid phases
  let phase: ValidPhase = 'isometric'; // default
  if (exercise?.phase && typeof exercise.phase === 'string') {
    const normalizedPhase = exercise.phase.toLowerCase().trim() as ValidPhase;
    if (VALID_PHASES.includes(normalizedPhase)) {
      phase = normalizedPhase;
    }
  }

  // Validate and sanitize difficulty_level (1-10)
  let difficultyLevel = 1; // default
  const difficultyInput = exercise?.difficulty || exercise?.difficulty_level;
  if (difficultyInput !== null && difficultyInput !== undefined) {
    const parsedDifficulty = Number(difficultyInput);
    if (!isNaN(parsedDifficulty) && parsedDifficulty >= 1 && parsedDifficulty <= 10) {
      difficultyLevel = Math.round(parsedDifficulty);
    }
  }

  // Validate and sanitize pain_level (1-10)
  let painLevel = 1; // default
  const painInput = exercise?.painLevel || exercise?.pain_level;
  if (painInput !== null && painInput !== undefined) {
    const parsedPain = Number(painInput);
    if (!isNaN(parsedPain) && parsedPain >= 1 && parsedPain <= 10) {
      painLevel = Math.round(parsedPain);
    }
  }

  // Validate and sanitize video_link
  let videoLink = '';
  if (exercise?.video_link || exercise?.videoUrl) {
    const link = exercise.video_link || exercise.videoUrl;
    if (typeof link === 'string') {
      videoLink = link.trim();
    }
  }

  const sanitizedExercise: TablesInsert<'program_exercises'> = {
    program_id: programId,
    exercise_name: sanitizedName,
    sets: sets,
    reps: reps,
    phase: phase,
    difficulty_level: difficultyLevel,
    pain_level: painLevel,
    video_link: videoLink || null
  };

  console.log('Sanitized exercise result:', sanitizedExercise);
  return sanitizedExercise;
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
      console.log('Program structure:', {
        summary: program.summary?.length || 0,
        weeklyGoals: program.weeklyGoals?.length || 0,
        days: program.days?.length || 0
      });
      
      // Input validation
      if (!patientId || typeof patientId !== 'string' || patientId.trim().length === 0) {
        throw new Error('Μη έγκυρο ID ασθενή');
      }
      
      if (!startDate || typeof startDate !== 'string' || startDate.trim().length === 0) {
        throw new Error('Μη έγκυρη ημερομηνία έναρξης');
      }
      
      // Validate date format
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(startDate)) {
        throw new Error('Μη έγκυρη μορφή ημερομηνίας (πρέπει να είναι YYYY-MM-DD)');
      }
      
      if (!program || typeof program !== 'object') {
        throw new Error('Μη έγκυρα δεδομένα προγράμματος');
      }
      
      if (!program.days || !Array.isArray(program.days) || program.days.length === 0) {
        throw new Error('Το πρόγραμμα πρέπει να περιέχει τουλάχιστον μία ημέρα');
      }
      
      // Calculate end date (start date + 6 days = 7 days total)
      const start = new Date(startDate);
      if (isNaN(start.getTime())) {
        throw new Error('Μη έγκυρη ημερομηνία έναρξης');
      }
      
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      
      // Create program record
      const programInsert: TablesInsert<'programs'> = {
        patient_id: patientId.trim(),
        program_start_date: startDate.trim(),
        program_end_date: end.toISOString().split('T')[0],
        notes: notes ? notes.trim() : null
      };
      
      console.log('Inserting program with data:', programInsert);
      
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
      
      console.log('Program created successfully with ID:', programData.id);
      
      // Prepare and sanitize all exercises
      const exercisesToInsert: TablesInsert<'program_exercises'>[] = [];
      let totalExercises = 0;
      
      for (let dayIndex = 0; dayIndex < program.days.length; dayIndex++) {
        const day = program.days[dayIndex];
        
        if (!day || typeof day !== 'object') {
          console.warn(`Skipping invalid day at index ${dayIndex}:`, day);
          continue;
        }
        
        if (!day.exercises || !Array.isArray(day.exercises)) {
          console.warn(`Day ${dayIndex + 1} has no valid exercises:`, day);
          continue;
        }
        
        for (let exerciseIndex = 0; exerciseIndex < day.exercises.length; exerciseIndex++) {
          const exercise = day.exercises[exerciseIndex];
          totalExercises++;
          
          try {
            // Sanitize each exercise with robust validation
            const sanitizedExercise = sanitizeExercise(exercise, programData.id);
            exercisesToInsert.push(sanitizedExercise);
            console.log(`✓ Exercise ${totalExercises} sanitized successfully`);
          } catch (exerciseError) {
            const errorMsg = `Σφάλμα επεξεργασίας άσκησης ${totalExercises}: ${exerciseError instanceof Error ? exerciseError.message : 'Άγνωστο σφάλμα'}`;
            console.error(errorMsg, { day: dayIndex + 1, exercise: exerciseIndex + 1, data: exercise });
            throw new Error(errorMsg);
          }
        }
      }
      
      if (exercisesToInsert.length === 0) {
        throw new Error('Δεν υπάρχουν έγκυρες ασκήσεις για εισαγωγή στο πρόγραμμα');
      }
      
      console.log(`Prepared ${exercisesToInsert.length} exercises for insertion`);
      console.log('Sample exercises to insert:', exercisesToInsert.slice(0, 2));
      
      // Insert all exercises in a single operation
      const { error: exercisesError } = await supabase
        .from('program_exercises')
        .insert(exercisesToInsert);
        
      if (exercisesError) {
        console.error('Exercises insertion error:', exercisesError);
        console.error('Failed exercises data:', exercisesToInsert);
        
        // Try to cleanup the created program if exercise insertion fails
        try {
          const { error: cleanupError } = await supabase
            .from('programs')
            .delete()
            .eq('id', programData.id);
            
          if (cleanupError) {
            console.error('Failed to cleanup program after exercise insertion failure:', cleanupError);
          } else {
            console.log('Successfully cleaned up program after exercise insertion failure');
          }
        } catch (cleanupError) {
          console.error('Exception during program cleanup:', cleanupError);
        }
        
        toast.error(`Αποτυχία αποθήκευσης προγράμματος: ${exercisesError.message}`);
        throw new Error(`Αποτυχία αποθήκευσης ασκήσεων: ${exercisesError.message}`);
      }
      
      console.log(`✅ Successfully inserted all ${exercisesToInsert.length} exercises`);
      
      // Show success message
      toast.success(`Το πρόγραμμα αποθηκεύτηκε με επιτυχία! (${exercisesToInsert.length} ασκήσεις)`);
      
      return programData;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Άγνωστο σφάλμα αποθήκευσης';
      console.error('Error in saveProgram:', error);
      toast.error(`Αποτυχία αποθήκευσης προγράμματος: ${errorMessage}`);
      throw error;
    }
  }
};

export default RehabProgramService;
