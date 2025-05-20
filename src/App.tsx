
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import PatientOnboardingPage from './pages/PatientOnboardingPage';
import PhysiotherapistOnboardingPage from './pages/PhysiotherapistOnboardingPage';
import PatientDashboard from './pages/PatientDashboard';
import PhysiotherapistDashboard from './pages/PhysiotherapistDashboard';
import PatientCreationPage from './pages/PatientCreationPage';
import PatientDetailPage from './pages/PatientDetailPage';
import ProgramCreationPage from './pages/ProgramCreationPage';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/onboarding/patient" element={<PatientOnboardingPage />} />
        <Route path="/onboarding/physiotherapist" element={<PhysiotherapistOnboardingPage />} />
        <Route path="/dashboard/patient" element={<PatientDashboard />} />
        <Route path="/dashboard/physiotherapist" element={<PhysiotherapistDashboard />} />
        <Route path="/patients/new" element={<PatientCreationPage />} />
        <Route path="/patients/:patientId" element={<PatientDetailPage />} />
        <Route path="/programs/new/:patientId" element={<ProgramCreationPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster position="top-right" richColors />
    </BrowserRouter>
  );
};

export default App;
