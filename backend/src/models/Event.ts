import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  address: String,
  event: String,
  transactionHash: String,
  blockNumber: Number,
  timestamp: Date
});

export default mongoose.model('Event', eventSchema);