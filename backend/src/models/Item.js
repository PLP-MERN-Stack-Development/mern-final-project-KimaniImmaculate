import mongoose from "mongoose";

const giftItemSchema = new mongoose.Schema({
  name: String,
  image: String,
  price: String,
  link: String,
  description: String,
  claimed: { type: Boolean, default: false },
  claimedBy: { type: String },
  claimedAt: { type: Date },
});

export default giftItemSchema;