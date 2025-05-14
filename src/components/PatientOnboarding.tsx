
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

// Step Components
import PersonalInfoStep from '@/components/onboarding-steps/PersonalInfoStep';
import MedicalHistoryStep from '@/components/onboarding-steps/MedicalHistoryStep';
import ProblemAreaStep from '@/components/onboarding-steps/ProblemAreaStep';
import SymptomsStep from '@/components/onboarding-steps/SymptomsStep';
import LifestyleStep from '@/components/onboarding-steps/LifestyleStep';
import AppointmentStep from '@/components/onboarding-steps/AppointmentStep';
import ReviewStep from '@/components/onboarding-steps/ReviewStep';

// Определение типа для шагов onboarding
type OnboardingStep = 
  | 'personal'
  | 'medical'
  | 'problem-area'
  | 'symptoms'
  | 'lifestyle'
  | 'appointment'
  | 'review';

const steps: OnboardingStep[] = [
  'personal',
  'medical',
  'problem-area',
  'symptoms',
  'lifestyle',
  'appointment',
  'review',
];

const stepLabels = {
  'personal': 'Προσωπικά Στοιχεία',
  'medical': 'Ιατρικό Ιστορικό',
  'problem-area': 'Προβληματική Περιοχή',
  'symptoms': 'Συμπτώματα & Πόνος',
  'lifestyle': 'Συνήθειες Ζωής',
  'appointment': 'Επόμενη Συνεδρία',
  'review': 'Ανασκόπηση'
};

const PatientOnboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('personal');
  const [formData, setFormData] = useState({
    // Personal Info
    name: '',
    age: 30,
    gender: '',
    email: '',
    phoneNumber: '',
    
    // Medical History
    previousInjuries: '',
    chronicConditions: '',
    medications: '',
    
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
    
    // Lifestyle
    dailyActivity: '',
    occupation: '',
    sleepQuality: '',
    stressLevel: 5,
    
    // Appointment
    nextAppointment: null as Date | null,
  });

  const currentStepIndex = steps.indexOf(currentStep);

  const handleNext = () => {
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
      console.log('Patient data:', formData);
      // Here we would save the data to Supabase in a real implementation
      
      toast.success('Η εγγραφή σας ολοκληρώθηκε με επιτυχία!');
      navigate('/dashboard/patient');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Προέκυψε ένα σφάλμα κατά την εγγραφή. Παρακαλώ δοκιμάστε ξανά.');
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'personal':
        return <PersonalInfoStep data={formData} updateData={updateFormData} />;
      case 'medical':
        return <MedicalHistoryStep data={formData} updateData={updateFormData} />;
      case 'problem-area':
        return <ProblemAreaStep data={formData} updateData={updateFormData} />;
      case 'symptoms':
        return <SymptomsStep data={formData} updateData={updateFormData} />;
      case 'lifestyle':
        return <LifestyleStep data={formData} updateData={updateFormData} />;
      case 'appointment':
        return <AppointmentStep data={formData} updateData={updateFormData} />;
      case 'review':
        return <ReviewStep data={formData} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 animate-fade-in">
      <h1 className="text-2xl font-bold mb-6 text-center">Εγγραφή Ασθενούς</h1>
      <p className="text-gray-600 mb-8 text-center">
        Συμπληρώστε τα παρακάτω στοιχεία για τη δημιουργία του εξατομικευμένου προγράμματος αποκατάστασής σας
      </p>

      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {steps.map((step, index) => (
            <div 
              key={step} 
              className={`flex flex-col items-center ${index <= currentStepIndex ? 'text-primary' : 'text-gray-400'}`}
            >
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 
                  ${index < currentStepIndex ? 'bg-primary text-white' : 
                    index === currentStepIndex ? 'border-2 border-primary text-primary' : 
                    'border-2 border-gray-300 text-gray-400'}`}
              >
                {index + 1}
              </div>
              <span className="text-xs text-center hidden md:block">{stepLabels[step]}</span>
            </div>
          ))}
        </div>
        <div className="w-full bg-gray-200 h-2 rounded-full">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300" 
            style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
          />
        </div>
      </div>

      {/* Current step content */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-primary">
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
          disabled={currentStepIndex === 0}
          className="bg-white hover:bg-gray-50"
        >
          Προηγούμενο
        </Button>
        
        {currentStep !== 'review' ? (
          <Button
            type="button"
            onClick={handleNext}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            Επόμενο
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleSubmit}
            className="bg-accent hover:bg-accent/90 text-white"
          >
            Ολοκλήρωση Εγγραφής
          </Button>
        )}
      </div>
    </div>
  );
};

export default PatientOnboarding;
