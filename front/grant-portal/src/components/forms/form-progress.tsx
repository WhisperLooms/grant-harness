"use client";

import { Progress } from "@/components/ui/progress";
import { Check } from "lucide-react";

interface FormProgressProps {
  currentStep: number;
  totalSteps: number;
  steps: Array<{ id: number; title: string }>;
}

export function FormProgress({ currentStep, totalSteps, steps }: FormProgressProps) {
  const progressValue = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full mb-8">
      {/* Progress Bar */}
      <Progress value={progressValue} className="h-2 mb-6" />

      {/* Step Indicators */}
      <div className="flex justify-between items-start">
        {steps.map((step) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;
          const isUpcoming = step.id > currentStep;

          return (
            <div key={step.id} className="flex flex-col items-center flex-1">
              {/* Circle Indicator */}
              <div
                className={`
                  flex items-center justify-center w-10 h-10 rounded-full border-2 mb-2
                  ${isCompleted ? "bg-green-600 border-green-600 text-white" : ""}
                  ${isCurrent ? "bg-blue-600 border-blue-600 text-white" : ""}
                  ${isUpcoming ? "bg-white border-gray-300 text-gray-400" : ""}
                `}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-semibold">{step.id}</span>
                )}
              </div>

              {/* Step Title */}
              <div
                className={`
                  text-xs text-center max-w-[100px]
                  ${isCurrent ? "font-semibold text-blue-600" : ""}
                  ${isCompleted ? "text-gray-700" : ""}
                  ${isUpcoming ? "text-gray-400" : ""}
                `}
              >
                {step.title}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
