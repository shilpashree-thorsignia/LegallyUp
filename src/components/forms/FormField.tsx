import React from 'react';

interface FormFieldProps {
  id: string;
  label: string;
  type?: 'text' | 'email' | 'tel' | 'url' | 'date' | 'textarea' | 'select';
  value: string | number | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  options?: { value: string; label: string }[];
  placeholder?: string;
  rows?: number;
  required?: boolean;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  sectionTitle?: string; // Optional title for a group of fields
  error?: string; // Error message to display below the field
}

const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  options,
  placeholder,
  rows = 3,
  required = false,
  className = 'mb-6',
  labelClassName = 'block text-primary font-semibold mb-2 text-sm',
  inputClassName = 'w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent text-sm',
  sectionTitle,
  error,
}) => {
  const commonProps = {
    id,
    name: id,
    value,
    onChange,
    placeholder,
    required,
    className: `${inputClassName} ${error ? 'border-red-500' : ''}`,
    'aria-invalid': error ? true : false,
    'aria-describedby': error ? `${id}-error` : undefined,
  };

  return (
    <div className={className}>
      {sectionTitle && <h3 className="text-lg font-semibold text-primary border-b pb-2 mb-4">{sectionTitle}</h3>}
      <label htmlFor={id} className={labelClassName}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {error && (
        <p id={`${id}-error`} className="text-red-500 text-xs mt-1 flex items-center">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
      {type === 'textarea' ? (
        <textarea {...commonProps} rows={rows}></textarea>
      ) : type === 'select' && options ? (
        <select {...commonProps}>
          <option value="" disabled>{placeholder || `Select ${label}`}</option>
          {options.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      ) : (
        <input type={type} {...commonProps} />
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormField;