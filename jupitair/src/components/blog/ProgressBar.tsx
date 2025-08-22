/**
 * Reading Progress Bar Component for Jupitair HVAC Blog
 * Features: Smooth animations, performance optimized, accessible
 */
import React, { useState, useEffect, useCallback } from 'react';

interface ProgressBarProps {
  className?: string;
  color?: string;
  height?: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  className = '',
  color = '#0066cc',
  height = 3
}) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const calculateProgress = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = (scrollTop / docHeight) * 100;
    
    setProgress(Math.min(Math.max(scrollProgress, 0), 100));
    setIsVisible(scrollTop > 100); // Show after scrolling 100px
  }, []);

  useEffect(() => {
    // Throttled scroll handler for better performance
    let timeoutId: NodeJS.Timeout;
    const throttledHandler = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(calculateProgress, 16); // ~60fps
    };

    window.addEventListener('scroll', throttledHandler, { passive: true });
    window.addEventListener('resize', calculateProgress, { passive: true });
    
    // Initial calculation
    calculateProgress();

    return () => {
      window.removeEventListener('scroll', throttledHandler);
      window.removeEventListener('resize', calculateProgress);
      clearTimeout(timeoutId);
    };
  }, [calculateProgress]);

  return (
    <>
      {/* Progress bar */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        style={{ height: `${height}px` }}
        role="progressbar"
        aria-label="Reading progress"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full transition-all duration-150 ease-out"
          style={{
            width: `${progress}%`,
            background: `linear-gradient(90deg, ${color} 0%, ${color}dd 100%)`,
            boxShadow: `0 0 10px ${color}44`
          }}
        />
      </div>

      {/* Reading time indicator (optional) */}
      {isVisible && (
        <div className="fixed top-4 right-4 z-40 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 shadow-lg transition-all duration-300">
          <div className="flex items-center gap-2">
            <svg 
              className="w-4 h-4" 
              fill="currentColor" 
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path 
                fillRule="evenodd" 
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" 
                clipRule="evenodd"
              />
            </svg>
            <span>{Math.round(progress)}% read</span>
          </div>
        </div>
      )}
    </>
  );
};

export default ProgressBar;