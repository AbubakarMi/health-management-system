"use client"

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { 
  Download, 
  FileImage, 
  FileSpreadsheet, 
  FileText, 
  Printer,
  Share2,
  Filter,
  Calendar,
  TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

// Export utilities
class ChartExporter {
  static exportToCSV(data: any[], filename: string) {
    if (!data.length) return;
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          return typeof value === 'string' ? `"${value}"` : value;
        }).join(',')
      )
    ].join('\n');
    
    this.downloadFile(csvContent, `${filename}.csv`, 'text/csv');
  }

  static exportToJSON(data: any[], filename: string) {
    const jsonContent = JSON.stringify(data, null, 2);
    this.downloadFile(jsonContent, `${filename}.json`, 'application/json');
  }

  static exportToPNG(chartElement: HTMLElement, filename: string) {
    // Implementation for PNG export using html2canvas
    import('html2canvas').then(html2canvas => {
      html2canvas(chartElement, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true
      }).then(canvas => {
        const link = document.createElement('a');
        link.download = `${filename}.png`;
        link.href = canvas.toDataURL();
        link.click();
      });
    });
  }

  static printChart(chartElement: HTMLElement) {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Chart Print</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .chart { width: 100%; height: auto; }
            .header { text-align: center; margin-bottom: 20px; }
            .powered-by { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Careflux Analytics Report</h1>
            <p>Generated on ${new Date().toLocaleString()}</p>
          </div>
          <div class="chart">
            ${chartElement.innerHTML}
          </div>
          <div class="powered-by">
            Powered by Nubenta Technology - World-Class Healthcare Management
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
  }

  private static downloadFile(content: string, filename: string, mimeType: string) {
    const blob = new Blob([content], { type: mimeType });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  }
}

// Advanced filtering component
interface ChartFilterProps {
  data: any[];
  onFilterChange: (filteredData: any[]) => void;
  filterFields?: string[];
}

export function ChartFilter({ data, onFilterChange, filterFields = [] }: ChartFilterProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});

  const filteredData = useMemo(() => {
    let filtered = [...data];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item => 
        Object.values(item).some(value => 
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Date range filter
    if (dateRange.start && dateRange.end) {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.date || item.timestamp || Date.now());
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);
        return itemDate >= startDate && itemDate <= endDate;
      });
    }

    // Field-specific filters
    Object.entries(selectedFilters).forEach(([field, value]) => {
      if (value) {
        filtered = filtered.filter(item => 
          String(item[field]).toLowerCase().includes(value.toLowerCase())
        );
      }
    });

    return filtered;
  }, [data, searchTerm, dateRange, selectedFilters]);

  React.useEffect(() => {
    onFilterChange(filteredData);
  }, [filteredData, onFilterChange]);

  return (
    <Card className="mb-6 border-0 shadow-lg bg-gradient-to-r from-card via-card to-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Filter className="w-5 h-5 text-primary" />
          Advanced Filters & Export
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="search">Search Data</Label>
            <Input
              id="search"
              placeholder="Search across all fields..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-background/50"
            />
          </div>
          
          <div>
            <Label htmlFor="date-start">Date Range</Label>
            <div className="flex gap-2">
              <Input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="bg-background/50"
              />
              <Input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="bg-background/50"
              />
            </div>
          </div>

          <div className="flex items-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setDateRange({ start: '', end: '' });
                setSelectedFilters({});
              }}
              className="w-full"
            >
              Clear Filters
            </Button>
            <Badge variant="secondary" className="whitespace-nowrap">
              {filteredData.length} items
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Main export toolbar component
interface ChartExportToolbarProps {
  data: any[];
  chartRef?: React.RefObject<HTMLDivElement>;
  filename?: string;
  showFilters?: boolean;
  onFilteredDataChange?: (data: any[]) => void;
}

export function ChartExportToolbar({ 
  data, 
  chartRef, 
  filename = 'chart-data', 
  showFilters = true,
  onFilteredDataChange 
}: ChartExportToolbarProps) {
  const [filteredData, setFilteredData] = useState(data);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (type: string) => {
    setIsExporting(true);
    
    try {
      switch (type) {
        case 'csv':
          ChartExporter.exportToCSV(filteredData, filename);
          break;
        case 'json':
          ChartExporter.exportToJSON(filteredData, filename);
          break;
        case 'png':
          if (chartRef?.current) {
            ChartExporter.exportToPNG(chartRef.current, filename);
          }
          break;
        case 'print':
          if (chartRef?.current) {
            ChartExporter.printChart(chartRef.current);
          }
          break;
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleFilterChange = (newFilteredData: any[]) => {
    setFilteredData(newFilteredData);
    onFilteredDataChange?.(newFilteredData);
  };

  const stats = useMemo(() => ({
    total: data.length,
    filtered: filteredData.length,
    percentage: data.length ? ((filteredData.length / data.length) * 100).toFixed(1) : '0'
  }), [data, filteredData]);

  return (
    <div className="space-y-4">
      {showFilters && (
        <ChartFilter 
          data={data} 
          onFilterChange={handleFilterChange}
        />
      )}
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Showing {stats.filtered} of {stats.total} records ({stats.percentage}%)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Share Chart Data</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Chart Summary</h4>
                  <p className="text-sm text-muted-foreground">
                    This chart contains {stats.filtered} data points from your Careflux analytics dashboard.
                    Generated on {new Date().toLocaleDateString()}.
                  </p>
                </div>
                <div className="text-center text-xs text-muted-foreground">
                  Powered by Nubenta Technology
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="default" 
                size="sm" 
                disabled={isExporting}
                className="bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-500 hover:from-teal-500 hover:via-cyan-500 hover:to-blue-600"
              >
                <Download className="w-4 h-4 mr-2" />
                {isExporting ? 'Exporting...' : 'Export'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Export Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={() => handleExport('csv')}>
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Export as CSV
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => handleExport('json')}>
                <FileText className="w-4 h-4 mr-2" />
                Export as JSON
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => handleExport('png')}>
                <FileImage className="w-4 h-4 mr-2" />
                Export as Image
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={() => handleExport('print')}>
                <Printer className="w-4 h-4 mr-2" />
                Print Chart
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

export { ChartExporter };