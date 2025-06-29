'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Header } from '@/components/layout/header';
import { FileUploadSection } from '@/components/data-ingestion/file-upload-section';
import { DataGridSection } from '@/components/data-display/data-grid-section';
import { ValidationPanel } from '@/components/validation/validation-panel';
import { AIQuerySection } from '@/components/ai/ai-query-section';
import { RuleDefinitionSection } from '@/components/rules/rule-definition-section';
import { PrioritizationSection } from '@/components/prioritization/prioritization-section';
import { ExportSection } from '@/components/export/export-section';
import { ClientData, WorkerData, TaskData, ValidationError } from '@/types/data-types';
import { useDataStore } from '@/hooks/use-data-store';
import { useRulesStore } from '@/hooks/use-rules-store';
import { generateRuleRecommendations } from '@/lib/rule-generator';

export default function Home() {
  const {
    clientData,
    workerData,
    taskData,
    validationErrors,
    originalFormats,
    setClientDataWithFormat,
    setWorkerDataWithFormat,
    setTaskDataWithFormat,
    setValidationErrors,
  } = useDataStore();

  const {
    businessRules,
    prioritizationProfiles,
    activePrioritizationProfile,
    ruleRecommendations,
    addBusinessRule,
    updateBusinessRule,
    removeBusinessRule,
    toggleRuleEnabled,
    addRuleRecommendation,
    removeRuleRecommendation,
    acceptRuleRecommendation,
    setActivePrioritizationProfile,
    updatePrioritizationProfile,
  } = useRulesStore();

  const [activeTab, setActiveTab] = useState('upload');

  const hasData = clientData.length > 0 || workerData.length > 0 || taskData.length > 0;
  const hasValidData = hasData && validationErrors.filter(e => e.severity === 'error').length === 0;
  const activeProfile = prioritizationProfiles.find(p => p.id === activePrioritizationProfile);

  // Generate AI recommendations when data changes
  useEffect(() => {
    if (hasData && ruleRecommendations.length === 0) {
      generateRuleRecommendations(clientData, workerData, taskData)
        .then(recommendations => {
          recommendations.forEach(rec => addRuleRecommendation(rec));
        })
        .catch(console.error);
    }
  }, [clientData.length, workerData.length, taskData.length]);

  const handleDataUploaded = (type: string, data: any[], format?: 'csv' | 'xlsx') => {
    if (type === 'clients') setClientDataWithFormat(data as ClientData[], format);
    else if (type === 'workers') setWorkerDataWithFormat(data as WorkerData[], format);
    else if (type === 'tasks') setTaskDataWithFormat(data as TaskData[], format);
    
    if (hasData || data.length > 0) {
      setActiveTab('data');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold font-mono bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              Data Alchemist
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Transform your raw data into optimized resource allocation configurations with AI-powered validation, 
              cleaning, and intelligent business rule recommendations.
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-7 mb-8">
              <TabsTrigger value="upload">Data Upload</TabsTrigger>
              <TabsTrigger value="data" disabled={!hasData}>Data Review</TabsTrigger>
              <TabsTrigger value="validation" disabled={!hasData}>Validation</TabsTrigger>
              <TabsTrigger value="ai-query" disabled={!hasData}>AI Query</TabsTrigger>
              <TabsTrigger value="rules" disabled={!hasData}>Business Rules</TabsTrigger>
              <TabsTrigger value="prioritization" disabled={!hasValidData}>Prioritization</TabsTrigger>
              <TabsTrigger value="export" disabled={!hasValidData}>Export</TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-6">
              <FileUploadSection onDataUploaded={handleDataUploaded} />
            </TabsContent>

            <TabsContent value="data" className="space-y-6">
              <DataGridSection
                clientData={clientData}
                workerData={workerData}
                taskData={taskData}
                onClientDataChange={(data) => setClientDataWithFormat(data)}
                onWorkerDataChange={(data) => setWorkerDataWithFormat(data)}
                onTaskDataChange={(data) => setTaskDataWithFormat(data)}
                validationErrors={validationErrors}
              />
            </TabsContent>

            <TabsContent value="validation" className="space-y-6">
              <ValidationPanel
                clientData={clientData}
                workerData={workerData}
                taskData={taskData}
                validationErrors={validationErrors}
                onValidationErrors={setValidationErrors}
              />
            </TabsContent>

            <TabsContent value="ai-query" className="space-y-6">
              <AIQuerySection
                clientData={clientData}
                workerData={workerData}
                taskData={taskData}
              />
            </TabsContent>

            <TabsContent value="rules" className="space-y-6">
              <RuleDefinitionSection
                clientData={clientData}
                workerData={workerData}
                taskData={taskData}
                businessRules={businessRules}
                ruleRecommendations={ruleRecommendations}
                onAddRule={addBusinessRule}
                onUpdateRule={updateBusinessRule}
                onRemoveRule={removeBusinessRule}
                onToggleRule={toggleRuleEnabled}
                onAcceptRecommendation={acceptRuleRecommendation}
                onRemoveRecommendation={removeRuleRecommendation}
              />
            </TabsContent>

            <TabsContent value="prioritization" className="space-y-6">
              <PrioritizationSection
                profiles={prioritizationProfiles}
                activeProfileId={activePrioritizationProfile}
                onProfileChange={setActivePrioritizationProfile}
                onProfileUpdate={updatePrioritizationProfile}
              />
            </TabsContent>

            <TabsContent value="export" className="space-y-6">
              <ExportSection
                clientData={clientData}
                workerData={workerData}
                taskData={taskData}
                businessRules={businessRules}
                prioritizationProfile={activeProfile}
                originalFormats={originalFormats}
              />
            </TabsContent>
          </Tabs>
        </div>
        <footer className='font-black text-right m-4' >Made by Harsh <span className='font-thin' >with loads of mehnat.</span> </footer>
      </main>
    </div>
  );
}