import { ClientData, WorkerData, TaskData, AIQueryResult } from '@/types/data-types';

interface DataContext {
  clientData: ClientData[];
  workerData: WorkerData[];
  taskData: TaskData[];
}

export async function processAIQuery(query: string, context: DataContext): Promise<AIQueryResult> {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const queryLower = query.toLowerCase();
  const result: AIQueryResult = {
    query,
    results: {
      clients: [],
      workers: [],
      tasks: []
    },
    explanation: ''
  };

  // Simple pattern matching for demo purposes
  // In a real implementation, this would use the Gemini API

  // Priority level queries
  if (queryLower.includes('priority') && (queryLower.includes('greater') || queryLower.includes('higher') || queryLower.includes('>'))) {
    const priorityMatch = queryLower.match(/(\d)/);
    const priority = priorityMatch ? parseInt(priorityMatch[1]) : 3;
    
    result.results.clients = context.clientData.filter(client => client.PriorityLevel > priority);
    result.explanation = `Found clients with priority level greater than ${priority}`;
  }
  
  // Skill-based queries
  else if (queryLower.includes('skill') || queryLower.includes('javascript') || queryLower.includes('python') || queryLower.includes('react')) {
    const skillMatches = queryLower.match(/(javascript|python|react|node\.js|java|css|html|aws|docker)/g);
    if (skillMatches) {
      const searchSkill = skillMatches[0];
      result.results.workers = context.workerData.filter(worker => 
        worker.Skills.toLowerCase().includes(searchSkill)
      );
      result.explanation = `Found workers with ${searchSkill} skills`;
    }
  }
  
  // Duration-based queries
  else if (queryLower.includes('duration') && (queryLower.includes('longer') || queryLower.includes('greater') || queryLower.includes('>'))) {
    const durationMatch = queryLower.match(/(\d)/);
    const duration = durationMatch ? parseInt(durationMatch[1]) : 1;
    
    result.results.tasks = context.taskData.filter(task => task.Duration > duration);
    result.explanation = `Found tasks with duration longer than ${duration} phase${duration > 1 ? 's' : ''}`;
  }
  
  // Phase availability queries
  else if (queryLower.includes('phase') && queryLower.includes('available')) {
    const phaseMatch = queryLower.match(/phase (\d)/);
    const phase = phaseMatch ? parseInt(phaseMatch[1]) : 2;
    
    result.results.workers = context.workerData.filter(worker => {
      try {
        const availableSlots = JSON.parse(worker.AvailableSlots);
        return Array.isArray(availableSlots) && availableSlots.includes(phase);
      } catch {
        return false;
      }
    });
    result.explanation = `Found workers available in phase ${phase}`;
  }
  
  // Group-based queries
  else if (queryLower.includes('group') || queryLower.includes('team')) {
    const groupMatches = queryLower.match(/(frontend|backend|design|devops|qa|mobile|development)/);
    if (groupMatches) {
      const searchGroup = groupMatches[0];
      result.results.workers = context.workerData.filter(worker => 
        worker.WorkerGroup.toLowerCase().includes(searchGroup)
      );
      result.explanation = `Found workers in ${searchGroup} group`;
    }
  }
  
  // Task category queries
  else if (queryLower.includes('category') || queryLower.includes('type')) {
    const categoryMatches = queryLower.match(/(development|design|testing|security|integration|analytics)/);
    if (categoryMatches) {
      const searchCategory = categoryMatches[0];
      result.results.tasks = context.taskData.filter(task => 
        task.Category.toLowerCase().includes(searchCategory)
      );
      result.explanation = `Found tasks in ${searchCategory} category`;
    }
  }
  
  // High priority clients with specific tasks
  else if (queryLower.includes('high priority') && queryLower.includes('task')) {
    const taskMatch = queryLower.match(/task (\w+)/);
    if (taskMatch) {
      const taskId = taskMatch[1].toUpperCase();
      result.results.clients = context.clientData.filter(client => 
        client.PriorityLevel >= 4 && client.RequestedTaskIDs.includes(taskId)
      );
      result.explanation = `Found high priority clients who requested ${taskId}`;
    } else {
      result.results.clients = context.clientData.filter(client => client.PriorityLevel >= 4);
      result.explanation = 'Found high priority clients (priority level 4 or 5)';
    }
  }
  
  // Available slots queries
  else if (queryLower.includes('available slots') || queryLower.includes('more than')) {
    const slotMatch = queryLower.match(/(\d)/);
    const minSlots = slotMatch ? parseInt(slotMatch[1]) : 3;
    
    result.results.workers = context.workerData.filter(worker => {
      try {
        const availableSlots = JSON.parse(worker.AvailableSlots);
        return Array.isArray(availableSlots) && availableSlots.length > minSlots;
      } catch {
        return false;
      }
    });
    result.explanation = `Found workers with more than ${minSlots} available slots`;
  }
  
  // Default fallback
  else {
    result.explanation = 'I couldn\'t understand your query. Try asking about priority levels, skills, duration, phases, groups, or categories.';
  }

  return result;
}