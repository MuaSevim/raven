/**
 * useMultiStepForm - Custom hook for multi-step form navigation
 * Eliminates duplicate stepper logic across SignUpScreen, PostTripScreen, CreateShipmentScreen
 */
import { useState, useCallback } from 'react';

export interface UseMultiStepFormOptions<T> {
  /** Initial form data */
  initialData: T;
  /** Total number of steps */
  totalSteps: number;
  /** Validation function for each step (optional) */
  validateStep?: (step: number, data: T) => boolean | Promise<boolean>;
  /** Callback when form is submitted (last step) */
  onSubmit?: (data: T) => void | Promise<void>;
  /** Callback when navigating back from step 1 */
  onCancel?: () => void;
}

export interface UseMultiStepFormReturn<T> {
  /** Current step (1-indexed) */
  currentStep: number;
  /** Total number of steps */
  totalSteps: number;
  /** Form data */
  formData: T;
  /** Whether currently on last step */
  isLastStep: boolean;
  /** Whether currently on first step */
  isFirstStep: boolean;
  /** Update a single field */
  updateField: <K extends keyof T>(field: K, value: T[K]) => void;
  /** Update multiple fields at once */
  updateFields: (fields: Partial<T>) => void;
  /** Go to next step (validates and submits on last step) */
  handleNext: () => Promise<boolean>;
  /** Go to previous step */
  handleBack: () => void;
  /** Go to specific step */
  goToStep: (step: number) => void;
  /** Reset form to initial state */
  reset: () => void;
  /** Progress percentage (0-100) */
  progress: number;
}

/**
 * Custom hook for managing multi-step form state and navigation
 *
 * @example
 * const {
 *   currentStep,
 *   formData,
 *   updateField,
 *   handleNext,
 *   handleBack,
 *   isLastStep,
 * } = useMultiStepForm({
 *   initialData: { name: '', email: '' },
 *   totalSteps: 3,
 *   validateStep: (step, data) => {
 *     if (step === 1 && !data.name) return false;
 *     return true;
 *   },
 *   onSubmit: (data) => console.log('Submit:', data),
 *   onCancel: () => navigation.goBack(),
 * });
 */
export function useMultiStepForm<T extends Record<string, unknown>>({
  initialData,
  totalSteps,
  validateStep,
  onSubmit,
  onCancel,
}: UseMultiStepFormOptions<T>): UseMultiStepFormReturn<T> {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<T>(initialData);

  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;
  const progress = (currentStep / totalSteps) * 100;

  const updateField = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const updateFields = useCallback((fields: Partial<T>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  }, []);

  const handleNext = useCallback(async (): Promise<boolean> => {
    // Validate current step if validator provided
    if (validateStep) {
      const isValid = await validateStep(currentStep, formData);
      if (!isValid) return false;
    }

    if (isLastStep) {
      // Submit on last step
      if (onSubmit) {
        await onSubmit(formData);
      }
      return true;
    }

    // Go to next step
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    return true;
  }, [currentStep, formData, isLastStep, onSubmit, totalSteps, validateStep]);

  const handleBack = useCallback(() => {
    if (isFirstStep) {
      onCancel?.();
    } else {
      setCurrentStep((prev) => Math.max(prev - 1, 1));
    }
  }, [isFirstStep, onCancel]);

  const goToStep = useCallback(
    (step: number) => {
      if (step >= 1 && step <= totalSteps) {
        setCurrentStep(step);
      }
    },
    [totalSteps]
  );

  const reset = useCallback(() => {
    setCurrentStep(1);
    setFormData(initialData);
  }, [initialData]);

  return {
    currentStep,
    totalSteps,
    formData,
    isLastStep,
    isFirstStep,
    updateField,
    updateFields,
    handleNext,
    handleBack,
    goToStep,
    reset,
    progress,
  };
}
