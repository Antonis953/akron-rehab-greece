
import React from 'react';
import Header from '@/components/Header';
import PatientOnboarding from '@/components/PatientOnboarding';

const PatientOnboardingPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-10">
        <PatientOnboarding />
      </main>
    </div>
  );
};

export default PatientOnboardingPage;
