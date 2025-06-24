import React from 'react';

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 24, 
  color = '#4A90E2',
  className 
}) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ color }}
      className={className}
    >
      <circle 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeDasharray="31.416" 
        strokeDashoffset="31.416"
        style={{ 
          animation: 'spin 1s linear infinite',
          transformOrigin: 'center'
        }}
      />
      <style>{`
        @keyframes spin {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </svg>
  );
};

export default LoadingSpinner; 