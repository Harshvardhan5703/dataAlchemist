'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, TrendingUp, Users, Zap, BarChart3 } from 'lucide-react';
import { PrioritizationProfile } from '@/types/rule-types';

interface PrioritizationProfilesProps {
  profiles: PrioritizationProfile[];
  activeProfileId: string;
  onProfileChange: (profileId: string) => void;
}

export function PrioritizationProfiles({ profiles, activeProfileId, onProfileChange }: PrioritizationProfilesProps) {
  const getProfileIcon = (profileId: string) => {
    switch (profileId) {
      case 'maximize-fulfillment':
        return <TrendingUp className="h-5 w-5" />;
      case 'fair-distribution':
        return <Users className="h-5 w-5" />;
      case 'minimize-workload':
        return <Zap className="h-5 w-5" />;
      default:
        return <BarChart3 className="h-5 w-5" />;
    }
  };

  const getProfileColor = (profileId: string) => {
    switch (profileId) {
      case 'maximize-fulfillment':
        return 'from-green-500 to-emerald-600';
      case 'fair-distribution':
        return 'from-blue-500 to-cyan-600';
      case 'minimize-workload':
        return 'from-purple-500 to-violet-600';
      default:
        return 'from-orange-500 to-red-600';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {profiles.map((profile) => {
        const isActive = profile.id === activeProfileId;
        const topCriteria = [...profile.criteria]
          .sort((a, b) => b.weight - a.weight)
          .slice(0, 3);

        return (
          <Card
            key={profile.id}
            className={`cursor-pointer transition-all duration-200 ${
              isActive 
                ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-200' 
                : 'hover:shadow-md hover:border-slate-300'
            }`}
            onClick={() => onProfileChange(profile.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 bg-gradient-to-r ${getProfileColor(profile.id)} rounded-lg text-white`}>
                    {getProfileIcon(profile.id)}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{profile.name}</CardTitle>
                    {profile.isDefault && (
                      <Badge variant="secondary" className="text-xs mt-1">Default</Badge>
                    )}
                  </div>
                </div>
                
                {isActive && (
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <CardDescription>{profile.description}</CardDescription>
              
              <div className="space-y-3">
                <div className="text-sm font-medium">Top Priorities:</div>
                {topCriteria.map((criteria) => (
                  <div key={criteria.id} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{criteria.name}</span>
                      <span className="font-medium">{Math.round(criteria.weight * 100)}%</span>
                    </div>
                    <Progress value={criteria.weight * 100} className="h-2" />
                  </div>
                ))}
              </div>
              
              <div className="pt-2">
                <Button
                  variant={isActive ? "default" : "outline"}
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    onProfileChange(profile.id);
                  }}
                >
                  {isActive ? 'Currently Active' : 'Select Profile'}
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}