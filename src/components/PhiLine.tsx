import React from 'react';

interface PhiLineProps {
  variant?: 'divider' | 'flow' | 'subtle';
  className?: string;
}

export const PhiLine: React.FC<PhiLineProps> = ({ variant = 'divider', className = '' }) => {
  if (variant === 'flow') {
    return (
      <div className={`w-full overflow-hidden ${className}`} aria-hidden="true">
        <svg
          viewBox="0 0 900 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-12 stroke-[#D8C4C2]"
        >
          <path
            d="M 50 30 Q 250 10, 450 30 T 850 30"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="3 3"
          />
          <circle cx="50" cy="30" r="3" fill="#B99A99" />
          <circle cx="450" cy="30" r="3" fill="#B99A99" />
          <circle cx="850" cy="30" r="3" fill="#B99A99" />
        </svg>
      </div>
    );
  }

  if (variant === 'subtle') {
    return (
      <div className={`flex justify-center py-6 ${className}`} aria-hidden="true">
        <svg width="120" height="24" viewBox="0 0 120 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M 10 14 C 35 6, 50 18, 60 12 C 70 6, 85 18, 110 12"
            stroke="#B99A99"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    );
  }

  // Default subtle divider
  return (
    <div className={`w-full max-w-md mx-auto flex items-center justify-center my-10 ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 400 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-10 text-[#B99A99]"
      >
        <path
          d="M 30 20 C 120 28, 180 12, 200 20 C 220 28, 280 12, 370 20"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          className="opacity-70"
        />
        <circle cx="200" cy="20" r="2.5" fill="currentColor" className="opacity-90" />
      </svg>
    </div>
  );
};

export default PhiLine;
