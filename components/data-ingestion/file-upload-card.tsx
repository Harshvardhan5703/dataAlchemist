'use client';

import { useRef, useState, ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Upload, CheckCircle, AlertCircle, Loader2, FileUp } from 'lucide-react';
import { DataType } from '@/types/data-types';
import { cn } from '@/lib/utils';

interface FileUploadCardProps {
  type: DataType;
  title: string;
  description: string;
  icon: ReactNode;
  acceptedFormats: string;
  onFileUpload: (type: DataType, file: File) => Promise<void>;
  uploadProgress: number;
  uploadStatus: 'idle' | 'uploading' | 'success' | 'error';
}

export function FileUploadCard({
  type,
  title,
  description,
  icon,
  acceptedFormats,
  onFileUpload,
  uploadProgress,
  uploadStatus,
}: FileUploadCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await onFileUpload(type, file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const file = files[0];

    if (file) {
      // Check file type
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      const allowedExtensions = ['csv', 'xlsx', 'xls'];
      
      if (allowedExtensions.includes(fileExtension || '')) {
        await onFileUpload(type, file);
      } else {
        // You could add error handling here for invalid file types
        console.error('Invalid file type. Please upload CSV or XLSX files.');
      }
    }
  };

  const getStatusIcon = () => {
    switch (uploadStatus) {
      case 'uploading':
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Upload className="h-4 w-4" />;
    }
  };

  const getStatusColor = () => {
    switch (uploadStatus) {
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      case 'uploading':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-slate-200 hover:border-blue-300';
    }
  };

  return (
    <Card 
      className={cn(
        'transition-all duration-200 cursor-pointer',
        getStatusColor(),
        isDragOver && 'border-blue-400 bg-blue-100 scale-105 shadow-lg',
        uploadStatus === 'idle' && 'hover:shadow-md'
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => uploadStatus !== 'uploading' && fileInputRef.current?.click()}
    >
      <CardHeader className="text-center">
        <div className="mx-auto p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg text-white w-fit">
          {icon}
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Drag and Drop Area */}
        <div 
          className={cn(
            'border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200',
            isDragOver 
              ? 'border-blue-400 bg-blue-50 text-blue-700' 
              : 'border-slate-300 hover:border-blue-300 hover:bg-slate-50',
            uploadStatus === 'uploading' && 'pointer-events-none opacity-50'
          )}
        >
          <FileUp className={cn(
            'h-8 w-8 mx-auto mb-2 transition-colors',
            isDragOver ? 'text-blue-500' : 'text-slate-400'
          )} />
          <p className={cn(
            'text-sm font-medium mb-1',
            isDragOver ? 'text-blue-700' : 'text-slate-600'
          )}>
            {isDragOver ? 'Drop your file here' : 'Drag & drop your file here'}
          </p>
          <p className="text-xs text-slate-500">
            or click anywhere to browse
          </p>
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          <Badge variant="outline">.CSV</Badge>
          <Badge variant="outline">.XLSX</Badge>
        </div>

        {uploadStatus === 'uploading' && (
          <div className="space-y-2">
            <Progress value={uploadProgress} className="w-full" />
            <p className="text-sm text-center text-slate-600">
              Processing with AI... {uploadProgress}%
            </p>
          </div>
        )}

        {/* <Button
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
          disabled={uploadStatus === 'uploading'}
          className="w-full"
          variant={uploadStatus === 'success' ? 'outline' : 'default'}
        >
          {getStatusIcon()}
          <span className="ml-2">
            {uploadStatus === 'uploading' ? 'Processing...' : 
             uploadStatus === 'success' ? 'Upload New File' : 
             'Choose File'}
          </span>
        </Button> */}

        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFormats}
          onChange={handleFileSelect}
          className="hidden"
        />
      </CardContent>
    </Card>
  );
}