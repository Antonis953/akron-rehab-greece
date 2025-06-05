
import { Patient } from '@/types/patient';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  ProgramInsert, 
  ProgramExerciseInsert,
  ExercisePhase 
} from '@/lib/supabase/generated-types';

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
      phase: ExercisePhase;
      difficulty: number;
      painLevel: number;
      source: string;
    }[];
    hasPhysiotherapistSession: boolean;
  }[];
}

// Valid phase values as per Supabase constraint
const VALID_PHASES: ExercisePhase[] = ['isometric', 'concentric', 'eccentric', 'plyometric'];

// Enhanced sanitization function with comprehensive validation
const sanitizeExercise = (exercise: any, programId: string): ProgramExerciseInsert => {
  console.log('🔍 Sanitizing exercise input:', JSON.stringify(exercise, null, 2));
  
  // Validate program_id
  if (!programId || typeof programId !== 'string' || programId.trim().length === 0) {
    throw new Error('Μη έγκυρο program_id για την άσκηση');
  }
  
  // Validate and sanitize exercise_name - REQUIRED FIELD
  let exerciseName = 'Γενική άσκηση'; // default fallback
  if (exercise?.name) {
    exerciseName = String(exercise.name).trim();
  } else if (exercise?.exercise_name) {
    exerciseName = String(exercise.exercise_name).trim();
  }
  
  if (!exerciseName || exerciseName.length === 0) {
    exerciseName = 'Γενική άσκηση';
  }
  
  // Validate and sanitize sets (must be >= 1)
  let sets = 2; // safe default
  if (exercise?.sets !== null && exercise?.sets !== undefined) {
    const parsedSets = Number(exercise.sets);
    if (!isNaN(parsedSets) && parsedSets >= 1 && parsedSets <= 10) {
      sets = Math.floor(parsedSets); // ensure integer
    }
  }
  if (sets < 1) sets = 2; // double-check constraint
  
  // Validate and sanitize reps (must be >= 1)
  let reps = 10; // safe default
  if (exercise?.reps !== null && exercise?.reps !== undefined) {
    const parsedReps = Number(exercise.reps);
    if (!isNaN(parsedReps) && parsedReps >= 1 && parsedReps <= 50) {
      reps = Math.floor(parsedReps); // ensure integer
    }
  }
  if (reps < 1) reps = 10; // double-check constraint
  
  // Validate and sanitize phase - MUST be from valid enum
  let phase: ExercisePhase = 'isometric'; // safe default
  if (exercise?.phase && typeof exercise.phase === 'string') {
    const normalizedPhase = exercise.phase.toLowerCase().trim() as ExercisePhase;
    if (VALID_PHASES.includes(normalizedPhase)) {
      phase = normalizedPhase;
    }
  }
  
  // Validate and sanitize difficulty_level (1-10 range)
  let difficultyLevel = 1; // safe default
  const difficultyInput = exercise?.difficulty || exercise?.difficulty_level;
  if (difficultyInput !== null && difficultyInput !== undefined) {
    const parsedDifficulty = Number(difficultyInput);
    if (!isNaN(parsedDifficulty) && parsedDifficulty >= 1 && parsedDifficulty <= 10) {
      difficultyLevel = Math.floor(parsedDifficulty); // ensure integer
    }
  }
  if (difficultyLevel < 1 || difficultyLevel > 10) difficultyLevel = 1; // double-check constraint
  
  // Validate and sanitize pain_level (1-10 range)
  let painLevel = 1; // safe default
  const painInput = exercise?.painLevel || exercise?.pain_level;
  if (painInput !== null && painInput !== undefined) {
    const parsedPain = Number(painInput);
    if (!isNaN(parsedPain) && parsedPain >= 1 && parsedPain <= 10) {
      painLevel = Math.floor(parsedPain); // ensure integer
    }
  }
  if (painLevel < 1 || painLevel > 10) painLevel = 1; // double-check constraint
  
  // Validate and sanitize video_link (can be null, but not undefined)
  let videoLink: string | null = null;
  if (exercise?.video_link || exercise?.videoUrl) {
    const link = exercise.video_link || exercise.videoUrl;
    if (typeof link === 'string' && link.trim().length > 0) {
      videoLink = link.trim();
    }
  }
  
  const sanitizedExercise: ProgramExerciseInsert = {
    program_id: programId.trim(),
    exercise_name: exerciseName,
    sets: sets,
    reps: reps,
    phase: phase,
    difficulty_level: difficultyLevel,
    pain_level: painLevel,
    video_link: videoLink
  };
  
  console.log('✅ Sanitized exercise result:', JSON.stringify(sanitizedExercise, null, 2));
  
  // Final validation check
  if (!sanitizedExercise.program_id || !sanitizedExercise.exercise_name) {
    throw new Error('Κρίσιμα πεδία λείπουν μετά τη sanitization');
  }
  
  return sanitizedExercise;
};

