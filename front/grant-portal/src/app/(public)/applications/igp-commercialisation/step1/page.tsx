"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  step1EligibilitySchema,
  Step1EligibilityData,
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { FormProgress } from "@/components/forms/form-progress";
import { FormNavigation } from "@/components/forms/form-navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Step1EligibilityPage() {
  const router = useRouter();
  const { formData, updateStepData, setCurrentStep, saveProgress } = useIGPFormContext();

  const form = useForm<Step1EligibilityData>({
    mode: "onChange", // Enable real-time validation for Next button
    resolver: zodResolver(step1EligibilitySchema),
    defaultValues: formData.step1_eligibility || {
      entityType: undefined,
      receivedAdvisoryReport: undefined,
      advisoryApplicationNumber: "",
      isNonTaxExempt: undefined,
      isGSTRegistered: undefined,
      hasInnovativeProductInNRF: undefined,
      annualTurnoverUnder20M: undefined,
      hasIPOwnership: undefined,
      canProvideFundingEvidence: undefined,
    },
  });

  const receivedAdvisoryReport = form.watch("receivedAdvisoryReport");

  const onSubmit = (data: Step1EligibilityData) => {
    updateStepData(1, data);
    setCurrentStep(2);
    router.push("/applications/igp-commercialisation/step2");
  };

  const handleSaveDraft = () => {
    const currentData = form.getValues();
    updateStepData(1, currentData);
    saveProgress();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <FormProgress
        currentStep={1}
        totalSteps={IGP_STEPS.length}
        steps={IGP_STEPS.map((s) => ({ id: s.id, title: s.title }))}
      />

      <Card>
        <CardHeader>
          <CardTitle>Step 1: Eligibility Check</CardTitle>
          <CardDescription>
            Confirm your organization meets the basic eligibility criteria for the Industry Growth Program
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Entity Type */}
              <FormField
                control={form.control}
                name="entityType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What is your entity type?</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="company_incorporated_australia" id="entity-company" />
                          <label htmlFor="entity-company" className="text-sm font-normal cursor-pointer">
                            Company incorporated in Australia
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="cooperative" id="entity-coop" />
                          <label htmlFor="entity-coop" className="text-sm font-normal cursor-pointer">
                            Cooperative
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="incorporated_trustee" id="entity-trustee" />
                          <label htmlFor="entity-trustee" className="text-sm font-normal cursor-pointer">
                            Incorporated trustee on behalf of a trust
                          </label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Advisory Service Report */}
              <FormField
                control={form.control}
                name="receivedAdvisoryReport"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Have you received an Industry Growth Program Advisory Service Report?
                    </FormLabel>
                    <FormDescription>
                      If you have completed the Advisory Service, you may be eligible for additional support
                    </FormDescription>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="advisory-yes" />
                          <label htmlFor="advisory-yes" className="text-sm font-normal cursor-pointer">
                            Yes
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="advisory-no" />
                          <label htmlFor="advisory-no" className="text-sm font-normal cursor-pointer">
                            No
                          </label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Advisory Application Number (conditional) */}
              {receivedAdvisoryReport === "yes" && (
                <FormField
                  control={form.control}
                  name="advisoryApplicationNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Advisory Service Application Number</FormLabel>
                      <FormDescription>
                        Please provide your Advisory Service application number
                      </FormDescription>
                      <FormControl>
                        <Input placeholder="e.g., IGP-ADV-2024-12345" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Non-Tax Exempt */}
              <FormField
                control={form.control}
                name="isNonTaxExempt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Is your organization non-tax-exempt?</FormLabel>
                    <FormDescription>
                      Tax-exempt organizations are not eligible for this program
                    </FormDescription>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="tax-yes" />
                          <label htmlFor="tax-yes" className="text-sm font-normal cursor-pointer">
                            Yes, we are non-tax-exempt
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="tax-no" />
                          <label htmlFor="tax-no" className="text-sm font-normal cursor-pointer">
                            No, we are tax-exempt
                          </label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* GST Registered */}
              <FormField
                control={form.control}
                name="isGSTRegistered"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Is your organization registered for GST?</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="gst-yes" />
                          <label htmlFor="gst-yes" className="text-sm font-normal cursor-pointer">
                            Yes
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="gst-no" />
                          <label htmlFor="gst-no" className="text-sm font-normal cursor-pointer">
                            No
                          </label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Innovative Product in NRF */}
              <FormField
                control={form.control}
                name="hasInnovativeProductInNRF"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Do you have an innovative product/service in a National Reconstruction Fund (NRF) priority area?
                    </FormLabel>
                    <FormDescription>
                      NRF priority areas include: Resources, Agriculture, Transport, Medical Science, Renewables, Defence, and Enabling Capabilities
                    </FormDescription>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="nrf-yes" />
                          <label htmlFor="nrf-yes" className="text-sm font-normal cursor-pointer">
                            Yes
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="nrf-no" />
                          <label htmlFor="nrf-no" className="text-sm font-normal cursor-pointer">
                            No
                          </label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Annual Turnover */}
              <FormField
                control={form.control}
                name="annualTurnoverUnder20M"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Is your annual turnover under $20 million?</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="turnover-yes" />
                          <label htmlFor="turnover-yes" className="text-sm font-normal cursor-pointer">
                            Yes
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="turnover-no" />
                          <label htmlFor="turnover-no" className="text-sm font-normal cursor-pointer">
                            No
                          </label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* IP Ownership */}
              <FormField
                control={form.control}
                name="hasIPOwnership"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Does your organization own or have rights to the intellectual property (IP)?</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="ip-yes" />
                          <label htmlFor="ip-yes" className="text-sm font-normal cursor-pointer">
                            Yes
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="ip-no" />
                          <label htmlFor="ip-no" className="text-sm font-normal cursor-pointer">
                            No
                          </label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Funding Evidence */}
              <FormField
                control={form.control}
                name="canProvideFundingEvidence"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Can you provide evidence of co-funding for the project?</FormLabel>
                    <FormDescription>
                      You must contribute at least 50% of the total project costs
                    </FormDescription>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="funding-yes" />
                          <label htmlFor="funding-yes" className="text-sm font-normal cursor-pointer">
                            Yes
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="funding-no" />
                          <label htmlFor="funding-no" className="text-sm font-normal cursor-pointer">
                            No
                          </label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormNavigation
                currentStep={1}
                totalSteps={IGP_STEPS.length}
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
