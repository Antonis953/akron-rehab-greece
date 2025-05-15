
import React from 'react';
import { Button } from '@/components/ui/button';

interface StepNavigationProps {
  onPrevious: () => void;
  onNext: () => void;
  onSubmit?: () => void;
  isPreviousDisabled: boolean;
  isNextDisabled: boolean;
  isLastStep: boolean;
  isMobile: boolean;
}

const StepNavigation: React.FC<StepNavigationProps> = ({ 
  onPrevious, 
  onNext, 
  onSubmit,
  isPreviousDisabled, 
  isNextDisabled, 
  isLastStep,
  isMobile
}) => {
  return (
    <div className="flex justify-between mt-6">
      <Button
        type="button"
        variant="outline"
        onClick={onPrevious}
        disabled={isPreviousDisabled}
        className="bg-white hover:bg-gray-50"
        size={isMobile ? "sm" : "default"}
      >
        Προηγούμενο
      </Button>
      
      {!isLastStep ? (
        <Button
          type="button"
          onClick={onNext}
          className="bg-primary hover:bg-primary/90 text-white"
          size={isMobile ? "sm" : "default"}
          disabled={isNextDisabled}
        >
          Επόμενο
        </Button>
      ) : (
        <Button
          type="button"
          onClick={onSubmit}
          className="bg-accent hover:bg-accent/90 text-white"
          size={isMobile ? "sm" : "default"}
        >
          Ολοκλήρωση Εγγραφής
        </Button>
      )}
    </div>
  );
};

export default StepNavigation;
