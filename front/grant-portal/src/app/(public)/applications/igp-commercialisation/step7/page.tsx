"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  step7ContactSchema,
  Step7ContactData,
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
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { FormProgress } from "@/components/forms/form-progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Step7ContactPage() {
  const router = useRouter();
  const { formData, updateStepData, saveProgress } = useIGPFormContext();

  const form = useForm<Step7ContactData>({
    mode: "onChange", // Enable real-time validation for Next button
    resolver: zodResolver(step7ContactSchema),
    defaultValues: formData.step7_contact || {
      contactName: "",
      contactPosition: "",
      contactEmail: "",
      contactPhone: "",
      bankAccountName: "",
      bankBsb: "",
      bankAccountNumber: "",
      hasConflictOfInterest: undefined,
      conflictOfInterestDetails: "",
      privacyAgreement: false,
      applicantDeclaration: false,
      authorizedOfficerName: "",
    },
  });

  const hasConflictOfInterest = form.watch("hasConflictOfInterest");

  const onSubmit = (data: Step7ContactData) => {
    updateStepData(7, data);
    saveProgress();

    // TODO: In Phase 2, this will submit to backend API
    // For now, show success message
    alert("Application draft saved successfully! In Phase 2, this will be submitted to the backend.");

    // Optionally redirect to a confirmation page
    // router.push("/applications/igp-commercialisation/confirmation");
  };

  const handlePrevious = () => {
    router.push("/applications/igp-commercialisation/step6");
  };

  const handleSaveDraft = () => {
    const currentData = form.getValues();
    updateStepData(7, currentData);
    saveProgress();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <FormProgress
        currentStep={7}
        totalSteps={IGP_STEPS.length}
        steps={IGP_STEPS.map((s) => ({ id: s.id, title: s.title }))}
      />

      <Card>
        <CardHeader>
          <CardTitle>Step 7: Contact Details & Declaration</CardTitle>
          <CardDescription>
            Provide contact information, bank details, and complete the required declarations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Primary Contact</h3>

                {/* Contact Name */}
                <FormField
                  control={form.control}
                  name="contactName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Contact Position */}
                <FormField
                  control={form.control}
                  name="contactPosition"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Position/Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., CEO, Managing Director" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {/* Contact Email */}
                  <FormField
                    control={form.control}
                    name="contactEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="email@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Contact Phone */}
                  <FormField
                    control={form.control}
                    name="contactPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="+61 2 1234 5678" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Bank Account Details</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Grant payments will be made to this account if your application is successful
                </p>

                {/* Bank Account Name */}
                <FormField
                  control={form.control}
                  name="bankAccountName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Account holder name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {/* Bank BSB */}
                  <FormField
                    control={form.control}
                    name="bankBsb"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>BSB</FormLabel>
                        <FormControl>
                          <Input placeholder="123456" {...field} maxLength={6} />
                        </FormControl>
                        <FormDescription>6 digits</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Bank Account Number */}
                  <FormField
                    control={form.control}
                    name="bankAccountNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Number</FormLabel>
                        <FormControl>
                          <Input placeholder="123456789" {...field} maxLength={10} />
                        </FormControl>
                        <FormDescription>6-10 digits</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Conflict of Interest</h3>

                {/* Has Conflict of Interest */}
                <FormField
                  control={form.control}
                  name="hasConflictOfInterest"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Do you or any members of your organization have a conflict of interest to declare?
                      </FormLabel>
                      <FormDescription>
                        This includes any relationships with government officials, assessment panel members,
                        or circumstances that may affect the fair assessment of your application.
                      </FormDescription>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="space-y-2 mt-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="conflict-yes" />
                            <label htmlFor="conflict-yes" className="text-sm font-normal cursor-pointer">
                              Yes, I have a conflict of interest to declare
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="conflict-no" />
                            <label htmlFor="conflict-no" className="text-sm font-normal cursor-pointer">
                              No, I have no conflicts of interest
                            </label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Conflict of Interest Details */}
                {hasConflictOfInterest === "yes" && (
                  <FormField
                    control={form.control}
                    name="conflictOfInterestDetails"
                    render={({ field }) => (
                      <FormItem className="mt-4">
                        <FormLabel>Conflict of Interest Details</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Provide details of the conflict of interest..."
                            {...field}
                            rows={4}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Declarations</h3>

                <div className="bg-muted p-4 rounded-lg mb-4">
                  <h4 className="font-semibold mb-2">Privacy Statement</h4>
                  <p className="text-sm">
                    The information provided in this application will be handled in accordance with the
                    Privacy Act 1988. Your personal information will be used to assess your application
                    and administer the grant program. It may be disclosed to other government agencies
                    as required by law.
                  </p>
                </div>

                {/* Privacy Agreement */}
                <FormField
                  control={form.control}
                  name="privacyAgreement"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 mb-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="font-normal">
                          I have read and agree to the privacy statement above
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <div className="bg-muted p-4 rounded-lg mb-4">
                  <h4 className="font-semibold mb-2">Applicant Declaration</h4>
                  <p className="text-sm mb-2">I declare that:</p>
                  <ul className="text-sm space-y-1 list-disc list-inside">
                    <li>All information provided in this application is true and accurate</li>
                    <li>I am authorized to submit this application on behalf of the organization</li>
                    <li>I understand that providing false or misleading information may result in disqualification</li>
                    <li>The organization meets all eligibility requirements</li>
                    <li>I have read and understood the grant guidelines and terms and conditions</li>
                    <li>The organization will comply with all grant requirements if successful</li>
                  </ul>
                </div>

                {/* Applicant Declaration */}
                <FormField
                  control={form.control}
                  name="applicantDeclaration"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 mb-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="font-normal">
                          I agree to the applicant declaration above and confirm all statements are true
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                {/* Authorized Officer Name */}
                <FormField
                  control={form.control}
                  name="authorizedOfficerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Authorized Officer Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Full name of authorized signatory" {...field} />
                      </FormControl>
                      <FormDescription>
                        Name of the person authorized to submit this application
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">Ready to Submit</h4>
                <p className="text-sm text-green-800">
                  Review your application carefully before submitting. You can save a draft and return
                  later using the &quot;Save Draft&quot; button. Once you submit, you will receive a
                  confirmation and application reference number.
                </p>
              </div>

              <div className="flex justify-between items-center pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                >
                  Previous
                </Button>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSaveDraft}
                  >
                    Save Draft
                  </Button>

                  <Button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700"
                    disabled={!form.formState.isValid}
                  >
                    Submit Application
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
