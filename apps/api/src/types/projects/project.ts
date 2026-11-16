export interface Project {
  id: string;
  streamName: string;
  websiteUrl: string;
  description: string;
  mode: 'web' | 'api' | 'both';
  createdAt: Date;
  updatedAt: Date;
}
