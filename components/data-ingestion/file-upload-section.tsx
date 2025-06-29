'use client';

import { useState } from 'react';
import { Upload, FileText, Users, Briefcase, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { FileUploadCard } from './file-upload-card';
import { SampleDataGenerator } from './sample-data-generator';
import { DataType, EntityData } from '@/types/data-types';
import { parseUploadedFile } from '@/lib/file-parser';
import { aiDataParser } from '@/lib/ai-data-parser';

interface FileUploadSectionProps {
  onDataUploaded: (type: DataType, data: EntityData[], format?: 'csv' | 'xlsx') => void;
}

export function FileUploadSection({ onDataUploaded }: FileUploadSectionProps) {
  const [uploadProgress, setUploadProgress] = useState<Record<DataType, number>>({
    clients: 0,
    workers: 0,
    tasks: 0,
  });
  
  const [uploadStatus, setUploadStatus] = useState<Record<DataType, 'idle' | 'uploading' | 'success' | 'error'>>({
    clients: 'idle',
    workers: 'idle',
    tasks: 'idle',
  });

  const [uploadMessages, setUploadMessages] = useState<Record<DataType, string>>({
    clients: '',
    workers: '',
    tasks: '',
  });

  const handleFileUpload = async (type: DataType, file: File) => {
    setUploadStatus(prev => ({ ...prev, [type]: 'uploading' }));
    setUploadProgress(prev => ({ ...prev, [type]: 0 }));

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => ({
          ...prev,
          [type]: Math.min(prev[type] + 10, 90)
        }));
      }, 100);

      // Parse the file
      const rawData = await parseUploadedFile(file);
      
      // Apply AI-powered intelligent parsing
      const intelligentData = await aiDataParser(rawData, type);
      
      // Determine file format
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      const format = fileExtension === 'xlsx' || fileExtension === 'xls' ? 'xlsx' : 'csv';
      
      clearInterval(progressInterval);
      setUploadProgress(prev => ({ ...prev, [type]: 100 }));
      
      // Pass data to parent with format information
      onDataUploaded(type, intelligentData, format);
      
      setUploadStatus(prev => ({ ...prev, [type]: 'success' }));
      setUploadMessages(prev => ({ 
        ...prev, 
        [type]: `Successfully uploaded ${intelligentData.length} ${type} records with AI-powered field mapping (${format.toUpperCase()})` 
      }));

    } catch (error) {
      setUploadStatus(prev => ({ ...prev, [type]: 'error' }));
      setUploadMessages(prev => ({ 
        ...prev, 
        [type]: `Error uploading ${type}: ${error instanceof Error ? error.message : 'Unknown error'}` 
      }));
    }
  };

  const handleSampleDataLoad = (type: DataType, data: EntityData[]) => {
    onDataUploaded(type, data, 'csv'); // Sample data defaults to CSV format
    setUploadStatus(prev => ({ ...prev, [type]: 'success' }));
    setUploadMessages(prev => ({ 
      ...prev, 
      [type]: `Loaded ${data.length} sample ${type} records (CSV format)` 
    }));
  };

  return (
    <div className="space-y-8">
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5 text-blue-600" />
            <span>Data Ingestion Hub</span>
          </CardTitle>
          <CardDescription>
            Upload your CSV or XLSX files for clients, workers, and tasks. Our AI engine will intelligently 
            parse and map your data fields, even with variations in column names or order. Files will be 
            exported in the same format they were imported.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <FileUploadCard
          type="clients"
          title="Client Data"
          description="Upload client information with priority levels and requested tasks"
          icon={<Users className="h-8 w-8" />}
          acceptedFormats=".csv,.xlsx"
          onFileUpload={handleFileUpload}
          uploadProgress={uploadProgress.clients}
          uploadStatus={uploadStatus.clients}
        />

        <FileUploadCard
          type="workers"
          title="Worker Data"
          description="Upload worker profiles with skills and availability slots"
          icon={<Briefcase className="h-8 w-8" />}
          acceptedFormats=".csv,.xlsx"
          onFileUpload={handleFileUpload}
          uploadProgress={uploadProgress.workers}
          uploadStatus={uploadStatus.workers}
        />

        <FileUploadCard
          type="tasks"
          title="Task Data"
          description="Upload task definitions with requirements and constraints"
          icon={<FileText className="h-8 w-8" />}
          acceptedFormats=".csv,.xlsx"
          onFileUpload={handleFileUpload}
          uploadProgress={uploadProgress.tasks}
          uploadStatus={uploadStatus.tasks}
        />
      </div>

      {/* Upload Status Messages */}
      <div className="space-y-3">
        {Object.entries(uploadMessages).map(([type, message]) => {
          if (!message) return null;
          const status = uploadStatus[type as DataType];
          
          return (
            <Alert key={type} className={status === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
              {status === 'success' ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600" />
              )}
              <AlertDescription className={status === 'success' ? 'text-green-800' : 'text-red-800'}>
                <span className="font-medium capitalize">{type}:</span> {message}
              </AlertDescription>
            </Alert>
          );
        })}
      </div>

      {/* Sample Data Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <span>Try Sample Data</span>
          </CardTitle>
          <CardDescription>
            Load pre-configured sample data to explore the application's capabilities immediately.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SampleDataGenerator onSampleDataLoad={handleSampleDataLoad} />
        </CardContent>
      </Card>
    </div>
  );
}