export interface TimelineCheckpoint {
  title: string;
  status: 'passed' | 'ongoing' | 'upcoming';
  timeRange?: string;
  description?: string;
}
