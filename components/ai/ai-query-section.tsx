'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Search, Loader2, MessageSquare } from 'lucide-react';
import { ClientData, WorkerData, TaskData, AIQueryResult } from '@/types/data-types';
import { processAIQuery } from '@/lib/ai-query-processor';
import { AIQueryResults } from './ai-query-results';

interface AIQuerySectionProps {
  clientData: ClientData[];
  workerData: WorkerData[];
  taskData: TaskData[];
}

export function AIQuerySection({ clientData, workerData, taskData }: AIQuerySectionProps) {
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [queryResult, setQueryResult] = useState<AIQueryResult | null>(null);
  const [queryHistory, setQueryHistory] = useState<string[]>([]);

  const handleQuery = async () => {
    if (!query.trim() || isProcessing) return;

    setIsProcessing(true);
    try {
      const result = await processAIQuery(query, { clientData, workerData, taskData });
      setQueryResult(result);
      setQueryHistory(prev => [query, ...prev.slice(0, 4)]); // Keep last 5 queries
      setQuery('');
    } catch (error) {
      console.error('Query processing error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleQuery();
    }
  };

  const sampleQueries = [
    "Show all clients with priority level greater than 3",
    "Find workers who have 'javascript' skills and are available in phase 2",
    "List tasks with duration longer than 2 phases",
    "Show all high priority clients who requested task T001",
    "Find workers in the 'development' group with more than 3 available slots"
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-cyan-600" />
            <span>AI-Powered Data Query</span>
          </CardTitle>
          <CardDescription>
            Ask questions about your data in plain English. Our AI will understand your intent 
            and filter the data accordingly, making complex queries simple and intuitive.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Query Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span>Natural Language Query</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask anything about your data... (e.g., 'Show all high priority clients with javascript tasks')"
              className="flex-1"
            />
            <Button 
              onClick={handleQuery}
              disabled={!query.trim() || isProcessing}
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              <span className="ml-2">
                {isProcessing ? 'Processing...' : 'Query'}
              </span>
            </Button>
          </div>

          {queryHistory.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-700">Recent Queries:</p>
              <div className="flex flex-wrap gap-2">
                {queryHistory.map((historyQuery, idx) => (
                  <Badge
                    key={idx}
                    variant="outline"
                    className="cursor-pointer hover:bg-slate-100 text-xs"
                    onClick={() => setQuery(historyQuery)}
                  >
                    {historyQuery.length > 50 ? `${historyQuery.substring(0, 50)}...` : historyQuery}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sample Queries */}
      <Card>
        <CardHeader>
          <CardTitle>Sample Queries</CardTitle>
          <CardDescription>
            Try these example queries to see how AI can help you explore your data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {sampleQueries.map((sampleQuery, idx) => (
              <Button
                key={idx}
                variant="outline"
                className="h-auto p-3 text-left justify-start"
                onClick={() => setQuery(sampleQuery)}
              >
                <MessageSquare className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="text-sm">{sampleQuery}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Query Results */}
      {queryResult && (
        <AIQueryResults result={queryResult} />
      )}
    </div>
  );
}