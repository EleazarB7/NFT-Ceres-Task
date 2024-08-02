# NFT Minting 

This project is a full-stack application for minting NFTs and viewing NFT's. It consists of a smart contract for NFT minting, a React frontend for user interaction, and a Node.js backend for event tracking.

## Table of Contents

1. [Smart Contract](#smart-contract)
2. [Frontend](#frontend)
3. [Backend](#backend)
4. [Setup and Installation](#setup-and-installation)
5. [Usage](#usage)
6. [License](#license)

## Smart Contract

The `NFTMinting.sol` contract allows users to register, mint NFTs, and includes features like blacklisting. It's deployed on the Sepolia testnet at address: `0xb874b8d0165212a840Ac41d92866b1d7a4a50196`.

Key features:

- User registration
- NFT minting
- Blacklist functionality
- Owner-only functions for managing fees and blacklist

## Frontend

The frontend is built with React and TypeScript. It provides a user interface for connecting wallets, registering users, minting NFTs, and viewing NFT collections.

Key components:

- Wallet connection
- User registration
- NFT minting

## Backend

The backend is a Node.js application that listens to events from the smart contract and stores them in a MongoDB database. It provides an API for querying events related to specific addresses.

Key features:

- Event listening and storage
- API for retrieving events by address

## Setup and Installation

1. Clone the repository:

```
git clone https://github.com/your-username/NFT-Ceres-Task.git
cd NFT-Ceres-Task
```

2. Install dependencies:

Frontend

```
cd frontend
npm install
```

Backend

```
cd ../backend
npm install
```

3. Set up environment variables:

- Create a `.env` file in the backend directory with the following:

```
MONGODB_URI=your_mongodb_connection_string
CONTRACT_ADDRESS=0xb874b8d0165212a840Ac41d92866b1d7a4a50196
RPC_URL=your_ethereum_node_url
```

4. Start the applications:

Frontend

```
cd frontend
npm start
```

Backend

```
cd ../backend
npm start
```

## Usage

1. Connect your wallet (MetaMask recommended) to the Sepolia testnet.
2. Register as a user by paying the registration fee.
3. Mint NFTs by paying the minting fee.
4. View your NFT collection in the frontend.
5. Use the backend API to retrieve event data for specific addresses.

## License

This project is licensed under the MIT License.
