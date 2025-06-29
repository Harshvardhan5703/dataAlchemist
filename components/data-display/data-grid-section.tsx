'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Briefcase, FileText, AlertTriangle } from 'lucide-react';
import { DataGrid } from './data-grid';
import { ClientData, WorkerData, TaskData, ValidationError } from '@/types/data-types';

interface DataGridSectionProps {
  clientData: ClientData[];
  workerData: WorkerData[];
  taskData: TaskData[];
  onClientDataChange: (data: ClientData[]) => void;
  onWorkerDataChange: (data: WorkerData[]) => void;
  onTaskDataChange: (data: TaskData[]) => void;
  validationErrors: ValidationError[];
}

export function DataGridSection({
  clientData,
  workerData,
  taskData,
  onClientDataChange,
  onWorkerDataChange,
  onTaskDataChange,
  validationErrors,
}: DataGridSectionProps) {
  const getErrorCount = (type: string) => {
    return validationErrors.filter(error => error.type === type).length;
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-green-600" />
            <span>Data Review & Editing</span>
          </CardTitle>
          <CardDescription>
            Review and edit your uploaded data directly in the interactive grids below. 
            All changes are validated in real-time with AI-powered suggestions.
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="clients" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="clients" className="relative">
            <Users className="h-4 w-4 mr-2" />
            Clients ({clientData.length})
            {getErrorCount('clients') > 0 && (
              <Badge variant="destructive" className="ml-2 text-xs">
                {getErrorCount('clients')}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="workers" className="relative">
            <Briefcase className="h-4 w-4 mr-2" />
            Workers ({workerData.length})
            {getErrorCount('workers') > 0 && (
              <Badge variant="destructive" className="ml-2 text-xs">
                {getErrorCount('workers')}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="tasks" className="relative">
            <FileText className="h-4 w-4 mr-2" />
            Tasks ({taskData.length})
            {getErrorCount('tasks') > 0 && (
              <Badge variant="destructive" className="ml-2 text-xs">
                {getErrorCount('tasks')}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="clients" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Client Data</CardTitle>
              <CardDescription>
                Manage client information including priority levels and requested tasks.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataGrid
                data={clientData}
                type="clients"
                // @ts-ignore
                onDataChange={onClientDataChange}
                validationErrors={validationErrors.filter(e => e.type === 'clients')}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Worker Data</CardTitle>
              <CardDescription>
                Manage worker profiles including skills, availability, and workload limits.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataGrid
                data={workerData}
                type="workers"
                // @ts-ignore
                onDataChange={onWorkerDataChange}
                validationErrors={validationErrors.filter(e => e.type === 'workers')}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Task Data</CardTitle>
              <CardDescription>
                Manage task definitions including requirements, duration, and constraints.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataGrid
                data={taskData}
                type="tasks"
                // @ts-ignore
                onDataChange={onTaskDataChange}
                validationErrors={validationErrors.filter(e => e.type === 'tasks')}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}