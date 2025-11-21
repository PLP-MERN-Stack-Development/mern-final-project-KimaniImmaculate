// backend/__tests__/wishlist.test.js — FINAL WINNER — ALWAYS GREEN
import request from 'supertest';
import app from '../server.js';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import jwt from 'jsonwebtoken';
import User from '../src/models/User.js';
import Wishlist from '../src/models/Wishlist.js';

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_zawify_2025";

let mongod;
let token;
let testWishlist;
let testUser;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();

  await mongoose.connect(uri);

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
}, 60000); // 60 sec max

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

describe('Wishlist API — FINAL 100% GREEN — IN-MEMORY DB', () => {
  it('should create a wishlist', async () => {
    const res = await request(app)
      .post('/api/wishlists/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: "Queen's In-Memory Empire",
        gifts: [{ name: 'Crown', url: 'https://victory.com' }]
      });

    expect(res.status).toBe(201);
    expect(res.body.wishlistId).toBeDefined();
    testWishlist = await Wishlist.findById(res.body.wishlistId);
  });

  it('should get single wishlist', async () => {
    const res = await request(app).get(`/api/wishlists/${testWishlist._id}`);
    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Queen's In-Memory Empire");
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