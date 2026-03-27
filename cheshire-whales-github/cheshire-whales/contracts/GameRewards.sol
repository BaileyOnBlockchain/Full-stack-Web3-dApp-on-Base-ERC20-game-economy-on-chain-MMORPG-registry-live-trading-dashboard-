// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./GameToken.sol";

/**
 * @title GameRewards
 * @author BlockchainBail
 * @notice Handles ETH and $CHESHIRE reward distribution for Cheshire Whales gameplay.
 * @dev Two parallel reward systems:
 *      1. ETH  — pulled from funded pool, daily cap per player, reentrancy-guarded
 *      2. CHESHIRE — minted via GameToken.earnTokens(), activity-rate driven
 *
 *      Network: Base (Ethereum L2)
 */
contract GameRewards is Ownable, ReentrancyGuard {

    // ─── State ────────────────────────────────────────────────────────────────

    GameToken public gameToken;

    /// @notice ETH pool size per activity (wei)
    mapping(string => uint256) public ethRewardPools;

    /// @notice ETH reward rate per activity (basis points — 100 = 1%)
    mapping(string => uint256) public ethRewardRates;

    /// @notice CHESHIRE pool per activity (token wei)
    mapping(string => uint256) public cheshireRewardPools;

    /// @notice CHESHIRE reward rate per activity (basis points)
    mapping(string => uint256) public cheshireRewardRates;

    /// @notice Lifetime ETH earned per player
    mapping(address => uint256) public totalEthEarned;

    /// @notice Lifetime CHESHIRE earned per player
    mapping(address => uint256) public totalCheshireEarned;

    /// @notice Lifetime tokens earned per player
    mapping(address => uint256) public totalTokensEarned;

    /// @notice Activity count per player per activity type
    mapping(address => mapping(string => uint256)) public playerActivityCount;

    /// @notice ETH earned per player per day (player => day => amount)
    mapping(address => mapping(uint256 => uint256)) public dailyEthEarned;

    /// @notice Minimum ETH balance a player must hold to claim ETH rewards
    uint256 public minEthBalance = 0.001 ether;

    /// @notice Maximum ETH a player can earn per day
    uint256 public maxDailyEthReward = 0.01 ether;

    // ─── Events ───────────────────────────────────────────────────────────────

    event EthRewardEarned(address indexed player, uint256 amount, string activity);
    event RewardPoolUpdated(string activity, uint256 newPool);
    event MinEthBalanceUpdated(uint256 newMinBalance);
    event MaxDailyRewardUpdated(uint256 newMaxReward);

    // ─── Constructor ──────────────────────────────────────────────────────────

    constructor(address _gameToken) Ownable(msg.sender) {
        gameToken = GameToken(_gameToken);

        // ETH reward pools (wei)
        ethRewardPools["quest_complete"]  = 0.1  ether;
        ethRewardPools["monster_defeat"]  = 0.01 ether;
        ethRewardPools["resource_gather"] = 0.005 ether;
        ethRewardPools["pvp_victory"]     = 0.05 ether;
        ethRewardPools["daily_login"]     = 0.001 ether;

        // ETH reward rates (basis points)
        ethRewardRates["quest_complete"]  = 1000; // 10%
        ethRewardRates["monster_defeat"]  = 100;  // 1%
        ethRewardRates["resource_gather"] = 50;   // 0.5%
        ethRewardRates["pvp_victory"]     = 500;  // 5%
        ethRewardRates["daily_login"]     = 250;  // 2.5%

        // CHESHIRE pools (token wei)
        cheshireRewardPools["quest_complete"]  = 10_000 * 10 ** 18;
        cheshireRewardPools["monster_defeat"]  = 1_000  * 10 ** 18;
        cheshireRewardPools["resource_gather"] = 500    * 10 ** 18;
        cheshireRewardPools["pvp_victory"]     = 5_000  * 10 ** 18;
        cheshireRewardPools["daily_login"]     = 100    * 10 ** 18;
    }

    // ─── Modifiers ────────────────────────────────────────────────────────────

    modifier onlyGameContract() {
        require(msg.sender == owner(), "Only owner can call this");
        _;
    }

    // ─── Reward Functions ─────────────────────────────────────────────────────

    /**
     * @notice Distribute ETH to a player for completing an activity.
     * @dev    Enforces daily cap. Caps partial rewards if limit would be exceeded.
     *         Uses low-level call for ETH transfer — reentrancy-guarded.
     * @param player    Recipient wallet
     * @param activity  Activity identifier
     */
    function processEthReward(
        address player,
        string memory activity
    ) external onlyGameContract nonReentrant {
        require(player != address(0), "Invalid player address");
        require(ethRewardPools[activity] > 0, "Activity not supported");

        uint256 today       = block.timestamp / 1 days;
        uint256 dailyEarned = dailyEthEarned[player][today];
        require(dailyEarned < maxDailyEthReward, "Daily ETH limit reached");

        uint256 rewardAmount = (ethRewardPools[activity] * ethRewardRates[activity]) / 10_000;

        // Cap to remaining daily allowance
        if (dailyEarned + rewardAmount > maxDailyEthReward) {
            rewardAmount = maxDailyEthReward - dailyEarned;
        }

        require(address(this).balance >= rewardAmount, "Insufficient ETH in contract");

        totalEthEarned[player]         += rewardAmount;
        dailyEthEarned[player][today]  += rewardAmount;
        playerActivityCount[player][activity]++;

        (bool success, ) = player.call{value: rewardAmount}("");
        require(success, "ETH transfer failed");

        emit EthRewardEarned(player, rewardAmount, activity);
    }

    /**
     * @notice Mint $CHESHIRE to a player for completing an activity.
     * @param player    Recipient wallet
     * @param activity  Activity identifier
     */
    function processTokenReward(
        address player,
        string memory activity
    ) external onlyGameContract nonReentrant {
        require(player != address(0), "Invalid player address");

        uint256 tokenAmount = gameToken.getEarningRate(activity);
        require(tokenAmount > 0, "Activity not supported");

        gameToken.earnTokens(player, tokenAmount, activity);
        totalTokensEarned[player] += tokenAmount;
    }

    // ─── Owner Functions ──────────────────────────────────────────────────────

    /// @notice Fund contract with ETH for reward distribution
    function fundContract() external payable {
        require(msg.value > 0, "Must send ETH");
    }

    function updateRewardPool(string memory activity, uint256 newPool) external onlyOwner {
        ethRewardPools[activity] = newPool;
        emit RewardPoolUpdated(activity, newPool);
    }

    function updateRewardRate(string memory activity, uint256 newRate) external onlyOwner {
        ethRewardRates[activity] = newRate;
    }

    function setMinEthBalance(uint256 newMin) external onlyOwner {
        minEthBalance = newMin;
        emit MinEthBalanceUpdated(newMin);
    }

    function setMaxDailyReward(uint256 newMax) external onlyOwner {
        maxDailyEthReward = newMax;
        emit MaxDailyRewardUpdated(newMax);
    }

    // ─── View Functions ───────────────────────────────────────────────────────

    function getDailyEthEarned(address player, uint256 day) external view returns (uint256) {
        return dailyEthEarned[player][day];
    }

    function getPlayerStats(address player) external view returns (
        uint256 ethEarned,
        uint256 tokensEarned
    ) {
        return (totalEthEarned[player], totalTokensEarned[player]);
    }

    receive() external payable {}
}
