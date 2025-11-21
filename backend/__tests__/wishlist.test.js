import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../../server.js"; // adjust path if needed

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Wishlist API", () => {
  let token;
  let userId;

  // Register & login first
  it("should register a user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ name: "Test", email: "test@example.com", password: "123456" });

    expect(res.status).toBe(201);
    token = res.body.token;
  });

  it("should create a wishlist", async () => {
    const res = await request(app)
      .post("/api/wishlists/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "My Birthday",
        gifts: [{ name: "iPhone 16", url: "https://apple.com" }]
      });

    expect(res.status).toBe(201);
    expect(res.body.wishlistId).toBeDefined();
  });
});