'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { formatUnits, parseUnits } from 'viem';
import { Coins, TrendingUp, Users, Wallet, ArrowUpRight, ArrowDownRight, Shield } from 'lucide-react';
import { decentralizedRewardEngine, RewardPool, UserDeposit } from '@/lib/decentralized-rewards';

export default function DecentralizedRewardPool() {
  const { address } = useAccount();
  const [pools, setPools] = useState<RewardPool[]>([]);
  const [userDeposits, setUserDeposits] = useState<UserDeposit[]>([]);
  const [poolStats, setPoolStats] = useState<any>(null);
  const [depositAmount, setDepositAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState('USDC');
  const [isDepositing, setIsDepositing] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    loadData();
  }, [address]);

  const loadData = () => {
    const rewardPools = decentralizedRewardEngine.getRewardPools();
    setPools(rewardPools);
    
    if (address) {
      const deposits = decentralizedRewardEngine.getUserDeposits(address);
      setUserDeposits(deposits);
    }
    
    const stats = decentralizedRewardEngine.getPoolStats();
    setPoolStats(stats);
  };

  const handleDeposit = async () => {
    if (!address) {
      setStatus('Please connect your wallet to deposit');
      return;
    }

    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      setStatus('Please enter a valid deposit amount');
      return;
    }

    setIsDepositing(true);
    setStatus('Processing deposit...');

    try {
      const result = await decentralizedRewardEngine.depositToRewardPool(
        selectedToken,
        parseUnits(depositAmount, 18).toString(), // Assuming 18 decimals
        address
      );

      if (result.success) {
        setStatus(`✅ Successfully deposited ${depositAmount} ${selectedToken}! Transaction: ${result.txHash}`);
        setDepositAmount('');
        loadData(); // Refresh data
      } else {
        setStatus(`❌ Deposit failed: ${result.error}`);
      }
    } catch (error) {
      setStatus(`❌ Deposit failed: ${error}`);
    } finally {
      setIsDepositing(false);
    }
  };

  const formatBalance = (balance: string) => {
    return parseFloat(formatUnits(BigInt(balance), 18)).toFixed(4);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
          <Coins className="h-6 w-6 text-cyan-400" />
          Decentralized Reward Pools
        </h2>
        <p className="text-gray-400">
          Community-funded reward pools. Users deposit tokens to fund rewards for everyone!
        </p>
      </div>

      {/* Pool Statistics */}
      {poolStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-500/30 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-6 w-6 text-green-400" />
              <div>
                <div className="text-sm text-gray-400">Total Deposited</div>
                <div className="text-lg font-bold text-white">${poolStats.totalDeposited.toFixed(2)}</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-blue-500/30 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Wallet className="h-6 w-6 text-blue-400" />
              <div>
                <div className="text-sm text-gray-400">Available Balance</div>
                <div className="text-lg font-bold text-white">${poolStats.availableBalance.toFixed(2)}</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Users className="h-6 w-6 text-purple-400" />
              <div>
                <div className="text-sm text-gray-400">Contributors</div>
                <div className="text-lg font-bold text-white">{poolStats.totalContributors}</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-900/20 to-red-900/20 border border-orange-500/30 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <ArrowUpRight className="h-6 w-6 text-orange-400" />
              <div>
                <div className="text-sm text-gray-400">Total Claimed</div>
                <div className="text-lg font-bold text-white">${poolStats.totalClaimed.toFixed(2)}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Protection Information */}
      <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-500/30 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5 text-green-400" />
          Startup Protection System
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-green-400">How Protection Works:</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Rewards start very small (0.1% scaling)</li>
              <li>• Gradually increase as pools grow</li>
              <li>• Maximum 1% of pool per reward</li>
              <li>• Your deposits are protected</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-green-400">Random Reward Ranges:</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Under $100: $0.001 - $0.01 (Max Protection)</li>
              <li>• Under $500: $0.001 - $0.05 (High Protection)</li>
              <li>• Under $1000: $0.001 - $0.10 (Medium Protection)</li>
              <li>• Under $5000: $0.001 - $0.25 (Low Protection)</li>
              <li>• Over $10000: $0.001 - $1.00 (No Protection)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Deposit Section */}
      {address && (
        <div className="bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border border-cyan-500/30 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Fund Reward Pools</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Token</label>
              <select
                value={selectedToken}
                onChange={(e) => setSelectedToken(e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
              >
                <option value="USDC">USDC</option>
                <option value="ETH">ETH</option>
                <option value="DAI">DAI</option>
                <option value="CHESHIRE">$CHESHIRE</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Amount</label>
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={handleDeposit}
                disabled={isDepositing}
                className="w-full font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600 text-white"
              >
                {isDepositing ? 'Depositing...' : 'Deposit'}
              </button>
            </div>
          </div>

          {status && (
            <div className={`p-3 rounded-lg ${
              status.includes('✅') ? 'bg-green-900/20 border border-green-500/30 text-green-400' :
              status.includes('❌') ? 'bg-red-900/20 border border-red-500/30 text-red-400' :
              'bg-blue-900/20 border border-blue-500/30 text-blue-400'
            }`}>
              {status}
            </div>
          )}
        </div>
      )}

      {/* Pool Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {pools.map((pool) => (
          <div key={pool.id} className="rounded-xl p-4 bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/50">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-semibold text-purple-300">
                {pool.tokenSymbol === 'CHESHIRE' ? '$CHESHIRE' : pool.tokenSymbol} Pool
              </h4>
              <div className="text-sm text-purple-400">
                {pool.contributors.length} contributors
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-purple-400">Available:</span>
                <span className="font-mono text-purple-300">
                  {formatBalance(pool.availableBalance)} {pool.tokenSymbol === 'CHESHIRE' ? '$CHESHIRE' : pool.tokenSymbol}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-400">Total Deposited:</span>
                <span className="font-mono text-purple-300">
                  {formatBalance(pool.totalDeposited)} {pool.tokenSymbol === 'CHESHIRE' ? '$CHESHIRE' : pool.tokenSymbol}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-400">Total Claimed:</span>
                <span className="font-mono text-purple-300">
                  {formatBalance(pool.totalClaimed)} {pool.tokenSymbol === 'CHESHIRE' ? '$CHESHIRE' : pool.tokenSymbol}
                </span>
              </div>
              
              {/* Protection Level Indicator */}
              {(() => {
                const poolBalance = parseFloat(formatBalance(pool.availableBalance));
                const scalingInfo = decentralizedRewardEngine.getRewardScalingInfo(poolBalance);
                
                return (
                  <div className="mt-3 pt-3 border-t border-purple-500/30">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-purple-400">Protection Level:</span>
                      <span className={`text-xs font-semibold ${
                        scalingInfo.protectionLevel === 'Maximum Protection' ? 'text-green-400' :
                        scalingInfo.protectionLevel === 'High Protection' ? 'text-yellow-400' :
                        scalingInfo.protectionLevel === 'Medium Protection' ? 'text-orange-400' :
                        'text-red-400'
                      }`}>
                        {scalingInfo.protectionLevel}
                      </span>
                    </div>
                    <div className="text-xs text-purple-300">
                      {scalingInfo.description}
                    </div>
                    <div className="text-xs text-pink-400 font-semibold">
                      Range: {scalingInfo.rewardRange}
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="mt-3 pt-3 border-t border-purple-500/30">
              <div className="text-xs text-purple-300">
                Last updated: {new Date(pool.lastUpdated).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* User Deposits */}
      {address && userDeposits.length > 0 && (
        <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Your Contributions</h3>
          <div className="space-y-2">
            {userDeposits.map((deposit) => (
              <div key={deposit.id} className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                <div>
                  <div className="text-white font-semibold">
                    {formatBalance(deposit.amount)} {deposit.tokenSymbol}
                  </div>
                  <div className="text-sm text-gray-400">
                    {new Date(deposit.timestamp).toLocaleString()}
                  </div>
                </div>
                <div className="text-sm text-gray-400">
                  TX: {deposit.contributionId.substring(0, 10)}...
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
