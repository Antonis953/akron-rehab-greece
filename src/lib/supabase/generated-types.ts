
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      patients: {
        Row: {
          id: string
          full_name: string
          email: string
          phone: string | null
          next_session_date: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          full_name: string
          email: string
          phone?: string | null
          next_session_date?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          full_name?: string
          email?: string
          phone?: string | null
          next_session_date?: string | null
          created_at?: string | null
        }
        Relationships: []
      }
      programs: {
        Row: {
          id: string
          patient_id: string | null
          program_start_date: string
          program_end_date: string | null
          notes: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          patient_id?: string | null
          program_start_date: string
          program_end_date?: string | null
          notes?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          patient_id?: string | null
          program_start_date?: string
          program_end_date?: string | null
          notes?: string | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "programs_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          }
        ]
      }
      program_exercises: {
        Row: {
          id: string
          program_id: string | null
          exercise_name: string
          sets: number | null
          reps: number | null
          phase: 'isometric' | 'concentric' | 'eccentric' | 'plyometric' | null
          difficulty_level: number | null
          pain_level: number | null
          video_link: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          program_id?: string | null
          exercise_name: string
          sets?: number | null
          reps?: number | null
          phase?: 'isometric' | 'concentric' | 'eccentric' | 'plyometric' | null
          difficulty_level?: number | null
          pain_level?: number | null
          video_link?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          program_id?: string | null
          exercise_name?: string
          sets?: number | null
          reps?: number | null
          phase?: 'isometric' | 'concentric' | 'eccentric' | 'plyometric' | null
          difficulty_level?: number | null
          pain_level?: number | null
          video_link?: string | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "program_exercises_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      exercise_phase: 'isometric' | 'concentric' | 'eccentric' | 'plyometric'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

// Specific type definitions for better type safety
export type Patient = Tables<'patients'>
export type PatientInsert = TablesInsert<'patients'>
export type PatientUpdate = TablesUpdate<'patients'>

export type Program = Tables<'programs'>
export type ProgramInsert = TablesInsert<'programs'>
export type ProgramUpdate = TablesUpdate<'programs'>

export type ProgramExercise = Tables<'program_exercises'>
export type ProgramExerciseInsert = TablesInsert<'program_exercises'>
export type ProgramExerciseUpdate = TablesUpdate<'program_exercises'>

// Exercise phase enum type
export type ExercisePhase = Database['public']['Enums']['exercise_phase']

// Extended types for business logic
export interface ExtendedPatient extends Patient {
  affected_area?: string
  symptom_description?: string
  pain_level?: number
  difficulty_level?: number
  symptom_start_date?: string
  aggravating_factors?: string
  relieving_factors?: string
  functional_limitations?: string
  treatment_history?: string
  rehab_goals?: string
  activity_level?: string
  occupation?: string
}

export interface ProgramWithExercises extends Program {
  exercises: ProgramExercise[]
}

export interface ProgramWithPatient extends Program {
  patient: Patient | null
}

console.log('✅ Supabase generated types created at src/lib/supabase/generated-types.ts');
