"use client";
import { useEffect, useRef, useState } from 'react';

interface TradingViewChartProps {
  symbol: string;
  price: number;
  change24h: number;
  className?: string;
  onClick?: () => void;
  isMini?: boolean;
}

export default function TradingViewChart({ 
  symbol, 
  price, 
  change24h, 
  className = "", 
  onClick,
  isMini = false 
}: TradingViewChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Set a timeout to ensure loading doesn't get stuck
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    // Generate simple line chart data
    const generateChartData = () => {
      const dataPoints = isMini ? 24 : 100;
      const basePrice = price;
      const volatility = Math.abs(change24h) / 100;
      const data: number[] = [];
      
      let currentPrice = basePrice;
      
      for (let i = 0; i < dataPoints; i++) {
        const progress = i / (dataPoints - 1);
        
        // Create realistic price movement
        const trend = (change24h / 100) * progress;
        const noise = (Math.random() - 0.5) * volatility * 0.1;
        
        currentPrice = basePrice * (1 + trend + noise);
        data.push(currentPrice);
      }
      
      // Ensure last point matches current price
      data[dataPoints - 1] = basePrice;
      
      return data;
    };

    try {
      const data = generateChartData();
      const minPrice = Math.min(...data);
      const maxPrice = Math.max(...data);
      const priceRange = maxPrice - minPrice;

      // Create SVG chart
      const width = isMini ? 100 : 400;
      const height = isMini ? 32 : 200;
      const padding = 2;

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

      // Create SVG element
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', '100%');
      svg.setAttribute('height', '100%');
      svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
      svg.setAttribute('class', 'overflow-visible');

      // Create defs
      const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
      gradient.setAttribute('id', `gradient-${symbol}`);
      gradient.setAttribute('x1', '0%');
      gradient.setAttribute('y1', '0%');
      gradient.setAttribute('x2', '0%');
      gradient.setAttribute('y2', '100%');
      
      const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      stop1.setAttribute('offset', '0%');
      stop1.setAttribute('stop-color', fillColor);
      
      const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      stop2.setAttribute('offset', '100%');
      stop2.setAttribute('stop-color', 'transparent');
      
      gradient.appendChild(stop1);
      gradient.appendChild(stop2);
      defs.appendChild(gradient);
      svg.appendChild(defs);

      // Create area fill
      const areaPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      areaPath.setAttribute('d', `M ${padding},${height - padding} L ${pathData.replace(/M [^,]+,[^ ]+ /, '')} L ${width - padding},${height - padding} Z`);
      areaPath.setAttribute('fill', `url(#gradient-${symbol})`);
      svg.appendChild(areaPath);

      // Create line path
      const linePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      linePath.setAttribute('d', pathData);
      linePath.setAttribute('fill', 'none');
      linePath.setAttribute('stroke', strokeColor);
      linePath.setAttribute('stroke-width', '1.5');
      linePath.setAttribute('stroke-linecap', 'round');
      linePath.setAttribute('stroke-linejoin', 'round');
      svg.appendChild(linePath);

      // Clear and append
      if (chartContainerRef.current) {
        chartContainerRef.current.innerHTML = '';
        chartContainerRef.current.appendChild(svg);
      }

      clearTimeout(timeout);
      setIsLoading(false);
    } catch (error) {
      console.error('Error creating chart:', error);
      clearTimeout(timeout);
      setIsLoading(false);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [symbol, price, change24h, isMini]);

  if (isLoading) {
    return (
      <div className={`w-full h-8 bg-gray-700/30 rounded flex items-center justify-center ${className}`}>
        <div className="text-gray-400 text-xs">Loading...</div>
      </div>
    );
  }

  const isPositive = change24h >= 0;

  return (
    <div 
      className={`relative ${className}`}
      onClick={onClick}
    >
      <div 
        ref={chartContainerRef} 
        className={`w-full ${isMini ? 'h-8' : 'h-64'} cursor-pointer`}
      />
      
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
