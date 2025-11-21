// backend/src/controllers/wishlistController.js
import Wishlist from "../models/Wishlist.js";

export const createWishlist = async (req, res) => {
  try {
    const { title, items } = req.body;

    const wishlist = await Wishlist.create({
      title,
      items: items || []
    });

    res.status(201).json(wishlist); // returns full object including _id
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findById(req.params.id);
    if (!wishlist) return res.status(404).json({ message: "Not found" });
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const claimItem = async (req, res) => {
  try {
    const { id, itemIndex } = req.params;
    const { claimedBy } = req.body;

    const wishlist = await Wishlist.findById(id);
    if (!wishlist) return res.status(404).json({ message: "Wishlist not found" });

    const item = wishlist.items[itemIndex];
    if (item.claimed) return res.status(400).json({ message: "Already claimed" });

    item.claimed = true;
    item.claimedBy = claimedBy;
    await wishlist.save();

    res.json({ message: "Claimed!", wishlist });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};