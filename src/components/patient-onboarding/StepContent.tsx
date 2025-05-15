
import React from 'react';
import { OnboardingStep, FormData } from './types';

import PersonalInfoStep from '@/components/onboarding-steps/PersonalInfoStep';
import MedicalHistoryStep from '@/components/onboarding-steps/MedicalHistoryStep';
import ProblemAreaStep from '@/components/onboarding-steps/ProblemAreaStep';
import SymptomsStep from '@/components/onboarding-steps/SymptomsStep';
import LifestyleStep from '@/components/onboarding-steps/LifestyleStep';
import AppointmentStep from '@/components/onboarding-steps/AppointmentStep';
import ReviewStep from '@/components/onboarding-steps/ReviewStep';
import { stepLabels } from './types';

interface StepContentProps {
  currentStep: OnboardingStep;
  data: FormData;
  updateData: (data: Partial<FormData>) => void;
}

const StepContent: React.FC<StepContentProps> = ({ currentStep, data, updateData }) => {
  const renderStep = () => {
    switch (currentStep) {
      case 'personal':
        return <PersonalInfoStep data={data} updateData={updateData} />;
      case 'medical':
        return <MedicalHistoryStep data={data} updateData={updateData} />;
      case 'problem-area':
        return <ProblemAreaStep data={data} updateData={updateData} />;
      case 'symptoms':
        return <SymptomsStep data={data} updateData={updateData} />;
      case 'lifestyle':
        return <LifestyleStep data={data} updateData={updateData} />;
      case 'appointment':
        return <AppointmentStep data={data} updateData={updateData} />;
      case 'review':
        return <ReviewStep data={data} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
      <h2 className="text-lg sm:text-xl font-semibold mb-4 text-primary">
        {stepLabels[currentStep]}
      </h2>
      {renderStep()}
    </div>
  );
};

export default StepContent;
