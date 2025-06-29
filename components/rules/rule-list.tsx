'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Trash2, Edit, Calendar, User, Bot } from 'lucide-react';
import { BusinessRule } from '@/types/rule-types';

interface RuleListProps {
  rules: BusinessRule[];
  onUpdate: (id: string, updates: Partial<BusinessRule>) => void;
  onRemove: (id: string) => void;
  onToggle: (id: string) => void;
}

export function RuleList({ rules, onUpdate, onRemove, onToggle }: RuleListProps) {
  if (rules.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-slate-500">No rules configured yet.</p>
          <p className="text-sm text-slate-400">Create your first rule using the builder or natural language input.</p>
        </CardContent>
      </Card>
    );
  }

  const getRuleTypeColor = (type: BusinessRule['type']) => {
    const colors = {
      'co-run': 'bg-blue-100 text-blue-800',
      'slot-restriction': 'bg-purple-100 text-purple-800',
      'load-limit': 'bg-orange-100 text-orange-800',
      'phase-window': 'bg-green-100 text-green-800',
      'pattern-match': 'bg-yellow-100 text-yellow-800',
      'precedence-override': 'bg-red-100 text-red-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getSourceIcon = (source: BusinessRule['source']) => {
    switch (source) {
      case 'ai-generated':
        return <Bot className="h-4 w-4" />;
      case 'ai-suggested':
        return <Bot className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const formatParameters = (rule: BusinessRule) => {
    switch (rule.type) {
      case 'co-run':
        return `Tasks: ${rule.parameters.taskIds?.join(', ') || 'None'}`;
      case 'slot-restriction':
        return `${rule.parameters.groupType} group: ${rule.parameters.targetGroup}, Min slots: ${rule.parameters.minCommonSlots}`;
      case 'load-limit':
        return `Group: ${rule.parameters.workerGroup}, Max: ${rule.parameters.maxSlotsPerPhase} slots/phase`;
      case 'phase-window':
        return `Task: ${rule.parameters.taskId}, Phases: ${rule.parameters.allowedPhases?.join(', ') || 'None'}`;
      case 'pattern-match':
        return `${rule.parameters.entityType}.${rule.parameters.field} ~ "${rule.parameters.pattern}"`;
      case 'precedence-override':
        return `Global: ${rule.parameters.globalRuleId}, Specific: ${rule.parameters.specificRuleId}`;
      default:
        return 'No parameters';
    }
  };

  return (
    <div className="space-y-4">
      {rules.map((rule) => (
        <Card key={rule.id} className={rule.enabled ? '' : 'opacity-60'}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CardTitle className="text-lg">{rule.name}</CardTitle>
                <Badge className={getRuleTypeColor(rule.type)}>
                  {rule.type.replace('-', ' ')}
                </Badge>
                <div className="flex items-center space-x-1 text-slate-500">
                  {getSourceIcon(rule.source)}
                  <span className="text-xs capitalize">{rule.source.replace('-', ' ')}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  checked={rule.enabled}
                  onCheckedChange={() => onToggle(rule.id)}
                />
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onRemove(rule.id)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-3">
            {rule.description && (
              <p className="text-sm text-slate-600">{rule.description}</p>
            )}
            
            <div className="space-y-2">
              <div className="text-sm">
                <span className="font-medium">Parameters: </span>
                <span className="text-slate-600">{formatParameters(rule)}</span>
              </div>
              
              <div className="flex items-center space-x-4 text-xs text-slate-500">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>Created {rule.createdAt.toLocaleDateString()}</span>
                </div>
                <Badge variant={rule.enabled ? 'default' : 'secondary'} className="text-xs">
                  {rule.enabled ? 'Active' : 'Disabled'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}