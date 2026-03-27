This repo is a snapshot — a small slice of a much larger project I built 
solo from the ground up.

Cheshire Whales is a full-stack Web3 application deployed on Base (Ethereum L2). 
What you're seeing here is 3 of the smart contracts and 14 of the frontend 
components. The full project runs to dozens of components, multiple API routes, 
custom blockchain hooks, a game engine, a trading interface (Riptide Trading), 
a card pack economy with its own circular token system, an AI assistant (CraigAI), 
a live feed, a chat system, an NFT marketplace (Blockbay), and a fully playable 
on-chain game — all wired together under one deployment at oden-net-work.vercel.app.

The contracts here cover the core game economy:
- A capped ERC20 token ($CHESHIRE) with activity-gated minting
- An ETH reward engine with daily caps and reentrancy protection  
- A full on-chain player registry — characters, XP, levelling, achievements

The frontend components cover wallet connection, live market data for 16 tokens, 
custom SVG charting, a decentralised community reward pool, a crypto news feed, 
and treasury management — all in TypeScript with wagmi and viem.

Everything you see was written by me. No templates, no boilerplate projects 
cloned and rebranded. This is original work built through real trial and error 
while learning Solidity, Web3 architecture, and Next.js simultaneously.

There's a lot more where this came from.
— @BlockchainBail
