"use client";
import { useEffect, useRef, useState } from 'react';

interface SimpleChartProps {
  symbol: string;
  price: number;
  change24h: number;
  className?: string;
  onClick?: () => void;
  isMini?: boolean;
}

export default function SimpleChart({ 
  symbol, 
  price, 
  change24h, 
  className = "", 
  onClick,
  isMini = false 
}: SimpleChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simple timeout to simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className={`w-full h-8 bg-gray-700/30 rounded flex items-center justify-center ${className}`}>
        <div className="text-gray-400 text-xs">Loading...</div>
      </div>
    );
  }

  const isPositive = change24h >= 0;
  const strokeColor = isPositive ? '#26a69a' : '#ef5350';
  const fillColor = isPositive ? 'rgba(38, 166, 154, 0.1)' : 'rgba(239, 83, 80, 0.1)';

  // Generate simple mock data
  const dataPoints = isMini ? 24 : 100;
  const data = [];
  let currentPrice = price;
  
  for (let i = 0; i < dataPoints; i++) {
    const progress = i / (dataPoints - 1);
    const trend = (change24h / 100) * progress;
    const noise = (Math.random() - 0.5) * 0.02;
    currentPrice = price * (1 + trend + noise);
    data.push(currentPrice);
  }
  
  data[dataPoints - 1] = price; // Ensure last point matches current price

  const minPrice = Math.min(...data);
  const maxPrice = Math.max(...data);
  const priceRange = maxPrice - minPrice;

  const width = isMini ? 100 : 400;
  const height = isMini ? 32 : 200;
  const padding = 2;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * (width - padding * 2) + padding;
    const y = height - padding - ((value - minPrice) / priceRange) * (height - padding * 2);
    return { x, y };
  });

  const pathData = points.map((point, index) => 
    `${index === 0 ? 'M' : 'L'} ${point.x},${point.y}`
  ).join(' ');

  return (
    <div 
      className={`relative ${className}`}
      onClick={onClick}
    >
      <div 
        ref={chartRef}
        className={`w-full ${isMini ? 'h-8' : 'h-64'} cursor-pointer`}
      >
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${width} ${height}`}
          className="overflow-visible"
        >
          <defs>
            <linearGradient id={`gradient-${symbol}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={fillColor} />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
          
          {/* Area fill */}
          <path
            d={`M ${padding},${height - padding} L ${pathData.replace(/M [^,]+,[^ ]+ /, '')} L ${width - padding},${height - padding} Z`}
            fill={`url(#gradient-${symbol})`}
          />
          
          {/* Main line */}
          <path
            d={pathData}
            fill="none"
            stroke={strokeColor}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      
      {/* Price change indicator for mini charts */}
      {isMini && (
        <div className="absolute top-0 right-0 text-xs font-mono z-10">
          <span className={`px-1 py-0.5 rounded text-xs ${
            isPositive 
              ? "text-green-400 bg-green-400/10" 
              : "text-red-400 bg-red-400/10"
          }`}>
            {change24h >= 0 ? "+" : ""}{change24h.toFixed(2)}%
          </span>
        </div>
      )}
      
      {/* Click hint for mini charts */}
      {isMini && onClick && (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <div className="bg-black/50 text-white text-xs px-2 py-1 rounded">
            Click to expand
          </div>
        </div>
      )}
    </div>
  );
}
