'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, AlertCircle, TrendingUp } from 'lucide-react';

interface ValidationSummaryProps {
  totalErrors: number;
  totalWarnings: number;
  totalRecords: number;
}

export function ValidationSummary({ totalErrors, totalWarnings, totalRecords }: ValidationSummaryProps) {
  const successRate = totalRecords > 0 ? Math.round(((totalRecords - totalErrors) / totalRecords) * 100) : 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4 text-center">
          <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-green-700">{successRate}%</div>
          <div className="text-sm text-green-600">Success Rate</div>
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4 text-center">
          <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-blue-700">{totalRecords}</div>
          <div className="text-sm text-blue-600">Total Records</div>
        </CardContent>
      </Card>

      <Card className="bg-red-50 border-red-200">
        <CardContent className="p-4 text-center">
          <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-red-700">{totalErrors}</div>
          <div className="text-sm text-red-600">Critical Errors</div>
        </CardContent>
      </Card>

      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="p-4 text-center">
          <AlertTriangle className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-yellow-700">{totalWarnings}</div>
          <div className="text-sm text-yellow-600">Warnings</div>
        </CardContent>
      </Card>
    </div>
  );
}