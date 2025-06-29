'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, Sparkles, Download, Plus } from 'lucide-react';
import { BusinessRule, RuleRecommendation } from '@/types/rule-types';
import { ClientData, WorkerData, TaskData } from '@/types/data-types';
import { RuleBuilder } from './rule-builder';
import { RuleList } from './rule-list';
import { RuleRecommendations } from './rule-recommendations';
import { NaturalLanguageRuleInput } from './natural-language-rule-input';

interface RuleDefinitionSectionProps {
  clientData: ClientData[];
  workerData: WorkerData[];
  taskData: TaskData[];
  businessRules: BusinessRule[];
  ruleRecommendations: RuleRecommendation[];
  onAddRule: (rule: BusinessRule) => void;
  onUpdateRule: (id: string, updates: Partial<BusinessRule>) => void;
  onRemoveRule: (id: string) => void;
  onToggleRule: (id: string) => void;
  onAcceptRecommendation: (id: string) => void;
  onRemoveRecommendation: (id: string) => void;
}

export function RuleDefinitionSection({
  clientData,
  workerData,
  taskData,
  businessRules,
  ruleRecommendations,
  onAddRule,
  onUpdateRule,
  onRemoveRule,
  onToggleRule,
  onAcceptRecommendation,
  onRemoveRecommendation,
}: RuleDefinitionSectionProps) {
  const [activeTab, setActiveTab] = useState('builder');
  const [showRuleBuilder, setShowRuleBuilder] = useState(false);

  const enabledRules = businessRules.filter(rule => rule.enabled);
  const hasRecommendations = ruleRecommendations.length > 0;

  const handleExportRules = () => {
    const rulesConfig = {
      rules: enabledRules,
      metadata: {
        exportedAt: new Date().toISOString(),
        totalRules: businessRules.length,
        enabledRules: enabledRules.length,
        // @ts-ignore
        ruleTypes: [...new Set(businessRules.map(rule => rule.type))]
      }
    };

    const blob = new Blob([JSON.stringify(rulesConfig, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'rules.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-orange-600" />
            <span>Business Rules Configuration</span>
          </CardTitle>
          <CardDescription>
            Define and manage business rules for resource allocation. Create rules manually, 
            use natural language input, or accept AI-generated recommendations.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Rule Statistics */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Rule Management</CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">{businessRules.length} total rules</Badge>
              <Badge variant="default">{enabledRules.length} enabled</Badge>
              {hasRecommendations && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  {ruleRecommendations.length} recommendations
                </Badge>
              )}
              <Button onClick={handleExportRules} size="sm" disabled={enabledRules.length === 0}>
                <Download className="h-4 w-4 mr-2" />
                Export Rules
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="builder">Rule Builder</TabsTrigger>
              <TabsTrigger value="natural">Natural Language</TabsTrigger>
              <TabsTrigger value="recommendations" className="relative">
                AI Recommendations
                {hasRecommendations && (
                  <Badge variant="destructive" className="ml-2 text-xs">
                    {ruleRecommendations.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="manage">Manage Rules</TabsTrigger>
            </TabsList>

            <TabsContent value="builder" className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Visual Rule Builder</h3>
                  <p className="text-sm text-slate-600">Create rules using guided forms and dropdowns</p>
                </div>
                <Button onClick={() => setShowRuleBuilder(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Rule
                </Button>
              </div>
              
              {showRuleBuilder && (
                <RuleBuilder
                  clientData={clientData}
                  workerData={workerData}
                  taskData={taskData}
                  onSave={(rule) => {
                    onAddRule(rule);
                    setShowRuleBuilder(false);
                  }}
                  onCancel={() => setShowRuleBuilder(false)}
                />
              )}
            </TabsContent>

            <TabsContent value="natural" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Natural Language Rule Input</h3>
                <p className="text-sm text-slate-600">Describe rules in plain English and let AI convert them</p>
              </div>
              
              <NaturalLanguageRuleInput
                clientData={clientData}
                workerData={workerData}
                taskData={taskData}
                onRuleGenerated={onAddRule}
              />
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-4">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-blue-600" />
                <div>
                  <h3 className="text-lg font-semibold">AI-Generated Recommendations</h3>
                  <p className="text-sm text-slate-600">Review and accept AI-suggested rules based on your data patterns</p>
                </div>
              </div>
              
              <RuleRecommendations
                recommendations={ruleRecommendations}
                onAccept={onAcceptRecommendation}
                onDismiss={onRemoveRecommendation}
              />
            </TabsContent>

            <TabsContent value="manage" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Rule Management</h3>
                <p className="text-sm text-slate-600">View, edit, and manage all configured rules</p>
              </div>
              
              <RuleList
                rules={businessRules}
                onUpdate={onUpdateRule}
                onRemove={onRemoveRule}
                onToggle={onToggleRule}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}