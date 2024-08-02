import React, { useState, useEffect, useCallback } from 'react';
import { ethers, BrowserProvider } from 'ethers';
import './App.css';

// Import the ABI
import NFTMintingABI from './NFTMinting.json';

const CONTRACT_ADDRESS = '0xb874b8d0165212a840Ac41d92866b1d7a4a50196';

function App() {
  const [account, setAccount] = useState<string | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [nfts, setNfts] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkRegistration = useCallback(async (address: string, nftContract: ethers.Contract) => {
    try {
      const registered = await nftContract.isUserRegistered(address);
      setIsRegistered(registered);
    } catch (error) {
      console.error("Failed to check registration:", error);
      setError("Failed to check registration status.");
    }
  }, []);

  const fetchNFTs = useCallback(async (address: string, nftContract: ethers.Contract) => {
    try {
      const balance = await nftContract.balanceOf(address);
      const tokenIds = [];
      for (let i = 0; i < balance; i++) {
        const tokenId = await nftContract.tokenOfOwnerByIndex(address, i);
        tokenIds.push(tokenId.toNumber());
      }
      setNfts(tokenIds);
    } catch (error) {
      console.error("Failed to fetch NFTs:", error);
      setError("Failed to fetch your NFTs.");
    }
  }, []);

  const connectWallet = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);

        const nftContract = new ethers.Contract(CONTRACT_ADDRESS, NFTMintingABI.abi, signer);
        setContract(nftContract);

        await checkRegistration(address, nftContract);
        await fetchNFTs(address, nftContract);
      } catch (error) {
        console.error("Failed to connect wallet:", error);
        setError("Failed to connect wallet. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else {
      setError('Please install MetaMask!');
      setIsLoading(false);
    }
  }, [checkRegistration, fetchNFTs]);

  const disconnectWallet = useCallback(() => {
    setAccount(null);
    setContract(null);
    setIsRegistered(false);
    setNfts([]);
  }, []);

  useEffect(() => {
    connectWallet();
  }, [connectWallet]);

  async function registerUser() {
    if (contract) {
      setIsLoading(true);
      setError(null);
      try {
        const tx = await contract.registerUser({ value: ethers.parseEther("0.001") });
        await tx.wait();
        setIsRegistered(true);
      } catch (error) {
        console.error("Failed to register:", error);
        setError("Failed to register. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  }

  async function mintNFT() {
    if (contract) {
      setIsLoading(true);
      setError(null);
      try {
        const tx = await contract.mintNFT({ value: ethers.parseEther("0.002") });
        await tx.wait();
        await fetchNFTs(account!, contract);
      } catch (error) {
        console.error("Failed to mint NFT:", error);
        setError("Failed to mint NFT. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  }

  return (
    <div className="App">
      {account ? (
        <div>
          <div className="wallet-address">Connected: {account}</div>
          <button onClick={disconnectWallet} className="disconnect-wallet-button">Disconnect Wallet</button>
        </div>
      ) : (
        <div className="connect-wallet-container">
          <button className="connect-wallet-button" onClick={connectWallet} disabled={isLoading}>
            {isLoading ? 'Connecting...' : 'Connect Wallet'}
          </button>
        </div>
      )}
      
      {error && <div className="error-message">{error}</div>}

      <main>
        {account && !isRegistered && (
          <div className="register-container">
            <p>You are not registered. Please register to mint NFTs.</p>
            <button onClick={registerUser} disabled={isLoading}>
              {isLoading ? 'Registering...' : 'Register'}
            </button>
          </div>
        )}
        
        {account && isRegistered && (
          <div className="nft-collection">
            <h2>Your NFT Collection</h2>
            <div className="nft-grid">
              {nfts.map((tokenId) => (
                <div key={tokenId} className="nft-item">
                  <img src={`https://your-nft-image-url.com/${tokenId}.png`} alt={`NFT ${tokenId}`} />
                  <p>Token ID: {tokenId}</p>
                </div>
              ))}
              <div className="nft-item">
                <button onClick={mintNFT} disabled={isLoading}>
                  {isLoading ? 'Minting...' : 'Mint New NFT'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;