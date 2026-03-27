"use client";
import { useState, useEffect, useRef } from 'react';
import { X, Loader2 } from 'lucide-react';

interface TradingViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  symbol: string;
  price: number;
  change24h: number;
}

const timeframes = [
  { key: '1h', label: '1H', hours: 1 },
  { key: '4h', label: '4H', hours: 4 },
  { key: '24h', label: '24H', hours: 24 },
  { key: '7d', label: '7D', hours: 168 },
  { key: '30d', label: '30D', hours: 720 }
];

export default function TradingViewModal({ isOpen, onClose, symbol, price, change24h }: TradingViewModalProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');
  const [isLoading, setIsLoading] = useState(true);
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || !chartContainerRef.current) return;

    // Add a small delay to simulate loading
    const timer = setTimeout(() => {
      const generateChartData = (timeframe: string) => {
        const currentTimeframe = timeframes.find(tf => tf.key === timeframe);
        const hours = currentTimeframe?.hours || 24;
        const dataPoints = Math.min(hours * 2, 100);
        
        const data: number[] = [];
        let currentPrice = price;
        const volatility = Math.abs(change24h) / 100;
        
        for (let i = 0; i < dataPoints; i++) {
          const progress = i / (dataPoints - 1);
          
          // Create realistic price movement
          const trend = (change24h / 100) * progress;
          const noise = (Math.random() - 0.5) * volatility * 0.1;
          
          currentPrice = price * (1 + trend + noise);
          data.push(currentPrice);
        }
        
        // Ensure last point matches current price
        data[dataPoints - 1] = price;
        
        return data;
      };

      const data = generateChartData(selectedTimeframe);
      const minPrice = Math.min(...data);
      const maxPrice = Math.max(...data);
      const priceRange = maxPrice - minPrice;

      // Create SVG chart
      const width = 800;
      const height = 400;
      const padding = 40;

      const points = data.map((value, index) => {
        const x = (index / (data.length - 1)) * (width - padding * 2) + padding;
        const y = height - padding - ((value - minPrice) / priceRange) * (height - padding * 2);
        return { x, y, value };
      });

      const pathData = points.map((point, index) => 
        `${index === 0 ? 'M' : 'L'} ${point.x},${point.y}`
      ).join(' ');

      const isPositive = change24h >= 0;
      const strokeColor = isPositive ? '#26a69a' : '#ef5350';
      const fillColor = isPositive ? 'rgba(38, 166, 154, 0.1)' : 'rgba(239, 83, 80, 0.1)';

      // Render SVG
      if (chartContainerRef.current) {
        chartContainerRef.current.innerHTML = `
          <svg width="100%" height="100%" viewBox="0 0 ${width} ${height}" class="overflow-visible">
            <defs>
              <linearGradient id="modal-gradient-${symbol}" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="${fillColor}" />
                <stop offset="100%" stop-color="transparent" />
              </linearGradient>
            </defs>
            
            <!-- Grid lines -->
            ${Array.from({ length: 5 }).map((_, i) => {
              const y = padding + (i / 4) * (height - padding * 2);
              return `<line x1="${padding}" y1="${y}" x2="${width - padding}" y2="${y}" stroke="rgba(42, 46, 57, 0.5)" stroke-width="0.5" stroke-dasharray="2,2" />`;
            }).join('')}
            
            ${Array.from({ length: 5 }).map((_, i) => {
              const x = padding + (i / 4) * (width - padding * 2);
              return `<line x1="${x}" y1="${padding}" x2="${x}" y2="${height - padding}" stroke="rgba(42, 46, 57, 0.5)" stroke-width="0.5" stroke-dasharray="2,2" />`;
            }).join('')}
            
            <!-- Area fill -->
            <path
              d="M ${padding},${height - padding} L ${pathData.replace(/M [^,]+,[^ ]+ /, '')} L ${width - padding},${height - padding} Z"
              fill="url(#modal-gradient-${symbol})"
            />
            
            <!-- Main line -->
            <path
              d="${pathData}"
              fill="none"
              stroke="${strokeColor}"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            
            <!-- Data points -->
            ${points.map((point, index) => {
              if (index % Math.max(1, Math.floor(points.length / 20)) === 0) {
                return `<circle cx="${point.x}" cy="${point.y}" r="2" fill="${strokeColor}" opacity="0.7" />`;
              }
              return '';
            }).join('')}
          </svg>
        `;
      }

      setIsLoading(false);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [isOpen, selectedTimeframe, symbol, price, change24h]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isPositive = change24h >= 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl border border-cyan-400/20 w-full max-w-6xl h-[80vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-gray-700 hover:bg-gray-600 rounded-full text-white transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div>
            <h2 className="text-3xl font-bold text-white">{symbol} Price Chart</h2>
            <p className="text-gray-400 text-sm">Professional TradingView-style chart</p>
          </div>
          <div className="text-right">
            <p className="text-white text-2xl font-bold">${price.toFixed(4)}</p>
            <p className={`text-sm font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {change24h >= 0 ? '+' : ''}{change24h.toFixed(2)}%
            </p>
          </div>
        </div>

        {/* Timeframe Selector */}
        <div className="flex gap-2 p-4 justify-center border-b border-gray-700">
          {timeframes.map((tf) => (
            <button
              key={tf.key}
              onClick={() => {
                setSelectedTimeframe(tf.key);
                setIsLoading(true);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedTimeframe === tf.key
                  ? 'bg-cyan-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>

        {/* Chart Area */}
        <div className="flex-1 p-4 relative">
          {isLoading ? (
            <div className="flex items-center justify-center h-full w-full animate-pulse bg-gray-700/30 rounded-lg">
              <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
              <span className="ml-2 text-white">Loading chart data...</span>
            </div>
          ) : (
            <div ref={chartContainerRef} className="w-full h-full" />
          )}
        </div>

        {/* Footer Stats */}
        <div className="grid grid-cols-4 gap-4 p-4 border-t border-gray-700 text-sm text-gray-300">
          <div className="text-center">
            <div className="text-gray-400">24h High</div>
            <div className="font-semibold text-white">${(price * 1.05).toFixed(4)}</div>
          </div>
          <div className="text-center">
            <div className="text-gray-400">24h Low</div>
            <div className="font-semibold text-white">${(price * 0.95).toFixed(4)}</div>
          </div>
          <div className="text-center">
            <div className="text-gray-400">Volume</div>
            <div className="font-semibold text-white">{(Math.random() * 1000000).toLocaleString()}</div>
          </div>
          <div className="text-center">
            <div className="text-gray-400">Market Cap</div>
            <div className="font-semibold text-white">${(price * 1000000).toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
