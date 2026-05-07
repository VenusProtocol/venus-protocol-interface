export interface TimelineCheckpoint {
  title: string;
  description: string;
  status: 'passed' | 'ongoing' | 'upcoming';
}
