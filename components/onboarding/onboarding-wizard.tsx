"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Step1Workspace } from "@/components/onboarding/steps/step-1-workspace";
import { Step2Integrations } from "@/components/onboarding/steps/step-2-integrations";
import { Step3Services } from "@/components/onboarding/steps/step-3-services";

import { Step4Forms } from "@/components/onboarding/steps/step-4-forms";
import { Step5Inventory } from "@/components/onboarding/steps/step-5-inventory";
import { Step6Completion } from "@/components/onboarding/steps/step-6-completion";

export function OnboardingWizard() {
  const [step, setStep] = useState(1);
  const [workspaceId, setWorkspaceId] = useState<string | undefined>();

  const next = () => setStep((s) => Math.min(6, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));

  const handleStep1Next = (id: string) => {
    setWorkspaceId(id);
    next();
  };

  return (
    <Card className="w-full border-border/50 bg-card shadow-[0_8px_30px_rgba(0,0,0,0.04)] rounded-2xl overflow-hidden selection:bg-black selection:text-white">
      <CardHeader className="border-b border-border/30 pb-8">
        <CardTitle className="font-serif text-3xl font-bold tracking-tight">Step {step} of 6</CardTitle>
        <CardDescription className="text-muted-foreground italic text-base">
          {step === 1 && "Start by creating your workspace profile."}
          {step === 2 && "Connect your communication channels."}
          {step === 3 && "Add your first service."}
          {step === 4 && "Configure your intake forms."}
          {step === 5 && "Track your essential inventory."}
          {step === 6 && "Review and activate your workspace."}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-10">
        {step === 1 && <Step1Workspace onNext={handleStep1Next} />}
        {step === 2 && <Step2Integrations onNext={next} workspaceId={workspaceId} />}
        {step === 3 && <Step3Services onNext={next} workspaceId={workspaceId} />}
        {step === 4 && <Step4Forms onNext={next} workspaceId={workspaceId} />}
        {step === 5 && <Step5Inventory onNext={next} workspaceId={workspaceId} />}
        {step === 6 && <Step6Completion workspaceId={workspaceId} />}
      </CardContent>
      {step < 6 && (
        <CardFooter className="flex justify-between">
          {step > 1 && (
            <Button variant="ghost" onClick={back} className="text-muted-foreground">
              Back
            </Button>
          )}
          {step > 1 && (
            <Button onClick={next} disabled={step === 6} className="rounded-full px-8 h-12 shadow-lg">
              {step > 5 ? "Finish" : "Next"}
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
