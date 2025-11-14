"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  step3BusinessSchema,
  Step3BusinessData,
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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormProgress } from "@/components/forms/form-progress";
import { FormNavigation } from "@/components/forms/form-navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Step3BusinessPage() {
  const router = useRouter();
  const { formData, updateStepData, setCurrentStep, saveProgress } = useIGPFormContext();

  const form = useForm<Step3BusinessData>({
    resolver: zodResolver(step3BusinessSchema),
    defaultValues: formData.step3_business || {
      businessDescription: "",
      companyWebsite: "",
      companyVideo: "",
      hasHoldingCompany: undefined,
      holdingCompanyName: "",
      holdingCompanyAbn: "",
      year1Revenue: 0,
      year1GrossProfit: 0,
      year1NetProfit: 0,
      year2Revenue: 0,
      year2GrossProfit: 0,
      year2NetProfit: 0,
      year3Revenue: 0,
      year3GrossProfit: 0,
      year3NetProfit: 0,
      womenOwnershipStatus: undefined,
    },
  });

  const businessDescription = form.watch("businessDescription");
  const hasHoldingCompany = form.watch("hasHoldingCompany");

  const onSubmit = (data: Step3BusinessData) => {
    updateStepData(3, data);
    setCurrentStep(4);
    router.push("/applications/igp-commercialisation/step4");
  };

  const handlePrevious = () => {
    router.push("/applications/igp-commercialisation/step2");
  };

  const handleSaveDraft = () => {
    const currentData = form.getValues();
    updateStepData(3, currentData);
    saveProgress();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <FormProgress
        currentStep={3}
        totalSteps={IGP_STEPS.length}
        steps={IGP_STEPS.map((s) => ({ id: s.id, title: s.title }))}
      />

      <Card>
        <CardHeader>
          <CardTitle>Step 3: Business Information</CardTitle>
          <CardDescription>
            Tell us about your business, its history, and trading performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Business Description */}
              <FormField
                control={form.control}
                name="businessDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Description (50-500 characters)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your business, its products/services, and target markets..."
                        {...field}
                        rows={5}
                      />
                    </FormControl>
                    <FormDescription>
                      {businessDescription?.length || 0} / 500 characters
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Company Website */}
              <FormField
                control={form.control}
                name="companyWebsite"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Website (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="https://www.example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Company Video */}
              <FormField
                control={form.control}
                name="companyVideo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Video URL (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="https://www.youtube.com/watch?v=..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Link to a video showcasing your business</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Holding Company</h3>

                {/* Has Holding Company */}
                <FormField
                  control={form.control}
                  name="hasHoldingCompany"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Does your organization have a holding company?</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="space-y-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="holding-yes" />
                            <label htmlFor="holding-yes" className="text-sm font-normal cursor-pointer">
                              Yes
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="holding-no" />
                            <label htmlFor="holding-no" className="text-sm font-normal cursor-pointer">
                              No
                            </label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {hasHoldingCompany === "yes" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {/* Holding Company Name */}
                    <FormField
                      control={form.control}
                      name="holdingCompanyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Holding Company Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Company name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Holding Company ABN */}
                    <FormField
                      control={form.control}
                      name="holdingCompanyAbn"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Holding Company ABN</FormLabel>
                          <FormControl>
                            <Input placeholder="11 digit ABN" {...field} maxLength={11} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Trading Performance (Last 3 Years)</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Provide financial performance data for the most recent 3 financial years
                </p>

                {/* Year 1 */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Most Recent Year</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="year1Revenue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Revenue ($)</FormLabel>
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
                    <FormField
                      control={form.control}
                      name="year1GrossProfit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gross Profit ($)</FormLabel>
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
                    <FormField
                      control={form.control}
                      name="year1NetProfit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Net Profit ($)</FormLabel>
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
                </div>

                {/* Year 2 */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Previous Year</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="year2Revenue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Revenue ($)</FormLabel>
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
                    <FormField
                      control={form.control}
                      name="year2GrossProfit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gross Profit ($)</FormLabel>
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
                    <FormField
                      control={form.control}
                      name="year2NetProfit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Net Profit ($)</FormLabel>
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
                </div>

                {/* Year 3 */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Two Years Ago</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="year3Revenue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Revenue ($)</FormLabel>
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
                    <FormField
                      control={form.control}
                      name="year3GrossProfit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gross Profit ($)</FormLabel>
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
                    <FormField
                      control={form.control}
                      name="year3NetProfit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Net Profit ($)</FormLabel>
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
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Diversity Information</h3>

                {/* Women Ownership Status */}
                <FormField
                  control={form.control}
                  name="womenOwnershipStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Is your organization women-owned or women-led?</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select women-owned/led status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="yes_women_owned_50_percent_or_more">
                            Yes, women-owned (50% or more ownership)
                          </SelectItem>
                          <SelectItem value="yes_women_led">
                            Yes, women-led (CEO or equivalent is a woman)
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
                currentStep={3}
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
