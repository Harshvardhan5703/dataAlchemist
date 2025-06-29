import { ClientData, WorkerData, TaskData, ValidationError } from '@/types/data-types';

export async function runValidation(
  clientData: ClientData[],
  workerData: WorkerData[],
  taskData: TaskData[]
): Promise<ValidationError[]> {
  const errors: ValidationError[] = [];
  let errorId = 1;

  // Validate clients
  clientData.forEach((client, index) => {
    errors.push(...validateClient(client, index, taskData, errorId));
  });

  // Validate workers
  workerData.forEach((worker, index) => {
    errors.push(...validateWorker(worker, index, errorId));
  });

  // Validate tasks
  taskData.forEach((task, index) => {
    errors.push(...validateTask(task, index, workerData, errorId));
  });

  // Cross-reference validations
  errors.push(...validateCrossReferences(clientData, workerData, taskData, errorId));

  return errors;
}

function validateClient(client: ClientData, index: number, taskData: TaskData[], errorId: number): ValidationError[] {
  const errors: ValidationError[] = [];

  // Required fields
  if (!client.ClientID?.trim()) {
    errors.push({
      id: `error_${errorId++}`,
      type: 'clients',
      row: index,
      field: 'ClientID',
      message: 'ClientID is required',
      severity: 'error',
      suggestion: 'Provide a unique identifier for the client'
    });
  }

  if (!client.ClientName?.trim()) {
    errors.push({
      id: `error_${errorId++}`,
      type: 'clients',
      row: index,
      field: 'ClientName',
      message: 'ClientName is required',
      severity: 'error',
      suggestion: 'Provide a descriptive name for the client'
    });
  }

  // Priority level validation
  if (client.PriorityLevel < 1 || client.PriorityLevel > 5) {
    errors.push({
      id: `error_${errorId++}`,
      type: 'clients',
      row: index,
      field: 'PriorityLevel',
      message: 'PriorityLevel must be between 1 and 5',
      severity: 'error',
      suggestion: 'Set priority level to a value between 1 (low) and 5 (high)'
    });
  }

  // Validate JSON format
  if (client.AttributesJSON) {
    try {
      JSON.parse(client.AttributesJSON);
    } catch {
      errors.push({
        id: `error_${errorId++}`,
        type: 'clients',
        row: index,
        field: 'AttributesJSON',
        message: 'AttributesJSON contains invalid JSON',
        severity: 'error',
        suggestion: 'Ensure the JSON is properly formatted with correct syntax'
      });
    }
  }

  // Validate requested task IDs exist
  if (client.RequestedTaskIDs) {
    const requestedIds = client.RequestedTaskIDs.split(',').map(id => id.trim());
    const availableTaskIds = taskData.map(task => task.TaskID);
    
    const invalidIds = requestedIds.filter(id => !availableTaskIds.includes(id));
    if (invalidIds.length > 0) {
      errors.push({
        id: `error_${errorId++}`,
        type: 'clients',
        row: index,
        field: 'RequestedTaskIDs',
        message: `Referenced task IDs not found: ${invalidIds.join(', ')}`,
        severity: 'warning',
        suggestion: 'Remove invalid task IDs or ensure the referenced tasks exist'
      });
    }
  }

  return errors;
}

function validateWorker(worker: WorkerData, index: number, errorId: number): ValidationError[] {
  const errors: ValidationError[] = [];

  // Required fields
  if (!worker.WorkerID?.trim()) {
    errors.push({
      id: `error_${errorId++}`,
      type: 'workers',
      row: index,
      field: 'WorkerID',
      message: 'WorkerID is required',
      severity: 'error',
      suggestion: 'Provide a unique identifier for the worker'
    });
  }

  if (!worker.WorkerName?.trim()) {
    errors.push({
      id: `error_${errorId++}`,
      type: 'workers',
      row: index,
      field: 'WorkerName',
      message: 'WorkerName is required',
      severity: 'error',
      suggestion: 'Provide the worker\'s name'
    });
  }

  // MaxLoadPerPhase validation
  if (worker.MaxLoadPerPhase < 1) {
    errors.push({
      id: `error_${errorId++}`,
      type: 'workers',
      row: index,
      field: 'MaxLoadPerPhase',
      message: 'MaxLoadPerPhase must be at least 1',
      severity: 'error',
      suggestion: 'Set a positive number for maximum workload per phase'
    });
  }

  // Validate AvailableSlots format
  if (worker.AvailableSlots) {
    try {
      const slots = JSON.parse(worker.AvailableSlots);
      if (!Array.isArray(slots)) {
        throw new Error('Not an array');
      }
      
      // Check if all values are numbers
      const invalidSlots = slots.filter(slot => typeof slot !== 'number' || slot < 1);
      if (invalidSlots.length > 0) {
        errors.push({
          id: `error_${errorId++}`,
          type: 'workers',
          row: index,
          field: 'AvailableSlots',
          message: 'AvailableSlots must contain only positive numbers',
          severity: 'error',
          suggestion: 'Ensure all slot numbers are positive integers (e.g., [1,2,3])'
        });
      }

      // Check for workload feasibility
      if (slots.length < worker.MaxLoadPerPhase) {
        errors.push({
          id: `error_${errorId++}`,
          type: 'workers',
          row: index,
          field: 'MaxLoadPerPhase',
          message: 'MaxLoadPerPhase exceeds available slots',
          severity: 'warning',
          suggestion: `Reduce MaxLoadPerPhase to ${slots.length} or add more available slots`
        });
      }
    } catch {
      errors.push({
        id: `error_${errorId++}`,
        type: 'workers',
        row: index,
        field: 'AvailableSlots',
        message: 'AvailableSlots must be a valid JSON array',
        severity: 'error',
        suggestion: 'Format as JSON array: [1,2,3,4]'
      });
    }
  }

  return errors;
}

