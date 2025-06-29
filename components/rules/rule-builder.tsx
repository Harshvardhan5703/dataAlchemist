'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { BusinessRule } from '@/types/rule-types';
import { ClientData, WorkerData, TaskData } from '@/types/data-types';

interface RuleBuilderProps {
  clientData: ClientData[];
  workerData: WorkerData[];
  taskData: TaskData[];
  onSave: (rule: BusinessRule) => void;
  onCancel: () => void;
}

export function RuleBuilder({ clientData, workerData, taskData, onSave, onCancel }: RuleBuilderProps) {
  const [ruleType, setRuleType] = useState<BusinessRule['type']>('co-run');
  const [ruleName, setRuleName] = useState('');
  const [ruleDescription, setRuleDescription] = useState('');
  const [parameters, setParameters] = useState<Record<string, any>>({});

  const handleSave = () => {
    if (!ruleName.trim()) return;

    const rule: BusinessRule = {
      id: `rule_${Date.now()}`,
      name: ruleName,
      type: ruleType,
      description: ruleDescription,
      parameters,
      enabled: true,
      createdAt: new Date(),
      source: 'manual'
    };

    onSave(rule);
  };

  const renderParameterInputs = () => {
    switch (ruleType) {
      case 'co-run':
        return <CoRunParameters parameters={parameters} setParameters={setParameters} taskData={taskData} />;
      case 'slot-restriction':
        return <SlotRestrictionParameters parameters={parameters} setParameters={setParameters} clientData={clientData} workerData={workerData} />;
      case 'load-limit':
        return <LoadLimitParameters parameters={parameters} setParameters={setParameters} workerData={workerData} />;
      case 'phase-window':
        return <PhaseWindowParameters parameters={parameters} setParameters={setParameters} taskData={taskData} />;
      case 'pattern-match':
        return <PatternMatchParameters parameters={parameters} setParameters={setParameters} />;
      case 'precedence-override':
        return <PrecedenceOverrideParameters parameters={parameters} setParameters={setParameters} />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Business Rule</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="rule-name">Rule Name</Label>
            <Input
              id="rule-name"
              value={ruleName}
              onChange={(e) => setRuleName(e.target.value)}
              placeholder="Enter rule name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="rule-type">Rule Type</Label>
            <Select value={ruleType} onValueChange={(value: BusinessRule['type']) => {
              setRuleType(value);
              setParameters({});
            }}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="co-run">Co-run</SelectItem>
                <SelectItem value="slot-restriction">Slot Restriction</SelectItem>
                <SelectItem value="load-limit">Load Limit</SelectItem>
                <SelectItem value="phase-window">Phase Window</SelectItem>
                <SelectItem value="pattern-match">Pattern Match</SelectItem>
                <SelectItem value="precedence-override">Precedence Override</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="rule-description">Description</Label>
          <Textarea
            id="rule-description"
            value={ruleDescription}
            onChange={(e) => setRuleDescription(e.target.value)}
            placeholder="Describe what this rule does"
            rows={2}
          />
        </div>

        {renderParameterInputs()}

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button onClick={handleSave} disabled={!ruleName.trim()}>Save Rule</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function CoRunParameters({ parameters, setParameters, taskData }: any) {
  const [selectedTasks, setSelectedTasks] = useState<string[]>(parameters.taskIds || []);

  const handleTaskToggle = (taskId: string) => {
    const newTasks = selectedTasks.includes(taskId)
      ? selectedTasks.filter(id => id !== taskId)
      : [...selectedTasks, taskId];
    
    setSelectedTasks(newTasks);
    setParameters({ ...parameters, taskIds: newTasks, mustRunTogether: true });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Select Tasks (minimum 2)</Label>
        <div className="grid grid-cols-2 gap-2 mt-2 max-h-40 overflow-y-auto">
          {taskData.map((task: TaskData) => (
            <div key={task.TaskID} className="flex items-center space-x-2">
              <Checkbox
                checked={selectedTasks.includes(task.TaskID)}
                onCheckedChange={() => handleTaskToggle(task.TaskID)}
              />
              <span className="text-sm">{task.TaskID} - {task.TaskName}</span>
            </div>
          ))}
        </div>
      </div>
      
      {selectedTasks.length > 0 && (
        <div>
          <Label>Selected Tasks:</Label>
          <div className="flex flex-wrap gap-1 mt-1">
            {selectedTasks.map(taskId => (
              <Badge key={taskId} variant="secondary">
                {taskId}
                <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => handleTaskToggle(taskId)} />
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SlotRestrictionParameters({ parameters, setParameters, clientData, workerData }: any) {
  // @ts-ignore
  const clientGroups = [...new Set(clientData.map((c: ClientData) => c.GroupTag))];
  // @ts-ignore
  const workerGroups = [...new Set(workerData.map((w: WorkerData) => w.WorkerGroup))];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Group Type</Label>
          <Select value={parameters.groupType || 'client'} onValueChange={(value) => 
            setParameters({ ...parameters, groupType: value, targetGroup: '' })
          }>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="client">Client Group</SelectItem>
              <SelectItem value="worker">Worker Group</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>Target Group</Label>
          <Select value={parameters.targetGroup || ''} onValueChange={(value) => 
            setParameters({ ...parameters, targetGroup: value })
          }>
            <SelectTrigger>
              <SelectValue placeholder="Select group" />
            </SelectTrigger>
            <SelectContent>
              {(parameters.groupType === 'worker' ? workerGroups : clientGroups).map(group => (
                <SelectItem key={group} value={group}>{group}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Minimum Common Slots</Label>
        <Input
          type="number"
          value={parameters.minCommonSlots || ''}
          onChange={(e) => setParameters({ ...parameters, minCommonSlots: parseInt(e.target.value) || 0 })}
          placeholder="Enter minimum slots"
        />
      </div>
    </div>
  );
}

function LoadLimitParameters({ parameters, setParameters, workerData }: any) {
  // @ts-ignore
  const workerGroups = [...new Set(workerData.map((w: WorkerData) => w.WorkerGroup))];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Worker Group</Label>
          <Select value={parameters.workerGroup || ''} onValueChange={(value) => 
            setParameters({ ...parameters, workerGroup: value })
          }>
            <SelectTrigger>
              <SelectValue placeholder="Select worker group" />
            </SelectTrigger>
            <SelectContent>
              {workerGroups.map(group => (
                <SelectItem key={group} value={group}>{group}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>Max Slots Per Phase</Label>
          <Input
            type="number"
            value={parameters.maxSlotsPerPhase || ''}
            onChange={(e) => setParameters({ ...parameters, maxSlotsPerPhase: parseInt(e.target.value) || 0 })}
            placeholder="Enter max slots"
          />
        </div>
      </div>
    </div>
  );
}

function PhaseWindowParameters({ parameters, setParameters, taskData }: any) {
  const [allowedPhases, setAllowedPhases] = useState<number[]>(parameters.allowedPhases || []);

  const handlePhaseToggle = (phase: number) => {
    const newPhases = allowedPhases.includes(phase)
      ? allowedPhases.filter(p => p !== phase)
      : [...allowedPhases, phase].sort();
    
    setAllowedPhases(newPhases);
    setParameters({ ...parameters, allowedPhases: newPhases });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Task ID</Label>
        <Select value={parameters.taskId || ''} onValueChange={(value) => 
          setParameters({ ...parameters, taskId: value })
        }>
          <SelectTrigger>
            <SelectValue placeholder="Select task" />
          </SelectTrigger>
          <SelectContent>
            {taskData.map((task: TaskData) => (
              <SelectItem key={task.TaskID} value={task.TaskID}>
                {task.TaskID} - {task.TaskName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label>Allowed Phases</Label>
        <div className="flex space-x-2">
          {[1, 2, 3, 4, 5, 6].map(phase => (
            <div key={phase} className="flex items-center space-x-1">
              <Checkbox
                checked={allowedPhases.includes(phase)}
                onCheckedChange={() => handlePhaseToggle(phase)}
              />
              <span className="text-sm">Phase {phase}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PatternMatchParameters({ parameters, setParameters }: any) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Entity Type</Label>
          <Select value={parameters.entityType || 'tasks'} onValueChange={(value) => 
            setParameters({ ...parameters, entityType: value })
          }>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="clients">Clients</SelectItem>
              <SelectItem value="workers">Workers</SelectItem>
              <SelectItem value="tasks">Tasks</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>Field</Label>
          <Input
            value={parameters.field || ''}
            onChange={(e) => setParameters({ ...parameters, field: e.target.value })}
            placeholder="Field name"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Pattern (Regex)</Label>
        <Input
          value={parameters.pattern || ''}
          onChange={(e) => setParameters({ ...parameters, pattern: e.target.value })}
          placeholder="Regular expression pattern"
        />
      </div>
      
      <div className="space-y-2">
        <Label>Action</Label>
        <Select value={parameters.action || 'flag'} onValueChange={(value) => 
          setParameters({ ...parameters, action: value })
        }>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="allow">Allow</SelectItem>
            <SelectItem value="deny">Deny</SelectItem>
            <SelectItem value="flag">Flag</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function PrecedenceOverrideParameters({ parameters, setParameters }: any) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Global Rule ID</Label>
        <Input
          value={parameters.globalRuleId || ''}
          onChange={(e) => setParameters({ ...parameters, globalRuleId: e.target.value })}
          placeholder="ID of global rule to override"
        />
      </div>
      
      <div className="space-y-2">
        <Label>Specific Rule ID</Label>
        <Input
          value={parameters.specificRuleId || ''}
          onChange={(e) => setParameters({ ...parameters, specificRuleId: e.target.value })}
          placeholder="ID of specific rule with higher priority"
        />
      </div>
      
      <div className="space-y-2">
        <Label>Priority Level</Label>
        <Input
          type="number"
          value={parameters.priority || ''}
          onChange={(e) => setParameters({ ...parameters, priority: parseInt(e.target.value) || 1 })}
          placeholder="Priority level (higher = more important)"
        />
      </div>
    </div>
  );
}