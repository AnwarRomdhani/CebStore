import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <label className="grid gap-1 text-sm">
        {label && <span className="text-foreground/80">{label}</span>}
        <input
          ref={ref}
          className={`h-10 rounded-lg border bg-transparent px-3 outline-none transition-colors focus:ring-2 focus:ring-brand/30 disabled:opacity-50 disabled:cursor-not-allowed ${
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30'
              : 'border-border focus:border-brand'
          } ${className}`}
          {...props}
        />
        {error && <span className="text-xs text-red-500">{error}</span>}
        {helperText && !error && <span className="text-xs text-foreground/60">{helperText}</span>}
      </label>
    );
  }
);

Input.displayName = 'Input';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <label className="grid gap-1 text-sm">
        {label && <span className="text-foreground/80">{label}</span>}
        <textarea
          ref={ref}
          className={`min-h-[100px] rounded-lg border bg-transparent px-3 py-2 outline-none transition-colors focus:ring-2 focus:ring-brand/30 disabled:opacity-50 disabled:cursor-not-allowed ${
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30'
              : 'border-border focus:border-brand'
          } ${className}`}
          {...props}
        />
        {error && <span className="text-xs text-red-500">{error}</span>}
        {helperText && !error && <span className="text-xs text-foreground/60">{helperText}</span>}
      </label>
    );
  }
);

TextArea.displayName = 'TextArea';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, options, className = '', ...props }, ref) => {
    return (
      <label className="grid gap-1 text-sm">
        {label && <span className="text-foreground/80">{label}</span>}
        <select
          ref={ref}
          className={`h-10 rounded-lg border bg-transparent px-3 outline-none transition-colors focus:ring-2 focus:ring-brand/30 disabled:opacity-50 disabled:cursor-not-allowed ${
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30'
              : 'border-border focus:border-brand'
          } ${className}`}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-background">
              {option.label}
            </option>
          ))}
        </select>
        {error && <span className="text-xs text-red-500">{error}</span>}
        {helperText && !error && <span className="text-xs text-foreground/60">{helperText}</span>}
      </label>
    );
  }
);

Select.displayName = 'Select';
