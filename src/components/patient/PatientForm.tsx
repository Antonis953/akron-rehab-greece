
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Progress } from "@/components/ui/progress";
import { ClipboardList } from 'lucide-react';
import { PatientFormData, OnboardingStep, stepLabels, requiredFieldsByStep } from '@/types/patient';
import { BRAND_COLORS } from '@/lib/utils';

// Step Components
import PersonalInfoStep from '@/components/onboarding-steps/PersonalInfoStep';
import ProblemAreaStep from '@/components/onboarding-steps/ProblemAreaStep';
import SymptomsStep from '@/components/onboarding-steps/SymptomsStep';
import AppointmentStep from '@/components/onboarding-steps/AppointmentStep';
import { toast } from 'sonner';

interface PatientFormProps {
  onSubmit: (formData: PatientFormData) => Promise<void>;
  isSubmitting: boolean;
}

const PRIMARY_COLOR = BRAND_COLORS.primary;
const SECONDARY_COLOR = BRAND_COLORS.secondary;

const steps: OnboardingStep[] = [
  'personal',
  'problem-area',
  'symptoms',
  'appointment',
];

export const PatientForm: React.FC<PatientFormProps> = ({ onSubmit, isSubmitting }) => {
  const isMobile = useIsMobile();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('personal');
  const [formData, setFormData] = useState<PatientFormData>({
    // Personal Info
    name: '',
    age: 30,
    gender: '',
    email: '',
    phoneNumber: '',
    
    // Problem Area
    problemArea: '',
    problemDescription: '',
    injuryDate: null,
    
    // Symptoms & Pain
    painLevel: 5,
    morningPain: false,
    nightPain: false,
    worseningFactors: '',
    relievingFactors: '',
    
    // Appointment
    nextAppointment: null,
  });
  
  const [isStepValid, setIsStepValid] = useState(false);
  const currentStepIndex = steps.indexOf(currentStep);

  // Progress percentage calculation
  const progressPercentage = (currentStepIndex / (steps.length - 1)) * 100;

  // Validate current step
  useEffect(() => {
    const requiredFields = requiredFieldsByStep[currentStep];
    const hasAllRequiredFields = requiredFields.every(field => {
      const value = formData[field as keyof PatientFormData];
      return value !== undefined && value !== null && value !== '';
    });
    
    setIsStepValid(hasAllRequiredFields);
  }, [currentStep, formData]);

  const updateFormData = (data: Partial<PatientFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    const requiredFields = requiredFieldsByStep[currentStep];
    
    // Check if all required fields are filled
    const missingFields = requiredFields.filter(field => {
      const value = formData[field as keyof PatientFormData];
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

  const handleSubmit = async () => {
    await onSubmit(formData);
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
    <div className="animate-fade-in">
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
            disabled={isSubmitting}
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

export default PatientForm;
