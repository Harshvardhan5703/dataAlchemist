import { BusinessRule, RuleRecommendation } from '@/types/rule-types';
import { ClientData, WorkerData, TaskData } from '@/types/data-types';

export async function generateRuleRecommendations(
  clientData: ClientData[],
  workerData: WorkerData[],
  taskData: TaskData[]
): Promise<RuleRecommendation[]> {
  const recommendations: RuleRecommendation[] = [];

  // Analyze co-run patterns
  const coRunRecommendations = analyzeCoRunPatterns(clientData, taskData);
  recommendations.push(...coRunRecommendations);

  // Analyze workload distribution
  const loadLimitRecommendations = analyzeWorkloadDistribution(workerData);
  recommendations.push(...loadLimitRecommendations);

  // Analyze skill coverage
  const skillRecommendations = analyzeSkillCoverage(workerData, taskData);
  recommendations.push(...skillRecommendations);

  // Analyze phase conflicts
  const phaseRecommendations = analyzePhaseConflicts(taskData, workerData);
  recommendations.push(...phaseRecommendations);

  return recommendations;
}

function analyzeCoRunPatterns(clientData: ClientData[], taskData: TaskData[]): RuleRecommendation[] {
  const recommendations: RuleRecommendation[] = [];
  const taskPairCounts = new Map<string, number>();

  // Count how often task pairs appear together in client requests
  clientData.forEach(client => {
    const requestedTasks = client.RequestedTaskIDs.split(',').map(id => id.trim());
    
    for (let i = 0; i < requestedTasks.length; i++) {
      for (let j = i + 1; j < requestedTasks.length; j++) {
        const pair = [requestedTasks[i], requestedTasks[j]].sort().join(',');
        taskPairCounts.set(pair, (taskPairCounts.get(pair) || 0) + 1);
      }
    }
  });

  // Recommend co-run rules for frequently paired tasks
  const threshold = Math.max(2, Math.floor(clientData.length * 0.3));
  
  taskPairCounts.forEach((count, pair) => {
    if (count >= threshold) {
      const [taskId1, taskId2] = pair.split(',');
      const task1 = taskData.find(t => t.TaskID === taskId1);
      const task2 = taskData.find(t => t.TaskID === taskId2);
      
      if (task1 && task2) {
        recommendations.push({
          id: `corun_${Date.now()}_${Math.random()}`,
          type: 'co-run',
          confidence: Math.min(0.95, count / clientData.length),
          description: `Tasks ${task1.TaskName} and ${task2.TaskName} are frequently requested together`,
          reasoning: `These tasks appear together in ${count} out of ${clientData.length} client requests (${Math.round(count/clientData.length*100)}%)`,
          suggestedRule: {
            name: `Co-run: ${task1.TaskName} & ${task2.TaskName}`,
            type: 'co-run',
            parameters: {
              taskIds: [taskId1, taskId2],
              mustRunTogether: true
            }
          },
          dataContext: {
            affectedEntities: [taskId1, taskId2],
            patterns: [`Frequency: ${count}/${clientData.length}`]
          }
        });
      }
    }
  });

  return recommendations;
}

function analyzeWorkloadDistribution(workerData: WorkerData[]): RuleRecommendation[] {
  const recommendations: RuleRecommendation[] = [];
  const groupWorkloads = new Map<string, { totalSlots: number, maxLoad: number, workers: number }>();

  // Analyze workload by worker group
  workerData.forEach(worker => {
    const group = worker.WorkerGroup;
    const availableSlots = JSON.parse(worker.AvailableSlots || '[]').length;
    
    if (!groupWorkloads.has(group)) {
      groupWorkloads.set(group, { totalSlots: 0, maxLoad: 0, workers: 0 });
    }
    
    const groupData = groupWorkloads.get(group)!;
    groupData.totalSlots += availableSlots;
    groupData.maxLoad += worker.MaxLoadPerPhase;
    groupData.workers += 1;
  });

  // Recommend load limits for overloaded groups
  groupWorkloads.forEach((data, group) => {
    const avgSlotsPerWorker = data.totalSlots / data.workers;
    const avgMaxLoadPerWorker = data.maxLoad / data.workers;
    
    if (avgMaxLoadPerWorker > avgSlotsPerWorker * 0.8) {
      recommendations.push({
        id: `loadlimit_${Date.now()}_${Math.random()}`,
        type: 'load-limit',
        confidence: 0.75,
        description: `${group} workers may be overloaded`,
        reasoning: `Average max load (${avgMaxLoadPerWorker.toFixed(1)}) is high relative to available slots (${avgSlotsPerWorker.toFixed(1)})`,
        suggestedRule: {
          name: `Load Limit: ${group}`,
          type: 'load-limit',
          parameters: {
            workerGroup: group,
            maxSlotsPerPhase: Math.floor(avgSlotsPerWorker * 0.7),
            phases: [1, 2, 3, 4, 5, 6]
          }
        },
        dataContext: {
          affectedEntities: [group],
          patterns: [`Avg load: ${avgMaxLoadPerWorker.toFixed(1)}`, `Avg slots: ${avgSlotsPerWorker.toFixed(1)}`]
        }
      });
    }
  });

  return recommendations;
}

