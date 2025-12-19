export interface GithubUser {
  login: string;
  avatar_url: string;
  html_url: string;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  bio: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
}

export interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  html_url: string;
  description: string | null;
  fork: boolean;
  url: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  homepage: string | null;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: string | null;
  forks_count: number;
  open_issues_count: number;
  topics: string[];
}

export interface LanguageStat {
  name: string;
  value: number; // Count of repos using this language
}

export interface ProcessedProfile {
  user: GithubUser;
  repos: GithubRepo[];
  totalStars: number;
  totalForks: number;
  languages: LanguageStat[];
  topRepos: GithubRepo[];
  forkRatio: string; // Percentage string
}

export interface AnalysisState {
  isLoading: boolean;
  report: string | null;
  error: string | null;
}
