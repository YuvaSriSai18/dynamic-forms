import React, { useState, useEffect } from 'react';
import { FormSection as FormSectionType, FormResponse, FormValues, FormErrors, FieldError } from '../types/form';
import FormSection from './FormSection';
import { CheckCircle } from 'lucide-react';

interface DynamicFormProps {
  formData: FormResponse;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ formData }) => {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [formValues, setFormValues] = useState<FormValues>({});
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { form } = formData;
  const currentSection = form.sections[currentSectionIndex];

  const validateSection = (sectionIndex: number): boolean => {
    const section = form.sections[sectionIndex];
    const errors: FieldError = {};
    let isValid = true;

    section.fields.forEach((field) => {
      const value = formValues[field.fieldId];
      
      // Required field validation
      if (field.required) {
        if (field.type === 'checkbox' && field.options) {
          // For checkbox groups, check if at least one option is selected
          if (!value || (Array.isArray(value) && value.length === 0)) {
            errors[field.fieldId] = field.validation?.message || 'This field is required';
            isValid = false;
          }
        } else if (!value || (typeof value === 'string' && value.trim() === '')) {
          errors[field.fieldId] = field.validation?.message || 'This field is required';
          isValid = false;
        }
      }

      // Min length validation
      if (
        field.minLength && 
        typeof value === 'string' && 
        value.trim() !== '' && 
        value.length < field.minLength
      ) {
        errors[field.fieldId] = field.validation?.message || `Minimum ${field.minLength} characters required`;
        isValid = false;
      }

      // Max length validation
      if (
        field.maxLength && 
        typeof value === 'string' && 
        value.length > field.maxLength
      ) {
        errors[field.fieldId] = field.validation?.message || `Maximum ${field.maxLength} characters allowed`;
        isValid = false;
      }

      // Email validation
      if (
        field.type === 'email' && 
        typeof value === 'string' && 
        value.trim() !== '' && 
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      ) {
        errors[field.fieldId] = field.validation?.message || 'Please enter a valid email address';
        isValid = false;
      }

      // Phone number validation
      if (
        field.type === 'tel' && 
        typeof value === 'string' && 
        value.trim() !== '' && 
        !/^\d{10}$/.test(value.replace(/\D/g, ''))
      ) {
        errors[field.fieldId] = field.validation?.message || 'Please enter a valid 10-digit phone number';
        isValid = false;
      }
    });

    // Update errors for the current section
    setFormErrors((prev) => ({
      ...prev,
      [sectionIndex]: errors,
    }));

    return isValid;
  };

  const handleFieldChange = (fieldId: string, value: string | string[] | boolean) => {
    setFormValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }));

    // Clear error when field is changed
    if (formErrors[currentSectionIndex]?.[fieldId]) {
      const updatedSectionErrors = { ...formErrors[currentSectionIndex] };
      delete updatedSectionErrors[fieldId];
      
      setFormErrors((prev) => ({
        ...prev,
        [currentSectionIndex]: updatedSectionErrors,
      }));
    }
  };

  const handlePrevious = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
    }
  };

  const handleNext = () => {
    const isValid = validateSection(currentSectionIndex);
    
    if (isValid && currentSectionIndex < form.sections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
    }
  };

  const handleSubmit = () => {
    const isValid = validateSection(currentSectionIndex);
    
    if (isValid) {
      console.log('Form submitted with data:', formValues);
      setIsSubmitted(true);
    }
  };

  // Calculate progress percentage
  const progressPercentage = ((currentSectionIndex + 1) / form.sections.length) * 100;

  if (isSubmitted) {
    return (
      <div className="w-full max-w-2xl p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Form Submitted Successfully!</h2>
          <p className="mt-2 text-gray-600">
            Thank you for completing the form. Your responses have been recorded.
          </p>
          <div className="mt-6 p-4 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-500">
              The form data has been logged to the console. You can check the browser console to view the submitted data.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{form.formTitle}</h1>
        <div className="mt-4 bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <div className="mt-2 text-sm text-gray-600">
          Section {currentSectionIndex + 1} of {form.sections.length}
        </div>
      </div>

      <FormSection
        section={currentSection}
        values={formValues}
        errors={formErrors[currentSectionIndex] || {}}
        onChange={handleFieldChange}
        currentSection={currentSectionIndex}
        totalSections={form.sections.length}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default DynamicForm;