"use client";

import { useEffect, useState } from "react";

interface GitHubStatsData {
  public_repos: number;
  followers: number;
  following: number;
  public_gists: number;
}

export default function GitHubStats() {
  const [stats, setStats] = useState<GitHubStatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGitHubStats = async () => {
      try {
        const response = await fetch(
          "https://api.github.com/users/keepitblazing"
        );
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch GitHub stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGitHubStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-wrap gap-3 justify-center sm:justify-start text-sm">
        <div className="flex items-center gap-2 px-3 py-1 bg-blog-black border border-blog-grey rounded-md animate-pulse">
          <span className="text-blog-text-muted">Loading...</span>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-3 justify-center sm:justify-start text-sm">
      <div className="flex items-center gap-2 px-3 py-1 bg-blog-black border border-blog-grey rounded-md">
        <span className="text-blog-text-muted">Repos:</span>
        <span className="text-blog-text font-medium">{stats.public_repos}</span>
      </div>
      <div className="flex items-center gap-2 px-3 py-1 bg-blog-black border border-blog-grey rounded-md">
        <span className="text-blog-text-muted">Followers:</span>
        <span className="text-blog-text font-medium">{stats.followers}</span>
      </div>
      <div className="flex items-center gap-2 px-3 py-1 bg-blog-black border border-blog-grey rounded-md">
        <span className="text-blog-text-muted">Following:</span>
        <span className="text-blog-text font-medium">{stats.following}</span>
      </div>
    </div>
  );
}
