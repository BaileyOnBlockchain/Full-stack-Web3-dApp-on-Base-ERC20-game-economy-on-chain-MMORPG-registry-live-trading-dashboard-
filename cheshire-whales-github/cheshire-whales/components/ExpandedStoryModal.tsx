"use client";
import { useEffect, useState } from 'react';
import { X, ExternalLink, Clock, Globe, TrendingUp, Calendar, ArrowLeft } from 'lucide-react';

interface NewsItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  category: string;
}

interface ExpandedStoryModalProps {
  story: NewsItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ExpandedStoryModal({ story, isOpen, onClose }: ExpandedStoryModalProps) {
  const [fullContent, setFullContent] = useState<string>('');
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [contentError, setContentError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && story) {
      // Simulate fetching full content (in a real app, you'd fetch the full article)
      setIsLoadingContent(true);
      setContentError(null);
      
      // Simulate API delay
      setTimeout(() => {
        setFullContent(generateFullContent(story));
        setIsLoadingContent(false);
      }, 1000);
    }
  }, [isOpen, story]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const generateFullContent = (story: NewsItem) => {
    // In a real app, you'd fetch the full article content
    return `
      <div class="prose prose-invert max-w-none">
        <p class="text-lg leading-relaxed mb-6">
          ${story.description}
        </p>
        
        <h3 class="text-xl font-semibold mb-4 text-cyan-300">Key Highlights</h3>
        <ul class="space-y-3 mb-6">
          <li class="flex items-start gap-3">
            <div class="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
            <span>This development represents a significant milestone in the cryptocurrency ecosystem</span>
          </li>
          <li class="flex items-start gap-3">
            <div class="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
            <span>Market analysts are closely monitoring the impact on trading volumes and user adoption</span>
          </li>
          <li class="flex items-start gap-3">
            <div class="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
            <span>Industry experts predict continued growth in the coming months</span>
          </li>
        </ul>

        <h3 class="text-xl font-semibold mb-4 text-cyan-300">Market Impact</h3>
        <p class="mb-4">
          The cryptocurrency market has shown strong resilience in recent weeks, with this latest development 
          contributing to positive sentiment across the board. Trading volumes have increased significantly, 
          and institutional interest continues to grow.
        </p>

        <h3 class="text-xl font-semibold mb-4 text-cyan-300">Technical Analysis</h3>
        <p class="mb-4">
          From a technical perspective, the market is showing signs of healthy consolidation after recent 
          gains. Key support levels are holding strong, and resistance levels are being tested with 
          increasing volume.
        </p>

        <div class="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-400/20 rounded-xl p-4 mt-6">
          <h4 class="font-semibold text-cyan-300 mb-2">Expert Opinion</h4>
          <p class="text-sm text-cyan-200/80">
            "This development marks an important step forward for the industry. We're seeing increased 
            institutional adoption and regulatory clarity that bodes well for long-term growth." 
            - Crypto Market Analyst
          </p>
        </div>
      </div>
    `;
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Bitcoin': 'from-orange-500/20 to-yellow-500/20 border-orange-400/40 text-orange-300',
      'Ethereum': 'from-blue-500/20 to-purple-500/20 border-blue-400/40 text-blue-300',
      'DeFi': 'from-green-500/20 to-emerald-500/20 border-green-400/40 text-green-300',
      'NFTs': 'from-pink-500/20 to-rose-500/20 border-pink-400/40 text-pink-300',
      'Regulation': 'from-red-500/20 to-orange-500/20 border-red-400/40 text-red-300',
      'Crypto': 'from-cyan-500/20 to-blue-500/20 border-cyan-400/40 text-cyan-300'
    };
    return colors[category] || colors['Crypto'];
  };

  if (!isOpen || !story) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-7xl max-h-[95vh] bg-gradient-to-br from-slate-800/95 via-blue-900/90 to-indigo-900/95 backdrop-blur-2xl rounded-3xl border border-cyan-400/20 shadow-2xl shadow-cyan-500/20 overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="relative p-6 border-b border-cyan-400/20">
          {/* Holographic grid overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%2300D4FF%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M0%200h20v20H0zM10%200v20M0%2010h20%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
          
          {/* Scanning line */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />
          
          {/* Close button - top right corner */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-red-300/80 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all duration-300 border border-red-400/30 hover:border-red-400/50 z-20"
            title="Close window"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="relative z-10 pr-12">
            <div className="flex items-center gap-3 mb-3">
              <div className={`px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r border ${getCategoryColor(story.category)}`}>
                {story.category}
              </div>
              <div className="flex items-center gap-1 text-sm text-cyan-300/60">
                <Clock className="w-4 h-4" />
                <span>{formatTimeAgo(story.pubDate)}</span>
              </div>
            </div>
            
            <h2 className="text-3xl font-bold text-cyan-100 mb-4 leading-tight">
              {story.title}
            </h2>
            
            <div className="flex items-center gap-4 text-sm text-cyan-300/70">
              <div className="flex items-center gap-1">
                <Globe className="w-4 h-4" />
                <span>CoinTelegraph</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                <span>Hot Story</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(story.pubDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-6 overflow-y-auto max-h-[65vh]">
          {isLoadingContent ? (
            <div className="space-y-4">
              <div className="h-4 bg-cyan-400/20 rounded animate-pulse" />
              <div className="h-4 bg-cyan-400/20 rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-cyan-400/20 rounded w-1/2 animate-pulse" />
              <div className="h-32 bg-cyan-400/20 rounded animate-pulse" />
            </div>
          ) : contentError ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-red-400 to-red-500 flex items-center justify-center">
                <div className="w-8 h-8 text-white">⚠</div>
              </div>
              <h3 className="text-xl font-semibold text-red-400 mb-2">Content Error</h3>
              <p className="text-red-400/60">{contentError}</p>
            </div>
          ) : (
            <div 
              className="text-cyan-100/90 leading-relaxed prose prose-invert max-w-none prose-headings:text-cyan-300 prose-p:text-cyan-100/90 prose-li:text-cyan-100/90"
              dangerouslySetInnerHTML={{ __html: fullContent }}
            />
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-cyan-400/20 bg-gradient-to-r from-slate-800/50 to-blue-900/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-cyan-300/60">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span>Live Updates</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                <span>Trending</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-red-300/80 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all duration-300 flex items-center gap-2 border border-red-400/30 hover:border-red-400/50"
              >
                <X className="w-4 h-4" />
                Close
              </button>
              <a
                href={story.link}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white rounded-lg font-semibold transition-all duration-300 flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Read Full Article
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
