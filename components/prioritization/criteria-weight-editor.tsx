'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RotateCcw, Save, AlertTriangle } from 'lucide-react';
import { PrioritizationProfile, PrioritizationCriteria } from '@/types/rule-types';

interface CriteriaWeightEditorProps {
  profile: PrioritizationProfile;
  onUpdate: (updates: Partial<PrioritizationProfile>) => void;
}

export function CriteriaWeightEditor({ profile, onUpdate }: CriteriaWeightEditorProps) {
  const [criteria, setCriteria] = useState<PrioritizationCriteria[]>(profile.criteria);
  const [hasChanges, setHasChanges] = useState(false);

  const totalWeight = criteria.reduce((sum, c) => sum + c.weight, 0);
  const isBalanced = Math.abs(totalWeight - 1.0) < 0.01;

  const handleWeightChange = (criteriaId: string, newWeight: number) => {
    const updatedCriteria = criteria.map(c =>
      c.id === criteriaId ? { ...c, weight: newWeight } : c
    );
    setCriteria(updatedCriteria);
    setHasChanges(true);
  };

  const handleNormalize = () => {
    const normalizedCriteria = criteria.map(c => ({
      ...c,
      weight: c.weight / totalWeight
    }));
    setCriteria(normalizedCriteria);
    setHasChanges(true);
  };

  const handleReset = () => {
    setCriteria(profile.criteria);
    setHasChanges(false);
  };

  const handleSave = () => {
    onUpdate({ criteria });
    setHasChanges(false);
  };

  const getCategoryColor = (category: PrioritizationCriteria['category']) => {
    const colors = {
      fulfillment: 'bg-green-100 text-green-800',
      distribution: 'bg-blue-100 text-blue-800',
      workload: 'bg-purple-100 text-purple-800',
      efficiency: 'bg-orange-100 text-orange-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Weight Configuration</CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant={isBalanced ? 'default' : 'destructive'}>
                Total: {Math.round(totalWeight * 100)}%
              </Badge>
              {!isBalanced && (
                <Button size="sm" variant="outline" onClick={handleNormalize}>
                  Normalize
                </Button>
              )}
              {hasChanges && (
                <>
                  <Button size="sm" variant="outline" onClick={handleReset}>
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Reset
                  </Button>
                  <Button size="sm" onClick={handleSave}>
                    <Save className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {!isBalanced && (
            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                Weights should sum to 100% for optimal allocation. Current total: {Math.round(totalWeight * 100)}%
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-6">
            {criteria.map((criterion) => (
              <Card key={criterion.id} className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Label className="font-medium">{criterion.name}</Label>
                        <Badge className={getCategoryColor(criterion.category)} variant="secondary">
                          {criterion.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600">{criterion.description}</p>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Input
                        type="number"
                        value={Math.round(criterion.weight * 100)}
                        onChange={(e) => handleWeightChange(criterion.id, parseInt(e.target.value) / 100 || 0)}
                        className="w-20 text-center"
                        min="0"
                        max="100"
                      />
                      <span className="text-sm text-slate-500">%</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Slider
                      value={[criterion.weight * 100]}
                      onValueChange={([value]) => handleWeightChange(criterion.id, value / 100)}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>0%</span>
                      <span>50%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}