import { useState, useEffect } from 'react';
import { DeploymentRecord, DeployStatus } from './types';
import { deployStorageAdapter } from '../storage/deployAdapter';

export function useDeployEngine(repoFullName: string) {
  const [record, setRecord] = useState<DeploymentRecord | null>(null);

  useEffect(() => {
    const existing = deployStorageAdapter.getRecord(repoFullName);
    if (existing) setRecord(existing);
    else setRecord(null);
  }, [repoFullName]);

  const triggerDeploy = async () => {
    const newRecord: DeploymentRecord = {
      id: `deploy-${Date.now()}`,
      repoFullName,
      status: 'building',
      previewUrl: null,
      startedAt: Date.now(),
      logs: ['Memulai workflow GitHub Actions...'],
    };
    
    setRecord(newRecord);
    deployStorageAdapter.saveRecord(repoFullName, newRecord);

    try {
      // Simulate build process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const successRecord: DeploymentRecord = {
        ...newRecord,
        status: 'success',
        previewUrl: `https://preview.github.io/${repoFullName.toLowerCase().replace('/', '-')}`,
        completedAt: Date.now(),
        logs: [...newRecord.logs, 'Build berhasil! Container siap disajikan.'],
      };
      
      setRecord(successRecord);
      deployStorageAdapter.saveRecord(repoFullName, successRecord);
    } catch (e) {
      console.error('[deployAutomation] Error in triggerDeploy:', e);
      const failedRecord: DeploymentRecord = {
        ...newRecord,
        status: 'failed',
        completedAt: Date.now(),
        logs: [...newRecord.logs, 'Build gagal akibat masalah dependensi.'],
      };
      setRecord(failedRecord);
      deployStorageAdapter.saveRecord(repoFullName, failedRecord);
    }
  };

  const clearDeploy = () => {
    deployStorageAdapter.clearRecord(repoFullName);
    setRecord(null);
  };

  return { record, triggerDeploy, clearDeploy };
}
