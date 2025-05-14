
import React from 'react';
import Header from '@/components/Header';
import RoleSelection from '@/components/RoleSelection';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-12 md:py-20 brand-gradient text-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                  Εξατομικευμένα προγράμματα φυσιοθεραπείας με τεχνητή νοημοσύνη
                </h1>
                <p className="text-lg md:text-xl mb-8 opacity-90">
                  Το PhysioMind.ai χρησιμοποιεί τεχνητή νοημοσύνη για να δημιουργήσει εξατομικευμένα προγράμματα αποκατάστασης για κάθε ασθενή, βασισμένα σε επιστημονικά τεκμηριωμένες μεθόδους.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                    Ξεκινήστε Τώρα
                  </Button>
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                    Μάθετε Περισσότερα
                  </Button>
                </div>
              </div>
              <div className="hidden md:flex justify-center">
                <div className="w-full max-w-md bg-white/10 backdrop-blur-sm rounded-lg p-6 shadow-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80" 
                    alt="Physiotherapy session" 
                    className="w-full h-auto rounded-lg shadow-md object-cover aspect-[4/3]" 
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Role Selection Section */}
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4 md:px-6">
            <RoleSelection />
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-12 md:py-20 bg-gray-100">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Χαρακτηριστικά</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Ανακαλύψτε πώς το PhysioMind.ai μπορεί να βελτιώσει την πρακτική σας και την αποκατάσταση των ασθενών σας
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Εξατομικευμένα Προγράμματα</h3>
                <p className="text-gray-600">
                  Αυτόματη δημιουργία προγραμμάτων αποκατάστασης προσαρμοσμένα στις ανάγκες κάθε ασθενή
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Επιστημονικά Τεκμηριωμένο</h3>
                <p className="text-gray-600">
                  Βασισμένο σε αναγνωρισμένες πηγές όπως Physiotutors, Prehab Guys και Adam Meakins
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Παρακολούθηση Προόδου</h3>
                <p className="text-gray-600">
                  Συνεχής αξιολόγηση και προσαρμογή των προγραμμάτων με βάση την καθημερινή πρόοδο του ασθενή
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="py-12 md:py-20 bg-primary text-white">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold mb-6">Έτοιμοι να ξεκινήσετε;</h2>
            <p className="text-xl max-w-3xl mx-auto mb-8 opacity-90">
              Εγγραφείτε σήμερα και ανακαλύψτε πώς το PhysioMind.ai μπορεί να βελτιώσει την πρακτική σας και την εμπειρία των ασθενών σας.
            </p>
            <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
              Εγγραφή Τώρα
            </Button>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">PhysioMind.ai</h3>
              <p className="text-sm">
                Η επόμενη γενιά εξατομικευμένων προγραμμάτων φυσιοθεραπείας με τη δύναμη της τεχνητής νοημοσύνης.
              </p>
            </div>
            
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Σύνδεσμοι</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Αρχική</a></li>
                <li><a href="#" className="hover:text-white">Χαρακτηριστικά</a></li>
                <li><a href="#" className="hover:text-white">Σχετικά με εμάς</a></li>
                <li><a href="#" className="hover:text-white">Επικοινωνία</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Νομικά</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Όροι Χρήσης</a></li>
                <li><a href="#" className="hover:text-white">Πολιτική Απορρήτου</a></li>
                <li><a href="#" className="hover:text-white">Cookies</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Επικοινωνία</h3>
              <ul className="space-y-2 text-sm">
                <li>info@physiomind.ai</li>
                <li>+30 210 1234567</li>
                <li>Αθήνα, Ελλάδα</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
            &copy; {new Date().getFullYear()} PhysioMind.ai - Με επιφύλαξη παντός δικαιώματος.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
