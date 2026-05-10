import React from 'react';
import { cn } from './LoadingSpinner';

const FormField = React.forwardRef(({ 
  label, 
  error, 
  type = 'text', 
  className,
  containerClassName,
  options = [],
  ...props 
}, ref) => {
  return (
    <div className={cn("flex flex-col gap-1.5", containerClassName)}>
      {label && (
        <label className="text-sm font-medium text-text">
          {label} {props.required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      {type === 'select' ? (
        <select
          ref={ref}
          className={cn(
            "input-field",
            error && "border-red-500 focus:ring-red-500",
            className
          )}
          {...props}
        >
          <option value="">Select...</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          ref={ref}
          className={cn(
            "input-field min-h-[100px] resize-y",
            error && "border-red-500 focus:ring-red-500",
            className
          )}
          {...props}
        />
      ) : (
        <input
          ref={ref}
          type={type}
          className={cn(
            "input-field",
            error && "border-red-500 focus:ring-red-500",
            className
          )}
          {...props}
        />
      )}
      
      {error && (
        <span className="text-xs text-red-500 mt-0.5">{error.message}</span>
      )}
    </div>
  );
});

FormField.displayName = 'FormField';

export default FormField;
