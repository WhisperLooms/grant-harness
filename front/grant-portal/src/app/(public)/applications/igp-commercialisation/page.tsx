"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useIGPFormContext } from "./igp-form-context";

export default function IGPApplicationPage() {
  const router = useRouter();
  const { currentStep } = useIGPFormContext();

  useEffect(() => {
    // Redirect to the current step (or step 1 if starting fresh)
    router.push(`/applications/igp-commercialisation/step${currentStep}`);
  }, [currentStep, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Loading Application...</h2>
        <p className="text-gray-600">Redirecting to your current step</p>
      </div>
    </div>
  );
}
