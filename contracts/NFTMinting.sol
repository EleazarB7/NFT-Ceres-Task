// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

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

    // Function to register a user
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

    // Function to mint an NFT
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

    // Function to add an address to the blacklist (only owner)
    function addToBlacklist(address _address) external onlyOwner {
        require(!blacklistedAddresses[_address], "Address already blacklisted");
        blacklistedAddresses[_address] = true;
        emit AddedToBlacklist(_address);
    }

    // Function to remove an address from the blacklist (only owner)
    function removeFromBlacklist(address _address) external onlyOwner {
        require(blacklistedAddresses[_address], "Address not blacklisted");
        blacklistedAddresses[_address] = false;
        emit RemovedFromBlacklist(_address);
    }

    // Function to withdraw contract balance (only owner)
    function withdrawFunds() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        payable(owner()).transfer(balance);
    }

    // Function to update registration fee (only owner)
    function setRegistrationFee(uint256 _newFee) external onlyOwner {
        registrationFee = _newFee;
        emit RegistrationFeeUpdated(_newFee);
    }

    // Function to update minting fee (only owner)
    function setMintingFee(uint256 _newFee) external onlyOwner {
        mintingFee = _newFee;
        emit MintingFeeUpdated(_newFee);
    }

    // Function to check if a user is registered
    function isUserRegistered(address _user) public view returns (bool) {
        return registeredUsers[_user];
    }

    // Function to get the current token ID
    function getCurrentTokenId() public view returns (uint256) {
        return _nextTokenId;
    }

    // Function to set the base URI for token metadata (only owner)
    function setBaseURI(string memory baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }

    // Override the _baseURI function
    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }
}
