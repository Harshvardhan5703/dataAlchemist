export interface BusinessRule {
  id: string;
  name: string;
  type: 'co-run' | 'slot-restriction' | 'load-limit' | 'phase-window' | 'pattern-match' | 'precedence-override';
  description: string;
  parameters: Record<string, any>;
  enabled: boolean;
  createdAt: Date;
  source: 'manual' | 'ai-generated' | 'ai-suggested';
}

export interface CoRunRule extends BusinessRule {
  type: 'co-run';
  parameters: {
    taskIds: string[];
    mustRunTogether: boolean;
  };
}

export interface SlotRestrictionRule extends BusinessRule {
  type: 'slot-restriction';
  parameters: {
    targetGroup: string;
    groupType: 'client' | 'worker';
    minCommonSlots: number;
    phases: number[];
  };
}

export interface LoadLimitRule extends BusinessRule {
  type: 'load-limit';
  parameters: {
    workerGroup: string;
    maxSlotsPerPhase: number;
    phases: number[];
  };
}

export interface PhaseWindowRule extends BusinessRule {
  type: 'phase-window';
  parameters: {
    taskId: string;
    allowedPhases: number[];
    restrictedPhases: number[];
  };
}

export interface PatternMatchRule extends BusinessRule {
  type: 'pattern-match';
  parameters: {
    pattern: string;
    field: string;
    entityType: 'clients' | 'workers' | 'tasks';
    action: 'allow' | 'deny' | 'flag';
  };
}

export interface PrecedenceOverrideRule extends BusinessRule {
  type: 'precedence-override';
  parameters: {
    globalRuleId: string;
    specificRuleId: string;
    priority: number;
  };
}

export interface PrioritizationCriteria {
  id: string;
  name: string;
  weight: number;
  description: string;
  category: 'fulfillment' | 'distribution' | 'workload' | 'efficiency';
}

export interface PrioritizationProfile {
  id: string;
  name: string;
  description: string;
  criteria: PrioritizationCriteria[];
  isDefault: boolean;
}

export interface RuleRecommendation {
  id: string;
  type: BusinessRule['type'];
  confidence: number;
  description: string;
  reasoning: string;
  suggestedRule: Partial<BusinessRule>;
  dataContext: {
    affectedEntities: string[];
    patterns: string[];
  };
}

export interface ExportConfiguration {
  includeCleanedData: boolean;
  includeRules: boolean;
  includePrioritization: boolean;
  format: 'json' | 'csv' | 'xlsx';
  filename?: string;
}