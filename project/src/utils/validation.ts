import { FormField, FormValues } from '../types/form';

export const validateField = (field: FormField, value: string | string[] | boolean): string | null => {
  // Required field validation
  if (field.required) {
    if (field.type === 'checkbox' && field.options) {
      // For checkbox groups, check if at least one option is selected
      if (!value || (Array.isArray(value) && value.length === 0)) {
        return field.validation?.message || 'This field is required';
      }
    } else if (!value || (typeof value === 'string' && value.trim() === '')) {
      return field.validation?.message || 'This field is required';
    }
  }

  // If the field is not required and empty, skip other validations
  if (typeof value === 'string' && value.trim() === '') {
    return null;
  }

  // Min length validation
  if (
    field.minLength && 
    typeof value === 'string' && 
    value.length < field.minLength
  ) {
    return field.validation?.message || `Minimum ${field.minLength} characters required`;
  }

  // Max length validation
  if (
    field.maxLength && 
    typeof value === 'string' && 
    value.length > field.maxLength
  ) {
    return field.validation?.message || `Maximum ${field.maxLength} characters allowed`;
  }

  // Email validation
  if (
    field.type === 'email' && 
    typeof value === 'string' && 
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  ) {
    return field.validation?.message || 'Please enter a valid email address';
  }

  // Phone number validation
  if (
    field.type === 'tel' && 
    typeof value === 'string' && 
    !/^\d{10}$/.test(value.replace(/\D/g, ''))
  ) {
    return field.validation?.message || 'Please enter a valid 10-digit phone number';
  }

  return null;
};

export const validateFormSection = (fields: FormField[], values: FormValues): Record<string, string> => {
  const errors: Record<string, string> = {};

  fields.forEach((field) => {
    const value = values[field.fieldId];
    const error = validateField(field, value);
    
    if (error) {
      errors[field.fieldId] = error;
    }
  });

  return errors;
};