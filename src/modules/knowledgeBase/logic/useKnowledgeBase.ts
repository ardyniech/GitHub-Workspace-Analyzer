import { useState, useEffect } from 'react';
import { ExtendedStyleRule, KnowledgeBaseFilter } from './types';
import { getKnowledgeBaseRules } from '../storage/knowledgeStorage';
import { addCustomStandard, updateRuleOverride, toggleRuleStatus } from './knowledgeEngine';
import { dispatcher } from '../../../core/dispatcher';

export function useKnowledgeBase() {
  const [rules, setRules] = useState<ExtendedStyleRule[]>(getKnowledgeBaseRules());
  const [filter, setFilter] = useState<KnowledgeBaseFilter>({
    category: 'all',
    searchQuery: '',
    statusFilter: 'all',
  });

  useEffect(() => {
    const unsub = dispatcher.on('knowledge_base:updated', (data: ExtendedStyleRule[]) => {
      setRules(data);
    });
    return () => unsub();
  }, []);

  const filteredRules = rules.filter((r) => {
    const matchesCategory = filter.category === 'all' || r.category === filter.category;
    const matchesStatus = filter.statusFilter === 'all' || r.status === filter.statusFilter;
    const matchesSearch =
      !filter.searchQuery ||
      r.rule.toLowerCase().includes(filter.searchQuery.toLowerCase()) ||
      r.rationale.toLowerCase().includes(filter.searchQuery.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  return {
    rules: filteredRules,
    totalCount: rules.length,
    filter,
    setFilter,
    addCustom: addCustomStandard,
    updateOverride: updateRuleOverride,
    toggleStatus: toggleRuleStatus,
    refresh: () => setRules(getKnowledgeBaseRules()),
  };
}