function validateTask(task: TaskData, index: number, workerData: WorkerData[], errorId: number): ValidationError[] {
  const errors: ValidationError[] = [];

  // Required fields
  if (!task.TaskID?.trim()) {
    errors.push({
      id: `error_${errorId++}`,
      type: 'tasks',
      row: index,
      field: 'TaskID',
      message: 'TaskID is required',
      severity: 'error',
      suggestion: 'Provide a unique identifier for the task'
    });
  }

  if (!task.TaskName?.trim()) {
    errors.push({
      id: `error_${errorId++}`,
      type: 'tasks',
      row: index,
      field: 'TaskName',
      message: 'TaskName is required',
      severity: 'error',
      suggestion: 'Provide a descriptive name for the task'
    });
  }

  // Duration validation
  if (task.Duration < 1) {
    errors.push({
      id: `error_${errorId++}`,
      type: 'tasks',
      row: index,
      field: 'Duration',
      message: 'Duration must be at least 1',
      severity: 'error',
      suggestion: 'Set task duration to a positive number of phases'
    });
  }

  // MaxConcurrent validation
  if (task.MaxConcurrent < 1) {
    errors.push({
      id: `error_${errorId++}`,
      type: 'tasks',
      row: index,
      field: 'MaxConcurrent',
      message: 'MaxConcurrent must be at least 1',
      severity: 'error',
      suggestion: 'Set maximum concurrent assignments to a positive number'
    });
  }

  // Validate PreferredPhases format
  if (task.PreferredPhases) {
    try {
      const phases = JSON.parse(task.PreferredPhases);
      if (!Array.isArray(phases)) {
        throw new Error('Not an array');
      }
      
      const invalidPhases = phases.filter(phase => typeof phase !== 'number' || phase < 1);
      if (invalidPhases.length > 0) {
        errors.push({
          id: `error_${errorId++}`,
          type: 'tasks',
          row: index,
          field: 'PreferredPhases',
          message: 'PreferredPhases must contain only positive numbers',
          severity: 'error',
          suggestion: 'Ensure all phase numbers are positive integers (e.g., [1,2,3])'
        });
      }
    } catch {
      errors.push({
        id: `error_${errorId++}`,
        type: 'tasks',
        row: index,
        field: 'PreferredPhases',
        message: 'PreferredPhases must be a valid JSON array',
        severity: 'error',
        suggestion: 'Format as JSON array: [1,2,3] or ["1-3"] for ranges'
      });
    }
  }

  // Skill coverage validation
  if (task.RequiredSkills && workerData.length > 0) {
    const requiredSkills = task.RequiredSkills.split(',').map(skill => skill.trim().toLowerCase());
    const allWorkerSkills = workerData.flatMap(worker => 
      worker.Skills.split(',').map(skill => skill.trim().toLowerCase())
    );
    
    const uncoveredSkills = requiredSkills.filter(skill => 
      !allWorkerSkills.includes(skill)
    );
    
    if (uncoveredSkills.length > 0) {
      errors.push({
        id: `error_${errorId++}`,
        type: 'tasks',
        row: index,
        field: 'RequiredSkills',
        message: `No workers have required skills: ${uncoveredSkills.join(', ')}`,
        severity: 'warning',
        suggestion: 'Add workers with these skills or modify skill requirements'
      });
    }
  }

  return errors;
}

function validateCrossReferences(
  clientData: ClientData[],
  workerData: WorkerData[],
  taskData: TaskData[],
  errorId: number
): ValidationError[] {
  const errors: ValidationError[] = [];

  // Check for duplicate IDs
  const clientIds = clientData.map(c => c.ClientID);
  const duplicateClientIds = clientIds.filter((id, index) => clientIds.indexOf(id) !== index);
  
  const workerIds = workerData.map(w => w.WorkerID);
  const duplicateWorkerIds = workerIds.filter((id, index) => workerIds.indexOf(id) !== index);
  
  const taskIds = taskData.map(t => t.TaskID);
  const duplicateTaskIds = taskIds.filter((id, index) => taskIds.indexOf(id) !== index);

  // Report duplicate IDs
  if (duplicateClientIds.length > 0) {
    errors.push({
      id: `error_${errorId++}`,
      type: 'clients',
      row: -1,
      field: 'ClientID',
      // @ts-ignore
      message: `Duplicate ClientIDs found: ${[...new Set(duplicateClientIds)].join(', ')}`,
      severity: 'error',
      suggestion: 'Ensure all ClientIDs are unique'
    });
  }

  if (duplicateWorkerIds.length > 0) {
    errors.push({
      id: `error_${errorId++}`,
      type: 'workers',
      row: -1,
      field: 'WorkerID',
      // @ts-ignore
      message: `Duplicate WorkerIDs found: ${[...new Set(duplicateWorkerIds)].join(', ')}`,
      severity: 'error',
      suggestion: 'Ensure all WorkerIDs are unique'
    });
  }

  if (duplicateTaskIds.length > 0) {
    errors.push({
      id: `error_${errorId++}`,
      type: 'tasks',
      row: -1,
      field: 'TaskID',
      // @ts-ignore
      message: `Duplicate TaskIDs found: ${[...new Set(duplicateTaskIds)].join(', ')}`,
      severity: 'error',
      suggestion: 'Ensure all TaskIDs are unique'
    });
  }

  return errors;
}