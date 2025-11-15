"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  step4ProjectSchema,
  Step4ProjectData,
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
import { FormProgress } from "@/components/forms/form-progress";
import { FormNavigation } from "@/components/forms/form-navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Step4ProjectPage() {
  const router = useRouter();
  const { formData, updateStepData, setCurrentStep, saveProgress } = useIGPFormContext();

  const form = useForm<Step4ProjectData>({
    mode: "onChange", // Enable real-time validation for Next button
    resolver: zodResolver(step4ProjectSchema),
    defaultValues: formData.step4_project || {
      projectTitle: "",
      projectBriefDescription: "",
      projectDetailedDescription: "",
      projectExpectedOutcomes: "",
      commercializationStage: undefined,
      nrfPriorityArea: undefined,
      projectStartDate: "",
      projectEndDate: "",
      projectDurationMonths: 12,
      projectLocationState: undefined,
      projectLocationSuburb: "",
    },
  });

  const projectTitle = form.watch("projectTitle");
  const projectBriefDescription = form.watch("projectBriefDescription");
  const projectDetailedDescription = form.watch("projectDetailedDescription");
  const projectExpectedOutcomes = form.watch("projectExpectedOutcomes");

  const onSubmit = (data: Step4ProjectData) => {
    updateStepData(4, data);
    setCurrentStep(5);
    router.push("/applications/igp-commercialisation/step5");
  };

  const handlePrevious = () => {
    router.push("/applications/igp-commercialisation/step3");
  };

  const handleSaveDraft = () => {
    const currentData = form.getValues();
    updateStepData(4, currentData);
    saveProgress();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <FormProgress
        currentStep={4}
        totalSteps={IGP_STEPS.length}
        steps={IGP_STEPS.map((s) => ({ id: s.id, title: s.title }))}
      />

      <Card>
        <CardHeader>
          <CardTitle>Step 4: Project Overview</CardTitle>
          <CardDescription>
            Describe your commercialisation project in detail
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Project Title */}
              <FormField
                control={form.control}
                name="projectTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Title (10-100 characters)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Brief, descriptive title for your project"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {projectTitle?.length || 0} / 100 characters
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Project Brief Description */}
              <FormField
                control={form.control}
                name="projectBriefDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Brief Description (50-200 characters)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="One or two sentences summarizing your project"
                        {...field}
                        rows={3}
                      />
                    </FormControl>
                    <FormDescription>
                      {projectBriefDescription?.length || 0} / 200 characters
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Project Detailed Description */}
              <FormField
                control={form.control}
                name="projectDetailedDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Detailed Description (200-2000 characters)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Provide a comprehensive description of your project, including what you plan to do, how you will do it, and why it is innovative..."
                        {...field}
                        rows={8}
                      />
                    </FormControl>
                    <FormDescription>
                      {projectDetailedDescription?.length || 0} / 2000 characters
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Project Expected Outcomes */}
              <FormField
                control={form.control}
                name="projectExpectedOutcomes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expected Outcomes (100-1000 characters)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the expected outcomes and benefits of your project, including commercial outcomes, jobs created, and economic impact..."
                        {...field}
                        rows={6}
                      />
                    </FormControl>
                    <FormDescription>
                      {projectExpectedOutcomes?.length || 0} / 1000 characters
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Project Classification</h3>

                {/* Commercialization Stage */}
                <FormField
                  control={form.control}
                  name="commercializationStage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Commercialisation Stage</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select current stage" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="proof_of_concept">Proof of Concept</SelectItem>
                          <SelectItem value="prototype">Prototype</SelectItem>
                          <SelectItem value="pilot">Pilot/Trial</SelectItem>
                          <SelectItem value="ready_for_market">Ready for Market</SelectItem>
                          <SelectItem value="early_market_entry">Early Market Entry</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select the stage that best describes your project&apos;s current development
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* NRF Priority Area */}
                <FormField
                  control={form.control}
                  name="nrfPriorityArea"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>National Reconstruction Fund (NRF) Priority Area</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select NRF priority area" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="resources">Resources</SelectItem>
                          <SelectItem value="agriculture_food">Agriculture, Forestry, Fisheries & Food</SelectItem>
                          <SelectItem value="transport">Transport</SelectItem>
                          <SelectItem value="medical_science">Medical Science</SelectItem>
                          <SelectItem value="renewables_low_emissions">Renewables & Low Emissions Technologies</SelectItem>
                          <SelectItem value="defense">Defence</SelectItem>
                          <SelectItem value="enabling_capabilities">Enabling Capabilities</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select the primary NRF priority area your project aligns with
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Project Timeline</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Project Start Date */}
                  <FormField
                    control={form.control}
                    name="projectStartDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Start Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Project End Date */}
                  <FormField
                    control={form.control}
                    name="projectEndDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project End Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Project Duration */}
                <FormField
                  control={form.control}
                  name="projectDurationMonths"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Project Duration (Months)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="12"
                          max="24"
                          placeholder="12-24 months"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 12)}
                        />
                      </FormControl>
                      <FormDescription>
                        Project duration must be between 12 and 24 months
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Project Location</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Project Location State */}
                  <FormField
                    control={form.control}
                    name="projectLocationState"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State/Territory</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
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

                  {/* Project Location Suburb */}
                  <FormField
                    control={form.control}
                    name="projectLocationSuburb"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Suburb/Town</FormLabel>
                        <FormControl>
                          <Input placeholder="Project location" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormNavigation
                currentStep={4}
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
