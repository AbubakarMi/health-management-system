import { HealthRiskForm } from "@/components/health-risk-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HeartPulse } from "lucide-react";

export default function RiskAssessmentPage() {
  return (
    <div className="max-w-4xl mx-auto">
        <Card>
            <CardHeader className="text-center">
                <div className="flex justify-center items-center mb-4">
                    <HeartPulse className="w-12 h-12 text-primary"/>
                </div>
                <CardTitle className="font-headline text-3xl">AI Health Risk Assessment</CardTitle>
                <CardDescription>
                    Enter patient information to get an AI-powered health risk assessment. This tool provides a simulated analysis based on the provided data.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <HealthRiskForm />
            </CardContent>
        </Card>
    </div>
  );
}
