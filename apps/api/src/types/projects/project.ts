export interface Project {
  id: string;
  streamName: string;
  websiteUrl: string;
  description: string;
  mode: 'web' | 'api' | 'both';
  umamiWebsiteId: string | null;
  createdAt: Date;
  updatedAt: Date;
}
