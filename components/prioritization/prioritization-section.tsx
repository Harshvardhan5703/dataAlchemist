'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Sliders, BarChart3, Download } from 'lucide-react';
import { PrioritizationProfile } from '@/types/rule-types';
import { PrioritizationProfiles } from './prioritization-profiles';
import { CriteriaWeightEditor } from './criteria-weight-editor';
import { PrioritizationPreview } from './prioritization-preview';

interface PrioritizationSectionProps {
  profiles: PrioritizationProfile[];
  activeProfileId: string;
  onProfileChange: (profileId: string) => void;
  onProfileUpdate: (profileId: string, updates: Partial<PrioritizationProfile>) => void;
}

export function PrioritizationSection({
  profiles,
  activeProfileId,
  onProfileChange,
  onProfileUpdate,
}: PrioritizationSectionProps) {
  const [activeTab, setActiveTab] = useState('profiles');
  
  const activeProfile = profiles.find(p => p.id === activeProfileId);

  const handleExportPrioritization = () => {
    if (!activeProfile) return;

    const config = {
      profile: activeProfile,
      metadata: {
        exportedAt: new Date().toISOString(),
        totalCriteria: activeProfile.criteria.length,
        weightSum: activeProfile.criteria.reduce((sum, c) => sum + c.weight, 0)
      }
    };

    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'prioritization.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-indigo-600" />
            <span>Prioritization Configuration</span>
          </CardTitle>
          <CardDescription>
            Configure how the resource allocation system should prioritize different criteria. 
            Choose from preset profiles or customize weights to match your business needs.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Priority Management</CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">
                Active: {activeProfile?.name || 'None'}
              </Badge>
              <Button onClick={handleExportPrioritization} size="sm" disabled={!activeProfile}>
                <Download className="h-4 w-4 mr-2" />
                Export Config
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profiles">
                <BarChart3 className="h-4 w-4 mr-2" />
                Profiles
              </TabsTrigger>
              <TabsTrigger value="customize">
                <Sliders className="h-4 w-4 mr-2" />
                Customize Weights
              </TabsTrigger>
              <TabsTrigger value="preview">
                <TrendingUp className="h-4 w-4 mr-2" />
                Preview Impact
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profiles" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Prioritization Profiles</h3>
                <p className="text-sm text-slate-600">Choose a preset profile that matches your allocation strategy</p>
              </div>
              
              <PrioritizationProfiles
                profiles={profiles}
                activeProfileId={activeProfileId}
                onProfileChange={onProfileChange}
              />
            </TabsContent>

            <TabsContent value="customize" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Customize Criteria Weights</h3>
                <p className="text-sm text-slate-600">Fine-tune the importance of each prioritization criterion</p>
              </div>
              
              {activeProfile && (
                <CriteriaWeightEditor
                  profile={activeProfile}
                  onUpdate={(updates) => onProfileUpdate(activeProfileId, updates)}
                />
              )}
            </TabsContent>

            <TabsContent value="preview" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Preview Prioritization Impact</h3>
                <p className="text-sm text-slate-600">See how your prioritization settings would affect resource allocation</p>
              </div>
              
              {activeProfile && (
                <PrioritizationPreview profile={activeProfile} />
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}