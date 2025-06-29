'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart3, TrendingUp, Users, Zap } from 'lucide-react';
import { PrioritizationProfile } from '@/types/rule-types';

interface PrioritizationPreviewProps {
  profile: PrioritizationProfile;
}

export function PrioritizationPreview({ profile }: PrioritizationPreviewProps) {
  // Mock data for preview - in real implementation, this would use actual data
  const mockScenarios = [
    {
      name: 'High Priority Client Request',
      description: 'Enterprise client with priority level 5 requesting urgent tasks',
      scores: {
        'priority-level': 0.95,
        'task-urgency': 0.85,
        'worker-utilization': 0.6,
        'skill-matching': 0.8,
        'phase-optimization': 0.7
      }
    },
    {
      name: 'Balanced Workload Distribution',
      description: 'Multiple medium priority requests with good skill coverage',
      scores: {
        'priority-level': 0.6,
        'task-urgency': 0.7,
        'worker-utilization': 0.9,
        'skill-matching': 0.85,
        'phase-optimization': 0.8
      }
    },
    {
      name: 'Efficiency Optimization',
      description: 'Tasks with perfect skill matches and optimal phase alignment',
      scores: {
        'priority-level': 0.5,
        'task-urgency': 0.6,
        'worker-utilization': 0.7,
        'skill-matching': 0.95,
        'phase-optimization': 0.9
      }
    }
  ];

  const calculateOverallScore = (scores: Record<string, number>) => {
    return profile.criteria.reduce((total, criterion) => {
      const score = scores[criterion.id] || 0;
      return total + (score * criterion.weight);
    }, 0);
  };

  const getCriteriaIcon = (criteriaId: string) => {
    switch (criteriaId) {
      case 'priority-level':
      case 'task-urgency':
        return <TrendingUp className="h-4 w-4" />;
      case 'worker-utilization':
        return <Users className="h-4 w-4" />;
      case 'skill-matching':
      case 'phase-optimization':
        return <Zap className="h-4 w-4" />;
      default:
        return <BarChart3 className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Allocation Scenarios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {mockScenarios.map((scenario, index) => {
              const overallScore = calculateOverallScore(scenario.scores);
              
              return (
                <Card key={index} className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{scenario.name}</h4>
                        <p className="text-sm text-slate-600">{scenario.description}</p>
                      </div>
                      <Badge 
                        variant={overallScore > 0.8 ? 'default' : overallScore > 0.6 ? 'secondary' : 'outline'}
                        className="text-lg px-3 py-1"
                      >
                        {Math.round(overallScore * 100)}%
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      {profile.criteria.map((criterion) => {
                        const score = scenario.scores[criterion.id] || 0;
                        const weightedScore = score * criterion.weight;
                        
                        return (
                          <div key={criterion.id} className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center space-x-2">
                                {getCriteriaIcon(criterion.id)}
                                <span>{criterion.name}</span>
                                <Badge variant="outline" className="text-xs">
                                  {Math.round(criterion.weight * 100)}% weight
                                </Badge>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-slate-600">
                                  {Math.round(score * 100)}% × {Math.round(criterion.weight * 100)}%
                                </span>
                                <span className="font-medium">
                                  = {Math.round(weightedScore * 100)}%
                                </span>
                              </div>
                            </div>
                            <Progress value={weightedScore * 100} className="h-2" />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Profile Impact Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Strongest Influence</h4>
              {profile.criteria
                .sort((a, b) => b.weight - a.weight)
                .slice(0, 2)
                .map((criterion) => (
                  <div key={criterion.id} className="flex items-center justify-between text-sm">
                    <span>{criterion.name}</span>
                    <Badge variant="default">{Math.round(criterion.weight * 100)}%</Badge>
                  </div>
                ))}
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Secondary Factors</h4>
              {profile.criteria
                .sort((a, b) => b.weight - a.weight)
                .slice(2)
                .map((criterion) => (
                  <div key={criterion.id} className="flex items-center justify-between text-sm">
                    <span>{criterion.name}</span>
                    <Badge variant="outline">{Math.round(criterion.weight * 100)}%</Badge>
                  </div>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}