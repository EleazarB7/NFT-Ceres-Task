import React, { useState } from 'react';
import './App.css';

// Sample NFT data
const NFT_DATA = [
  { id: 1, image: 'https://via.placeholder.com/150', owned: false },
  { id: 2, image: 'https://via.placeholder.com/150', owned: true },
  { id: 3, image: 'https://via.placeholder.com/150', owned: false },
  { id: 4, image: 'https://via.placeholder.com/150', owned: true },
  { id: 5, image: 'https://via.placeholder.com/150', owned: false },
];

function App() {
  const [connected, setConnected] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [blacklisted, setBlacklisted] = useState(false);

  const connectWallet = () => setConnected(true);
  const register = () => setRegistered(true);
  const toggleBlacklist = () => setBlacklisted(!blacklisted);

  return (
    <div className="App">
      {connected && (
        <div className="wallet-address">0x999999cf1046e68e36E1aA2E0E07105eDDD1f08E</div>
      )}

      <main>
        {!connected && (
          <div className="connect-wallet-container">
            <button className="connect-wallet-button" onClick={connectWallet}>
              Connect wallet
            </button>
          </div>
        )}
        
        {connected && !registered && (
          <div className="register-container">
            <p>Please register to view/mint NFTs</p>
            <button onClick={register}>Register</button>
          </div>
        )}

        {connected && registered && !blacklisted && (
          <div className="nft-collection">
            <h2>NFT Collection</h2>
            <div className="nft-grid">
              {NFT_DATA.map((nft) => (
                <div key={nft.id} className="nft-item">
                  <img src={nft.image} alt={`NFT ${nft.id}`} />
                  {nft.owned ? (
                    <p>Owned by: 0x742...3479</p>
                  ) : (
                    <button>Mint</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {blacklisted && (
          <p>You have been blacklisted from this NFT collection!</p>
        )}
      </main>

      <div className="debug-buttons">
        <button onClick={() => setConnected(!connected)}>
          {connected ? 'Disconnect' : 'Connect'}
        </button>
        <button onClick={() => setRegistered(!registered)}>
          {registered ? 'Unregister' : 'Register'}
        </button>
        <button onClick={toggleBlacklist}>
          {blacklisted ? 'Remove from Blacklist' : 'Blacklist'}
        </button>
      </div>
    </div>
  );
}

export default App;