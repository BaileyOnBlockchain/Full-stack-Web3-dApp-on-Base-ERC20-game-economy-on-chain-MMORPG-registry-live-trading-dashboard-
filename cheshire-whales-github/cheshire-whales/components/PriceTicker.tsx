"use client";
import { formatPrice, formatChange } from "@/lib/utils";
import { useMarketData } from "@/lib/hooks/useMarketData";
import Image from "next/image";
import { useState, useEffect } from "react";

export function PriceTicker() {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Show popular tokens in the ticker
  const tickerTokens = [
    "ETH", "BTC", "USDC", "USDT", "SOL", "AVAX", "DOGE", "SHIB",
    "UNI", "AAVE", "LINK", "MATIC", "ARB", "OP", "BNB", "PEPE"
  ];
  
  // Fetch live market data using our existing hook
  const { data: marketData, isLoading } = useMarketData(tickerTokens);

  // Get live data or fallback to static data
  const tokens = tickerTokens.map(symbol => {
    if (marketData) {
      const tokenKey = Object.keys(marketData).find(key => 
        (marketData[key] as any)?.symbol === symbol
      );
      if (tokenKey && marketData[tokenKey]) {
        const token = marketData[tokenKey] as any;
        return {
          symbol: token.symbol,
          price: token.price,
          change24h: token.change24h,
          icon: token.icon
        };
      }
    }
    
    // Fallback static data
    const fallbackData: Record<string, { price: number; change24h: number; icon: string }> = {
      ETH: { price: 3245.67, change24h: 2.34, icon: "https://assets.coingecko.com/coins/images/279/large/ethereum.png" },
      BTC: { price: 43250.12, change24h: 1.87, icon: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png" },
      USDC: { price: 1.00, change24h: 0.01, icon: "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png" },
      USDT: { price: 1.00, change24h: -0.02, icon: "https://assets.coingecko.com/coins/images/325/large/Tether.png" },
      SOL: { price: 98.76, change24h: 5.67, icon: "https://assets.coingecko.com/coins/images/4128/large/solana.png" },
      AVAX: { price: 34.56, change24h: 3.45, icon: "https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png" },
      DOGE: { price: 0.089, change24h: 6.78, icon: "https://assets.coingecko.com/coins/images/5/large/dogecoin.png" },
      SHIB: { price: 0.000012, change24h: 8.45, icon: "https://assets.coingecko.com/coins/images/11939/large/shiba.png" },
      UNI: { price: 12.45, change24h: 3.21, icon: "https://assets.coingecko.com/coins/images/12504/large/uniswap-uni.png" },
      AAVE: { price: 98.76, change24h: 4.56, icon: "https://assets.coingecko.com/coins/images/12645/large/AAVE.png" },
      LINK: { price: 14.56, change24h: 2.78, icon: "https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png" },
      MATIC: { price: 0.78, change24h: 2.45, icon: "https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png" },
      ARB: { price: 1.23, change24h: 3.67, icon: "https://assets.coingecko.com/coins/images/16547/large/photo_2023-03-29_21.47.00.jpeg" },
      OP: { price: 2.34, change24h: 4.12, icon: "https://assets.coingecko.com/coins/images/25244/large/Optimism.png" },
      BNB: { price: 312.45, change24h: 1.23, icon: "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png" },
      PEPE: { price: 0.0000012, change24h: 12.34, icon: "https://assets.coingecko.com/coins/images/29850/large/pepe-token.jpeg" },
    };
    
    return {
      symbol,
      ...fallbackData[symbol]
    };
  }).filter(token => token);

  // Auto-scroll effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % tokens.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [tokens.length]);

  return (
    <div className="relative overflow-hidden">
      {/* Cyberpunk Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/5 to-purple-500/10 rounded-xl"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
      
      {/* Scanning line effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent animate-pulse"></div>
      
      {/* Main content */}
      <div className="relative z-10 p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                LIVE MARKET DATA
              </h3>
              <p className="text-xs text-gray-400 font-mono">REAL-TIME PRICE TRACKING</p>
            </div>
          </div>
          
          {isLoading && (
            <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/20 rounded-full border border-yellow-500/30">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-yellow-400 font-mono">SYNCING...</span>
            </div>
          )}
        </div>

        {/* Price Ticker */}
        <div className="relative overflow-hidden">
          <div className="flex items-center gap-8 animate-scroll">
            {tokens.map((token, index) => (
              <div 
                key={token.symbol} 
                className={`flex items-center gap-3 min-w-[180px] px-4 py-3 rounded-lg border transition-all duration-500 ${
                  index === currentIndex 
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-400/50 shadow-lg shadow-cyan-500/20' 
                    : 'bg-black/20 border-gray-700/50 hover:border-cyan-400/30'
                }`}
              >
                {/* Token Icon */}
                <div className="relative">
                  <Image
                    src={token.icon}
                    alt={token.symbol}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full ring-2 ring-cyan-400/30"
                  />
                  {index === currentIndex && (
                    <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400 animate-ping opacity-75"></div>
                  )}
                </div>
                
                {/* Token Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-cyan-300 text-sm">{token.symbol}</span>
                    {index === currentIndex && (
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    )}
                  </div>
                  <div className="text-white font-mono text-sm">
                    {formatPrice(token.price)}
                  </div>
                </div>
                
                {/* Price Change */}
                <div className={`text-right ${token.change24h >= 0 ? "text-green-400" : "text-red-400"}`}>
                  <div className="flex items-center gap-1">
                    {token.change24h >= 0 ? (
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                    <span className="text-xs font-mono font-bold">
                      {formatChange(token.change24h)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status Bar */}
        <div className="mt-4 flex items-center justify-between text-xs text-gray-400 font-mono">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>LIVE</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
              <span>SECURE</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>REAL-TIME</span>
            </div>
          </div>
          <div className="text-gray-500">
            {tokens.length} TOKENS TRACKED
          </div>
        </div>
      </div>
    </div>
  );
}