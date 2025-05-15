
import React from 'react';
import { OnboardingStep } from './types';

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

  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex justify-between mb-2">
        {steps.map((step, index) => (
          <div 
            key={step} 
            className={`flex flex-col items-center ${index <= currentStepIndex ? 'text-primary' : 'text-gray-400'}`}
          >
            <div 
              className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center mb-1 
                ${index < currentStepIndex ? 'bg-primary text-white' : 
                  index === currentStepIndex ? 'border-2 border-primary text-primary' : 
                  'border-2 border-gray-300 text-gray-400'}`}
            >
              {index + 1}
            </div>
            <span className="text-[0.6rem] sm:text-xs text-center hidden sm:block">{stepLabels[step]}</span>
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
  );
};

export default StepProgressBar;