// Enhanced program data sanitization
const sanitizeProgramInsert = (patientId: string, startDate: string, notes: string): ProgramInsert => {
  console.log('🔍 Sanitizing program input:', { patientId, startDate, notes });
  
  // Validate patient_id
  if (!patientId || typeof patientId !== 'string' || patientId.trim().length === 0) {
    throw new Error('Μη έγκυρο patient_id');
  }
  
  // Validate start date
  if (!startDate || typeof startDate !== 'string' || startDate.trim().length === 0) {
    throw new Error('Μη έγκυρη ημερομηνία έναρξης');
  }
  
  // Validate date format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(startDate.trim())) {
    throw new Error('Μη έγκυρη μορφή ημερομηνίας (πρέπει να είναι YYYY-MM-DD)');
  }
  
  // Calculate end date (start date + 6 days = 7 days total)
  const start = new Date(startDate.trim());
  if (isNaN(start.getTime())) {
    throw new Error('Μη έγκυρη ημερομηνία έναρξης');
  }
  
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  
  const sanitizedProgram: ProgramInsert = {
    patient_id: patientId.trim(),
    program_start_date: startDate.trim(),
    program_end_date: end.toISOString().split('T')[0],
    notes: notes && notes.trim().length > 0 ? notes.trim() : null
  };
  
  console.log('✅ Sanitized program result:', JSON.stringify(sanitizedProgram, null, 2));
  return sanitizedProgram;
};

