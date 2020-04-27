export interface Event {
  data: string;
}

export interface Source {
  repoSource?: RepoSource;
}

export interface RepoSource {
  repoName: string;
  branchName: string;
  tagName: string;
  commitSha: string;
  dir: string;
  projectId: string;
  substitutions: Map<string, string>;
}

export interface Build {
  id: number;
  status: string;
  logUrl: string;
  source: Source;
}

export function deserBuild(event: Event): Build {
  return JSON.parse(Buffer.from(event.data, 'base64').toString());
}
