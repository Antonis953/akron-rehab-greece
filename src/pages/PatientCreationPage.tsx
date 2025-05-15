
import React from 'react';
import Header from '@/components/Header';
import PhysiotherapistPatientCreation from '@/components/PhysiotherapistPatientCreation';

const PatientCreationPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-10">
        <PhysiotherapistPatientCreation />
      </main>
    </div>
  );
};

export default PatientCreationPage;
