import { useState, useCallback } from 'react';
import { GithubUser, GithubRepo, ProcessedProfile, LanguageStat } from '../types';

interface ScanResult {
  data: ProcessedProfile | null;
  loading: boolean;
  error: string | null;
}

export const useGithubScanner = () => {
  const [result, setResult] = useState<ScanResult>({
    data: null,
    loading: false,
    error: null,
  });

  const scanProfile = useCallback(async (username: string) => {
    if (!username.trim()) return;

    setResult((prev) => ({ ...prev, loading: true, error: null, data: null }));

    try {
      // 1. Fetch User Data
      const userRes = await fetch(`https://api.github.com/users/${username}`);
      if (!userRes.ok) {
        if (userRes.status === 404) throw new Error('User not found');
        throw new Error(`GitHub API Error: ${userRes.statusText}`);
      }
      const user: GithubUser = await userRes.json();

      // 2. Fetch Repos (Top 100 sorted by updated)
      const reposRes = await fetch(
        `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`
      );
      if (!reposRes.ok) throw new Error('Failed to fetch repositories');
      const repos: GithubRepo[] = await reposRes.json();

      // 3. Process Data
      const totalStars = repos.reduce((acc, repo) => acc + repo.stargazers_count, 0);
      const totalForks = repos.reduce((acc, repo) => acc + repo.forks_count, 0);

      // Language Stats
      const langMap: Record<string, number> = {};
      repos.forEach((repo) => {
        if (repo.language) {
          langMap[repo.language] = (langMap[repo.language] || 0) + 1;
        }
      });

      const languages: LanguageStat[] = Object.entries(langMap)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 6); // Top 6 languages

      // Top Repos by Stars
      const topRepos = [...repos]
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 5);

      const forkRatio = repos.length > 0 
        ? ((repos.filter(r => r.fork).length / repos.length) * 100).toFixed(1) + '%' 
        : '0%';

      setResult({
        loading: false,
        error: null,
        data: {
          user,
          repos,
          totalStars,
          totalForks,
          languages,
          topRepos,
          forkRatio,
        },
      });

    } catch (err: any) {
      setResult({
        loading: false,
        error: err.message || 'An unknown error occurred',
        data: null,
      });
    }
  }, []);

  return { ...result, scanProfile };
};
