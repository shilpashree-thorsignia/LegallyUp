import { useState } from 'react';
import { validateFormStep, getRequiredFields } from '../utils/formValidation';

export const useFormValidation = (documentType: string, formData: any, totalSteps: number) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(1);

  const validateCurrentStep = (): boolean => {
    const requiredFields = getRequiredFields(documentType, currentStep);
    const { isValid, errors: validationErrors } = validateFormStep(formData, requiredFields);
    setErrors(validationErrors);
    
    if (!isValid) {
      // Scroll to the first error
      const firstErrorField = Object.keys(validationErrors)[0];
      if (firstErrorField) {
        const element = document.getElementById(firstErrorField);
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element?.focus();
      }
    }
    
    return isValid;
  };

  const nextStep = (): boolean => {
    if (!validateCurrentStep()) {
      return false;
    }
    
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
      return true;
    }
    return false;
  };

  const prevStep = (): void => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      setErrors({});
    }
  };

  const jumpToStep = (step: number): boolean => {
    if (step < currentStep) {
      // Allow going back without validation
      setCurrentStep(step);
      setErrors({});
      return true;
    } else if (step > currentStep) {
      // Only allow going forward if current step is valid
      if (validateCurrentStep()) {
        setCurrentStep(step);
        return true;
      }
      return false;
    }
    return true;
  };

  const validateBeforeSubmit = (): boolean => {
    // Validate all steps up to the current one
    for (let i = 1; i <= currentStep; i++) {
      const requiredFields = getRequiredFields(documentType, i);
      const { isValid, errors: stepErrors } = validateFormStep(formData, requiredFields);
      
      if (!isValid) {
        setErrors(stepErrors);
        // Jump to the first step with errors
        setCurrentStep(i);
        // Scroll to the first error
        const firstErrorField = Object.keys(stepErrors)[0];
        if (firstErrorField) {
          setTimeout(() => {
            const element = document.getElementById(firstErrorField);
            element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element?.focus();
          }, 100);
        }
        return false;
      }
    }
    
    return true;
  };

  return {
    currentStep,
    errors,
    nextStep,
    prevStep,
    jumpToStep,
    validateBeforeSubmit,
    setErrors,
    setCurrentStep: (step: number) => {
      if (step >= 1 && step <= totalSteps) {
        setCurrentStep(step);
      }
    }
  };
};