function analyzeSkillCoverage(workerData: WorkerData[], taskData: TaskData[]): RuleRecommendation[] {
  const recommendations: RuleRecommendation[] = [];
  const skillCoverage = new Map<string, number>();

  // Count workers per skill
  workerData.forEach(worker => {
    const skills = worker.Skills.split(',').map(s => s.trim().toLowerCase());
    skills.forEach(skill => {
      skillCoverage.set(skill, (skillCoverage.get(skill) || 0) + 1);
    });
  });

  // Find tasks with low skill coverage
  taskData.forEach(task => {
    const requiredSkills = task.RequiredSkills.split(',').map(s => s.trim().toLowerCase());
    const minCoverage = Math.min(...requiredSkills.map(skill => skillCoverage.get(skill) || 0));
    
    if (minCoverage <= 1 && requiredSkills.length > 0) {
      const criticalSkills = requiredSkills.filter(skill => (skillCoverage.get(skill) || 0) <= 1);
      
      recommendations.push({
        id: `skill_${Date.now()}_${Math.random()}`,
        type: 'pattern-match',
        confidence: 0.8,
        description: `Task ${task.TaskName} has limited skill coverage`,
        reasoning: `Critical skills with ≤1 worker: ${criticalSkills.join(', ')}`,
        suggestedRule: {
          name: `Skill Priority: ${task.TaskName}`,
          type: 'pattern-match',
          parameters: {
            pattern: task.TaskID,
            field: 'TaskID',
            entityType: 'tasks',
            action: 'flag'
          }
        },
        dataContext: {
          affectedEntities: [task.TaskID],
          patterns: [`Critical skills: ${criticalSkills.join(', ')}`]
        }
      });
    }
  });

  return recommendations;
}

function analyzePhaseConflicts(taskData: TaskData[], workerData: WorkerData[]): RuleRecommendation[] {
  const recommendations: RuleRecommendation[] = [];
  const phaseCapacity = new Map<number, number>();

  // Calculate total worker capacity per phase
  workerData.forEach(worker => {
    try {
      const availableSlots = JSON.parse(worker.AvailableSlots || '[]');
      availableSlots.forEach((phase: number) => {
        phaseCapacity.set(phase, (phaseCapacity.get(phase) || 0) + worker.MaxLoadPerPhase);
      });
    } catch {
      // Skip invalid slot data
    }
  });

  // Analyze task demand per phase
  const phaseDemand = new Map<number, number>();
  
  taskData.forEach(task => {
    try {
      const preferredPhases = JSON.parse(task.PreferredPhases || '[]');
      preferredPhases.forEach((phase: number) => {
        phaseDemand.set(phase, (phaseDemand.get(phase) || 0) + (task.Duration * task.MaxConcurrent));
      });
    } catch {
      // Skip invalid phase data
    }
  });

  // Recommend phase windows for overloaded phases
  phaseDemand.forEach((demand, phase) => {
    const capacity = phaseCapacity.get(phase) || 0;
    
    if (demand > capacity * 0.9) {
      // Find tasks that could be moved to less congested phases
      const alternativePhases = Array.from(phaseCapacity.keys())
        .filter(p => p !== phase && (phaseDemand.get(p) || 0) < capacity * 0.7)
        .slice(0, 3);

      if (alternativePhases.length > 0) {
        recommendations.push({
          id: `phase_${Date.now()}_${Math.random()}`,
          type: 'phase-window',
          confidence: 0.7,
          description: `Phase ${phase} is overloaded`,
          reasoning: `Demand (${demand}) exceeds 90% of capacity (${capacity}). Consider redistributing tasks.`,
          suggestedRule: {
            name: `Phase Redistribution: Phase ${phase}`,
            type: 'phase-window',
            parameters: {
              taskId: '', // Would need specific task selection
              allowedPhases: alternativePhases,
              restrictedPhases: [phase]
            }
          },
          dataContext: {
            affectedEntities: [`phase_${phase}`],
            patterns: [`Demand: ${demand}`, `Capacity: ${capacity}`, `Alternatives: ${alternativePhases.join(',')}`]
          }
        });
      }
    }
  });

  return recommendations;
}

