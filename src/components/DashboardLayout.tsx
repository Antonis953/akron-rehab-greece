
import React, { PropsWithChildren } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from './Logo';
import { Button } from './ui/button';
import { UserRole } from '@/types';
import { User, Calendar, ClipboardList, Plus } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

interface DashboardLayoutProps extends PropsWithChildren {
  userRole: UserRole;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, userRole }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isPhysiotherapist = userRole === 'physiotherapist';

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto py-3 px-4 flex justify-between items-center">
          <Logo />
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium">
              {isPhysiotherapist ? 'Φυσιοθεραπευτής' : 'Ασθενής'}
            </span>
            <Button variant="outline" size="sm" onClick={() => navigate('/')}>
              Αποσύνδεση
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="w-64 bg-gray-50 border-r hidden md:block">
          <nav className="p-4 space-y-1">
            <a 
              href={isPhysiotherapist ? "/dashboard/physiotherapist" : "/dashboard/patient"} 
              className={`flex items-center px-4 py-2 rounded-md hover:bg-gray-100 ${
                isActive(isPhysiotherapist ? "/dashboard/physiotherapist" : "/dashboard/patient") 
                  ? "bg-gray-100 text-primary font-medium" 
                  : "text-gray-700"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Αρχική
            </a>

            {isPhysiotherapist ? (
              <>
                <a 
                  href="#" 
                  className="flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100"
                >
                  <User className="h-5 w-5 mr-3" />
                  Ασθενείς
                </a>
                <a 
                  href="/patients/new" 
                  className={`flex items-center px-4 py-2 rounded-md hover:bg-gray-100 ${
                    isActive("/patients/new") 
                      ? "bg-gray-100 text-primary font-medium" 
                      : "text-gray-700"
                  }`}
                >
                  <Plus className="h-5 w-5 mr-3" />
                  Νέος Ασθενής
                </a>
                <a href="#" className="flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100">
                  <ClipboardList className="h-5 w-5 mr-3" />
                  Προγράμματα
                </a>
                <a href="#" className="flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  Συνομιλίες με AI
                </a>
              </>
            ) : (
              <>
                <a href="#" className="flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Το Πρόγραμμά μου
                </a>
                <a href="#" className="flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100">
                  <Progress className="h-5 w-5 mr-3" />
                  Πρόοδος
                </a>
                <a href="#" className="flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100">
                  <Calendar className="h-5 w-5 mr-3" />
                  Ημερολόγιο
                </a>
              </>
            )}

            <a href="#" className="flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Ρυθμίσεις
            </a>
          </nav>
        </aside>

        <main className="flex-1 p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
