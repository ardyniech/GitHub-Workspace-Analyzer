export type VoiceCommandIntentType =
  | 'ANALYZE_REPO'
  | 'SEARCH_FILE'
  | 'CREATE_ISSUE'
  | 'UNKNOWN';

export interface VoiceCommandIntent {
  type: VoiceCommandIntentType;
  confidence: number;
  label: string;
  description: string;
  params: {
    query?: string;
    issueTitle?: string;
    issueBody?: string;
    analysisTopic?: string;
  };
}

export type VoiceCommanderStatus =
  | 'idle'
  | 'listening'
  | 'analyzing'
  | 'recognized'
  | 'executing'
  | 'success'
  | 'error';

export interface VoiceHistoryEntry {
  id: string;
  timestamp: number;
  transcript: string;
  intentType: VoiceCommandIntentType;
}
