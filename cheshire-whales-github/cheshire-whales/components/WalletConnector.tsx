"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useBalance } from "wagmi";
import { useState, useEffect } from "react";
import { Wallet } from "lucide-react";
import { formatUnits } from "viem";

export function WalletConnector() {
  const { address, isConnected, isConnecting, isDisconnected } = useAccount();
  const { data: ethBalance, isLoading: balanceLoading, error: balanceError } = useBalance({ address });
  
  // Debug logging
  useEffect(() => {
    console.log('WalletConnector Debug:', {
      address,
      isConnected,
      isConnecting,
      isDisconnected,
      ethBalance,
      balanceLoading,
      balanceError
    });
  }, [address, isConnected, isConnecting, isDisconnected, ethBalance, balanceLoading, balanceError]);

  return (
    <div className="relative">
      <ConnectButton.Custom>
        {({
          account,
          chain,
          openAccountModal,
          openChainModal,
          openConnectModal,
          mounted,
        }) => {
          const ready = mounted;
          const connected = ready && account && chain;

          return (
            <div
              {...(!ready && {
                'aria-hidden': true,
                'style': {
                  opacity: 0,
                  pointerEvents: 'none',
                  userSelect: 'none',
                },
              })}
            >
              {(() => {
                if (!connected) {
                  return (
                    <button
                      onClick={openConnectModal}
                      type="button"
                      disabled={isConnecting}
                      className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                    >
                      <Wallet className="w-4 h-4" style={{color: '#000000', stroke: '#000000'}} />
                      <span style={{color: '#000000'}}>
                        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                      </span>
                    </button>
                  );
                }

                if (chain.unsupported) {
                  return (
                    <button
                      onClick={openChainModal}
                      type="button"
                      className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Wrong network
                    </button>
                  );
                }

                return (
                  <div className="flex gap-2 items-center">
                    {/* Network Info */}
                    <button
                      onClick={openChainModal}
                      type="button"
                      className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
                      <span className="text-sm" style={{color: '#000000', fontWeight: '500'}}>
                        {chain?.name || 'Unknown Network'}
                      </span>
                    </button>

                    {/* Wallet Info */}
                    <button
                      onClick={openAccountModal}
                      type="button"
                      className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Wallet className="w-3 h-3" style={{color: '#000000', stroke: '#000000'}} />
                      <span className="text-sm" style={{color: '#000000', fontWeight: '500'}}>
                        {balanceLoading ? 'Loading...' : 
                         balanceError ? `Error: ${balanceError.message}` :
                         ethBalance ? parseFloat(formatUnits(ethBalance.value, ethBalance.decimals)).toFixed(4) : '0.0000'} ETH
                      </span>
                    </button>


                  </div>
                );
              })()}
            </div>
          );
        }}
      </ConnectButton.Custom>
    </div>
  );
}