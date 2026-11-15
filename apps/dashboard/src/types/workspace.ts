export type ConnectionMode = "web" | "api" | "both";

export interface LocalProject {
  id: string;
  name: string;
  websiteUrl: string;
  stellarDescription: string;
  connectionMode: ConnectionMode | null;
  serviceName: string;
  createdAt: string;
}

export interface LocalWorkspace {
  version: 1;
  email: string;
  name: string;
  project: LocalProject | null;
}
