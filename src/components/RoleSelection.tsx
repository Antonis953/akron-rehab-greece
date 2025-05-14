
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '@/types';

const RoleSelection = () => {
  const navigate = useNavigate();

  const handleRoleSelect = (role: UserRole) => {
    navigate(`/onboarding/${role}`);
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
        Καλώς ήρθατε στο PhysioMind.ai
      </h2>
      <p className="text-center text-lg text-gray-600 max-w-xl mb-10">
        Η πλατφόρμα που χρησιμοποιεί τεχνητή νοημοσύνη για να δημιουργήσει εξατομικευμένα προγράμματα
        αποκατάστασης, βασισμένα σε επιστημονικά τεκμηριωμένες μεθόδους.
      </p>
      
      <div className="grid md:grid-cols-2 gap-8 w-full max-w-2xl">
        <Card className="border-2 hover:border-primary hover:shadow-lg transition-all cursor-pointer">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="bg-primary/10 p-4 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="font-bold text-xl mb-3">Είμαι Φυσιοθεραπευτής</h3>
            <p className="text-gray-600 mb-6">
              Δημιουργήστε εξατομικευμένα προγράμματα για τους ασθενείς σας με τη βοήθεια της τεχνητής νοημοσύνης
            </p>
            <Button onClick={() => handleRoleSelect('physiotherapist')} className="w-full bg-primary hover:bg-primary/90">
              Συνέχεια ως Φυσιοθεραπευτής
            </Button>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-primary hover:shadow-lg transition-all cursor-pointer">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="bg-accent/10 p-4 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-xl mb-3">Είμαι Ασθενής</h3>
            <p className="text-gray-600 mb-6">
              Αποκτήστε πρόσβαση στο προσωπικό σας πρόγραμμα αποκατάστασης και παρακολουθήστε την πρόοδό σας
            </p>
            <Button onClick={() => handleRoleSelect('patient')} className="w-full bg-accent hover:bg-accent/90 text-white">
              Συνέχεια ως Ασθενής
            </Button>
          </CardContent>
        </Card>
      </div>

      <p className="mt-10 text-sm text-gray-500 max-w-md text-center">
        Το PhysioMind.ai χρησιμοποιεί μόνο επιστημονικά τεκμηριωμένες πηγές και μεθόδους αποκατάστασης από 
        αναγνωρισμένους οργανισμούς και ειδικούς στο χώρο της φυσιοθεραπείας.
      </p>
    </div>
  );
};

export default RoleSelection;
