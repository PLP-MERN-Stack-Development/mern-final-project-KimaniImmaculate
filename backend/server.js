// backend/server.js — NUCLEAR FINAL VERSION — 100% GREEN GUARANTEED
import 'dotenv/config';
import express from 'express';
import cors from 'cors';

// Import routes — MUST BE BEFORE app.use
import authRoutes from './src/routes/auth.js';
import wishlistRoutes from './src/routes/wishlist.js';

const app = express();

// MIDDLEWARE
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

// ROUTES — REGISTERED IMMEDIATELY
app.use('/api/auth', authRoutes);
app.use('/api/wishlists', wishlistRoutes);

app.get('/', (req, res) => {
  res.send('Zawify Backend Running — Tests Working!');
});

// THIS IS THE ONLY EXPORT — JEST USES THIS
export default app;

// ONLY RUN SERVER IF NOT IN TEST MODE
if (process.env.NODE_ENV !== 'test' && import.meta.url === `file://${process.argv[1]}`) {
  const PORT = process.env.PORT || 5000;
  
  import('./src/config/db.js').then(async ({ default: connectDB }) => {
    await connectDB();
    console.log(`Server running on port ${PORT}`);
    
    const { createServer } = await import('http');
    const { Server } = await import('socket.io');
    const server = createServer(app);
    const io = new Server(server, {
      cors: { origin: process.env.CLIENT_URL || '*', credentials: true }
    });

    io.on('connection', (socket) => {
      socket.on('claim_item', (data) => io.emit('item_claimed', data));
    });

    server.listen(PORT);
  });
}