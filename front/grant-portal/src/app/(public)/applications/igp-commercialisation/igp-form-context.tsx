"use client";

import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { IGPFormData } from "@/lib/schemas/igp-commercialisation";
import { getFromLocalStorage, saveToLocalStorage, removeFromLocalStorage } from "@/lib/utils/localStorage";

interface IGPFormContextType {
  formData: Partial<IGPFormData>;
  currentStep: number;
  isHydrated: boolean;
  updateStepData: (step: number, data: unknown) => void;
  setCurrentStep: (step: number) => void;
  clearFormData: () => void;
  saveProgress: () => void;
}

const IGPFormContext = createContext<IGPFormContextType | undefined>(undefined);

const STORAGE_KEY = "igp_commercialisation_form";
const STEP_KEY = "igp_current_step";

export default function IGPFormContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  // Initialize with empty defaults (matches SSR render)
  const [formData, setFormData] = useState<Partial<IGPFormData>>({});
  const [currentStep, setCurrentStepState] = useState<number>(1);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage AFTER mount (client-only, fixes hydration)
  useEffect(() => {
    const savedFormData = getFromLocalStorage<Partial<IGPFormData>>(STORAGE_KEY);
    const savedStep = getFromLocalStorage<number>(STEP_KEY);

    if (savedFormData) {
      setFormData(savedFormData);
    }
    if (savedStep) {
      setCurrentStepState(savedStep);
    }

    setIsHydrated(true);
  }, []); // Run once on mount

  // Auto-save to LocalStorage whenever formData changes (only after hydration)
  useEffect(() => {
    if (isHydrated && Object.keys(formData).length > 0) {
      saveToLocalStorage(STORAGE_KEY, formData);
    }
  }, [formData, isHydrated]);

  // Save current step (only after hydration)
  useEffect(() => {
    if (isHydrated) {
      saveToLocalStorage(STEP_KEY, currentStep);
    }
  }, [currentStep, isHydrated]);

  const updateStepData = (step: number, data: unknown) => {
    const stepKey = `step${step}_${getStepName(step)}` as keyof IGPFormData;
    setFormData((prev) => ({
      ...prev,
      [stepKey]: data,
    }));
  };

  const setCurrentStep = (step: number) => {
    setCurrentStepState(step);
  };

  const clearFormData = () => {
    setFormData({});
    setCurrentStepState(1);
    removeFromLocalStorage(STORAGE_KEY);
    removeFromLocalStorage(STEP_KEY);
  };

  const saveProgress = () => {
    saveToLocalStorage(STORAGE_KEY, formData);
    saveToLocalStorage(STEP_KEY, currentStep);
  };

  return (
    <IGPFormContext.Provider
      value={{
        formData,
        currentStep,
        isHydrated,
        updateStepData,
        setCurrentStep,
        clearFormData,
        saveProgress,
      }}
    >
      {children}
    </IGPFormContext.Provider>
  );
}

export function useIGPFormContext() {
  const context = useContext(IGPFormContext);
  if (context === undefined) {
    throw new Error(
      "useIGPFormContext must be used within an IGPFormContextProvider"
    );
  }
  return context;
}

// Helper function to get step name from step number
function getStepName(step: number): string {
  const stepNames = [
    "eligibility",
    "organization",
    "business",
    "project",
    "budget",
    "assessment",
    "contact",
  ];
  return stepNames[step - 1] || "unknown";
}
