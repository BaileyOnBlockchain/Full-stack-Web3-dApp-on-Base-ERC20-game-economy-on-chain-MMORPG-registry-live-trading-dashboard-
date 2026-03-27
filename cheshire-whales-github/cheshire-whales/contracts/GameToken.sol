// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title GameToken
 * @author BlockchainBail
 * @notice ERC20 token for the Cheshire Whales MMORPG economy.
 * @dev Players earn $CHESHIRE through gameplay. Only the registered game
 *      contract can mint — all minting is activity-gated to prevent inflation.
 *
 *      Supply:   1,000,000 initial  |  10,000,000 hard cap
 *      Network:  Base (Ethereum L2)
 */
contract GameToken is ERC20, Ownable, ReentrancyGuard {

    // ─── Constants ────────────────────────────────────────────────────────────

    uint256 public constant INITIAL_SUPPLY = 1_000_000 * 10 ** 18;
    uint256 public constant MAX_SUPPLY     = 10_000_000 * 10 ** 18;

    // ─── State ────────────────────────────────────────────────────────────────

    /// @notice The only address authorised to call earnTokens()
    address public gameContract;

    /// @notice Token reward per activity type (in wei)
    mapping(string => uint256) public earningRates;

    // ─── Events ───────────────────────────────────────────────────────────────

    event TokensEarned(address indexed player, uint256 amount, string activity);
    event GameContractUpdated(address indexed oldContract, address indexed newContract);

    // ─── Constructor ──────────────────────────────────────────────────────────

    constructor() ERC20("Cheshire Whales Token", "CHESHIRE") Ownable(msg.sender) {
        _mint(msg.sender, INITIAL_SUPPLY);

        // Base earning rates — adjustable by owner post-deploy
        earningRates["quest_complete"]  = 100 * 10 ** 18;  // 100 tokens
        earningRates["monster_defeat"]  = 10  * 10 ** 18;  // 10 tokens
        earningRates["resource_gather"] = 5   * 10 ** 18;  // 5 tokens
        earningRates["pvp_victory"]     = 50  * 10 ** 18;  // 50 tokens
        earningRates["daily_login"]     = 25  * 10 ** 18;  // 25 tokens
    }

    // ─── Modifiers ────────────────────────────────────────────────────────────

    modifier onlyGameContract() {
        require(msg.sender == gameContract, "Only game contract can call this");
        _;
    }

    // ─── Owner Functions ──────────────────────────────────────────────────────

    /**
     * @notice Register the authorised game contract that may mint tokens.
     * @param _gameContract Address of the deployed game/rewards contract
     */
    function setGameContract(address _gameContract) external onlyOwner {
        address old = gameContract;
        gameContract = _gameContract;
        emit GameContractUpdated(old, _gameContract);
    }

    /**
     * @notice Update the token reward for a specific in-game activity.
     * @param activity  Activity identifier string
     * @param rate      New reward in wei (e.g. 10 * 10**18 = 10 tokens)
     */
    function updateEarningRate(string memory activity, uint256 rate) external onlyOwner {
        earningRates[activity] = rate;
    }

    // ─── Game Contract Functions ──────────────────────────────────────────────

    /**
     * @notice Mint tokens to a player for completing an in-game activity.
     * @dev    Enforces MAX_SUPPLY cap. Called exclusively by gameContract.
     * @param player    Recipient wallet address
     * @param amount    Amount to mint in wei
     * @param activity  Activity that triggered the reward (for event log)
     */
    function earnTokens(
        address player,
        uint256 amount,
        string memory activity
    ) external onlyGameContract nonReentrant {
        require(totalSupply() + amount <= MAX_SUPPLY, "Max supply exceeded");
        require(player != address(0), "Invalid player address");
        require(amount > 0, "Amount must be > 0");

        _mint(player, amount);
        emit TokensEarned(player, amount, activity);
    }

    // ─── View Functions ───────────────────────────────────────────────────────

    /**
     * @notice Returns the token earning rate for a given activity.
     * @param activity Activity identifier string
     */
    function getEarningRate(string memory activity) external view returns (uint256) {
        return earningRates[activity];
    }
}
