import { ethers } from 'ethers';
import EventModel from './models/Event'; 
import NFTMintingJSON from './NFTMinting.json';

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS!;
const RPC_URL = process.env.RPC_URL!;

const provider = new ethers.JsonRpcProvider(RPC_URL);
const contract = new ethers.Contract(CONTRACT_ADDRESS, NFTMintingJSON.abi, provider);

export function startEventListener() {
  contract.on("UserRegistered", async (user: string, event: ethers.Log) => {
    await saveEvent(user, "UserRegistered", event);
  });

  contract.on("NFTMinted", async (user: string, tokenId: ethers.BigNumberish, event: ethers.Log) => {
    await saveEvent(user, "NFTMinted", event);
  });

  contract.on("AddedToBlacklist", async (user: string, event: ethers.Log) => {
    await saveEvent(user, "AddedToBlacklist", event);
  });

  console.log("Event listener started");
}

async function saveEvent(address: string, eventName: string, event: ethers.Log) {
  const newEvent = new EventModel({
    address,
    event: eventName,
    transactionHash: event.transactionHash,
    blockNumber: event.blockNumber,
    timestamp: new Date()
  });

  await newEvent.save();
  console.log(`Saved ${eventName} event for address ${address}`);
}