'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, FileText, Settings, CheckCircle, Loader2, FileSpreadsheet } from 'lucide-react';
import { ExportConfiguration } from '@/types/rule-types';
import { exportData } from '@/lib/export-manager';

interface ExportSectionProps {
  clientData: any[];
  workerData: any[];
  taskData: any[];
  businessRules: any[];
  prioritizationProfile: any;
  originalFormats: {
    clients?: 'csv' | 'xlsx';
    workers?: 'csv' | 'xlsx';
    tasks?: 'csv' | 'xlsx';
  };
}

export function ExportSection({
  clientData,
  workerData,
  taskData,
  businessRules,
  prioritizationProfile,
  originalFormats,
}: ExportSectionProps) {
  const [config, setConfig] = useState<ExportConfiguration>({
    includeCleanedData: true,
    includeRules: true,
    includePrioritization: true,
    format: 'json',
    filename: undefined
  });
  
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    setExportComplete(false);

    try {
      await exportData(config, {
        clientData,
        workerData,
        taskData,
        businessRules,
        prioritizationProfile
      }, originalFormats);
      
      setExportComplete(true);
      setTimeout(() => setExportComplete(false), 3000);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const getExportSummary = () => {
    const items = [];
    if (config.includeCleanedData) {
      const fileCount = [clientData.length > 0, workerData.length > 0, taskData.length > 0].filter(Boolean).length;
      items.push(`${fileCount} data file${fileCount > 1 ? 's' : ''} (original formats)`);
    }
    if (config.includeRules) {
      const enabledRules = businessRules.filter(rule => rule.enabled).length;
      items.push(`${enabledRules} business rules (JSON)`);
    }
    if (config.includePrioritization) {
      items.push('prioritization configuration (JSON)');
    }
    return items;
  };

  const getFormatIcon = (format?: 'csv' | 'xlsx') => {
    return format === 'xlsx' ? <FileSpreadsheet className="h-4 w-4" /> : <FileText className="h-4 w-4" />;
  };

  const hasDataToExport = clientData.length > 0 || workerData.length > 0 || taskData.length > 0;
  const hasRulesToExport = businessRules.some(rule => rule.enabled);
  const canExport = (config.includeCleanedData && hasDataToExport) || 
                   (config.includeRules && hasRulesToExport) || 
                   config.includePrioritization;

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Download className="h-5 w-5 text-emerald-600" />
            <span>Export Configuration</span>
          </CardTitle>
          <CardDescription>
            Export your cleaned data, business rules, and prioritization settings. Data files will be 
            exported in the same format they were originally imported (CSV or XLSX).
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Export Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Export Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-3">
                <Label className="text-base font-medium">What to Export</Label>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="include-data"
                      checked={config.includeCleanedData}
                      onCheckedChange={(checked) => 
                        setConfig(prev => ({ ...prev, includeCleanedData: !!checked }))
                      }
                      disabled={!hasDataToExport}
                    />
                    <Label htmlFor="include-data" className="flex items-center space-x-2">
                      <span>Cleaned Data Files</span>
                      <Badge variant="secondary" className="text-xs">
                        {clientData.length + workerData.length + taskData.length} records
                      </Badge>
                    </Label>
                  </div>
                  
                  {/* Show original formats */}
                  {config.includeCleanedData && hasDataToExport && (
                    <div className="ml-6 space-y-1">
                      {clientData.length > 0 && (
                        <div className="flex items-center space-x-2 text-sm text-slate-600">
                          {getFormatIcon(originalFormats.clients)}
                          <span>Clients: {originalFormats.clients?.toUpperCase() || 'CSV'} format</span>
                        </div>
                      )}
                      {workerData.length > 0 && (
                        <div className="flex items-center space-x-2 text-sm text-slate-600">
                          {getFormatIcon(originalFormats.workers)}
                          <span>Workers: {originalFormats.workers?.toUpperCase() || 'CSV'} format</span>
                        </div>
                      )}
                      {taskData.length > 0 && (
                        <div className="flex items-center space-x-2 text-sm text-slate-600">
                          {getFormatIcon(originalFormats.tasks)}
                          <span>Tasks: {originalFormats.tasks?.toUpperCase() || 'CSV'} format</span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="include-rules"
                      checked={config.includeRules}
                      onCheckedChange={(checked) => 
                        setConfig(prev => ({ ...prev, includeRules: !!checked }))
                      }
                      disabled={!hasRulesToExport}
                    />
                    <Label htmlFor="include-rules" className="flex items-center space-x-2">
                      <Settings className="h-4 w-4" />
                      <span>Business Rules</span>
                      <Badge variant="secondary" className="text-xs">
                        {businessRules.filter(rule => rule.enabled).length} enabled
                      </Badge>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="include-prioritization"
                      checked={config.includePrioritization}
                      onCheckedChange={(checked) => 
                        setConfig(prev => ({ ...prev, includePrioritization: !!checked }))
                      }
                    />
                    <Label htmlFor="include-prioritization" className="flex items-center space-x-2">
                      <Settings className="h-4 w-4" />
                      <span>Prioritization Config</span>
                      <Badge variant="secondary" className="text-xs">
                        {prioritizationProfile?.name || 'Default'}
                      </Badge>
                    </Label>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="filename">Custom Filename Prefix (Optional)</Label>
                <Input
                  id="filename"
                  value={config.filename || ''}
                  onChange={(e) => setConfig(prev => ({ ...prev, filename: e.target.value || undefined }))}
                  placeholder="Leave empty for default naming"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Export Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Export Preview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {canExport ? (
              <>
                <div className="space-y-3">
                  <Label className="text-base font-medium">Files to be Generated:</Label>
                  <div className="space-y-2">
                    {getExportSummary().map((item, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {exportComplete && (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      Export completed successfully! Files have been downloaded to your device in their original formats.
                    </AlertDescription>
                  </Alert>
                )}

                <Button 
                  onClick={handleExport}
                  disabled={isExporting}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                  size="lg"
                >
                  {isExporting ? (
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  ) : (
                    <Download className="h-5 w-5 mr-2" />
                  )}
                  {isExporting ? 'Exporting...' : 'Export All Files'}
                </Button>
              </>
            ) : (
              <Alert>
                <AlertDescription>
                  No data available for export. Please upload data files and configure rules before exporting.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}