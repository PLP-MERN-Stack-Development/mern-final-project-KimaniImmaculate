// backend/src/routes/wishlist.js
import express from "express";
import Wishlist from "../models/Wishlist.js";
import authMiddleware from "../middleware/auth.js"; // ← make sure this file exists!

const router = express.Router();

// CREATE WISHLIST - Protected (only logged-in users)
router.post("/create", authMiddleware, async (req, res) => {
  try {
    const { title, gifts } = req.body;

    // Validation
    if (!title || !gifts || !Array.isArray(gifts) || gifts.length === 0) {
      return res.status(400).json({ msg: "Title and at least one gift are required" });
    }

    const newWishlist = new Wishlist({
      title,
      gifts: gifts.map(g => ({
        name: g.name,
        url: g.url || "",
        isClaimed: false
      })),
      owner: req.user.id,
      ownerName: req.user.name || req.user.email,
    });

    const wishlist = await newWishlist.save();
    res.status(201).json({ wishlistId: wishlist._id });

  } catch (err) {
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ msg: "Validation failed", errors });
    }
    console.error("Create wishlist error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// GET WISHLIST - Public
router.get("/:wishlistId", async (req, res) => {
  try {
    const wishlist = await Wishlist.findById(req.params.wishlistId)
      .select('-owner -__v'); // hide sensitive fields

    if (!wishlist) {
      return res.status(404).json({ msg: "Wishlist not found" });
    }

    res.json(wishlist);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: "Invalid wishlist ID" });
    }
    console.error("Get wishlist error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// CLAIM GIFT - Protected (only logged-in users can claim)
router.post("/claim", authMiddleware, async (req, res) => {
  try {
    const { wishlistId, giftId } = req.body;

    const wishlist = await Wishlist.findById(wishlistId);
    if (!wishlist) return res.status(404).json({ msg: "Wishlist not found" });

    const gift = wishlist.gifts.id(giftId); // ← BEST WAY to find subdocument
    if (!gift) return res.status(404).json({ msg: "Gift not found" });

    if (gift.isClaimed) {
      return res.status(400).json({ msg: "This gift is already claimed" });
    }

    gift.isClaimed = true;
    gift.claimedBy = req.user.id;
    gift.claimedByName = req.user.name || req.user.email;
    gift.claimedAt = new Date();

    await wishlist.save();

    // Emit via Socket.IO later
    res.json({
      msg: "Gift claimed successfully!",
      claimedBy: gift.claimedByName,
      giftId: gift._id,
      wishlistId
    });

  } catch (err) {
    console.error("Claim error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;



