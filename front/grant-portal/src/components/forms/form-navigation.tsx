"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Save } from "lucide-react";

interface FormNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevious?: () => void;
  onSave?: () => void;
  isSubmitting?: boolean;
  canGoNext?: boolean;
}

export function FormNavigation({
  currentStep,
  totalSteps,
  onPrevious,
  onSave,
  isSubmitting = false,
  canGoNext = true,
}: FormNavigationProps) {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  return (
    <div className="flex items-center justify-between pt-6 border-t">
      {/* Previous Button */}
      <Button
        type="button"
        variant="outline"
        onClick={onPrevious}
        disabled={isFirstStep || isSubmitting}
        className="flex items-center gap-2"
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </Button>

      <div className="flex items-center gap-3">
        {/* Save Draft Button */}
        {onSave && !isLastStep && (
          <Button
            type="button"
            variant="outline"
            onClick={onSave}
            disabled={isSubmitting}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Draft
          </Button>
        )}

        {/* Next/Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting || !canGoNext}
          className="flex items-center gap-2"
        >
          {isSubmitting ? (
            "Processing..."
          ) : isLastStep ? (
            "Submit Application"
          ) : (
            <>
              Next
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
