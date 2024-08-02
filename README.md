# NFT Minting and Collection Viewer

This project is a full-stack application for minting NFTs and viewing NFT collections. It consists of a smart contract for NFT minting, a React frontend for user interaction, and a Node.js backend for event tracking.

## Table of Contents

1. [Project Structure](#project-structure)
2. [Smart Contract](#smart-contract)
3. [Frontend](#frontend)
4. [Backend](#backend)
5. [Setup and Installation](#setup-and-installation)
6. [Usage](#usage)
7. [Contributing](#contributing)
8. [License](#license)

## Project Structure

NFT-Ceres-Task/
├── contracts/
│ └── NFTMinting.sol
├── frontend/
│ ├── src/
│ │ ├── App.tsx
│ │ └── App.css
│ ├── package.json
│ └── tsconfig.json
├── backend/
│ ├── src/
│ │ ├── models/
│ │ │ └── Event.ts
│ │ ├── contractListener.ts
│ │ └── server.ts
│ ├── NFTMinting.json
│ ├── package.json
│ └── tsconfig.json
└── README.md

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
- Collection viewer

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
