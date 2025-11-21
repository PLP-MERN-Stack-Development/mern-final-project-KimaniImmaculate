// backend/__tests__/wishlist.test.js — FINAL: REAL ATLAS (LIKE PRODUCTION)
import request from 'supertest';
import app from '../server.js';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import User from '../src/models/User.js';
import Wishlist from '../src/models/Wishlist.js';

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_zawify_2025";

// Use your real Atlas URI — same as production
const TEST_DB_URI = process.env.TEST_MONGO_URI || process.env.MONGO_URI;

if (!TEST_DB_URI) {
  throw new Error("Please set TEST_MONGO_URI or MONGO_URI in .env for tests");
}

let token;
let testWishlist;
let testUser;

beforeAll(async () => {
  // Connect to Atlas (same cluster you use in dev/prod)
  await mongoose.connect(TEST_DB_URI, {
    dbName: 'zawify-test'  // Use a dedicated test database
  });

  await User.deleteMany({});
  await Wishlist.deleteMany({});

  testUser = await User.create({
    name: 'Queen Immaculate',
    email: 'queen@zawify.com',
    password: '123456'
  });

  token = jwt.sign(
    { id: testUser._id, name: testUser.name },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
}, 30000); // 30 sec timeout for Atlas

afterAll(async () => {
  await User.deleteMany({});
  await Wishlist.deleteMany({});
  await mongoose.connection.close();
}, 30000);

describe('Wishlist API — REAL ATLAS — 100% GREEN', () => {
  it('should create a wishlist', async () => {
    const res = await request(app)
      .post('/api/wishlists/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: "Queen's Atlas Empire",
        gifts: [{ name: 'Atlas Crown', url: 'https://queen.com' }]
      });

    expect(res.status).toBe(201);
    expect(res.body.wishlistId).toBeDefined();
    testWishlist = await Wishlist.findById(res.body.wishlistId);
  });

  it('should get single wishlist', async () => {
    const res = await request(app).get(`/api/wishlists/${testWishlist._id}`);
    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Queen's Atlas Empire");
  });

  it('should claim a gift', async () => {
    const giftId = testWishlist.gifts[0]._id;
    const res = await request(app)
      .post('/api/wishlists/claim')
      .set('Authorization', `Bearer ${token}`)
      .send({ giftId, wishlistId: testWishlist._id });

    expect(res.status).toBe(200);
    expect(res.body.claimedBy).toBe("Queen Immaculate");
  });
});