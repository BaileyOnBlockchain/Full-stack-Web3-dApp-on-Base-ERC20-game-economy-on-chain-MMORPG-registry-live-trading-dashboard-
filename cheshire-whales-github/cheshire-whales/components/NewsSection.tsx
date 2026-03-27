"use client";
import { useEffect, useState } from 'react';
import { ExternalLink, TrendingUp, Clock, Zap, Globe, Maximize2 } from 'lucide-react';
import ExpandedStoryModal from './ExpandedStoryModal';

interface NewsItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  category: string;
}

export default function NewsSection() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  const [selectedStory, setSelectedStory] = useState<NewsItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedStory, setExpandedStory] = useState<NewsItem | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/news');
        const data = await response.json();
        
        // Check if we got real data or fallback data
        const isFallback = data.some((item: NewsItem) => 
          item.title.includes('Bitcoin price analysis: BTC consolidates above $100K') ||
          item.title.includes('Ethereum network upgrade shows 40% reduction')
        );
        
        setNews(data);
        setIsUsingFallback(isFallback);
        setError(null);
      } catch (err) {
        setError('Failed to load news');
        setIsUsingFallback(true);
        console.error('News fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
    
    // Refresh news every 5 minutes
    const interval = setInterval(fetchNews, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

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

  const handleStoryClick = (story: NewsItem) => {
    if (expandedStory && expandedStory.title === story.title) {
      // If clicking the same story, collapse it
      setExpandedStory(null);
    } else {
      // Expand the clicked story
      setExpandedStory(story);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStory(null);
  };

  const handleExpandToModal = (story: NewsItem) => {
    setSelectedStory(story);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="w-full lg:w-80 bg-gradient-to-br from-slate-800/90 via-blue-900/80 to-indigo-900/90 backdrop-blur-2xl rounded-2xl p-6 border border-cyan-400/20 shadow-2xl shadow-cyan-500/10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
            <Globe className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-lg font-bold text-cyan-300">Hot Stories</h3>
        </div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-cyan-400/20 rounded mb-2" />
              <div className="h-3 bg-cyan-400/10 rounded w-3/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full lg:w-80 bg-gradient-to-br from-slate-800/90 via-blue-900/80 to-indigo-900/90 backdrop-blur-2xl rounded-2xl p-6 border border-cyan-400/20 shadow-2xl shadow-cyan-500/10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-400 to-red-500 flex items-center justify-center">
            <div className="w-4 h-4 text-white">⚠</div>
          </div>
          <h3 className="text-lg font-bold text-red-300">News Error</h3>
        </div>
        <p className="text-red-300/60 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full lg:w-80 bg-gradient-to-br from-slate-800/90 via-blue-900/80 to-indigo-900/90 backdrop-blur-2xl rounded-2xl p-6 border border-cyan-400/20 shadow-2xl shadow-cyan-500/10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
            <Globe className="w-4 h-4 text-white" />
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
            <Zap className="w-2 h-2 text-white" />
          </div>
        </div>
        <div>
          <h3 className="text-lg font-bold bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
            Hot Stories
          </h3>
          <p className="text-xs text-cyan-300/60">
            {isUsingFallback ? 'Sample Data' : 'CoinTelegraph'}
          </p>
        </div>
        <div className={`ml-auto flex items-center gap-1 px-2 py-1 rounded-full border ${
          isUsingFallback 
            ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-400/40' 
            : 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-400/40'
        }`}>
          <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${
            isUsingFallback ? 'bg-yellow-400' : 'bg-green-400'
          }`} />
          <span className={`text-xs font-medium ${
            isUsingFallback ? 'text-yellow-300' : 'text-green-300'
          }`}>
            {isUsingFallback ? 'SAMPLE' : 'LIVE'}
          </span>
        </div>
      </div>

      {/* News Items */}
      <div className="space-y-4">
        {news.map((item, index) => (
          <div key={index}>
            {/* Story Card */}
            <div
              className={`group p-4 bg-gradient-to-r from-slate-700/50 to-slate-800/50 rounded-xl border transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-500/10 ${
                expandedStory && expandedStory.title === item.title
                  ? 'border-cyan-400/50 bg-gradient-to-r from-slate-700/70 to-slate-800/70'
                  : 'border-cyan-400/10 hover:border-cyan-400/30 hover:bg-gradient-to-r hover:from-slate-700/70 hover:to-slate-800/70'
              }`}
              onClick={() => handleStoryClick(item)}
            >
              {/* Category Badge */}
              <div className="flex items-center gap-2 mb-2">
                <div className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r border ${getCategoryColor(item.category)}`}>
                  {item.category}
                </div>
                <div className="flex items-center gap-1 text-xs text-cyan-300/60">
                  <Clock className="w-3 h-3" />
                  <span>{formatTimeAgo(item.pubDate)}</span>
                </div>
              </div>

              {/* Title */}
              <h4 className="text-sm font-semibold text-cyan-100 group-hover:text-white transition-colors duration-300 mb-2 line-clamp-2">
                {item.title}
              </h4>

              {/* Description */}
              {item.description && (
                <p className={`text-xs text-cyan-300/70 mb-3 transition-all duration-300 ${
                  expandedStory && expandedStory.title === item.title ? 'line-clamp-none' : 'line-clamp-2'
                }`}>
                  {item.description}
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-1 text-xs text-cyan-400/60 group-hover:text-cyan-400 transition-colors duration-300">
                  <Maximize2 className="w-3 h-3" />
                  <span>{expandedStory && expandedStory.title === item.title ? 'Collapse' : 'Expand story'}</span>
                </div>
                
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1 text-xs text-cyan-400/60 hover:text-cyan-400 transition-colors duration-300"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Read full</span>
                </a>
              </div>
            </div>

            {/* Expanded Content */}
            {expandedStory && expandedStory.title === item.title && (
              <div className="mt-4 p-4 bg-gradient-to-r from-slate-800/60 to-slate-900/60 rounded-xl border border-cyan-400/20 animate-in slide-in-from-top-2 duration-300">
                <div className="space-y-3">
                  {/* Key Highlights Section */}
                  <div>
                    <h5 className="text-sm font-semibold text-cyan-300 mb-2 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Key Highlights
                    </h5>
                    <div className="space-y-2">
                      <div className="text-xs text-cyan-300/80 leading-relaxed">
                        • This development represents a significant milestone in the cryptocurrency ecosystem
                      </div>
                      <div className="text-xs text-cyan-300/80 leading-relaxed">
                        • Market analysts are closely monitoring the impact on trading volumes and user adoption
                      </div>
                      <div className="text-xs text-cyan-300/80 leading-relaxed">
                        • Industry experts predict continued growth in the coming months
                      </div>
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div>
                    <h5 className="text-sm font-semibold text-cyan-300 mb-2 flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      Market Impact
                    </h5>
                    <p className="text-xs text-cyan-300/80 leading-relaxed">
                      The cryptocurrency market continues to show resilience with increasing institutional adoption and regulatory clarity. 
                      This news highlights the growing mainstream acceptance of digital assets and their potential to reshape traditional financial systems.
                    </p>
                  </div>

                  {/* Action Buttons for Expanded View */}
                  <div className="flex items-center gap-2 pt-2 border-t border-cyan-400/20">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExpandToModal(item);
                      }}
                      className="flex-1 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 hover:from-cyan-400/30 hover:to-blue-500/30 border border-cyan-400/40 text-cyan-300 hover:text-white px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300"
                    >
                      Open in Full View
                    </button>
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 border border-blue-400/40 text-blue-300 hover:text-white px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 text-center"
                    >
                      Read Original
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-cyan-400/20">
        <div className="flex items-center justify-between text-xs text-cyan-300/60">
          <div className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>Updated every 5min</span>
          </div>
          <a
            href="https://cointelegraph.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-cyan-300 transition-colors duration-300"
          >
            View all →
          </a>
        </div>
      </div>

      {/* Expanded Story Modal */}
      <ExpandedStoryModal
        story={selectedStory}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
