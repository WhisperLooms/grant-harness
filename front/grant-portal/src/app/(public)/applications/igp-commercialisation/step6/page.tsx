"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  step6AssessmentSchema,
  Step6AssessmentData,
  IGP_STEPS,
} from "@/lib/schemas/igp-commercialisation";
import { useIGPFormContext } from "../igp-form-context";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { FormProgress } from "@/components/forms/form-progress";
import { FormNavigation } from "@/components/forms/form-navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Step6AssessmentPage() {
  const router = useRouter();
  const { formData, updateStepData, setCurrentStep, saveProgress } = useIGPFormContext();

  const form = useForm<Step6AssessmentData>({
    mode: "onChange", // Enable real-time validation for Next button
    resolver: zodResolver(step6AssessmentSchema),
    defaultValues: formData.step6_assessment || {
      criterion1Response: "",
      criterion2Response: "",
      criterion3Response: "",
      criterion4Response: "",
    },
  });

  // Trigger validation after localStorage hydration (Issue #12 fix)
  useEffect(() => {
    // Only trigger if we have saved data from localStorage
    if (formData.step6_assessment && Object.keys(formData.step6_assessment).length > 0) {
      form.trigger(); // Re-run all validation rules
    }
  }, []); // Run once on mount

  const criterion1Response = form.watch("criterion1Response");
  const criterion2Response = form.watch("criterion2Response");
  const criterion3Response = form.watch("criterion3Response");
  const criterion4Response = form.watch("criterion4Response");

  const onSubmit = (data: Step6AssessmentData) => {
    updateStepData(6, data);
    setCurrentStep(7);
    router.push("/applications/igp-commercialisation/step7");
  };

  const handlePrevious = () => {
    router.push("/applications/igp-commercialisation/step5");
  };

  const handleSaveDraft = () => {
    const currentData = form.getValues();
    updateStepData(6, currentData);
    saveProgress();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <FormProgress
        currentStep={6}
        totalSteps={IGP_STEPS.length}
        steps={IGP_STEPS.map((s) => ({ id: s.id, title: s.title }))}
      />

      <Card>
        <CardHeader>
          <CardTitle>Step 6: Assessment Criteria</CardTitle>
          <CardDescription>
            Provide detailed responses to the assessment criteria. Each response should be 200-5000 characters.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Assessment Information</h3>
                <p className="text-sm">
                  Your application will be assessed against these four criteria. Provide comprehensive responses
                  that clearly demonstrate how your project meets each criterion. Use specific examples and
                  evidence where possible.
                </p>
              </div>

              {/* Criterion 1: Alignment with NRF Priorities */}
              <FormField
                control={form.control}
                name="criterion1Response"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">
                      Criterion 1: Alignment with National Reconstruction Fund (NRF) Priorities
                    </FormLabel>
                    <FormDescription className="text-sm mt-2 mb-3">
                      Describe how your project aligns with the NRF priority areas. Explain the innovative
                      aspects of your product or service and how it addresses national priorities. Discuss
                      the potential for industry transformation and sovereignty.
                    </FormDescription>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your project's alignment with NRF priorities, innovation, and contribution to industry transformation..."
                        {...field}
                        rows={10}
                        className="resize-y"
                      />
                    </FormControl>
                    <FormDescription className="flex justify-between text-xs">
                      <span>Minimum 200 characters, maximum 5000 characters</span>
                      <span className="font-medium">
                        {criterion1Response?.length || 0} / 5000
                      </span>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Criterion 2: Capacity to Deliver */}
              <FormField
                control={form.control}
                name="criterion2Response"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">
                      Criterion 2: Capacity to Deliver the Project
                    </FormLabel>
                    <FormDescription className="text-sm mt-2 mb-3">
                      Demonstrate your organization&apos;s capability to successfully deliver the project. Include
                      information about your team&apos;s expertise, relevant experience, track record, governance
                      structures, and risk management approach. Describe your project management methodology
                      and key milestones.
                    </FormDescription>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your organization's capability, team expertise, project management approach, and risk mitigation strategies..."
                        {...field}
                        rows={10}
                        className="resize-y"
                      />
                    </FormControl>
                    <FormDescription className="flex justify-between text-xs">
                      <span>Minimum 200 characters, maximum 5000 characters</span>
                      <span className="font-medium">
                        {criterion2Response?.length || 0} / 5000
                      </span>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Criterion 3: Market Opportunity */}
              <FormField
                control={form.control}
                name="criterion3Response"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">
                      Criterion 3: Market Opportunity and Commercialisation Potential
                    </FormLabel>
                    <FormDescription className="text-sm mt-2 mb-3">
                      Describe the market opportunity for your product or service. Include market size,
                      target customers, competitive advantage, go-to-market strategy, and revenue projections.
                      Explain how grant funding will accelerate commercialisation and what commercial outcomes
                      are expected.
                    </FormDescription>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the market opportunity, target customers, competitive landscape, commercialisation strategy, and projected outcomes..."
                        {...field}
                        rows={10}
                        className="resize-y"
                      />
                    </FormControl>
                    <FormDescription className="flex justify-between text-xs">
                      <span>Minimum 200 characters, maximum 5000 characters</span>
                      <span className="font-medium">
                        {criterion3Response?.length || 0} / 5000
                      </span>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Criterion 4: Economic Benefits */}
              <FormField
                control={form.control}
                name="criterion4Response"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">
                      Criterion 4: Economic, Social and Environmental Benefits
                    </FormLabel>
                    <FormDescription className="text-sm mt-2 mb-3">
                      Outline the broader benefits of your project beyond commercial success. Include job
                      creation (direct and indirect), economic impact on the region/industry, skills development,
                      export potential, environmental benefits, and contribution to social outcomes. Quantify
                      benefits where possible.
                    </FormDescription>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the economic, social, and environmental benefits including jobs created, industry impact, and community outcomes..."
                        {...field}
                        rows={10}
                        className="resize-y"
                      />
                    </FormControl>
                    <FormDescription className="flex justify-between text-xs">
                      <span>Minimum 200 characters, maximum 5000 characters</span>
                      <span className="font-medium">
                        {criterion4Response?.length || 0} / 5000
                      </span>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                <h4 className="font-semibold text-amber-900 mb-2">Assessment Tips</h4>
                <ul className="text-sm text-amber-800 space-y-1 list-disc list-inside">
                  <li>Be specific and provide evidence to support your claims</li>
                  <li>Use quantifiable metrics where possible (numbers, percentages, timeframes)</li>
                  <li>Address all aspects mentioned in the criterion description</li>
                  <li>Focus on the unique value proposition of your project</li>
                  <li>Ensure responses are comprehensive but concise</li>
                </ul>
              </div>

              <FormNavigation
                currentStep={6}
                totalSteps={IGP_STEPS.length}
                onPrevious={handlePrevious}
                onSave={handleSaveDraft}
                canGoNext={form.formState.isValid}
              />
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
