'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, Users, Briefcase, FileText } from 'lucide-react';
import { AIQueryResult } from '@/types/data-types';

interface AIQueryResultsProps {
  result: AIQueryResult;
}

export function AIQueryResults({ result }: AIQueryResultsProps) {
  const { clients = [], workers = [], tasks = [] } = result.results;
  const totalResults = clients.length + workers.length + tasks.length;

  const renderTable = (data: any[], type: string) => {
    if (data.length === 0) return <div className="text-center py-4 text-slate-500">No {type} found</div>;

    const columns = Object.keys(data[0]);

    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column}>{column}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, idx) => (
              <TableRow key={idx}>
                {columns.map((column) => (
                  <TableCell key={column} className="max-w-[200px] truncate">
                    {String(row[column])}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <span>Query Results</span>
        </CardTitle>
        <CardDescription>
          <div className="space-y-2">
            <p><strong>Query:</strong> "{result.query}"</p>
            <p><strong>AI Explanation:</strong> {result.explanation}</p>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">{totalResults} total results</Badge>
              {clients.length > 0 && <Badge variant="outline">{clients.length} clients</Badge>}
              {workers.length > 0 && <Badge variant="outline">{workers.length} workers</Badge>}
              {tasks.length > 0 && <Badge variant="outline">{tasks.length} tasks</Badge>}
            </div>
          </div>
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {totalResults === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <p className="text-lg">No results found for your query.</p>
            <p className="text-sm">Try rephrasing your question or using different search terms.</p>
          </div>
        ) : (
          <Tabs defaultValue={clients.length > 0 ? 'clients' : workers.length > 0 ? 'workers' : 'tasks'}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="clients" disabled={clients.length === 0}>
                <Users className="h-4 w-4 mr-2" />
                Clients ({clients.length})
              </TabsTrigger>
              <TabsTrigger value="workers" disabled={workers.length === 0}>
                <Briefcase className="h-4 w-4 mr-2" />
                Workers ({workers.length})
              </TabsTrigger>
              <TabsTrigger value="tasks" disabled={tasks.length === 0}>
                <FileText className="h-4 w-4 mr-2" />
                Tasks ({tasks.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="clients" className="mt-4">
              {renderTable(clients, 'clients')}
            </TabsContent>

            <TabsContent value="workers" className="mt-4">
              {renderTable(workers, 'workers')}
            </TabsContent>

            <TabsContent value="tasks" className="mt-4">
              {renderTable(tasks, 'tasks')}
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}