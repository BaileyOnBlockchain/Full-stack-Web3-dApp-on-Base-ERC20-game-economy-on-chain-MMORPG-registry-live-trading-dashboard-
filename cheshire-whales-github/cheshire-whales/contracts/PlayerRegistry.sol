// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title PlayerRegistry
 * @author BlockchainBail
 * @notice On-chain player and character registry for Cheshire Whales MMORPG.
 * @dev Stores player profiles, character sheets, XP/levelling, and achievements
 *      directly on Base. No off-chain database required for core game state.
 *
 *      - 1 wallet = 1 player profile (max 3 characters)
 *      - Usernames enforced unique on-chain
 *      - Exponential XP curve; stats auto-scale on level-up
 *      - Achievements stored as string arrays per player
 *
 *      Network: Base (Ethereum L2)
 */
contract PlayerRegistry is Ownable, ReentrancyGuard {

    // ─── Structs ──────────────────────────────────────────────────────────────

    struct Character {
        string  name;
        uint8   level;
        uint256 experience;
        uint256 health;
        uint256 maxHealth;
        uint256 mana;
        uint256 maxMana;
        uint256 strength;
        uint256 agility;
        uint256 intelligence;
        uint256 vitality;
        uint256 gold;
        uint256 lastLogin;
        bool    isActive;
    }

    struct Player {
        address   wallet;
        string    username;
        uint256   totalPlayTime;
        uint256   joinDate;
        uint256   lastActive;
        bool      isRegistered;
        string[]  achievements;
    }

    // ─── State ────────────────────────────────────────────────────────────────

    mapping(address => Player)      public players;
    mapping(address => Character[]) public characters;
    mapping(string  => address)     public usernameToAddress;
    mapping(uint8   => uint256)     public levelRequirements;

    uint256 public totalPlayers;
    uint256 public totalCharacters;
    uint256 public totalPlayTime;
    uint256 public maxCharactersPerPlayer = 3;

    // ─── Events ───────────────────────────────────────────────────────────────

    event PlayerRegistered(address indexed player, string username);
    event CharacterCreated(address indexed player, uint256 characterId, string name);
    event CharacterLeveledUp(address indexed player, uint256 characterId, uint8 newLevel);
    event AchievementUnlocked(address indexed player, string achievement);

    // ─── Constructor ──────────────────────────────────────────────────────────

    constructor() Ownable(msg.sender) {
        // Exponential XP curve — extend via setLevelRequirement()
        levelRequirements[1] = 0;
        levelRequirements[2] = 100;
        levelRequirements[3] = 250;
        levelRequirements[4] = 500;
        levelRequirements[5] = 1_000;
    }

    // ─── Modifiers ────────────────────────────────────────────────────────────

    modifier onlyRegisteredPlayer() {
        require(players[msg.sender].isRegistered, "Player not registered");
        _;
    }

    modifier validCharacterId(uint256 characterId) {
        require(characterId < characters[msg.sender].length, "Invalid character ID");
        require(characters[msg.sender][characterId].isActive,  "Character not active");
        _;
    }

    // ─── Registration ─────────────────────────────────────────────────────────

    /**
     * @notice Register a new player with a unique username.
     * @param username Alphanumeric username, max 32 characters
     */
    function registerPlayer(string memory username) external {
        require(!players[msg.sender].isRegistered,         "Already registered");
        require(usernameToAddress[username] == address(0), "Username taken");
        require(
            bytes(username).length > 0 && bytes(username).length <= 32,
            "Username must be 1–32 characters"
        );

        players[msg.sender] = Player({
            wallet:        msg.sender,
            username:      username,
            totalPlayTime: 0,
            joinDate:      block.timestamp,
            lastActive:    block.timestamp,
            isRegistered:  true,
            achievements:  new string[](0)
        });

        usernameToAddress[username] = msg.sender;
        totalPlayers++;

        emit PlayerRegistered(msg.sender, username);
    }

    // ─── Character Management ─────────────────────────────────────────────────

    /**
     * @notice Create a new character for the calling player.
     * @param name Character name, max 32 characters
     */
    function createCharacter(string memory name) external onlyRegisteredPlayer {
        require(
            characters[msg.sender].length < maxCharactersPerPlayer,
            "Max characters reached"
        );
        require(
            bytes(name).length > 0 && bytes(name).length <= 32,
            "Name must be 1–32 characters"
        );

        characters[msg.sender].push(Character({
            name:         name,
            level:        1,
            experience:   0,
            health:       100,
            maxHealth:    100,
            mana:         50,
            maxMana:      50,
            strength:     10,
            agility:      10,
            intelligence: 10,
            vitality:     10,
            gold:         100,
            lastLogin:    block.timestamp,
            isActive:     true
        }));

        uint256 characterId = characters[msg.sender].length - 1;
        totalCharacters++;

        emit CharacterCreated(msg.sender, characterId, name);
    }

    /**
     * @notice Award XP to a character and trigger level-up if threshold met.
     * @dev    Stats increase by 2 per stat per level. HP/mana fully restored on level-up.
     * @param characterId Index in the player's character array
     * @param expGained   XP to add
     */
    function gainExperience(
        uint256 characterId,
        uint256 expGained
    ) external onlyRegisteredPlayer validCharacterId(characterId) {
        Character storage c = characters[msg.sender][characterId];
        c.experience += expGained;

        uint8 newLevel = c.level;
        while (newLevel < 50 && c.experience >= levelRequirements[newLevel + 1]) {
            newLevel++;
        }

        if (newLevel > c.level) {
            c.level        = newLevel;
            c.strength     += 2;
            c.agility      += 2;
            c.intelligence += 2;
            c.vitality     += 2;
            c.maxHealth    += 20;
            c.health        = c.maxHealth;  // Full heal on level-up
            c.maxMana      += 10;
            c.mana          = c.maxMana;    // Full mana restore

            emit CharacterLeveledUp(msg.sender, characterId, newLevel);
        }
    }

    // ─── Stat Updates ─────────────────────────────────────────────────────────

    function updateHealth(
        uint256 characterId,
        uint256 newHealth
    ) external onlyRegisteredPlayer validCharacterId(characterId) {
        Character storage c = characters[msg.sender][characterId];
        require(newHealth <= c.maxHealth, "Exceeds max health");
        c.health = newHealth;
    }

    function updateMana(
        uint256 characterId,
        uint256 newMana
    ) external onlyRegisteredPlayer validCharacterId(characterId) {
        Character storage c = characters[msg.sender][characterId];
        require(newMana <= c.maxMana, "Exceeds max mana");
        c.mana = newMana;
    }

    function updateGold(
        uint256 characterId,
        uint256 newGold
    ) external onlyRegisteredPlayer validCharacterId(characterId) {
        characters[msg.sender][characterId].gold = newGold;
    }

    // ─── Player Progress ──────────────────────────────────────────────────────

    function updatePlayTime(uint256 playTimeSeconds) external onlyRegisteredPlayer {
        players[msg.sender].lastActive      = block.timestamp;
        players[msg.sender].totalPlayTime  += playTimeSeconds;
        totalPlayTime                       += playTimeSeconds;
    }

    function addAchievement(string memory achievement) external onlyRegisteredPlayer {
        players[msg.sender].achievements.push(achievement);
        emit AchievementUnlocked(msg.sender, achievement);
    }

    // ─── Owner Functions ──────────────────────────────────────────────────────

    function setMaxCharactersPerPlayer(uint256 newMax) external onlyOwner {
        maxCharactersPerPlayer = newMax;
    }

    function setLevelRequirement(uint8 level, uint256 requirement) external onlyOwner {
        levelRequirements[level] = requirement;
    }

    // ─── View Functions ───────────────────────────────────────────────────────

    function getPlayer(address player) external view returns (Player memory) {
        return players[player];
    }

    function getCharacters(address player) external view returns (Character[] memory) {
        return characters[player];
    }

    function getCharacter(
        address player,
        uint256 characterId
    ) external view returns (Character memory) {
        require(characterId < characters[player].length, "Invalid character ID");
        return characters[player][characterId];
    }

    function getAchievements(address player) external view returns (string[] memory) {
        return players[player].achievements;
    }
}
