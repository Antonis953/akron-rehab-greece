
import React from 'react';
import { OnboardingStep } from './types';
import { Progress } from "@/components/ui/progress";

interface StepProgressBarProps {
  steps: OnboardingStep[];
  currentStep: OnboardingStep;
  stepLabels: Record<OnboardingStep, string>;
}

const StepProgressBar: React.FC<StepProgressBarProps> = ({
  steps,
  currentStep,
  stepLabels,
}) => {
  const currentStepIndex = steps.indexOf(currentStep);
  // Calculate progress percentage
  const progressPercentage = (currentStepIndex / (steps.length - 1)) * 100;

  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex justify-between mb-2">
        {steps.map((step, index) => (
          <div 
            key={step} 
            className={`flex flex-col items-center ${index <= currentStepIndex ? 'text-[#1B677D]' : 'text-gray-400'}`}
          >
            <div 
              className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center mb-1 
                ${index < currentStepIndex ? 'bg-[#1B677D] text-white' : 
                  index === currentStepIndex ? 'border-2 border-[#1B677D] text-[#1B677D]' : 
                  'border-2 border-gray-300 text-gray-400'}`}
            >
              {index + 1}
            </div>
            <span className="text-[0.6rem] sm:text-xs text-center hidden sm:block">{stepLabels[step]}</span>
          </div>
        ))}
      </div>
      <Progress value={progressPercentage} className="h-2" />
    </div>
  );
};

export default StepProgressBar;
