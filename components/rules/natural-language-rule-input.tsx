'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Sparkles, Loader2, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';
import { BusinessRule } from '@/types/rule-types';
import { ClientData, WorkerData, TaskData } from '@/types/data-types';
import { processNaturalLanguageRule } from '@/lib/rule-generator';

interface NaturalLanguageRuleInputProps {
  clientData: ClientData[];
  workerData: WorkerData[];
  taskData: TaskData[];
  onRuleGenerated: (rule: BusinessRule) => void;
}

export function NaturalLanguageRuleInput({
  clientData,
  workerData,
  taskData,
  onRuleGenerated,
}: NaturalLanguageRuleInputProps) {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResult, setLastResult] = useState<{ success: boolean; message: string } | null>(null);
  const [inputHistory, setInputHistory] = useState<string[]>([]);

  const handleProcess = async () => {
    if (!input.trim() || isProcessing) return;

    setIsProcessing(true);
    setLastResult(null);

    try {
      const rule = await processNaturalLanguageRule(input, { clientData, workerData, taskData });
      
      if (rule) {
        onRuleGenerated(rule);
        setInputHistory(prev => [input, ...prev.slice(0, 4)]);
        setInput('');
        setLastResult({
          success: true,
          message: `Successfully created rule: ${rule.name}`
        });
      } else {
        setLastResult({
          success: false,
          message: 'Could not understand the rule description. Please try rephrasing or use more specific terms.'
        });
      }
    } catch (error) {
      setLastResult({
        success: false,
        message: 'An error occurred while processing your rule. Please try again.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      handleProcess();
    }
  };

  const sampleInputs = [
    "Tasks T001 and T003 must run together",
    "Limit frontend workers to 2 slots per phase",
    "Task T007 can only run in phases 4, 5, and 6",
    "Enterprise clients need at least 3 common slots",
    "Backend workers should not exceed 80% capacity"
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span>Describe Your Rule</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe the business rule you want to create in plain English..."
              rows={4}
              className="resize-none"
            />
            <div className="flex justify-between items-center">
              <p className="text-xs text-slate-500">
                Press Ctrl+Enter to process, or click the button
              </p>
              <Button 
                onClick={handleProcess}
                disabled={!input.trim() || isProcessing}
              >
                {isProcessing ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Sparkles className="h-4 w-4 mr-2" />
                )}
                {isProcessing ? 'Processing...' : 'Generate Rule'}
              </Button>
            </div>
          </div>

          {lastResult && (
            <Alert className={lastResult.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
              {lastResult.success ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600" />
              )}
              <AlertDescription className={lastResult.success ? 'text-green-800' : 'text-red-800'}>
                {lastResult.message}
              </AlertDescription>
            </Alert>
          )}

          {inputHistory.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-700">Recent Inputs:</p>
              <div className="flex flex-wrap gap-2">
                {inputHistory.map((historyInput, idx) => (
                  <Badge
                    key={idx}
                    variant="outline"
                    className="cursor-pointer hover:bg-slate-100 text-xs"
                    onClick={() => setInput(historyInput)}
                  >
                    {historyInput.length > 40 ? `${historyInput.substring(0, 40)}...` : historyInput}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Example Rule Descriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3">
            {sampleInputs.map((sample, idx) => (
              <Button
                key={idx}
                variant="outline"
                className="h-auto p-3 text-left justify-start"
                onClick={() => setInput(sample)}
              >
                <MessageSquare className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="text-sm">{sample}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}