import { DataType, EntityData, ClientData, WorkerData, TaskData } from '@/types/data-types';

// Field mapping configurations for intelligent parsing
const FIELD_MAPPINGS = {
  clients: {
    'ClientID': ['client_id', 'clientid', 'id', 'client_identifier'],
    'ClientName': ['client_name', 'clientname', 'name', 'client'],
    'PriorityLevel': ['priority_level', 'prioritylevel', 'priority', 'importance'],
    'RequestedTaskIDs': ['requested_task_ids', 'requestedtaskids', 'tasks', 'task_ids'],
    'GroupTag': ['group_tag', 'grouptag', 'group', 'tag', 'category'],
    'AttributesJSON': ['attributes_json', 'attributesjson', 'attributes', 'metadata']
  },
  workers: {
    'WorkerID': ['worker_id', 'workerid', 'id', 'worker_identifier'],
    'WorkerName': ['worker_name', 'workername', 'name', 'worker'],
    'Skills': ['skills', 'skill_set', 'skillset', 'capabilities'],
    'AvailableSlots': ['available_slots', 'availableslots', 'slots', 'availability'],
    'MaxLoadPerPhase': ['max_load_per_phase', 'maxloadperphase', 'max_load', 'capacity'],
    'WorkerGroup': ['worker_group', 'workergroup', 'group', 'team'],
    'QualificationLevel': ['qualification_level', 'qualificationlevel', 'qualification', 'level']
  },
  tasks: {
    'TaskID': ['task_id', 'taskid', 'id', 'task_identifier'],
    'TaskName': ['task_name', 'taskname', 'name', 'task'],
    'Category': ['category', 'type', 'task_type', 'tasktype'],
    'Duration': ['duration', 'length', 'time_required', 'phases'],
    'RequiredSkills': ['required_skills', 'requiredskills', 'skills', 'skill_requirements'],
    'PreferredPhases': ['preferred_phases', 'preferredphases', 'phases', 'timeline'],
    'MaxConcurrent': ['max_concurrent', 'maxconcurrent', 'concurrent_limit', 'parallel']
  }
};

export async function aiDataParser(rawData: any[], type: DataType): Promise<EntityData[]> {
  if (rawData.length === 0) return [];

  // Get expected field mappings for this data type
  const expectedFields = FIELD_MAPPINGS[type];
  const rawFields = Object.keys(rawData[0]);
  
  // Create field mapping
  const fieldMapping: Record<string, string> = {};
  
  for (const [expectedField, possibleMatches] of Object.entries(expectedFields)) {
    // Find exact match first
    let matchedField = rawFields.find(field => 
      field.toLowerCase() === expectedField.toLowerCase()
    );
    
    // If no exact match, try fuzzy matching
    if (!matchedField) {
      matchedField = rawFields.find(field => 
        possibleMatches.some(match => 
          field.toLowerCase().includes(match) || match.includes(field.toLowerCase())
        )
      );
    }
    
    if (matchedField) {
      fieldMapping[expectedField] = matchedField;
    }
  }

  // Transform data using the field mapping
  const transformedData = rawData.map(row => {
    const transformedRow: any = {};
    
    for (const [expectedField, rawField] of Object.entries(fieldMapping)) {
      let value = row[rawField];
      
      // Apply data type conversions and cleaning
      if (expectedField === 'PriorityLevel' || expectedField === 'Duration' || 
          expectedField === 'MaxLoadPerPhase' || expectedField === 'MaxConcurrent') {
        value = parseInt(value) || 0;
      }
      
      // Clean string values
      if (typeof value === 'string') {
        value = value.trim();
      }
      
      // Handle JSON strings
      if (expectedField === 'AttributesJSON' && typeof value === 'string') {
        try {
          JSON.parse(value);
        } catch {
          // If not valid JSON, wrap in quotes to make it valid
          value = `"${value}"`;
        }
      }
      
      // Handle array-like fields
      if ((expectedField === 'RequestedTaskIDs' || expectedField === 'Skills' || 
           expectedField === 'RequiredSkills') && typeof value === 'string') {
        // Ensure comma-separated format
        value = value.replace(/[;|]/g, ',').replace(/\s*,\s*/g, ',');
      }
      
      // Handle AvailableSlots and PreferredPhases
      if ((expectedField === 'AvailableSlots' || expectedField === 'PreferredPhases') && 
          typeof value === 'string') {
        // Try to parse as JSON array, fallback to comma-separated
        try {
          const parsed = JSON.parse(value);
          if (Array.isArray(parsed)) {
            value = JSON.stringify(parsed);
          }
        } catch {
          // Convert comma-separated to JSON array format
          // @ts-ignore
          const items = value.split(',').map(item => item.trim());
          if (expectedField === 'AvailableSlots') {
                      // @ts-ignore

            const numbers = items.map(item => parseInt(item)).filter(n => !isNaN(n));
            value = JSON.stringify(numbers);
          } else {
            value = JSON.stringify(items);
          }
        }
      }
      
      transformedRow[expectedField] = value;
    }
    
    // Fill in missing required fields with defaults
    const requiredDefaults = getRequiredDefaults(type);
    for (const [field, defaultValue] of Object.entries(requiredDefaults)) {
      if (!(field in transformedRow)) {
        transformedRow[field] = defaultValue;
      }
    }
    
    return transformedRow;
  });

  return transformedData;
}

function getRequiredDefaults(type: DataType): Record<string, any> {
  switch (type) {
    case 'clients':
      return {
        ClientID: '',
        ClientName: '',
        PriorityLevel: 1,
        RequestedTaskIDs: '',
        GroupTag: 'default',
        AttributesJSON: '{}'
      };
    case 'workers':
      return {
        WorkerID: '',
        WorkerName: '',
        Skills: '',
        AvailableSlots: '[]',
        MaxLoadPerPhase: 1,
        WorkerGroup: 'default',
        QualificationLevel: 'junior'
      };
    case 'tasks':
      return {
        TaskID: '',
        TaskName: '',
        Category: 'general',
        Duration: 1,
        RequiredSkills: '',
        PreferredPhases: '[]',
        MaxConcurrent: 1
      };
    default:
      return {};
  }
}