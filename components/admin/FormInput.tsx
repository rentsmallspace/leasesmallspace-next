"use client";

import { forwardRef, useId } from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id?: string;
  className?: string;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, id, className = '', ...props }, ref) => {
    // Use React's useId for stable ID generation
    const generatedId = useId();
    const inputId = id || props.name || generatedId;

    return (
      <div className="relative">
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <div className="mt-1 relative">
          <input
            ref={ref}
            id={inputId}
            className={`block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm text-gray-900 ${className}`}
            {...props}
          />
        </div>
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';

export default FormInput;
