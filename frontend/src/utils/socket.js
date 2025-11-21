// frontend/src/utils/socket.js
import io from 'socket.io-client';

const SOCKET_URL = 
  process.env.NODE_ENV === 'production'
    ? 'https://zawify-2.onrender.com'  
    : 'http://localhost:5000';

const socket = io(SOCKET_URL, {
  withCredentials: true,
  transports: ['websocket'],
});

export default socket;