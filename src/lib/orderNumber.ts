import dbConnect from "@/lib/mongodb";
import mongoose from "mongoose";

const STARTING_NUMBER = 10;

// Create counter collection for atomic increment
const CounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

const Counter = mongoose.models.Counter || mongoose.model('Counter', CounterSchema);

export async function generateNextOrderNumber(): Promise<string> {
  await dbConnect();

  // Atomic increment - guaranteed unique even with concurrent requests
  const counter = await Counter.findByIdAndUpdate(
    { _id: 'orderNumber' },
    { $inc: { seq: 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  // If this is first run, set starting value
  if (counter.seq === 1) {
    counter.seq = STARTING_NUMBER;
    await counter.save();
  }

  return counter.seq.toString().padStart(8, '0');
}
