import { PrioritizationProfile, PrioritizationCriteria } from '@/types/rule-types';

export function generateDefaultPrioritizationProfiles(): PrioritizationProfile[] {
  const baseCriteria: PrioritizationCriteria[] = [
    {
      id: 'priority-level',
      name: 'Client Priority Level',
      weight: 0.3,
      description: 'Weight given to client priority levels (1-5)',
      category: 'fulfillment'
    },
    {
      id: 'task-urgency',
      name: 'Task Urgency',
      weight: 0.25,
      description: 'Priority based on task deadlines and duration',
      category: 'fulfillment'
    },
    {
      id: 'worker-utilization',
      name: 'Worker Utilization',
      weight: 0.2,
      description: 'Balance workload across available workers',
      category: 'distribution'
    },
    {
      id: 'skill-matching',
      name: 'Skill Matching',
      weight: 0.15,
      description: 'Quality of skill match between workers and tasks',
      category: 'efficiency'
    },
    {
      id: 'phase-optimization',
      name: 'Phase Optimization',
      weight: 0.1,
      description: 'Optimize task scheduling across phases',
      category: 'efficiency'
    }
  ];

  return [
    {
      id: 'maximize-fulfillment',
      name: 'Maximize Fulfillment',
      description: 'Prioritize completing as many high-priority client requests as possible',
      isDefault: false,
      criteria: baseCriteria.map(c => ({
        ...c,
        weight: c.category === 'fulfillment' ? c.weight * 1.5 : c.weight * 0.7
      }))
    },
    {
      id: 'balanced',
      name: 'Balanced Approach',
      description: 'Balance between fulfillment, fair distribution, and efficiency',
      isDefault: true,
      criteria: [...baseCriteria]
    },
    {
      id: 'fair-distribution',
      name: 'Fair Distribution',
      description: 'Ensure equitable workload distribution across all workers',
      isDefault: false,
      criteria: baseCriteria.map(c => ({
        ...c,
        weight: c.category === 'distribution' ? c.weight * 1.8 : c.weight * 0.8
      }))
    },
    {
      id: 'minimize-workload',
      name: 'Minimize Workload',
      description: 'Optimize for minimal overall workload and maximum efficiency',
      isDefault: false,
      criteria: baseCriteria.map(c => ({
        ...c,
        weight: c.category === 'workload' || c.category === 'efficiency' ? c.weight * 1.4 : c.weight * 0.9
      }))
    }
  ];
}