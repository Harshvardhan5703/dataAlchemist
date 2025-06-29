export interface ClientData {
  ClientID: string;
  ClientName: string;
  PriorityLevel: number;
  RequestedTaskIDs: string;
  GroupTag: string;
  AttributesJSON: string;
}

export interface WorkerData {
  WorkerID: string;
  WorkerName: string;
  Skills: string;
  AvailableSlots: string;
  MaxLoadPerPhase: number;
  WorkerGroup: string;
  QualificationLevel: string;
}

export interface TaskData {
  TaskID: string;
  TaskName: string;
  Category: string;
  Duration: number;
  RequiredSkills: string;
  PreferredPhases: string;
  MaxConcurrent: number;
}

export interface ValidationError {
  id: string;
  type: 'clients' | 'workers' | 'tasks';
  row: number;
  field: string;
  message: string;
  severity: 'error' | 'warning';
  suggestion?: string;
}

export interface AIQueryResult {
  query: string;
  results: {
    clients?: ClientData[];
    workers?: WorkerData[];
    tasks?: TaskData[];
  };
  explanation: string;
}

export type DataType = 'clients' | 'workers' | 'tasks';
export type EntityData = ClientData | WorkerData | TaskData;