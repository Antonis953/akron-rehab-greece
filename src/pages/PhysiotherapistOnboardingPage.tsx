
import React from 'react';
import Header from '@/components/Header';
import PhysiotherapistOnboarding from '@/components/PhysiotherapistOnboarding';

const PhysiotherapistOnboardingPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-10">
        <PhysiotherapistOnboarding />
      </main>
    </div>
  );
};

export default PhysiotherapistOnboardingPage;
