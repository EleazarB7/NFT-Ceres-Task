// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title NFTMinting
 * @dev An ERC721 contract for minting NFTs with user registration, fees, and blacklist functionality.
 */
contract NFTMinting is ERC721, Ownable {
    // Counter for token IDs
    uint256 private _nextTokenId;

    // Maximum supply of NFTs
    uint256 public constant MAX_SUPPLY = 10000;

    // Mapping to store registered users
    mapping(address => bool) public registeredUsers;

    // Mapping to store blacklisted addresses
    mapping(address => bool) public blacklistedAddresses;

    // Registration fee (1,000 wei)
    uint256 public registrationFee = 1000 wei;

    // Minting fee (2,000 wei)
    uint256 public mintingFee = 2000 wei;

    // Base URI for token metadata
    string private _baseTokenURI;

    // Events
    event UserRegistered(address indexed user);
    event NFTMinted(address indexed user, uint256 tokenId);
    event AddedToBlacklist(address indexed user);
    event RemovedFromBlacklist(address indexed user);
    event RegistrationFeeUpdated(uint256 newFee);
    event MintingFeeUpdated(uint256 newFee);


    constructor() ERC721("UserNFT", "UNFT") Ownable(msg.sender) {
        _nextTokenId = 1;
    }

    /**
     * @notice Registers a user if they are not already registered and not blacklisted. Requires a fee.
     * @dev User must not be registered or blacklisted and must pay the registration fee.
     */
    function registerUser() external payable {
        require(!registeredUsers[msg.sender], "User already registered");
        require(!blacklistedAddresses[msg.sender], "Address is blacklisted");
        require(msg.value >= registrationFee, "Insufficient registration fee");

        registeredUsers[msg.sender] = true;
        emit UserRegistered(msg.sender);

        // Refund excess payment
        if (msg.value > registrationFee) {
            payable(msg.sender).transfer(msg.value - registrationFee);
        }
    }

    /**
     * @notice Mints a new NFT if the sender is registered and not blacklisted. Requires a fee.
     * @dev User must be registered, not blacklisted, and must pay the minting fee. The total supply must not exceed MAX_SUPPLY.
     */
    function mintNFT() external payable {
        require(registeredUsers[msg.sender], "User not registered");
        require(!blacklistedAddresses[msg.sender], "Address is blacklisted");
        require(msg.value >= mintingFee, "Insufficient minting fee");
        require(_nextTokenId <= MAX_SUPPLY, "Max supply reached");

        uint256 newTokenId = _nextTokenId;
        _safeMint(msg.sender, newTokenId);
        _nextTokenId++;

        emit NFTMinted(msg.sender, newTokenId);

        // Refund excess payment
        if (msg.value > mintingFee) {
            payable(msg.sender).transfer(msg.value - mintingFee);
        }
    }

    /**
     * @notice Adds an address to the blacklist. Only callable by the owner.
     * @param _address The address to be blacklisted.
     * @dev The address must not already be blacklisted.
     */
    function addToBlacklist(address _address) external onlyOwner {
        require(!blacklistedAddresses[_address], "Address already blacklisted");
        blacklistedAddresses[_address] = true;
        emit AddedToBlacklist(_address);
    }

    /**
     * @notice Removes an address from the blacklist. Only callable by the owner.
     * @param _address The address to be removed from the blacklist.
     * @dev The address must be blacklisted.
     */
    function removeFromBlacklist(address _address) external onlyOwner {
        require(blacklistedAddresses[_address], "Address not blacklisted");
        blacklistedAddresses[_address] = false;
        emit RemovedFromBlacklist(_address);
    }

    /**
     * @notice Withdraws the contract balance to the owner's address. Only callable by the owner.
     * @dev The contract balance must be greater than zero.
     */
    function withdrawFunds() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        payable(owner()).transfer(balance);
    }

    /**
     * @notice Updates the registration fee. Only callable by the owner.
     * @param _newFee The new registration fee.
     */
    function setRegistrationFee(uint256 _newFee) external onlyOwner {
        registrationFee = _newFee;
        emit RegistrationFeeUpdated(_newFee);
    }

    /**
     * @notice Updates the minting fee. Only callable by the owner.
     * @param _newFee The new minting fee.
     */
    function setMintingFee(uint256 _newFee) external onlyOwner {
        mintingFee = _newFee;
        emit MintingFeeUpdated(_newFee);
    }

    /**
     * @notice Checks if a user is registered.
     * @param _user The address to check.
     * @return bool True if the user is registered, false otherwise.
     */
    function isUserRegistered(address _user) public view returns (bool) {
        return registeredUsers[_user];
    }

    /**
     * @notice Gets the current token ID.
     * @return uint256 The current token ID.
     */
    function getCurrentTokenId() public view returns (uint256) {
        return _nextTokenId;
    }

    /**
     * @notice Sets the base URI for token metadata. Only callable by the owner.
     * @param baseURI The new base URI.
     */
    function setBaseURI(string memory baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }

    /**
     * @notice Internal function to get the base URI for token metadata.
     * @return string The base URI.
     */
    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }
}
