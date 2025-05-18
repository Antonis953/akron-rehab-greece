
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Progress } from "@/components/ui/progress";
import { supabase } from '@/integrations/supabase/client';
import { BRAND_COLORS } from '@/lib/utils';

// Step Components
import PersonalInfoStep from '@/components/onboarding-steps/PersonalInfoStep';
import ProblemAreaStep from '@/components/onboarding-steps/ProblemAreaStep';
import SymptomsStep from '@/components/onboarding-steps/SymptomsStep';
import AppointmentStep from '@/components/onboarding-steps/AppointmentStep';
import { ClipboardList } from 'lucide-react';

// Ορισμός τύπου για τα βήματα onboarding
type OnboardingStep = 
  | 'personal'
  | 'problem-area'
  | 'symptoms'
  | 'appointment';

const steps: OnboardingStep[] = [
  'personal',
  'problem-area',
  'symptoms',
  'appointment',
];

const stepLabels = {
  'personal': 'Προσωπικά Στοιχεία',
  'problem-area': 'Προβληματική Περιοχή',
  'symptoms': 'Συμπτώματα & Πόνος',
  'appointment': 'Επόμενη Συνεδρία'
};

// Ορισμός των υποχρεωτικών πεδίων ανά βήμα
const requiredFieldsByStep = {
  'personal': ['name', 'email'],
  'problem-area': ['problemArea', 'problemDescription'],
  'symptoms': ['painLevel'],
  'appointment': ['nextAppointment'],
};

const PRIMARY_COLOR = BRAND_COLORS.primary;
const SECONDARY_COLOR = BRAND_COLORS.secondary;

