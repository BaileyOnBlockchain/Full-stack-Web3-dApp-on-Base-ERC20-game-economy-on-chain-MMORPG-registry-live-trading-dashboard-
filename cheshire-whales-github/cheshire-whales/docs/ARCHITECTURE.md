# Architecture — Cheshire Whales

## Overview

Cheshire Whales is a Web3 dApp with two core pillars:

1. **Crypto Trading Dashboard** — live price data, charting, news, wallet integration
2. **On-chain MMORPG Economy** — $CHESHIRE token, ETH rewards, player registry deployed to Base

---

## Contract Architecture

```
GameToken.sol
    ↑ mints tokens
GameRewards.sol ──→ processes activity → earnTokens() → GameToken
    ↑
PlayerRegistry.sol (tracks who earned what)
```

**Deployment order:**
1. Deploy `GameToken`
2. Deploy `GameRewards(gameTokenAddress)`
3. Call `GameToken.setGameContract(gameRewardsAddress)`
4. Deploy `PlayerRegistry` independently

---

## Frontend Architecture

```
Navbar
  └── WalletConnector (wagmi + RainbowKit)

Home Page
  ├── PriceTicker          ← live market data, 16 tokens
  ├── NewsSection          ← CoinTelegraph RSS, 5min polling
  │     └── ExpandedStoryModal
  ├── DecentralizedRewardPool  ← community deposit/reward UI
  ├── PackPoolDisplay      ← $CHESHIRE pack economy
  └── TreasuryManager      ← payout status

Market/Trading Page
  ├── TradingViewChart     ← SVG chart, mini variant
  └── TradingViewModal     ← full-screen chart, 5 timeframes

Shared
  ├── SimpleChart          ← lightweight SVG chart
  ├── TokenIcon            ← image with error fallback
  └── PerformanceOptimizer ← idle preload, passive scroll
```

---

## Key Design Decisions

**Why Base?**
Low gas fees critical for game reward micro-transactions. ETH security with L2 cost.

**Why on-chain player registry?**
Core game state (levels, achievements) stored on-chain — no centralised DB required for game integrity.

**Daily reward cap**
`maxDailyEthReward = 0.01 ETH` prevents drain attacks while still incentivising daily play.

**Reentrancy guard on all reward functions**
ETH transfers use low-level `.call{}` — ReentrancyGuard is non-negotiable.

**SVG charting over TradingView widget**
Full control over styling, no iframe, no third-party dependency for chart rendering.

---

## Data Flow — Reward Claim

```
Player completes activity
    → frontend calls processEthReward(player, "quest_complete")
    → contract checks daily cap
    → calculates reward: pool * rate / 10000
    → updates player stats
    → transfers ETH via .call{value}
    → emits EthRewardEarned event
    → frontend listens for event, updates UI
```
