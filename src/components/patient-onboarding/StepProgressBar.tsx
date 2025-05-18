
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { OnboardingStep } from './types';
import { BRAND_COLORS } from '@/lib/utils';

interface StepProgressBarProps {
  steps: OnboardingStep[];
  currentStep: OnboardingStep;
  stepLabels: Record<OnboardingStep, string>;
}

const StepProgressBar: React.FC<StepProgressBarProps> = ({ steps, currentStep, stepLabels }) => {
  const currentStepIndex = steps.indexOf(currentStep);
  const progressPercentage = (currentStepIndex / (steps.length - 1)) * 100;

  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex justify-between mb-2">
        {steps.map((step, index) => (
          <div 
            key={step} 
            className="flex flex-col items-center"
            style={{ color: index <= currentStepIndex ? BRAND_COLORS.primary : 'rgb(156, 163, 175)' }}
          >
            <div 
              className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center mb-1 border-2"
              style={{
                backgroundColor: index < currentStepIndex ? BRAND_COLORS.primary : 'transparent',
                borderColor: index <= currentStepIndex ? BRAND_COLORS.primary : 'rgb(209, 213, 219)',
                color: index < currentStepIndex ? 'white' : index === currentStepIndex ? BRAND_COLORS.primary : 'rgb(156, 163, 175)'
              }}
            >
              {index + 1}
            </div>
            <span className="text-[0.6rem] sm:text-xs text-center hidden sm:block">
              {stepLabels[step]}
            </span>
          </div>
        ))}
      </div>
      <Progress 
        value={progressPercentage} 
        className="h-2"
        style={{ 
          backgroundColor: 'rgb(229, 231, 235)',
          '--progress-background': BRAND_COLORS.primary
        } as React.CSSProperties}
      />
    </div>
  );
};

export default StepProgressBar;
