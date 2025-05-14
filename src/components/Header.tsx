
import React from 'react';
import Logo from './Logo';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Logo />
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
            Αρχική
          </a>
          <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
            Χαρακτηριστικά
          </a>
          <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
            Πληροφορίες
          </a>
          <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
            Επικοινωνία
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
