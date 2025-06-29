'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, AlertCircle, Lightbulb, ArrowRight, CheckCircle } from 'lucide-react';
import { ValidationError } from '@/types/data-types';

interface ValidationErrorListProps {
  errors: ValidationError[];
}

export function ValidationErrorList({ errors }: ValidationErrorListProps) {
  if (errors.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
        <p className="text-lg font-medium">No validation issues found!</p>
        <p className="text-sm">Your data looks clean and ready for processing.</p>
      </div>
    );
  }

  const groupedErrors = errors.reduce((groups, error) => {
    const key = `${error.type}-${error.row}`;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(error);
    return groups;
  }, {} as Record<string, ValidationError[]>);

  return (
    <div className="space-y-4">
      {Object.entries(groupedErrors).map(([key, errorGroup]) => {
        const firstError = errorGroup[0];
        const hasMultipleErrors = errorGroup.length > 1;

        return (
          <Alert
            key={key}
            className={
              firstError.severity === 'error'
                ? 'border-red-200 bg-red-50'
                : 'border-yellow-200 bg-yellow-50'
            }
          >
            {firstError.severity === 'error' ? (
              <AlertCircle className="h-4 w-4 text-red-600" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            )}
            
            <AlertDescription>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="capitalize">
                      {firstError.type}
                    </Badge>
                    <span className="text-sm font-medium">
                      Row {firstError.row + 1}
                    </span>
                    {hasMultipleErrors && (
                      <Badge variant="secondary" className="text-xs">
                        {errorGroup.length} issues
                      </Badge>
                    )}
                  </div>
                  <Badge
                    variant={firstError.severity === 'error' ? 'destructive' : 'secondary'}
                    className="text-xs"
                  >
                    {firstError.severity}
                  </Badge>
                </div>

                <div className="space-y-2">
                  {errorGroup.map((error, idx) => (
                    <div key={idx} className="flex items-start space-x-2">
                      <ArrowRight className="h-4 w-4 mt-0.5 text-slate-400 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-medium">{error.field}:</span> {error.message}
                        </p>
                        {error.suggestion && (
                          <div className="mt-1 flex items-start space-x-2 p-2 bg-blue-50 rounded-md">
                            <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-blue-800">{error.suggestion}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {errorGroup.some(error => error.suggestion) && (
                  <div className="flex space-x-2 pt-2">
                    <Button size="sm" variant="outline">
                      Apply Suggestions
                    </Button>
                    <Button size="sm" variant="ghost">
                      Go to Row
                    </Button>
                  </div>
                )}
              </div>
            </AlertDescription>
          </Alert>
        );
      })}
    </div>
  );
}