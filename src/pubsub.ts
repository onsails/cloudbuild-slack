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
}

export interface Build {
  id: number;
  status: string;
  logUrl: string;
  source: Source;
  substitutions: { [key: string]: string };
  BRANCH_NAME: string;
  SHORT_SHA: string;
}

export function deserBuild(event: Event): Build {
  return JSON.parse(Buffer.from(event.data, 'base64').toString());
}
