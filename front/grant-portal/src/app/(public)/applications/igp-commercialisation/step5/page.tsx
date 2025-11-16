"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  step5BudgetSchema,
  Step5BudgetData,
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
import { FormProgress } from "@/components/forms/form-progress";
import { FormNavigation } from "@/components/forms/form-navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Step5BudgetPage() {
  const router = useRouter();
  const { formData, updateStepData, setCurrentStep, saveProgress } = useIGPFormContext();

  const form = useForm<Step5BudgetData>({
    mode: "onChange", // Enable real-time validation for Next button
    resolver: zodResolver(step5BudgetSchema),
    defaultValues: formData.step5_budget || {
      labourCosts: 0,
      labourOnCosts: 0,
      contractCosts: 0,
      capitalisedExpenditure: 0,
      travelCosts: 0,
      otherCosts: 0,
      totalEligibleExpenditure: 0,
      grantAmountSought: 0,
      applicantCashContribution: 0,
      otherGovernmentFunding: 0,
    },
  });

  // Trigger validation after form loads (Issue #12 fix)
  useEffect(() => {
    form.trigger();
  }, [form]);

  // Watch all cost fields for the summary
  const labourCosts = form.watch("labourCosts") || 0;
  const labourOnCosts = form.watch("labourOnCosts") || 0;
  const contractCosts = form.watch("contractCosts") || 0;
  const capitalisedExpenditure = form.watch("capitalisedExpenditure") || 0;
  const travelCosts = form.watch("travelCosts") || 0;
  const otherCosts = form.watch("otherCosts") || 0;
  const totalEligibleExpenditure = form.watch("totalEligibleExpenditure") || 0;
  const grantAmountSought = form.watch("grantAmountSought") || 0;

  // Calculate sum of cost categories
  const calculatedTotal = labourCosts + labourOnCosts + contractCosts +
                         capitalisedExpenditure + travelCosts + otherCosts;

  const onSubmit = (data: Step5BudgetData) => {
    updateStepData(5, data);
    setCurrentStep(6);
    router.push("/applications/igp-commercialisation/step6");
  };

  const handlePrevious = () => {
    router.push("/applications/igp-commercialisation/step4");
  };

  const handleSaveDraft = () => {
    const currentData = form.getValues();
    updateStepData(5, currentData);
    saveProgress();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <FormProgress
        currentStep={5}
        totalSteps={IGP_STEPS.length}
        steps={IGP_STEPS.map((s) => ({ id: s.id, title: s.title }))}
      />

      <Card>
        <CardHeader>
          <CardTitle>Step 5: Project Budget</CardTitle>
          <CardDescription>
            Provide detailed budget information for your project. All amounts in Australian dollars (AUD).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="bg-muted p-4 rounded-lg mb-6">
                <h3 className="font-semibold mb-2">Budget Requirements</h3>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Minimum total eligible expenditure: $200,000</li>
                  <li>Grant amount: $100,000 - $5,000,000</li>
                  <li>Labour on-costs limited to 30% of labour costs</li>
                  <li>Travel costs limited to 10% of total expenditure</li>
                  <li>Capitalised expenditure limited to 25% of total expenditure</li>
                  <li>Sum of cost categories must equal total eligible expenditure</li>
                </ul>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Cost Categories</h3>

                {/* Labour Costs */}
                <FormField
                  control={form.control}
                  name="labourCosts"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Labour Costs ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormDescription>
                        Direct salary costs for project staff
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Labour On-Costs */}
                <FormField
                  control={form.control}
                  name="labourOnCosts"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Labour On-Costs ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormDescription>
                        Maximum 30% of labour costs. Includes superannuation, payroll tax, workers compensation.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Contract Costs */}
                <FormField
                  control={form.control}
                  name="contractCosts"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Contract Costs ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormDescription>
                        Costs for consultants and contractors
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Capitalised Expenditure */}
                <FormField
                  control={form.control}
                  name="capitalisedExpenditure"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Capitalised Expenditure ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormDescription>
                        Maximum 25% of total expenditure. Equipment, machinery, software licenses.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Travel Costs */}
                <FormField
                  control={form.control}
                  name="travelCosts"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Travel Costs ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormDescription>
                        Maximum 10% of total expenditure. Project-related travel only.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Other Costs */}
                <FormField
                  control={form.control}
                  name="otherCosts"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Other Eligible Costs ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormDescription>
                        Other project costs not covered above
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Budget Summary */}
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Cost Categories Summary</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Labour Costs:</span>
                      <span>{formatCurrency(labourCosts)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Labour On-Costs:</span>
                      <span>{formatCurrency(labourOnCosts)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Contract Costs:</span>
                      <span>{formatCurrency(contractCosts)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Capitalised Expenditure:</span>
                      <span>{formatCurrency(capitalisedExpenditure)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Travel Costs:</span>
                      <span>{formatCurrency(travelCosts)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Other Costs:</span>
                      <span>{formatCurrency(otherCosts)}</span>
                    </div>
                    <div className="flex justify-between font-semibold border-t pt-1 mt-1">
                      <span>Calculated Total:</span>
                      <span>{formatCurrency(calculatedTotal)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Total Project Budget</h3>

                {/* Total Eligible Expenditure */}
                <FormField
                  control={form.control}
                  name="totalEligibleExpenditure"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Eligible Expenditure ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="200000"
                          placeholder="Minimum $200,000"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormDescription>
                        Must be at least $200,000. Should equal the sum of cost categories above.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Grant Amount Sought */}
                <FormField
                  control={form.control}
                  name="grantAmountSought"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Grant Amount Sought ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="100000"
                          max="5000000"
                          placeholder="$100,000 - $5,000,000"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormDescription>
                        Grant amount must be between $100,000 and $5,000,000
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Applicant Cash Contribution */}
                <FormField
                  control={form.control}
                  name="applicantCashContribution"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Applicant Cash Contribution ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          placeholder="Your cash contribution"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormDescription>
                        Your organization&apos;s cash contribution to the project
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Other Government Funding */}
                <FormField
                  control={form.control}
                  name="otherGovernmentFunding"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Other Government Funding (Optional) ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormDescription>
                        Any other government funding secured for this project
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Funding Summary */}
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Funding Summary</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Total Eligible Expenditure:</span>
                      <span className="font-semibold">{formatCurrency(totalEligibleExpenditure)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Grant Amount Sought:</span>
                      <span>{formatCurrency(grantAmountSought)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Grant Percentage:</span>
                      <span>
                        {totalEligibleExpenditure > 0
                          ? `${((grantAmountSought / totalEligibleExpenditure) * 100).toFixed(1)}%`
                          : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <FormNavigation
                currentStep={5}
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
