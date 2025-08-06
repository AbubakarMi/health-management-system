
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { assessHealthRisk, type AssessHealthRiskOutput } from "@/ai/flows/health-risk-assessment";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertTriangle, ShieldCheck, HeartPulse, Pill } from "lucide-react";
import { Badge } from "./ui/badge";

const formSchema = z.object({
  medicalHistory: z.string().min(10, "Please provide more details."),
  lifestyleFactors: z.string().min(10, "Please provide more details."),
  familyHistory: z.string().min(10, "Please provide more details."),
});

type FormData = z.infer<typeof formSchema>;

export function HealthRiskForm() {
  const [result, setResult] = useState<AssessHealthRiskOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      medicalHistory: "",
      lifestyleFactors: "",
      familyHistory: "",
    },
  });

  async function onSubmit(values: FormData) {
    setIsLoading(true);
    setResult(null);
    setError(null);
    try {
      const assessmentResult = await assessHealthRisk(values);
      setResult(assessmentResult);
    } catch (e) {
      setError("An error occurred while assessing the risk. Please try again.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  const getRiskBadge = (riskLevel: "low" | "medium" | "high") => {
    switch (riskLevel) {
        case 'low':
            return <Badge variant="default" className="bg-green-500 hover:bg-green-600"><ShieldCheck className="mr-2 h-4 w-4" />Low Risk</Badge>;
        case 'medium':
            return <Badge variant="secondary" className="bg-yellow-500 hover:bg-yellow-600 text-yellow-900"><AlertTriangle className="mr-2 h-4 w-4" />Medium Risk</Badge>;
        case 'high':
            return <Badge variant="destructive"><HeartPulse className="mr-2 h-4 w-4" />High Risk</Badge>;
    }
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="medicalHistory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Medical History</FormLabel>
                <FormControl>
                  <Textarea placeholder="e.g., Patient has a history of hypertension, diagnosed in 2018..." {...field} rows={4} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lifestyleFactors"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lifestyle Factors</FormLabel>
                <FormControl>
                  <Textarea placeholder="e.g., Patient is a non-smoker, exercises 3 times a week..." {...field} rows={4} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="familyHistory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Family History</FormLabel>
                <FormControl>
                  <Textarea placeholder="e.g., Father had a history of heart disease..." {...field} rows={4} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Assessing Risk...
              </>
            ) : (
              "Assess Health Risk"
            )}
          </Button>
        </form>
      </Form>

      {error && (
        <Card className="mt-6 border-destructive bg-destructive/10">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
                <AlertTriangle /> Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
                <span>Assessment Result</span>
                {getRiskBadge(result.riskLevel)}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-yellow-600"/>Identified Risk Factors</h3>
              <p className="text-sm text-muted-foreground mt-1 ml-6">{result.riskFactors}</p>
            </div>
             <div>
              <h3 className="font-semibold flex items-center gap-2"><Pill className="w-4 h-4 text-blue-500" />Suggested Treatment / Medication</h3>
              <p className="text-sm text-muted-foreground mt-1 ml-6">{result.treatmentSuggestion}</p>
            </div>
            <div>
              <h3 className="font-semibold flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-green-600"/>Recommendations</h3>
              <p className="text-sm text-muted-foreground mt-1 ml-6">{result.recommendations}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
