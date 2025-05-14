
import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="w-10 h-10 rounded-full brand-gradient flex items-center justify-center">
        <span className="text-white font-bold text-xl">Φ</span>
      </div>
      <div className="font-semibold text-xl">
        <span className="text-primary">Physio</span>
        <span className="text-accent">Mind</span>
        <span className="text-primary">.ai</span>
      </div>
    </div>
  );
};

export default Logo;
