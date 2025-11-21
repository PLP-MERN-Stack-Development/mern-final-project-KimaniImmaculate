// backend/src/models/Wishlist.js
import mongoose from "mongoose";

const giftSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: String,
  isClaimed: { type: Boolean, default: false },
  claimedBy: String,
  claimedByName: String,
  claimedAt: Date
});

const wishlistSchema = new mongoose.Schema({
  title: { type: String, required: true },
  gifts: [giftSchema],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ownerName: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Wishlist", wishlistSchema);