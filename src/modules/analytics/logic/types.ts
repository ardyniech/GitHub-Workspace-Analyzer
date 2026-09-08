export interface WeeklyCommitActivity {
  week: number;
  total: number;
  days: number[];
  weekLabel: string;
}

export interface ParticipationActivity {
  all: number[];
  owner: number[];
}
