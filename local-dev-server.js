import express from 'express';
import { createServer as createViteServer } from 'vite';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';

// Load environment variables
dotenv.config({ path: '.env.local' });

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;

// Enable mock mode if no API key is available
const MOCK_MODE = !process.env.ANTHROPIC_API_KEY;

if (MOCK_MODE) {
  console.warn('⚠️ ANTHROPIC_API_KEY is not set in .env.local file');
  console.warn('Running in MOCK MODE - API responses will be simulated');
} else {
  console.log(`🔑 Using Anthropic API key: ${process.env.ANTHROPIC_API_KEY.substring(0, 5)}...`);
}

// Only initialize Anthropic client if not in mock mode
const anthropic = MOCK_MODE ? null : new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

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

  // API test page
  app.get('/test-api', (req, res) => {
    res.sendFile('test-api.html', { root: __dirname });
  });

  // API endpoint - implemented directly for local development
  app.post('/api/convert-color', async (req, res) => {
    try {
      const { colorName } = req.body;
      
      if (!colorName) {
        return res.status(400).json({ error: 'Color name is required' });
      }
      
      console.log(`🎨 Processing color request: "${colorName}"`);
      
      // Mock response for testing or when API key is not available
      if (MOCK_MODE) {
        console.log('🔄 Using mock response');
        
        // Return a fixed response based on common colors for testing
        const mockResponses = {
          'blue': '#0000FF',
          'red': '#FF0000',
          'green': '#00FF00',
          'yellow': '#FFFF00',
          'purple': '#800080',
          'orange': '#FFA500',
          'black': '#000000',
          'white': '#FFFFFF'
        };
        
        const lowerColor = colorName.toLowerCase();
        const hexColor = mockResponses[lowerColor] || 'thats not a color, you silly goose';
        
        if (hexColor.startsWith('#')) {
          console.log(`✅ Mock valid color: ${hexColor}`);
          return res.json({ hexColor, isValid: true });
        } else {
          console.log(`❌ Mock invalid color`);
          return res.json({ 
            isValid: false, 
            message: hexColor 
          });
        }
      }
      
      // Real API call
      const message = await anthropic.messages.create({
        model: 'claude-3-7-sonnet-latest',
        max_tokens: 150,
        messages: [
          {
            role: 'user',
            content: `Convert the color "${colorName}" to its hexadecimal value. Reply ONLY with the hex value in the format #RRGGBB if the color is VALID, otherwise reply with "thats not a color, you silly goose" with no explanation or additional text.`
          }
        ],
        temperature: 0
      });
      
      const responseText = message.content[0].type === 'text' 
        ? message.content[0].text 
        : '';
      
      const hexColor = responseText.trim();
      console.log(`🔄 Anthropic response: "${hexColor}"`);
      
      if (/^#[0-9A-Fa-f]{6}$/.test(hexColor)) {
        console.log(`✅ Valid color detected: ${hexColor}`);
        return res.json({ hexColor, isValid: true });
      } else {
        console.log(`❌ Invalid color detected`);
        return res.json({ 
          isValid: false, 
          message: "thats not a color, you silly goose" 
        });
      }
    } catch (error) {
      console.error('❌ Error processing color:', error);
      return res.status(500).json({ 
        error: 'Failed to convert color',
        details: error.message || 'Unknown error'
      });
    }
  });

  app.listen(PORT, () => {
    console.log(`🚀 Local development server running at http://localhost:${PORT}`);
    console.log(`📝 API available at http://localhost:${PORT}/api/convert-color`);
    console.log(`🔧 Running in ${MOCK_MODE ? 'MOCK MODE (no API calls)' : 'LIVE MODE (real API calls)'}`);
  });
}

createServer(); 