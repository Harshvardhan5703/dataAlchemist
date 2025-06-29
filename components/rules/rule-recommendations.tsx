'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lightbulb, CheckCircle, X, TrendingUp } from 'lucide-react';
import { RuleRecommendation } from '@/types/rule-types';

interface RuleRecommendationsProps {
  recommendations: RuleRecommendation[];
  onAccept: (id: string) => void;
  onDismiss: (id: string) => void;
}

export function RuleRecommendations({ recommendations, onAccept, onDismiss }: RuleRecommendationsProps) {
  if (recommendations.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Lightbulb className="h-12 w-12 mx-auto mb-4 text-slate-300" />
          <p className="text-slate-500">No AI recommendations available.</p>
          <p className="text-sm text-slate-400">Upload more data to get intelligent rule suggestions.</p>
        </CardContent>
      </Card>
    );
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-100 text-green-800';
    if (confidence >= 0.6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.8) return 'High';
    if (confidence >= 0.6) return 'Medium';
    return 'Low';
  };

  return (
    <div className="space-y-4">
      <Alert className="border-blue-200 bg-blue-50">
        <Lightbulb className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          AI has analyzed your data patterns and suggests {recommendations.length} potential rule{recommendations.length > 1 ? 's' : ''}. 
          Review and accept the ones that align with your business requirements.
        </AlertDescription>
      </Alert>

      {recommendations.map((recommendation) => (
        <Card key={recommendation.id} className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CardTitle className="text-lg">{recommendation.description}</CardTitle>
                <Badge className={getConfidenceColor(recommendation.confidence)}>
                  {getConfidenceLabel(recommendation.confidence)} ({Math.round(recommendation.confidence * 100)}%)
                </Badge>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button 
                  size="sm" 
                  onClick={() => onAccept(recommendation.id)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Accept
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onDismiss(recommendation.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div>
                <span className="font-medium text-sm">AI Reasoning:</span>
                <p className="text-sm text-slate-600 mt-1">{recommendation.reasoning}</p>
              </div>
              
              <div>
                <span className="font-medium text-sm">Suggested Rule:</span>
                <div className="mt-1 p-3 bg-slate-50 rounded-md">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="outline">{recommendation.type.replace('-', ' ')}</Badge>
                    <span className="font-medium">{recommendation.suggestedRule.name}</span>
                  </div>
                  {recommendation.suggestedRule.description && (
                    <p className="text-sm text-slate-600">{recommendation.suggestedRule.description}</p>
                  )}
                </div>
              </div>
              
              {recommendation.dataContext.patterns.length > 0 && (
                <div>
                  <span className="font-medium text-sm">Data Patterns:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {recommendation.dataContext.patterns.map((pattern, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {pattern}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {recommendation.dataContext.affectedEntities.length > 0 && (
                <div>
                  <span className="font-medium text-sm">Affected Entities:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {recommendation.dataContext.affectedEntities.map((entity, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {entity}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}