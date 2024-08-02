import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Event from './models/Event';
import { startEventListener } from './contractListener';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI!)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.get('/events/:address', async (req, res) => {
  try {
    const events = await Event.find({ address: req.params.address });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching events' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  startEventListener();
});