export const RehabProgramService = {
  /**
   * Generate a personalized rehabilitation program based on patient data
   */
  generateProgram: async (patientId: string, startDate: string): Promise<GeneratedProgram> => {
    try {
      console.log('🚀 Generating program for patient:', patientId, 'start date:', startDate);
      
      // Fetch patient data from Supabase
      const { data: patient, error } = await supabase
        .from('patients')
        .select('*')
        .eq('id', patientId)
        .single();

      if (error) {
        console.error('❌ Error fetching patient:', error);
        throw new Error(`Αποτυχία ανάκτησης στοιχείων ασθενή: ${error.message}`);
      }

      if (!patient) {
        throw new Error('Δεν βρέθηκε ο ασθενής');
      }

      console.log('👤 Patient data:', patient);

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
          const phases: ExercisePhase[] = ['isometric', 'concentric', 'eccentric', 'plyometric'];
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
      
      console.log('✅ Generated program successfully');
      
      return {
        summary,
        weeklyGoals,
        days
      };
    } catch (error) {
      console.error('❌ Error generating program:', error);
      toast.error(`Σφάλμα κατά τη δημιουργία του προγράμματος: ${error instanceof Error ? error.message : 'Άγνωστο σφάλμα'}`);
      throw error;
    }
  },
  
  /**
   * Save a generated program to Supabase with comprehensive validation
   */
  saveProgram: async (patientId: string, startDate: string, notes: string, program: GeneratedProgram) => {
    try {
      console.log('🚀 Starting program save process');
      console.log('📝 Input parameters:', { 
        patientId: patientId, 
        startDate: startDate, 
        notesLength: notes?.length || 0,
        programStructure: {
          summary: program?.summary?.length || 0,
          weeklyGoals: program?.weeklyGoals?.length || 0,
          days: program?.days?.length || 0
        }
      });
      
      // Input validation
      if (!program || typeof program !== 'object') {
        throw new Error('Μη έγκυρα δεδομένα προγράμματος');
      }
      
      if (!program.days || !Array.isArray(program.days) || program.days.length === 0) {
        throw new Error('Το πρόγραμμα πρέπει να περιέχει τουλάχιστον μία ημέρα');
      }
      
      // Sanitize program data
      const programInsert = sanitizeProgramInsert(patientId, startDate, notes);
      
      console.log('📤 Inserting program with data:', JSON.stringify(programInsert, null, 2));
      
      // Insert program
      const { data: programData, error: programError } = await supabase
        .from('programs')
        .insert(programInsert)
        .select()
        .single();
        
      if (programError) {
        console.error('❌ Program insertion error:', programError);
        console.error('❌ Failed program data:', JSON.stringify(programInsert, null, 2));
        throw new Error(`Αποτυχία δημιουργίας προγράμματος: ${programError.message}`);
      }
      
      if (!programData || !programData.id) {
        throw new Error('Δεν ελήφθησαν δεδομένα προγράμματος από τη βάση');
      }
      
      console.log('✅ Program created successfully with ID:', programData.id);
      
      // Prepare and sanitize all exercises
      const exercisesToInsert: ProgramExerciseInsert[] = [];
      let totalExercises = 0;
      
      for (let dayIndex = 0; dayIndex < program.days.length; dayIndex++) {
        const day = program.days[dayIndex];
        
        if (!day || typeof day !== 'object') {
          console.warn(`⚠️ Skipping invalid day at index ${dayIndex}:`, day);
          continue;
        }
        
        if (!day.exercises || !Array.isArray(day.exercises)) {
          console.warn(`⚠️ Day ${dayIndex + 1} has no valid exercises:`, day);
          continue;
        }
        
        console.log(`📋 Processing day ${dayIndex + 1} with ${day.exercises.length} exercises`);
        
        for (let exerciseIndex = 0; exerciseIndex < day.exercises.length; exerciseIndex++) {
          const exercise = day.exercises[exerciseIndex];
          totalExercises++;
          
          try {
            console.log(`🔄 Processing exercise ${totalExercises}:`, JSON.stringify(exercise, null, 2));
            
            // Sanitize each exercise with robust validation
            const sanitizedExercise = sanitizeExercise(exercise, programData.id);
            exercisesToInsert.push(sanitizedExercise);
            console.log(`✅ Exercise ${totalExercises} sanitized successfully`);
          } catch (exerciseError) {
            const errorMsg = `Σφάλμα επεξεργασίας άσκησης ${totalExercises}: ${exerciseError instanceof Error ? exerciseError.message : 'Άγνωστο σφάλμα'}`;
            console.error(`❌ ${errorMsg}`, { 
              day: dayIndex + 1, 
              exercise: exerciseIndex + 1, 
              data: exercise,
              error: exerciseError 
            });
            throw new Error(errorMsg);
          }
        }
      }
      
      if (exercisesToInsert.length === 0) {
        throw new Error('Δεν υπάρχουν έγκυρες ασκήσεις για εισαγωγή στο πρόγραμμα');
      }
      
      console.log(`📦 Prepared ${exercisesToInsert.length} exercises for insertion`);
      console.log('🔍 Sample exercises to insert:', JSON.stringify(exercisesToInsert.slice(0, 2), null, 2));
      console.log('📤 All exercises to insert:', JSON.stringify(exercisesToInsert, null, 2));
      
      // Insert all exercises in a single operation
      const { error: exercisesError } = await supabase
        .from('program_exercises')
        .insert(exercisesToInsert);
        
      if (exercisesError) {
        console.error('❌ Exercises insertion error:', exercisesError);
        console.error('❌ Failed exercises data:', JSON.stringify(exercisesToInsert, null, 2));
        
        // Try to cleanup the created program if exercise insertion fails
        try {
          const { error: cleanupError } = await supabase
            .from('programs')
            .delete()
            .eq('id', programData.id);
            
          if (cleanupError) {
            console.error('❌ Failed to cleanup program after exercise insertion failure:', cleanupError);
          } else {
            console.log('🧹 Successfully cleaned up program after exercise insertion failure');
          }
        } catch (cleanupError) {
          console.error('❌ Exception during program cleanup:', cleanupError);
        }
        
        toast.error(`Σφάλμα κατά την αποθήκευση προγράμματος: ${exercisesError.message}`);
        throw new Error(`Αποτυχία αποθήκευσης ασκήσεων: ${exercisesError.message}`);
      }
      
      console.log(`✅ Successfully inserted all ${exercisesToInsert.length} exercises`);
      
      // Show success message
      toast.success(`Το πρόγραμμα αποθηκεύτηκε με επιτυχία! (${exercisesToInsert.length} ασκήσεις)`);
      
      return programData;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Άγνωστο σφάλμα αποθήκευσης';
      console.error('❌ Error in saveProgram:', error);
      console.error('❌ Full error details:', JSON.stringify(error, null, 2));
      toast.error(`Σφάλμα κατά την αποθήκευση προγράμματος: ${errorMessage}`);
      throw error;
    }
  }
};

export default RehabProgramService;