export async function processNaturalLanguageRule(
  input: string,
  context: { clientData: ClientData[]; workerData: WorkerData[]; taskData: TaskData[] }
): Promise<BusinessRule | null> {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const inputLower = input.toLowerCase();

  // Pattern matching for different rule types
  if (inputLower.includes('together') || inputLower.includes('co-run') || inputLower.includes('same time')) {
    return parseCoRunRule(input, context);
  }
  
  if (inputLower.includes('limit') && (inputLower.includes('load') || inputLower.includes('workload'))) {
    return parseLoadLimitRule(input, context);
  }
  
  if (inputLower.includes('phase') && (inputLower.includes('only') || inputLower.includes('restrict'))) {
    return parsePhaseWindowRule(input, context);
  }
  
  if (inputLower.includes('group') && inputLower.includes('slot')) {
    return parseSlotRestrictionRule(input, context);
  }

  return null;
}

function parseCoRunRule(input: string, context: any): BusinessRule | null {
  // Extract task IDs or names from the input
  const taskMatches = input.match(/T\d+/g) || [];
  const validTasks = taskMatches.filter(taskId => 
    context.taskData.some((task: TaskData) => task.TaskID === taskId)
  );

  if (validTasks.length >= 2) {
    return {
      id: `rule_${Date.now()}`,
      name: `Co-run: ${validTasks.join(' & ')}`,
      type: 'co-run',
      description: `Tasks ${validTasks.join(' and ')} must run together`,
      parameters: {
        taskIds: validTasks,
        mustRunTogether: true
      },
      enabled: true,
      createdAt: new Date(),
      source: 'ai-generated'
    };
  }

  return null;
}

function parseLoadLimitRule(input: string, context: any): BusinessRule | null {
  const numberMatch = input.match(/(\d+)/);
  const groupMatch = input.match(/(frontend|backend|design|devops|qa|mobile|data-science|management)/i);
  
  if (numberMatch && groupMatch) {
    return {
      id: `rule_${Date.now()}`,
      name: `Load Limit: ${groupMatch[1]}`,
      type: 'load-limit',
      description: `Limit ${groupMatch[1]} workers to ${numberMatch[1]} slots per phase`,
      parameters: {
        workerGroup: groupMatch[1].toLowerCase(),
        maxSlotsPerPhase: parseInt(numberMatch[1]),
        phases: [1, 2, 3, 4, 5, 6]
      },
      enabled: true,
      createdAt: new Date(),
      source: 'ai-generated'
    };
  }

  return null;
}

function parsePhaseWindowRule(input: string, context: any): BusinessRule | null {
  const taskMatch = input.match(/T\d+/);
  const phaseMatches = input.match(/phase (\d+)/gi);
  
  if (taskMatch && phaseMatches) {
    const phases = phaseMatches.map(match => parseInt(match.replace(/phase /i, '')));
    
    return {
      id: `rule_${Date.now()}`,
      name: `Phase Window: ${taskMatch[0]}`,
      type: 'phase-window',
      description: `Restrict ${taskMatch[0]} to specific phases`,
      parameters: {
        taskId: taskMatch[0],
        allowedPhases: phases,
        restrictedPhases: []
      },
      enabled: true,
      createdAt: new Date(),
      source: 'ai-generated'
    };
  }

  return null;
}

function parseSlotRestrictionRule(input: string, context: any): BusinessRule | null {
  const numberMatch = input.match(/(\d+)/);
  const groupMatch = input.match(/(enterprise|startup|small-business|research|healthcare|finance)/i);
  
  if (numberMatch && groupMatch) {
    return {
      id: `rule_${Date.now()}`,
      name: `Slot Restriction: ${groupMatch[1]}`,
      type: 'slot-restriction',
      description: `Require ${groupMatch[1]} clients to have ${numberMatch[1]} common slots`,
      parameters: {
        targetGroup: groupMatch[1].toLowerCase(),
        groupType: 'client' as const,
        minCommonSlots: parseInt(numberMatch[1]),
        phases: [1, 2, 3, 4, 5, 6]
      },
      enabled: true,
      createdAt: new Date(),
      source: 'ai-generated'
    };
  }

  return null;
}