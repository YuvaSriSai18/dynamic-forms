import React from 'react';
import { FormSection as FormSectionType, FormValues, FieldError } from '../types/form';
import FormField from './FormField';

interface FormSectionProps {
  section: FormSectionType;
  values: FormValues;
  errors: FieldError;
  onChange: (id: string, value: string | string[] | boolean) => void;
  currentSection: number;
  totalSections: number;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

const FormSection: React.FC<FormSectionProps> = ({
  section,
  values,
  errors,
  onChange,
  currentSection,
  totalSections,
  onPrevious,
  onNext,
  onSubmit,
}) => {
  const isFirstSection = currentSection === 0;
  const isLastSection = currentSection === totalSections - 1;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 animate-fadeIn">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">{section.title}</h2>
      <p className="text-gray-600 mb-6">{section.description}</p>

      <div className="space-y-4">
        {section.fields.map((field) => (
          <FormField
            key={field.fieldId}
            field={field}
            value={values[field.fieldId] || (field.type === 'checkbox' ? false : '')}
            error={errors[field.fieldId]}
            onChange={onChange}
          />
        ))}
      </div>

      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={onPrevious}
          disabled={isFirstSection}
          className={`px-4 py-2 rounded-md ${
            isFirstSection
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors'
          }`}
        >
          Previous
        </button>

        {isLastSection ? (
          <button
            type="button"
            onClick={onSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Submit
          </button>
        ) : (
          <button
            type="button"
            onClick={onNext}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default FormSection;