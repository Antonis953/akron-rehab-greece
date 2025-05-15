
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import StepProgressBar from './StepProgressBar';
import StepNavigation from './StepNavigation';
import StepContent from './StepContent';
import { useOnboardingForm } from './useOnboardingForm';
import { stepLabels } from './types';

const OnboardingForm = () => {
  const isMobile = useIsMobile();
  const {
    steps,
    currentStep,
    currentStepIndex,
    formData,
    isStepValid,
    updateFormData,
    handleNext,
    handlePrevious,
    handleSubmit,
  } = useOnboardingForm();

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 animate-fade-in">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">Εγγραφή Ασθενούς</h1>
      <p className="text-gray-600 mb-6 sm:mb-8 text-center text-sm sm:text-base">
        Συμπληρώστε τα παρακάτω στοιχεία για τη δημιουργία του εξατομικευμένου προγράμματος αποκατάστασής σας
      </p>

      {/* Progress indicator */}
      <StepProgressBar 
        steps={steps} 
        currentStep={currentStep} 
        stepLabels={stepLabels} 
      />

      {/* Current step content */}
      <StepContent 
        currentStep={currentStep}
        data={formData}
        updateData={updateFormData}
      />

      {/* Navigation buttons */}
      <StepNavigation
        onPrevious={handlePrevious}
        onNext={handleNext}
        onSubmit={handleSubmit}
        isPreviousDisabled={currentStepIndex === 0}
        isNextDisabled={!isStepValid && requiredFieldsByStep[currentStep].length > 0}
        isLastStep={currentStep === 'review'}
        isMobile={isMobile}
      />
    </div>
  );
};

export default OnboardingForm;
