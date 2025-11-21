// backend/__tests__/wishlist.test.js — FINAL 100% GREEN
import request from 'supertest';
import app from '../server.js';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import User from '../src/models/User.js';
import Wishlist from '../src/models/Wishlist.js';

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_zawify_2025";

let token;
let testWishlist;
let testUser; // ← NOW DECLARED OUTSIDE

beforeAll(async () => {
  await mongoose.connect('mongodb://127.0.0.1:27017/zawify-test');
  await User.deleteMany({});
  await Wishlist.deleteMany({});

  // Create test user
  testUser = await User.create({
    name: 'Queen Immaculate',
    email: 'queen@zawify.com',
    password: '123456' // pre-save hook will hash it
  });

  // Generate token with name included
  token = jwt.sign(
    { id: testUser._id, name: testUser.name }, // ← INCLUDE NAME
    JWT_SECRET,
    { expiresIn: '1h' }
  );
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('Wishlist API — FINAL 100% GREEN', () => {
  it('should create a wishlist', async () => {
    const res = await request(app)
      .post('/api/wishlists/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: "Queen's Final Empire",
        gifts: [{ name: 'Crown', url: 'https://victory.com' }]
      });

    expect(res.status).toBe(201);
    expect(res.body.wishlistId).toBeDefined();
    testWishlist = await Wishlist.findById(res.body.wishlistId);
    expect(testWishlist.owner.toString()).toBe(testUser._id.toString());
  });

  it('should get single wishlist', async () => {
    const res = await request(app).get(`/api/wishlists/${testWishlist._id}`);
    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Queen's Final Empire");
  });

  it('should claim a gift', async () => {
    const giftId = testWishlist.gifts[0]._id;
    const res = await request(app)
      .post('/api/wishlists/claim')
      .set('Authorization', `Bearer ${token}`)
      .send({ giftId, wishlistId: testWishlist._id });

    expect(res.status).toBe(200);
    expect(res.body.msg).toBe("Gift claimed successfully!");
    expect(res.body.claimedBy).toBe("Queen Immaculate"); // ← NOW WORKS
  });
});