const PhysiotherapistPatientCreation = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('personal');
  const [formData, setFormData] = useState({
    // Personal Info
    name: '',
    age: 30,
    gender: '',
    email: '',
    phoneNumber: '',
    
    // Problem Area
    problemArea: '',
    problemDescription: '',
    injuryDate: null as Date | null,
    
    // Symptoms & Pain
    painLevel: 5,
    morningPain: false,
    nightPain: false,
    worseningFactors: '',
    relievingFactors: '',
    
    // Appointment
    nextAppointment: null as Date | null,
  });
  
  const [isStepValid, setIsStepValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentStepIndex = steps.indexOf(currentStep);

  // Progress percentage calculation
  const progressPercentage = (currentStepIndex / (steps.length - 1)) * 100;

  // Έλεγχος εγκυρότητας τρέχοντος βήματος
  useEffect(() => {
    const requiredFields = requiredFieldsByStep[currentStep];
    const hasAllRequiredFields = requiredFields.every(field => {
      const value = formData[field as keyof typeof formData];
      return value !== undefined && value !== null && value !== '';
    });
    
    setIsStepValid(hasAllRequiredFields);
  }, [currentStep, formData]);

  const handleNext = () => {
    const requiredFields = requiredFieldsByStep[currentStep];
    
    // Έλεγχος αν όλα τα υποχρεωτικά πεδία έχουν συμπληρωθεί
    const missingFields = requiredFields.filter(field => {
      const value = formData[field as keyof typeof formData];
      return value === undefined || value === null || value === '';
    });
    
    if (missingFields.length > 0) {
      const fieldLabels = missingFields.map(field => {
        switch(field) {
          case 'name': return 'Ονοματεπώνυμο';
          case 'email': return 'Email';
          case 'problemArea': return 'Προβληματική Περιοχή';
          case 'problemDescription': return 'Περιγραφή Προβλήματος';
          case 'painLevel': return 'Επίπεδο Πόνου';
          case 'nextAppointment': return 'Ημερομηνία Συνεδρίας';
          default: return field;
        }
      });
      
      toast.error(`Παρακαλώ συμπληρώστε τα υποχρεωτικά πεδία: ${fieldLabels.join(', ')}`);
      return;
    }
    
    const nextStep = steps[currentStepIndex + 1];
    if (nextStep) {
      setCurrentStep(nextStep);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevious = () => {
    const prevStep = steps[currentStepIndex - 1];
    if (prevStep) {
      setCurrentStep(prevStep);
      window.scrollTo(0, 0);
    }
  };

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      // Extract required data for patient creation
      const { name: full_name, email, phoneNumber: phone } = formData;
      
      console.log('Creating patient account in Supabase:', { full_name, email, phone });
      
      // Insert patient data into the patients table
      const { data, error } = await supabase
        .from('patients')
        .insert([
          { full_name, email, phone }
        ]);
      
      if (error) {
        console.error('Supabase error:', error);
        throw new Error(error.message);
      }
      
      console.log('Patient created successfully:', data);
      
      toast.success('Η εγγραφή του ασθενή ολοκληρώθηκε με επιτυχία και έχει σταλεί email με τα στοιχεία εισόδου.');
      
      navigate('/dashboard/physiotherapist');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Προέκυψε ένα σφάλμα κατά τη δημιουργία του λογαριασμού. Παρακαλώ δοκιμάστε ξανά.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'personal':
        return <PersonalInfoStep data={formData} updateData={updateFormData} />;
      case 'problem-area':
        return <ProblemAreaStep data={formData} updateData={updateFormData} />;
      case 'symptoms':
        return <SymptomsStep data={formData} updateData={updateFormData} />;
      case 'appointment':
        return <AppointmentStep data={formData} updateData={updateFormData} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <ClipboardList className="h-6 w-6" style={{ color: PRIMARY_COLOR }} />
        <h1 className="text-xl sm:text-2xl font-bold" style={{ color: PRIMARY_COLOR }}>Δημιουργία Νέου Ασθενή</h1>
      </div>
      
      <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
        Συμπληρώστε το αρχικό ερωτηματολόγιο για τη δημιουργία λογαριασμού ασθενή
      </p>

      {/* Progress indicator */}
      <div className="mb-6 sm:mb-8">
        <div className="flex justify-between mb-2">
          {steps.map((step, index) => (
            <div 
              key={step} 
              className="flex flex-col items-center"
              style={{ color: index <= currentStepIndex ? PRIMARY_COLOR : 'rgb(156, 163, 175)' }}
            >
              <div 
                className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center mb-1 border-2"
                style={{
                  backgroundColor: index < currentStepIndex ? PRIMARY_COLOR : 'transparent',
                  borderColor: index <= currentStepIndex ? PRIMARY_COLOR : 'rgb(209, 213, 219)',
                  color: index < currentStepIndex ? 'white' : index === currentStepIndex ? PRIMARY_COLOR : 'rgb(156, 163, 175)'
                }}
              >
                {index + 1}
              </div>
              <span className="text-[0.6rem] sm:text-xs text-center hidden sm:block">{stepLabels[step]}</span>
            </div>
          ))}
        </div>
        <Progress value={progressPercentage} className="h-2" style={{ 
          backgroundColor: 'rgb(229, 231, 235)',
          '--progress-background': PRIMARY_COLOR 
        } as React.CSSProperties} />
      </div>

      {/* Current step content */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-4" style={{ color: PRIMARY_COLOR }}>
          {stepLabels[currentStep]}
        </h2>
        {renderStep()}
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStepIndex === 0 || isSubmitting}
          className="bg-white hover:bg-gray-50"
          size={isMobile ? "sm" : "default"}
        >
          Προηγούμενο
        </Button>
        
        {currentStep !== 'appointment' ? (
          <Button
            type="button"
            onClick={handleNext}
            className="text-white"
            style={{ backgroundColor: PRIMARY_COLOR, borderColor: PRIMARY_COLOR }}
            size={isMobile ? "sm" : "default"}
            disabled={!isStepValid && requiredFieldsByStep[currentStep].length > 0}
          >
            Επόμενο
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleSubmit}
            className="text-white"
            style={{ backgroundColor: SECONDARY_COLOR, borderColor: SECONDARY_COLOR }}
            size={isMobile ? "sm" : "default"}
            disabled={!isStepValid || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin mr-2">⟳</span>
                Δημιουργία...
              </>
            ) : (
              'Δημιουργία Λογαριασμού'
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default PhysiotherapistPatientCreation;
