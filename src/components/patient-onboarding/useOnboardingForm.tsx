
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { OnboardingStep, FormData, requiredFieldsByStep } from './types';
import { supabase } from '@/integrations/supabase/client';

const steps: OnboardingStep[] = [
  'personal',
  'medical',
  'problem-area',
  'symptoms',
  'lifestyle',
  'appointment',
  'review',
];

export const useOnboardingForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('personal');
  const [isStepValid, setIsStepValid] = useState(false);
  const [formData, setFormData] = useState<FormData>({
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
    injuryDate: null,
    
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
    nextAppointment: null,
  });

  const currentStepIndex = steps.indexOf(currentStep);
  
  // Check current step validity
  useEffect(() => {
    const requiredFields = requiredFieldsByStep[currentStep];
    const hasAllRequiredFields = requiredFields.every(field => {
      const value = formData[field];
      return value !== undefined && value !== null && value !== '';
    });
    
    setIsStepValid(hasAllRequiredFields);
  }, [currentStep, formData]);

  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    const requiredFields = requiredFieldsByStep[currentStep];
    
    // Check if all required fields are filled
    const missingFields = requiredFields.filter(field => {
      const value = formData[field];
      return value === undefined || value === null || value === '';
    });
    
    if (missingFields.length > 0) {
      const fieldLabels = missingFields.map(field => {
        switch(field) {
          case 'name': return 'Ονοματεπώνυμο';
          case 'age': return 'Ηλικία';
          case 'gender': return 'Φύλο';
          case 'email': return 'Email';
          case 'problemArea': return 'Προβληματική Περιοχή';
          case 'problemDescription': return 'Περιγραφή Προβλήματος';
          case 'painLevel': return 'Επίπεδο Πόνου';
          case 'dailyActivity': return 'Καθημερινή Δραστηριότητα';
          case 'occupation': return 'Επάγγελμα';
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
    try {
      console.log('Patient data:', formData);
      
      // Store patient data in Supabase
      const { data, error } = await supabase
        .from('patients')
        .insert([
          { 
            full_name: formData.name,
            email: formData.email,
            phone: formData.phoneNumber
          }
        ]);
      
      if (error) {
        console.error("Supabase error:", error);
        toast.error('Προέκυψε ένα σφάλμα κατά την εγγραφή. Παρακαλώ δοκιμάστε ξανά.');
        return;
      }
      
      toast.success('Η εγγραφή του ασθενή ολοκληρώθηκε με επιτυχία και έχει σταλεί email με τα στοιχεία εισόδου.');
      navigate('/dashboard/patient');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Προέκυψε ένα σφάλμα κατά την εγγραφή. Παρακαλώ δοκιμάστε ξανά.');
    }
  };

  return {
    steps,
    currentStep,
    currentStepIndex,
    formData,
    isStepValid,
    updateFormData,
    handleNext,
    handlePrevious,
    handleSubmit,
  };
};
