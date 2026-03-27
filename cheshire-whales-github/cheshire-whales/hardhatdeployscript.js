const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying Cheshire Whales game contracts...");

  const GameToken      = await ethers.getContractFactory("GameToken");
  const GameRewards    = await ethers.getContractFactory("GameRewards");
  const PlayerRegistry = await ethers.getContractFactory("PlayerRegistry");

  // 1. Deploy GameToken
  console.log("Deploying GameToken...");
  const gameToken = await GameToken.deploy();
  await gameToken.waitForDeployment();
  const gameTokenAddress = await gameToken.getAddress();
  console.log("GameToken deployed to:", gameTokenAddress);

  // 2. Deploy GameRewards (requires GameToken address)
  console.log("Deploying GameRewards...");
  const gameRewards = await GameRewards.deploy(gameTokenAddress);
  await gameRewards.waitForDeployment();
  const gameRewardsAddress = await gameRewards.getAddress();
  console.log("GameRewards deployed to:", gameRewardsAddress);

  // 3. Deploy PlayerRegistry
  console.log("Deploying PlayerRegistry...");
  const playerRegistry = await PlayerRegistry.deploy();
  await playerRegistry.waitForDeployment();
  const playerRegistryAddress = await playerRegistry.getAddress();
  console.log("PlayerRegistry deployed to:", playerRegistryAddress);

  // 4. Wire GameToken → GameRewards (only GameRewards can mint)
  console.log("Setting game contract in GameToken...");
  await gameToken.setGameContract(gameRewardsAddress);
  console.log("Game contract set.");

  // 5. Seed GameRewards with ETH for reward distribution
  console.log("Funding GameRewards...");
  const [deployer] = await ethers.getSigners();
  const fundTx = await deployer.sendTransaction({
    to: gameRewardsAddress,
    value: ethers.parseEther("1.0")
  });
  await fundTx.wait();
  console.log("GameRewards funded with 1 ETH");

  // Summary
  const network = (await ethers.provider.getNetwork()).name;
  console.log("\n=== Deployment Summary ===");
  console.log("Network:", network);
  console.log("GameToken:      ", gameTokenAddress);
  console.log("GameRewards:    ", gameRewardsAddress);
  console.log("PlayerRegistry: ", playerRegistryAddress);

  // Persist addresses
  const fs = require("fs");
  fs.writeFileSync("./deployed-contracts.json", JSON.stringify({
    network,
    gameToken:      gameTokenAddress,
    gameRewards:    gameRewardsAddress,
    playerRegistry: playerRegistryAddress,
    deployedAt:     new Date().toISOString()
  }, null, 2));
  console.log("\nAddresses saved to deployed-contracts.json");
}

main()
  .then(() => process.exit(0))
  .catch((err) => { console.error(err); process.exit(1); });