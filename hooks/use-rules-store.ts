'use client';

import { useState } from 'react';
import { BusinessRule, PrioritizationProfile, RuleRecommendation } from '@/types/rule-types';
import { generateDefaultPrioritizationProfiles } from '@/lib/prioritization-profiles';

export function useRulesStore() {
  const [businessRules, setBusinessRules] = useState<BusinessRule[]>([]);
  const [prioritizationProfiles, setPrioritizationProfiles] = useState<PrioritizationProfile[]>(
    generateDefaultPrioritizationProfiles()
  );
  const [activePrioritizationProfile, setActivePrioritizationProfile] = useState<string>('balanced');
  const [ruleRecommendations, setRuleRecommendations] = useState<RuleRecommendation[]>([]);

  const addBusinessRule = (rule: BusinessRule) => {
    setBusinessRules(prev => [...prev, rule]);
  };

  const updateBusinessRule = (id: string, updates: Partial<BusinessRule>) => {
    setBusinessRules(prev => 
      prev.map(rule => rule.id === id ? { ...rule, ...updates } : rule)
    );
  };

  const removeBusinessRule = (id: string) => {
    setBusinessRules(prev => prev.filter(rule => rule.id !== id));
  };

  const toggleRuleEnabled = (id: string) => {
    setBusinessRules(prev =>
      prev.map(rule => rule.id === id ? { ...rule, enabled: !rule.enabled } : rule)
    );
  };

  const addRuleRecommendation = (recommendation: RuleRecommendation) => {
    setRuleRecommendations(prev => [...prev, recommendation]);
  };

  const removeRuleRecommendation = (id: string) => {
    setRuleRecommendations(prev => prev.filter(rec => rec.id !== id));
  };

  const acceptRuleRecommendation = (recommendationId: string) => {
    const recommendation = ruleRecommendations.find(rec => rec.id === recommendationId);
    if (recommendation) {
      const newRule: BusinessRule = {
        id: `rule_${Date.now()}`,
        name: recommendation.suggestedRule.name || `AI Generated Rule`,
        type: recommendation.type,
        description: recommendation.description,
        parameters: recommendation.suggestedRule.parameters || {},
        enabled: true,
        createdAt: new Date(),
        source: 'ai-generated'
      };
      addBusinessRule(newRule);
      removeRuleRecommendation(recommendationId);
    }
  };

  const updatePrioritizationProfile = (profileId: string, updates: Partial<PrioritizationProfile>) => {
    setPrioritizationProfiles(prev =>
      prev.map(profile => profile.id === profileId ? { ...profile, ...updates } : profile)
    );
  };

  return {
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
  };
}