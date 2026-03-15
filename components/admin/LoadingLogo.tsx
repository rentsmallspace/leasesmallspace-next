"use client";

import Logo from './Logo';
import { useEffect, useState } from 'react';

interface LoadingLogoProps {
  width?: number;
  height?: number;
  className?: string;
  variant?: 'light' | 'dark';
}

export default function LoadingLogo({ 
  width = 32, 
  height = 32, 
  className = "", 
  variant = 'dark' 
}: LoadingLogoProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <Logo width={width} height={height} variant={variant} />;
  }

  return (
    <div className={`relative ${className}`}>
      <div className="animate-pulse">
        <Logo width={width} height={height} variant={variant} />
      </div>
      <div 
        className="absolute inset-0 animate-spin-slow"
        style={{ animationDuration: '3s' }}
      >
        <Logo 
          width={width} 
          height={height} 
          variant={variant}
          className="opacity-20"
        />
      </div>
    </div>
  );
} 