import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-11 w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2.5 text-sm',
          'placeholder:text-gray-400 focus:border-[rgb(0,122,255)] focus:outline-none focus:ring-4 focus:ring-blue-100',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'dark:border-gray-700 dark:bg-gray-900 dark:focus:ring-blue-900',
          'transition-all duration-200',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input };
