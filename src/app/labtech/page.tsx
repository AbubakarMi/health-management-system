
"use client";

import { useState, useEffect } from "react";
import { LabVisitsChart } from "@/components/charts/lab-visits-chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { labTestManager, LabTest } from "@/lib/constants";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function LabTechDashboard() {
  const [pendingTests, setPendingTests] = useState<LabTest[]>([]);
  const [recentCompleted, setRecentCompleted] = useState<LabTest[]>([]);

  useEffect(() => {
      const handleUpdate = (updatedTests: LabTest[]) => {
          setPendingTests(updatedTests.filter(t => t.status === 'Pending' || t.status === 'Processing').slice(0, 5));
          setRecentCompleted(updatedTests.filter(t => t.status === 'Completed').slice(0, 5));
      };
      handleUpdate(labTestManager.getLabTests());
      const unsubscribe = labTestManager.subscribe(handleUpdate);
      return () => unsubscribe();
  }, []);

  return (
    <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
      <div className="lg:col-span-2">
        <LabVisitsChart />
      </div>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Pending Lab Tests</CardTitle>
              <CardDescription>Tests awaiting processing or results.</CardDescription>
            </div>
             <Button asChild variant="outline" size="sm">
               <Link href="/labtech/tests">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
               </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
           <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Test</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingTests.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">{t.patient}</TableCell>
                  <TableCell>{t.test}</TableCell>
                   <TableCell>
                    <Badge variant={t.status === 'Pending' ? 'destructive' : 'secondary'}>
                        {t.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {pendingTests.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground">No pending tests.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
        <Card>
        <CardHeader>
          <CardTitle>Recently Completed</CardTitle>
          <CardDescription>The latest test results that have been uploaded.</CardDescription>
        </CardHeader>
        <CardContent>
           <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Test</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentCompleted.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">{t.patient}</TableCell>
                  <TableCell>{t.test}</TableCell>
                   <TableCell>
                    <Badge className="bg-green-500">{t.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
                {recentCompleted.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground">No recently completed tests.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
