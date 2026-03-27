'use client';

import { useState, useEffect } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { formatUnits } from 'viem';
import { Wallet, AlertTriangle, CheckCircle, Coins } from 'lucide-react';

interface TreasuryStatus {
  isConfigured: boolean;
  ethBalance: string;
  usdcBalance: string;
  totalPayouts: number;
  error?: string;
}

export default function TreasuryManager() {
  const { address } = useAccount();
  const [treasuryStatus, setTreasuryStatus] = useState<TreasuryStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkTreasuryStatus = async () => {
    try {
      const response = await fetch('/api/treasury/status');
      const status = await response.json();
      setTreasuryStatus(status);
    } catch (error) {
      setTreasuryStatus({
        isConfigured: false,
        ethBalance: '0',
        usdcBalance: '0',
        totalPayouts: 0,
        error: 'Failed to check treasury status'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkTreasuryStatus();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-xl p-6">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-400"></div>
          <span className="text-white">Checking treasury status...</span>
        </div>
      </div>
    );
  }

  if (!treasuryStatus) {
    return (
      <div className="bg-gradient-to-r from-red-900/20 to-orange-900/20 border border-red-500/30 rounded-xl p-6">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-6 w-6 text-red-400" />
          <span className="text-white">Failed to load treasury status</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Treasury Status */}
      <div className={`rounded-xl p-6 border ${
        treasuryStatus.isConfigured 
          ? 'bg-gradient-to-r from-green-900/20 to-emerald-900/20 border-green-500/30'
          : 'bg-gradient-to-r from-red-900/20 to-orange-900/20 border-red-500/30'
      }`}>
        <div className="flex items-center gap-3 mb-4">
          {treasuryStatus.isConfigured ? (
            <CheckCircle className="h-6 w-6 text-green-400" />
          ) : (
            <AlertTriangle className="h-6 w-6 text-red-400" />
          )}
          <h3 className="text-white font-semibold">
            {treasuryStatus.isConfigured ? 'Treasury Active' : 'Treasury Not Configured'}
          </h3>
        </div>

        {treasuryStatus.isConfigured ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">ETH Balance:</span>
              <span className="text-white font-mono">{treasuryStatus.ethBalance} ETH</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">USDC Balance:</span>
              <span className="text-white font-mono">{treasuryStatus.usdcBalance} USDC</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Total Payouts:</span>
              <span className="text-white font-mono">{treasuryStatus.totalPayouts}</span>
            </div>
            <div className="text-sm text-green-400 mt-4">
              ✅ Real crypto payouts are enabled! Users will receive actual tokens.
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-red-400">
              ❌ Treasury wallet not configured. Payouts are currently simulated.
            </div>
            <div className="text-sm text-gray-400">
              To enable real payouts, configure TREASURY_PRIVATE_KEY environment variable
              and fund the treasury wallet with tokens.
            </div>
          </div>
        )}
      </div>

      {/* Payout Information */}
      <div className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-blue-500/30 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-3">
          <Coins className="h-6 w-6 text-blue-400" />
          <h3 className="text-white font-semibold">How Payouts Work</h3>
        </div>
        <div className="space-y-2 text-sm text-gray-300">
          <div>• Users claim rewards from opened packs</div>
          <div>• Real crypto tokens are transferred to their wallet</div>
          <div>• Transactions are recorded on Base blockchain</div>
          <div>• Users receive actual USDC, ETH, DAI, and other tokens</div>
        </div>
      </div>
    </div>
  );
}
