'use client';

import { useState } from 'react';
import { ClientData, WorkerData, TaskData, ValidationError } from '@/types/data-types';

export function useDataStore() {
  const [clientData, setClientData] = useState<ClientData[]>([]);
  const [workerData, setWorkerData] = useState<WorkerData[]>([]);
  const [taskData, setTaskData] = useState<TaskData[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  
  // Track original file formats
  const [originalFormats, setOriginalFormats] = useState<{
    clients?: 'csv' | 'xlsx';
    workers?: 'csv' | 'xlsx';
    tasks?: 'csv' | 'xlsx';
  }>({});

  const setClientDataWithFormat = (data: ClientData[], format?: 'csv' | 'xlsx') => {
    setClientData(data);
    if (format) {
      setOriginalFormats(prev => ({ ...prev, clients: format }));
    }
  };

  const setWorkerDataWithFormat = (data: WorkerData[], format?: 'csv' | 'xlsx') => {
    setWorkerData(data);
    if (format) {
      setOriginalFormats(prev => ({ ...prev, workers: format }));
    }
  };

  const setTaskDataWithFormat = (data: TaskData[], format?: 'csv' | 'xlsx') => {
    setTaskData(data);
    if (format) {
      setOriginalFormats(prev => ({ ...prev, tasks: format }));
    }
  };

  return {
    clientData,
    workerData,
    taskData,
    validationErrors,
    originalFormats,
    setClientData,
    setWorkerData,
    setTaskData,
    setClientDataWithFormat,
    setWorkerDataWithFormat,
    setTaskDataWithFormat,
    setValidationErrors,
  };
}