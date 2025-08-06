
import { ReportGenerator } from "@/components/report-generator";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

export default function Page() {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-3">
                    <BarChart3 className="w-6 h-6" />
                    <div>
                        <CardTitle>System Reports</CardTitle>
                        <CardDescription>Generate and export detailed reports for various system activities.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <ReportGenerator />
            </CardContent>
        </Card>
    )
}
