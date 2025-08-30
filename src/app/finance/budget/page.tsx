"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Calculator, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  PieChart, 
  Save, 
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Users,
  Building,
  Stethoscope,
  Pill,
  TestTube,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";

interface BudgetItem {
  category: string;
  planned: number;
  actual: number;
  percentage: number;
}

export default function BudgetCalculatorPage() {
  const [budgetPeriod, setBudgetPeriod] = useState("monthly");
  const [totalBudget, setTotalBudget] = useState(5000000);
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([
    { category: "Medical Equipment", planned: 1500000, actual: 1350000, percentage: 30 },
    { category: "Staff Salaries", planned: 2000000, actual: 2000000, percentage: 40 },
    { category: "Pharmaceuticals", planned: 800000, actual: 920000, percentage: 16 },
    { category: "Facility Maintenance", planned: 400000, actual: 380000, percentage: 8 },
    { category: "Utilities", planned: 200000, actual: 250000, percentage: 4 },
    { category: "Insurance", planned: 100000, actual: 100000, percentage: 2 }
  ]);

  const budgetAnalysis = useMemo(() => {
    const totalPlanned = budgetItems.reduce((sum, item) => sum + item.planned, 0);
    const totalActual = budgetItems.reduce((sum, item) => sum + item.actual, 0);
    const variance = totalActual - totalPlanned;
    const variancePercentage = totalPlanned > 0 ? (variance / totalPlanned) * 100 : 0;
    const remainingBudget = totalBudget - totalActual;
    const utilizationRate = totalBudget > 0 ? (totalActual / totalBudget) * 100 : 0;
    
    const overBudgetItems = budgetItems.filter(item => item.actual > item.planned);
    const underBudgetItems = budgetItems.filter(item => item.actual < item.planned);
    
    return {
      totalPlanned,
      totalActual,
      variance,
      variancePercentage,
      remainingBudget,
      utilizationRate,
      overBudgetItems,
      underBudgetItems
    };
  }, [budgetItems, totalBudget]);

  const updateBudgetItem = (index: number, field: 'planned' | 'actual', value: number) => {
    const newItems = [...budgetItems];
    newItems[index][field] = value;
    if (field === 'planned') {
      newItems[index].percentage = totalBudget > 0 ? (value / totalBudget) * 100 : 0;
    }
    setBudgetItems(newItems);
  };

  const addBudgetItem = () => {
    const newItem: BudgetItem = {
      category: "New Category",
      planned: 0,
      actual: 0,
      percentage: 0
    };
    setBudgetItems([...budgetItems, newItem]);
  };

  const resetBudget = () => {
    setBudgetItems([
      { category: "Medical Equipment", planned: 1500000, actual: 1350000, percentage: 30 },
      { category: "Staff Salaries", planned: 2000000, actual: 2000000, percentage: 40 },
      { category: "Pharmaceuticals", planned: 800000, actual: 920000, percentage: 16 },
      { category: "Facility Maintenance", planned: 400000, actual: 380000, percentage: 8 },
      { category: "Utilities", planned: 200000, actual: 250000, percentage: 4 },
      { category: "Insurance", planned: 100000, actual: 100000, percentage: 2 }
    ]);
    setTotalBudget(5000000);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/finance" className="p-2 hover:bg-accent rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-xl">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold nubenta-gradient-text">Budget Calculator</h1>
                <p className="text-muted-foreground">Financial planning and budget analysis</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={budgetPeriod} onValueChange={setBudgetPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={resetBudget} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button size="sm">
            <Save className="w-4 h-4 mr-2" />
            Save Budget
          </Button>
        </div>
      </div>

      {/* Budget Overview Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-card via-card to-primary/5">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-400" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{totalBudget.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground capitalize">{budgetPeriod} allocation</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-card via-card to-primary/5">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-cyan-400" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Actual Spending</CardTitle>
            <PieChart className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{budgetAnalysis.totalActual.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{budgetAnalysis.utilizationRate.toFixed(1)}% utilized</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-card via-card to-primary/5">
          <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${budgetAnalysis.variance >= 0 ? 'from-red-400 to-orange-400' : 'from-green-400 to-emerald-400'}`} />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Variance</CardTitle>
            {budgetAnalysis.variance >= 0 ? 
              <TrendingUp className="h-4 w-4 text-red-500" /> : 
              <TrendingDown className="h-4 w-4 text-green-500" />
            }
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${budgetAnalysis.variance >= 0 ? 'text-red-600' : 'text-green-600'}`}>
              {budgetAnalysis.variance >= 0 ? '+' : ''}₦{budgetAnalysis.variance.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {budgetAnalysis.variancePercentage >= 0 ? '+' : ''}{budgetAnalysis.variancePercentage.toFixed(1)}% vs planned
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-card via-card to-primary/5">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-pink-400" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Remaining</CardTitle>
            <CheckCircle className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{budgetAnalysis.remainingBudget.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Available to spend</p>
          </CardContent>
        </Card>
      </div>

      {/* Budget Configuration */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-card via-card to-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-emerald-500" />
                Budget Breakdown
              </CardTitle>
              <CardDescription>Configure planned vs actual spending by category</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="grid grid-cols-5 gap-4 text-sm font-medium text-muted-foreground">
                  <div>Category</div>
                  <div>Planned (₦)</div>
                  <div>Actual (₦)</div>
                  <div>Variance</div>
                  <div>Progress</div>
                </div>
                
                {budgetItems.map((item, index) => {
                  const variance = item.actual - item.planned;
                  const progress = item.planned > 0 ? (item.actual / item.planned) * 100 : 0;
                  
                  return (
                    <div key={index} className="grid grid-cols-5 gap-4 items-center p-3 rounded-lg border bg-background/50">
                      <div className="font-medium">
                        <Input
                          value={item.category}
                          onChange={(e) => {
                            const newItems = [...budgetItems];
                            newItems[index].category = e.target.value;
                            setBudgetItems(newItems);
                          }}
                          className="border-none p-0 h-auto font-medium bg-transparent"
                        />
                      </div>
                      
                      <div>
                        <Input
                          type="number"
                          value={item.planned}
                          onChange={(e) => updateBudgetItem(index, 'planned', Number(e.target.value))}
                          className="h-8"
                        />
                      </div>
                      
                      <div>
                        <Input
                          type="number"
                          value={item.actual}
                          onChange={(e) => updateBudgetItem(index, 'actual', Number(e.target.value))}
                          className="h-8"
                        />
                      </div>
                      
                      <div>
                        <Badge variant={variance >= 0 ? "destructive" : "default"} className="text-xs">
                          {variance >= 0 ? '+' : ''}₦{variance.toLocaleString()}
                        </Badge>
                      </div>
                      
                      <div className="space-y-1">
                        <Progress value={Math.min(progress, 100)} className="h-2" />
                        <div className="text-xs text-muted-foreground">{progress.toFixed(0)}%</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <Button onClick={addBudgetItem} variant="outline" className="w-full">
                Add Category
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Budget Alerts */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-card via-card to-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Budget Alerts
            </CardTitle>
            <CardDescription>Items requiring attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {budgetAnalysis.overBudgetItems.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-red-600">Over Budget</h4>
                {budgetAnalysis.overBudgetItems.map((item, index) => (
                  <div key={index} className="p-3 rounded-lg bg-red-500/10 border border-red-200">
                    <div className="text-sm font-medium">{item.category}</div>
                    <div className="text-xs text-red-600">
                      +₦{(item.actual - item.planned).toLocaleString()} over budget
                    </div>
                  </div>
                ))}
              </div>
            )}

            {budgetAnalysis.underBudgetItems.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-green-600">Under Budget</h4>
                {budgetAnalysis.underBudgetItems.slice(0, 3).map((item, index) => (
                  <div key={index} className="p-3 rounded-lg bg-green-500/10 border border-green-200">
                    <div className="text-sm font-medium">{item.category}</div>
                    <div className="text-xs text-green-600">
                      ₦{(item.planned - item.actual).toLocaleString()} under budget
                    </div>
                  </div>
                ))}
              </div>
            )}

            {budgetAnalysis.utilizationRate > 90 && (
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-200">
                <div className="flex items-center gap-2 text-amber-600">
                  <AlertTriangle className="w-4 h-4" />
                  <div className="text-sm font-medium">High Utilization</div>
                </div>
                <div className="text-xs text-amber-600 mt-1">
                  {budgetAnalysis.utilizationRate.toFixed(1)}% of budget used
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}