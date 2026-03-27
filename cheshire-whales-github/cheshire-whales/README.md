# 🐋 Cheshire Whales — Blockchain dApp

A full-stack Web3 dApp built on **Base** (Ethereum L2), combining a crypto trading dashboard, live market data, a decentralised reward pool system, and an on-chain MMORPG economy.

Live: [oden-net-work.vercel.app](https://oden-net-work.vercel.app)

---

## Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| Blockchain | Solidity ^0.8.24, Base (L2) |
| Web3 | wagmi, viem, RainbowKit |
| Contracts | OpenZeppelin (ERC20, Ownable, ReentrancyGuard) |

---

## Smart Contracts

### `GameToken.sol`
ERC20 token contract for the `$CHESHIRE` game economy.
- 1M initial supply / 10M max supply cap
- Activity-based minting — tokens earned through gameplay (quests, PvP, daily login)
- Only the registered game contract can mint — no arbitrary inflation
- Configurable earning rates per activity type

### `GameRewards.sol`
ETH reward distribution engine for in-game activities.
- On-chain reward pools per activity type
- Daily ETH reward cap per player (anti-drain protection)
- Reentrancy-guarded transfers
- Separate CHESHIRE token reward pools running in parallel

### `PlayerRegistry.sol`
Full on-chain MMORPG player and character registry.
- Player registration with unique username enforcement
- Up to 3 characters per wallet
- Character stats: level, XP, HP, mana, strength, agility, intelligence, vitality
- Exponential XP levelling curve — stats scale on level-up
- Achievements system stored on-chain
- Play time tracking

---

## Frontend Components

### Wallet & Chain
- **WalletConnector** — RainbowKit custom connect button, live ETH balance, wrong network detection
- **Navbar** — Next.js navigation with integrated wallet state

### Market Data
- **PriceTicker** — Live ticker for 16 tokens (ETH, BTC, SOL, PEPE...), auto-scroll, CoinGecko icons, fallback data
- **TradingViewChart / TradingViewModal** — Custom SVG charting engine with 5 timeframes (1H → 30D)
- **SimpleChart** — Lightweight mini chart for token cards

### DeFi / Rewards
- **DecentralizedRewardPool** — Community-funded reward pool UI. Deposit tokens, view protection tiers, live contributor stats
- **PackPoolDisplay** — Pack economy dashboard with pool health bar, top contributors leaderboard
- **TreasuryManager** — Treasury wallet status, payout tracking, on-chain tx display

### Content
- **NewsSection** — Live crypto news feed (CoinTelegraph RSS), 5-minute polling, category badges
- **ExpandedStoryModal** — Full-screen story reader with keyboard navigation
- **TwitterFeed** — X feed integration with API fallback to mock data

### Utility
- **TokenIcon** — Image component with graceful error fallback
- **PerformanceOptimizer** — `requestIdleCallback` preloading, passive scroll listener

---

## Repo Structure

```
cheshire-whales/
├── contracts/
│   ├── GameToken.sol
│   ├── GameRewards.sol
│   └── PlayerRegistry.sol
├── components/
│   ├── WalletConnector.tsx
│   ├── DecentralizedRewardPool.tsx
│   ├── PriceTicker.tsx
│   ├── TradingViewChart.tsx
│   ├── TradingViewModal.tsx
│   ├── NewsSection.tsx
│   ├── ExpandedStoryModal.tsx
│   ├── PackPoolDisplay.tsx
│   ├── TreasuryManager.tsx
│   ├── TwitterFeed.tsx
│   ├── Navbar.tsx
│   ├── SimpleChart.tsx
│   ├── TokenIcon.tsx
│   └── PerformanceOptimizer.tsx
└── docs/
    └── ARCHITECTURE.md
```

---

## Author

Built by [@BlockchainBail](https://x.com/BlockchainBail)
