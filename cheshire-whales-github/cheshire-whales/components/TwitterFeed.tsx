"use client";

import { useState, useEffect } from 'react';
import { ExternalLink, RefreshCw } from 'lucide-react';
import { mockTweets, mockUser } from '@/lib/twitter-api';

interface Tweet {
  id: string;
  text: string;
  created_at: string;
  public_metrics: {
    retweet_count: number;
    like_count: number;
    reply_count: number;
    quote_count: number;
  };
  author: {
    username: string;
    name: string;
    profile_image_url: string;
  };
}

export default function TwitterFeed() {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTweets = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Try to fetch from API first
      const response = await fetch('/api/twitter');
      
      if (response.ok) {
        const data = await response.json();
        setTweets(data.tweets);
      } else {
        // Fallback to mock data
        const formattedTweets = mockTweets.map(tweet => ({
          ...tweet,
          author: mockUser
        }));
        setTweets(formattedTweets);
      }
    } catch (err) {
      console.warn('Failed to fetch tweets, using mock data:', err);
      setError('Using cached data');
      // Fallback to mock data
      const formattedTweets = mockTweets.map(tweet => ({
        ...tweet,
        author: mockUser
      }));
      setTweets(formattedTweets);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTweets();
  }, []);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks}w ago`;
    
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) return `${diffInMonths}mo ago`;
    
    const diffInYears = Math.floor(diffInDays / 365);
    return `${diffInYears}y ago`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="relative bg-gradient-to-br from-gray-800/90 to-black/90 backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/30 hover:border-cyan-400/50 transition-all duration-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-cyan-300">Latest from X</h3>
            <p className="text-sm text-gray-400">@Cheshire_Whales</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchTweets}
            disabled={loading}
            className="p-2 text-gray-400 hover:text-cyan-400 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <a
            href="https://x.com/Cheshire_Whales"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-gray-400 hover:text-cyan-400 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Tweets */}
      <div className="space-y-4">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-700 rounded w-1/4 mb-2"></div>
                    <div className="h-3 bg-gray-700 rounded w-1/6 mb-3"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-700 rounded"></div>
                      <div className="h-3 bg-gray-700 rounded w-3/4"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <div className="text-red-400 mb-2">⚠️ {error}</div>
            <button
              onClick={fetchTweets}
              className="text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Try again
            </button>
          </div>
        ) : (
          tweets.map((tweet) => (
            <div key={tweet.id} className="border-b border-gray-700/50 pb-4 last:border-b-0">
              <div className="flex gap-3">
                <img
                  src={tweet.author.profile_image_url}
                  alt={tweet.author.name}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-cyan-300">{tweet.author.name}</span>
                    <span className="text-gray-400 text-sm">@{tweet.author.username}</span>
                    <span className="text-gray-500 text-sm">·</span>
                    <span className="text-gray-500 text-sm">{formatTimeAgo(tweet.created_at)}</span>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed mb-3">
                    {tweet.text}
                  </p>
                  <div className="flex items-center gap-6 text-gray-400 text-sm">
                    <div className="flex items-center gap-1 hover:text-cyan-400 transition-colors">
                      <span>💬</span>
                      <span className="font-medium">{formatNumber(tweet.public_metrics.reply_count)}</span>
                    </div>
                    <div className="flex items-center gap-1 hover:text-green-400 transition-colors">
                      <span>🔄</span>
                      <span className="font-medium">{formatNumber(tweet.public_metrics.retweet_count)}</span>
                    </div>
                    <div className="flex items-center gap-1 hover:text-red-400 transition-colors">
                      <span>❤️</span>
                      <span className="font-medium">{formatNumber(tweet.public_metrics.like_count)}</span>
                    </div>
                    {tweet.public_metrics.quote_count > 0 && (
                      <div className="flex items-center gap-1 hover:text-purple-400 transition-colors">
                        <span>💭</span>
                        <span className="font-medium">{formatNumber(tweet.public_metrics.quote_count)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-700/50">
        <a
          href="https://x.com/Cheshire_Whales"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors text-sm"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          Follow us on X for more updates
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
