'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw, 
  Zap,
  Users,
  Briefcase,
  FileText
} from 'lucide-react';
import { ClientData, WorkerData, TaskData, ValidationError } from '@/types/data-types';
import { runValidation } from '@/lib/validation-engine';
import { ValidationSummary } from './validation-summary';
import { ValidationErrorList } from './validation-error-list';

interface ValidationPanelProps {
  clientData: ClientData[];
  workerData: WorkerData[];
  taskData: TaskData[];
  validationErrors: ValidationError[];
  onValidationErrors: (errors: ValidationError[]) => void;
}

export function ValidationPanel({
  clientData,
  workerData,
  taskData,
  validationErrors,
  onValidationErrors,
}: ValidationPanelProps) {
  const [isValidating, setIsValidating] = useState(false);
  const [validationProgress, setValidationProgress] = useState(0);
  const [lastValidationTime, setLastValidationTime] = useState<Date | null>(null);

  const runFullValidation = async () => {
    setIsValidating(true);
    setValidationProgress(0);

    try {
      // Simulate validation progress
      const progressSteps = [
        { step: 'Validating required fields...', progress: 20 },
        { step: 'Checking for duplicates...', progress: 40 },
        { step: 'Validating data types...', progress: 60 },
        { step: 'Checking cross-references...', progress: 80 },
        { step: 'Running AI-powered pattern analysis...', progress: 100 },
      ];

      for (const { step, progress } of progressSteps) {
        setValidationProgress(progress);
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      const errors = await runValidation(clientData, workerData, taskData);
      onValidationErrors(errors);
      setLastValidationTime(new Date());
    } finally {
      setIsValidating(false);
    }
  };

  // Auto-validate when data changes
  useEffect(() => {
    if (clientData.length > 0 || workerData.length > 0 || taskData.length > 0) {
      runFullValidation();
    }
  }, [clientData.length, workerData.length, taskData.length]);

  const errorsByType = {
    clients: validationErrors.filter(e => e.type === 'clients'),
    workers: validationErrors.filter(e => e.type === 'workers'),
    tasks: validationErrors.filter(e => e.type === 'tasks'),
  };

  const totalErrors = validationErrors.filter(e => e.severity === 'error').length;
  const totalWarnings = validationErrors.filter(e => e.severity === 'warning').length;

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-purple-600" />
            <span>Data Validation Center</span>
          </CardTitle>
          <CardDescription>
            Comprehensive validation of your data with AI-powered pattern recognition and business rule checking.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Validation Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              {totalErrors === 0 ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-600" />
              )}
              <span>Validation Status</span>
            </CardTitle>
            <Button 
              onClick={runFullValidation}
              disabled={isValidating}
              size="sm"
            >
              {isValidating ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Zap className="h-4 w-4 mr-2" />
              )}
              {isValidating ? 'Validating...' : 'Run Validation'}
            </Button>
          </div>
          {lastValidationTime && (
            <CardDescription>
              Last validated: {lastValidationTime.toLocaleString()}
            </CardDescription>
          )}
        </CardHeader>
        
        <CardContent className="space-y-4">
          {isValidating && (
            <div className="space-y-2">
              <Progress value={validationProgress} className="w-full" />
              <p className="text-sm text-slate-600 text-center">
                Running comprehensive validation... {validationProgress}%
              </p>
            </div>
          )}

          <ValidationSummary
            totalErrors={totalErrors}
            totalWarnings={totalWarnings}
            totalRecords={clientData.length + workerData.length + taskData.length}
          />

          {validationErrors.length > 0 && (
            <Alert className={totalErrors > 0 ? 'border-red-200 bg-red-50' : 'border-yellow-200 bg-yellow-50'}>
              <AlertTriangle className={`h-4 w-4 ${totalErrors > 0 ? 'text-red-600' : 'text-yellow-600'}`} />
              <AlertDescription className={totalErrors > 0 ? 'text-red-800' : 'text-yellow-800'}>
                {totalErrors > 0 
                  ? `Found ${totalErrors} critical error${totalErrors > 1 ? 's' : ''} that must be fixed before proceeding.`
                  : `Found ${totalWarnings} warning${totalWarnings > 1 ? 's' : ''} that should be reviewed.`
                }
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Validation Results by Entity Type */}
      {validationErrors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Validation Results</CardTitle>
            <CardDescription>
              Review and address validation issues organized by entity type.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">
                  All Issues ({validationErrors.length})
                </TabsTrigger>
                <TabsTrigger value="clients">
                  <Users className="h-4 w-4 mr-2" />
                  Clients ({errorsByType.clients.length})
                </TabsTrigger>
                <TabsTrigger value="workers">
                  <Briefcase className="h-4 w-4 mr-2" />
                  Workers ({errorsByType.workers.length})
                </TabsTrigger>
                <TabsTrigger value="tasks">
                  <FileText className="h-4 w-4 mr-2" />
                  Tasks ({errorsByType.tasks.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                <ValidationErrorList errors={validationErrors} />
              </TabsContent>

              <TabsContent value="clients" className="space-y-4">
                <ValidationErrorList errors={errorsByType.clients} />
              </TabsContent>

              <TabsContent value="workers" className="space-y-4">
                <ValidationErrorList errors={errorsByType.workers} />
              </TabsContent>

              <TabsContent value="tasks" className="space-y-4">
                <ValidationErrorList errors={errorsByType.tasks} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}