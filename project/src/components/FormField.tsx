import React from 'react';
import { FormField as FormFieldType } from '../types/form';

interface FormFieldProps {
  field: FormFieldType;
  value: string | string[] | boolean;
  error?: string;
  onChange: (id: string, value: string | string[] | boolean) => void;
}

const FormField: React.FC<FormFieldProps> = ({ field, value, error, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target;
    
    if (field.type === 'checkbox') {
      onChange(field.fieldId, (target as HTMLInputElement).checked);
    } else if (field.type === 'radio') {
      onChange(field.fieldId, target.value);
    } else {
      onChange(field.fieldId, target.value);
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    const currentValue = Array.isArray(value) ? value : [];
    
    if (target.checked) {
      onChange(field.fieldId, [...currentValue, target.value]);
    } else {
      onChange(field.fieldId, currentValue.filter(v => v !== target.value));
    }
  };

  const renderField = () => {
    switch (field.type) {
      case 'text':
      case 'tel':
      case 'email':
      case 'date':
        return (
          <input
            type={field.type}
            id={field.fieldId}
            value={value as string || ''}
            placeholder={field.placeholder || ''}
            onChange={handleChange}
            required={field.required}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
            minLength={field.minLength}
            maxLength={field.maxLength}
            data-testid={field.dataTestId}
          />
        );
      
      case 'textarea':
        return (
          <textarea
            id={field.fieldId}
            value={value as string || ''}
            placeholder={field.placeholder || ''}
            onChange={handleChange}
            required={field.required}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
            minLength={field.minLength}
            maxLength={field.maxLength}
            data-testid={field.dataTestId}
            rows={4}
          />
        );
      
      case 'dropdown':
        return (
          <select
            id={field.fieldId}
            value={value as string || ''}
            onChange={handleChange}
            required={field.required}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
            data-testid={field.dataTestId}
          >
            <option value="">Select an option</option>
            {field.options?.map((option) => (
              <option 
                key={option.value} 
                value={option.value}
                data-testid={option.dataTestId}
              >
                {option.label}
              </option>
            ))}
          </select>
        );
      
      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <div key={option.value} className="flex items-center">
                <input
                  type="radio"
                  id={`${field.fieldId}-${option.value}`}
                  name={field.fieldId}
                  value={option.value}
                  checked={(value as string) === option.value}
                  onChange={handleChange}
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500"
                  data-testid={option.dataTestId}
                />
                <label 
                  htmlFor={`${field.fieldId}-${option.value}`}
                  className="text-sm font-medium text-gray-700"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        );
      
      case 'checkbox':
        if (field.options) {
          // Multiple checkboxes (array of values)
          return (
            <div className="space-y-2">
              {field.options.map((option) => (
                <div key={option.value} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`${field.fieldId}-${option.value}`}
                    name={field.fieldId}
                    value={option.value}
                    checked={Array.isArray(value) && value.includes(option.value)}
                    onChange={handleCheckboxChange}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500"
                    data-testid={option.dataTestId}
                  />
                  <label 
                    htmlFor={`${field.fieldId}-${option.value}`}
                    className="text-sm font-medium text-gray-700"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          );
        } else {
          // Single checkbox (boolean value)
          return (
            <div className="flex items-center">
              <input
                type="checkbox"
                id={field.fieldId}
                checked={value as boolean || false}
                onChange={handleChange}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500"
                data-testid={field.dataTestId}
              />
              <label 
                htmlFor={field.fieldId}
                className="text-sm font-medium text-gray-700"
              >
                {field.label}
              </label>
            </div>
          );
        }
      
      default:
        return <p>Unsupported field type: {field.type}</p>;
    }
  };

  return (
    <div className="mb-4">
      {field.type !== 'checkbox' && (
        <label htmlFor={field.fieldId} className="block text-sm font-medium text-gray-700 mb-1">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {renderField()}
      
      {error && (
        <p className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormField;