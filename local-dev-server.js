import express from 'express';
import { createServer as createViteServer } from 'vite';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import apiHandler from './api/convert-color.js';

// Load environment variables
dotenv.config({ path: '.env.local' });

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Create Vite server in middleware mode
async function createServer() {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });

  // Use vite's connect instance as middleware
  app.use(vite.middlewares);

  // API endpoint
  app.post('/api/convert-color', (req, res) => {
    // Mock Express-like request/response for the serverless function
    apiHandler(req, res);
  });

  app.listen(PORT, () => {
    console.log(`🚀 Local development server running at http://localhost:${PORT}`);
    console.log(`📝 API available at http://localhost:${PORT}/api/convert-color`);
  });
}

createServer(); 