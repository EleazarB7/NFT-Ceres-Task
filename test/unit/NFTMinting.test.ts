import { expect } from "chai";
import { ethers } from "hardhat";
import { NFTMinting } from "../../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("NFTMinting", function () {
  let nftMinting: NFTMinting;
  let owner: HardhatEthersSigner;
  let user1: HardhatEthersSigner;
  let user2: HardhatEthersSigner;

  beforeEach(async function () {
    const NFTMinting = await ethers.getContractFactory("NFTMinting");
    [owner, user1, user2] = await ethers.getSigners();
    nftMinting = await NFTMinting.deploy() as NFTMinting;
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await nftMinting.owner()).to.equal(await owner.getAddress());
    });

    it("Should have the correct initial values", async function () {
      expect(await nftMinting.registrationFee()).to.equal(1000); // 1000 wei
      expect(await nftMinting.mintingFee()).to.equal(2000); // 2000 wei
    });
  });

  describe("User Registration", function () {
    it("Should allow a user to register", async function () {
      await nftMinting.connect(user1).registerUser({ value: 1000 });
      expect(await nftMinting.isUserRegistered(await user1.getAddress())).to.be.true;
    });

    it("Should not allow registration with insufficient fee", async function () {
      await expect(nftMinting.connect(user1).registerUser({ value: 999 }))
        .to.be.revertedWith("Insufficient registration fee");
    });

    it("Should not allow double registration", async function () {
      await nftMinting.connect(user1).registerUser({ value: 1000 });
      await expect(nftMinting.connect(user1).registerUser({ value: 1000 }))
        .to.be.revertedWith("User already registered");
    });

    it("Should emit UserRegistered event", async function () {
      await expect(nftMinting.connect(user1).registerUser({ value: 1000 }))
        .to.emit(nftMinting, "UserRegistered")
        .withArgs(await user1.getAddress());
    });
  });

  describe("NFT Minting", function () {
    beforeEach(async function () {
      await nftMinting.connect(user1).registerUser({ value: 1000 });
    });

    it("Should allow a registered user to mint an NFT", async function () {
      await nftMinting.connect(user1).mintNFT({ value: 2000 });
      expect(await nftMinting.balanceOf(await user1.getAddress())).to.equal(1);
    });

    it("Should not allow minting with insufficient fee", async function () {
      await expect(nftMinting.connect(user1).mintNFT({ value: 1999 }))
        .to.be.revertedWith("Insufficient minting fee");
    });

    it("Should not allow unregistered users to mint", async function () {
      await expect(nftMinting.connect(user2).mintNFT({ value: 2000 }))
        .to.be.revertedWith("User not registered");
    });

    it("Should emit NFTMinted event", async function () {
      await expect(nftMinting.connect(user1).mintNFT({ value: 2000 }))
        .to.emit(nftMinting, "NFTMinted")
        .withArgs(await user1.getAddress(), 1);
    });
  });

  describe("Blacklist", function () {
    it("Should allow owner to add an address to blacklist", async function () {
      await nftMinting.connect(owner).addToBlacklist(await user1.getAddress());
      expect(await nftMinting.blacklistedAddresses(await user1.getAddress())).to.be.true;
    });

    it("Should not allow non-owner to add to blacklist", async function () {
      await expect(nftMinting.connect(user1).addToBlacklist(await user2.getAddress()))
        .to.be.revertedWithCustomError(nftMinting, "OwnableUnauthorizedAccount")
        .withArgs(await user1.getAddress());
    });

    it("Should not allow blacklisted address to register", async function () {
      await nftMinting.connect(owner).addToBlacklist(await user1.getAddress());
      await expect(nftMinting.connect(user1).registerUser({ value: 1000 }))
        .to.be.revertedWith("Address is blacklisted");
    });

    it("Should emit AddedToBlacklist event", async function () {
      await expect(nftMinting.connect(owner).addToBlacklist(await user1.getAddress()))
        .to.emit(nftMinting, "AddedToBlacklist")
        .withArgs(await user1.getAddress());
    });

    it("Should allow owner to remove address from blacklist", async function () {
      await nftMinting.connect(owner).addToBlacklist(await user1.getAddress());
      await nftMinting.connect(owner).removeFromBlacklist(await user1.getAddress());
      expect(await nftMinting.blacklistedAddresses(await user1.getAddress())).to.be.false;
    });

    it("Should emit RemovedFromBlacklist event", async function () {
      await nftMinting.connect(owner).addToBlacklist(await user1.getAddress());
      await expect(nftMinting.connect(owner).removeFromBlacklist(await user1.getAddress()))
        .to.emit(nftMinting, "RemovedFromBlacklist")
        .withArgs(await user1.getAddress());
    });
  });

  describe("Withdrawal", function () {
    it("Should allow owner to withdraw funds", async function () {
      // Add funds to the contract
      await nftMinting.connect(user1).registerUser({ value: 1000 });
      await nftMinting.connect(user1).mintNFT({ value: 2000 });

      const contractBalance = await ethers.provider.getBalance(await nftMinting.getAddress());
      const initialOwnerBalance = await ethers.provider.getBalance(await owner.getAddress());

      // Perform withdrawal
      const tx = await nftMinting.connect(owner).withdrawFunds();
      const receipt = await tx.wait();

      // Check if receipt is null
      if (receipt === null) {
        throw new Error("Transaction failed");
      }

      // Calculate gas cost
      const gasCost = receipt.gasUsed * receipt.gasPrice;

      const finalOwnerBalance = await ethers.provider.getBalance(await owner.getAddress());

      // Check if the owner's balance increased by the contract balance minus gas costs
      const expectedBalance = initialOwnerBalance + contractBalance - gasCost;
      expect(finalOwnerBalance).to.equal(expectedBalance);

      // Check if the contract balance is now 0
      const finalContractBalance = await ethers.provider.getBalance(await nftMinting.getAddress());
      expect(finalContractBalance).to.equal(0);
    });

    it("Should not allow non-owner to withdraw funds", async function () {
      await expect(nftMinting.connect(user1).withdrawFunds())
        .to.be.revertedWithCustomError(nftMinting, "OwnableUnauthorizedAccount")
        .withArgs(await user1.getAddress());
    });
  });
});