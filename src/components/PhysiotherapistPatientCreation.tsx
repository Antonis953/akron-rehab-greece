
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ClipboardList } from 'lucide-react';
import { BRAND_COLORS } from '@/lib/utils';
import PatientForm from '@/components/patient/PatientForm';
import PatientSupabaseService from '@/services/PatientSupabaseService';
import { PatientFormData } from '@/types/patient';

const PRIMARY_COLOR = BRAND_COLORS.primary;

const PhysiotherapistPatientCreation = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: PatientFormData) => {
    try {
      setIsSubmitting(true);
      
      const newPatient = await PatientSupabaseService.createPatient(formData);
      
      if (newPatient) {
        toast.success('Η εγγραφή του ασθενή ολοκληρώθηκε με επιτυχία και έχει σταλεί email με τα στοιχεία εισόδου.');
        navigate('/dashboard/physiotherapist');
      }
    } catch (error) {
      console.error('Σφάλμα κατά την υποβολή της φόρμας:', error);
      toast.error('Προέκυψε ένα σφάλμα κατά τη δημιουργία του λογαριασμού. Παρακαλώ δοκιμάστε ξανά.');
    } finally {
      setIsSubmitting(false);
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

      <PatientForm 
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default PhysiotherapistPatientCreation;
