"use client";
import type { SVGProps } from 'react';

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
  variant?: 'light' | 'dark';
}

export default function Logo({ width = 32, height = 32, className = "", variant = 'dark' }: LogoProps) {
  const fillColor = variant === 'light' ? 'white' : 'fill-primary-600';
  const strokeColor = variant === 'light' ? 'white' : 'currentColor';

  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 32 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        d="M16 3L3 10V29H29V10L16 3Z" 
        className={fillColor}
      />
      <path 
        d="M13 29V19H19V29" 
        stroke={strokeColor} 
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path 
        d="M3 10L16 17L29 10" 
        stroke={strokeColor} 
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <rect 
        x="14" 
        y="11" 
        width="4" 
        height="4" 
        fill={strokeColor} 
        rx="1"
      />
    </svg>
  );
} 