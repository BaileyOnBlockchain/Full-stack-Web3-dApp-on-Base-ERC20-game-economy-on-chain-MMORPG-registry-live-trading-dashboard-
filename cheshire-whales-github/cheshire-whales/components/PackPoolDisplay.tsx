"use client";

import { useState, useEffect } from 'react';
import { packPoolManager, PackPool, PackPoolStats } from '@/lib/pack-pool-manager';
import { Coins, TrendingUp, Users, Activity, RefreshCw } from 'lucide-react';

export default function PackPoolDisplay() {
  const [pools, setPools] = useState<PackPool[]>([]);
  const [stats, setStats] = useState<PackPoolStats | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadPools();
  }, []);

  const loadPools = () => {
    const allPools = packPoolManager.getAllPools();
    const poolStats = packPoolManager.getPoolStats();
    setPools(allPools);
    setStats(poolStats);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadPools();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const getPoolColor = (poolId: string) => {
    switch (poolId) {
      case 'starter-pack-pool':
        return 'from-green-500/20 to-emerald-500/20 border-green-500/30';
      case 'premium-pack-pool':
        return 'from-blue-500/20 to-cyan-500/20 border-blue-500/30';
      case 'legendary-pack-pool':
        return 'from-purple-500/20 to-pink-500/20 border-purple-500/30';
      case 'mythic-pack-pool':
        return 'from-yellow-500/20 to-orange-500/20 border-yellow-500/30';
      default:
        return 'from-gray-500/20 to-slate-500/20 border-gray-500/30';
    }
  };

  const getPoolIcon = (poolId: string) => {
    switch (poolId) {
      case 'starter-pack-pool':
        return '🌱';
      case 'premium-pack-pool':
        return '💎';
      case 'legendary-pack-pool':
        return '👑';
      case 'mythic-pack-pool':
        return '⚡';
      default:
        return '📦';
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-700/30 p-8 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center">
            <Coins className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Pack Pool Economy</h2>
            <p className="text-gray-400">Self-sustaining $CHESHIRE circulation system</p>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="p-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 border border-cyan-500/30 hover:border-cyan-500/50 rounded-xl transition-all duration-300 disabled:opacity-50"
        >
          <RefreshCw className={`w-5 h-5 text-cyan-400 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Overall Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-sm text-gray-400">Total Deposited</p>
                <p className="text-lg font-bold text-white">{formatNumber(stats.totalDeposited)} $CHESHIRE</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-sm text-gray-400">Current Balance</p>
                <p className="text-lg font-bold text-white">{formatNumber(stats.currentBalance)} $CHESHIRE</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <Coins className="w-5 h-5 text-purple-400" />
              <div>
                <p className="text-sm text-gray-400">Total Distributed</p>
                <p className="text-lg font-bold text-white">{formatNumber(stats.totalWithdrawn)} $CHESHIRE</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-yellow-400" />
              <div>
                <p className="text-sm text-gray-400">Active Pools</p>
                <p className="text-lg font-bold text-white">{stats.totalPools}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pool Details */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white mb-4">Individual Pool Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pools.map((pool) => (
            <div
              key={pool.id}
              className={`bg-gradient-to-br ${getPoolColor(pool.id)} backdrop-blur-xl rounded-2xl border p-6`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getPoolIcon(pool.id)}</span>
                  <div>
                    <h4 className="text-lg font-semibold text-white">{pool.name}</h4>
                    <p className="text-sm text-gray-400">Last updated: {new Date(pool.lastUpdated).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-white">{formatNumber(pool.currentBalance)}</p>
                  <p className="text-sm text-gray-400">$CHESHIRE</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Total Deposited</p>
                  <p className="font-semibold text-white">{formatNumber(pool.totalDeposited)}</p>
                </div>
                <div>
                  <p className="text-gray-400">Total Distributed</p>
                  <p className="font-semibold text-white">{formatNumber(pool.totalWithdrawn)}</p>
                </div>
                <div>
                  <p className="text-gray-400">Contributors</p>
                  <p className="font-semibold text-white">{pool.contributors.length}</p>
                </div>
                <div>
                  <p className="text-gray-400">Distributions</p>
                  <p className="font-semibold text-white">{pool.distributionHistory.length}</p>
                </div>
              </div>
              
              {/* Pool Health Indicator */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                  <span>Pool Health</span>
                  <span>{pool.currentBalance > pool.totalDeposited * 0.1 ? 'Healthy' : 'Low'}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      pool.currentBalance > pool.totalDeposited * 0.1
                        ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                        : 'bg-gradient-to-r from-yellow-400 to-orange-500'
                    }`}
                    style={{
                      width: `${Math.min(100, (pool.currentBalance / Math.max(pool.totalDeposited, 1)) * 100)}%`
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Contributors */}
      {stats && stats.topContributors.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-white mb-4">Top Contributors</h3>
          <div className="bg-gray-800/30 rounded-2xl p-6">
            <div className="space-y-3">
              {stats.topContributors.slice(0, 5).map((contributor, index) => (
                <div key={contributor.address} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        {contributor.address.slice(0, 6)}...{contributor.address.slice(-4)}
                      </p>
                      <p className="text-gray-400 text-sm">Wallet Address</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">{formatNumber(contributor.totalContributed)} $CHESHIRE</p>
                    <p className="text-gray-400 text-sm">Total Contributed</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Economy Info */}
      <div className="mt-8 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-2">How the Economy Works</h4>
            <div className="space-y-2 text-sm text-gray-300">
              <p>• <strong>80%</strong> of pack purchases flow back into the pool</p>
              <p>• <strong>20%</strong> goes to platform operations and rewards</p>
              <p>• Pools automatically distribute rewards to pack buyers</p>
              <p>• Creates a self-sustaining circular economy</p>
              <p>• Higher-tier packs have larger, more stable pools</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
