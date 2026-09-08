import { useState, useEffect } from 'react';
import { PreFlightState, PreFlightStatus } from './types';
import { getStoredPreFlightState } from '../storage/preFlightStorage';
import { runPreFlightAudit, autoFixPreFlightIssue, resetPreFlightState } from './preFlightEngine';
import { dispatcher } from '../../../core/dispatcher';

export function usePreFlight() {
  const [state, setState] = useState<PreFlightState>(getStoredPreFlightState());
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const unsubUpdate = dispatcher.on('preflight:updated', (data: PreFlightState) => {
      setState(data);
      setIsRunning(false);
    });

    const unsubStatus = dispatcher.on('preflight:status', (status: PreFlightStatus) => {
      setIsRunning(status === 'scanning');
      setState((prev) => ({ ...prev, status }));
    });

    return () => {
      unsubUpdate();
      unsubStatus();
    };
  }, []);

  const triggerAudit = () => {
    setIsRunning(true);
    runPreFlightAudit();
  };

  const applyFix = (issueId: string) => {
    const updated = autoFixPreFlightIssue(issueId);
    setState(updated);
  };

  const reset = () => {
    const fresh = resetPreFlightState();
    setState(fresh);
    setIsRunning(false);
  };

  return {
    state,
    isRunning,
    triggerAudit,
    applyFix,
    reset,
  };
}
