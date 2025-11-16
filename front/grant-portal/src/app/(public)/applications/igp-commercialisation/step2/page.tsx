"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  step2OrganizationSchema,
  Step2OrganizationData,
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
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormProgress } from "@/components/forms/form-progress";
import { FormNavigation } from "@/components/forms/form-navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Step2OrganizationPage() {
  const router = useRouter();
  const { formData, isHydrated, updateStepData, setCurrentStep, saveProgress } = useIGPFormContext();

  // Don't initialize form until after hydration completes (Issue #12 fix)
  // This ensures Select components get correct values from localStorage
  if (!isHydrated) {
    return (
      <div className="max-w-4xl mx-auto">
        <FormProgress
          currentStep={2}
          totalSteps={IGP_STEPS.length}
          steps={IGP_STEPS.map((s) => ({ id: s.id, title: s.title }))}
        />
        <Card>
          <CardHeader>
            <CardTitle>Step 2: Organization Details</CardTitle>
            <CardDescription>Loading...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return <Step2Form formData={formData} updateStepData={updateStepData} setCurrentStep={setCurrentStep} saveProgress={saveProgress} router={router} />;
}

// Separate component to ensure hooks are only called after hydration
function Step2Form({ formData, updateStepData, setCurrentStep, saveProgress, router }: {
  formData: Partial<IGPFormData>;
  updateStepData: (step: number, data: unknown) => void;
  setCurrentStep: (step: number) => void;
  saveProgress: () => void;
  router: ReturnType<typeof useRouter>;
}) {
  const form = useForm<Step2OrganizationData>({
    mode: "onChange", // Enable real-time validation for Next button
    resolver: zodResolver(step2OrganizationSchema),
    defaultValues: formData.step2_organization || {
      abn: "",
      legalEntityName: "",
      tradingName: "",
      businessStreetAddress: "",
      businessSuburb: "",
      businessState: "" as any, // Empty string keeps Select controlled
      businessPostcode: "",
      postalAddressSameAsBusiness: true,
      postalStreetAddress: undefined,
      postalSuburb: undefined,
      postalState: undefined,
      postalPostcode: undefined,
      mostRecentYearTurnover: 0,
      mostRecentYearTotalAssets: 0,
      existedCompleteFinancialYear: "" as any, // Empty string keeps RadioGroup controlled
      previousYearTurnover: 0,
      previousYearTotalAssets: 0,
      numberOfEmployees: 0,
      numberOfContractors: 0,
      indigenousOwnership: "" as any, // Empty string keeps Select controlled
    },
  });

  const postalSameAsBusiness = form.watch("postalAddressSameAsBusiness");
  const existedCompleteFinancialYear = form.watch("existedCompleteFinancialYear");

  // Trigger validation after form loads with localStorage data
  useEffect(() => {
    form.trigger();
  }, [form]);

  const onSubmit = (data: Step2OrganizationData) => {
    updateStepData(2, data);
    setCurrentStep(3);
    router.push("/applications/igp-commercialisation/step3");
  };

  const handlePrevious = () => {
    router.push("/applications/igp-commercialisation/step1");
  };

  const handleSaveDraft = () => {
    const currentData = form.getValues();
    updateStepData(2, currentData);
    saveProgress();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <FormProgress
        currentStep={2}
        totalSteps={IGP_STEPS.length}
        steps={IGP_STEPS.map((s) => ({ id: s.id, title: s.title }))}
      />

      <Card>
        <CardHeader>
          <CardTitle>Step 2: Organization Details</CardTitle>
          <CardDescription>
            Provide your organization&apos;s legal and financial information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              {/* ABN */}
              <FormField
                control={form.control}
                name="abn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Australian Business Number (ABN)</FormLabel>
                    <FormControl>
                      <Input placeholder="11 digit ABN" {...field} maxLength={11} />
                    </FormControl>
                    <FormDescription>Enter your 11-digit ABN without spaces</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Legal Entity Name */}
              <FormField
                control={form.control}
                name="legalEntityName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Legal Entity Name</FormLabel>
                    <FormControl>
                      <Input placeholder="As registered with ASIC" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Trading Name */}
              <FormField
                control={form.control}
                name="tradingName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trading Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Business trading name" {...field} />
                    </FormControl>
                    <FormDescription>The name your business operates under</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Business Address</h3>

                {/* Business Street Address */}
                <FormField
                  control={form.control}
                  name="businessStreetAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main Street" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  {/* Business Suburb */}
                  <FormField
                    control={form.control}
                    name="businessSuburb"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Suburb</FormLabel>
                        <FormControl>
                          <Input placeholder="Suburb" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Business State */}
                  <FormField
                    control={form.control}
                    name="businessState"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="NSW">NSW</SelectItem>
                            <SelectItem value="VIC">VIC</SelectItem>
                            <SelectItem value="QLD">QLD</SelectItem>
                            <SelectItem value="SA">SA</SelectItem>
                            <SelectItem value="WA">WA</SelectItem>
                            <SelectItem value="TAS">TAS</SelectItem>
                            <SelectItem value="NT">NT</SelectItem>
                            <SelectItem value="ACT">ACT</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Business Postcode */}
                  <FormField
                    control={form.control}
                    name="businessPostcode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postcode</FormLabel>
                        <FormControl>
                          <Input placeholder="2000" {...field} maxLength={4} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Postal Address</h3>

                {/* Postal Address Same as Business */}
                <FormField
                  control={form.control}
                  name="postalAddressSameAsBusiness"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 mb-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Postal address is the same as business address</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                {!postalSameAsBusiness && (
                  <>
                    {/* Postal Street Address */}
                    <FormField
                      control={form.control}
                      name="postalStreetAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Street Address</FormLabel>
                          <FormControl>
                            <Input placeholder="PO Box or street address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      {/* Postal Suburb */}
                      <FormField
                        control={form.control}
                        name="postalSuburb"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Suburb</FormLabel>
                            <FormControl>
                              <Input placeholder="Suburb" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Postal State */}
                      <FormField
                        control={form.control}
                        name="postalState"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select state" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="NSW">NSW</SelectItem>
                                <SelectItem value="VIC">VIC</SelectItem>
                                <SelectItem value="QLD">QLD</SelectItem>
                                <SelectItem value="SA">SA</SelectItem>
                                <SelectItem value="WA">WA</SelectItem>
                                <SelectItem value="TAS">TAS</SelectItem>
                                <SelectItem value="NT">NT</SelectItem>
                                <SelectItem value="ACT">ACT</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Postal Postcode */}
                      <FormField
                        control={form.control}
                        name="postalPostcode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Postcode</FormLabel>
                            <FormControl>
                              <Input placeholder="2000" {...field} maxLength={4} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Financial Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Most Recent Year Turnover */}
                  <FormField
                    control={form.control}
                    name="mostRecentYearTurnover"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Most Recent Year Turnover ($)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Most Recent Year Total Assets */}
                  <FormField
                    control={form.control}
                    name="mostRecentYearTotalAssets"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Most Recent Year Total Assets ($)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Existed Complete Financial Year */}
                <FormField
                  control={form.control}
                  name="existedCompleteFinancialYear"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>
                        Has your organization existed for at least one complete financial year?
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="space-y-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="financial-year-yes" />
                            <label htmlFor="financial-year-yes" className="text-sm font-normal cursor-pointer">
                              Yes
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="financial-year-no" />
                            <label htmlFor="financial-year-no" className="text-sm font-normal cursor-pointer">
                              No
                            </label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {existedCompleteFinancialYear === "yes" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {/* Previous Year Turnover */}
                    <FormField
                      control={form.control}
                      name="previousYearTurnover"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Previous Year Turnover ($)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Previous Year Total Assets */}
                    <FormField
                      control={form.control}
                      name="previousYearTotalAssets"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Previous Year Total Assets ($)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Employment</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Number of Employees */}
                  <FormField
                    control={form.control}
                    name="numberOfEmployees"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Employees</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormDescription>Full-time equivalent employees</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Number of Contractors */}
                  <FormField
                    control={form.control}
                    name="numberOfContractors"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Contractors</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormDescription>Full-time equivalent contractors</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Diversity Information</h3>

                {/* Indigenous Ownership */}
                <FormField
                  control={form.control}
                  name="indigenousOwnership"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Is your organization Indigenous-owned?</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Indigenous ownership status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="yes_50_percent_or_more">
                            Yes, 50% or more Indigenous ownership
                          </SelectItem>
                          <SelectItem value="yes_less_than_50_percent">
                            Yes, less than 50% Indigenous ownership
                          </SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormNavigation
                currentStep={2}
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
