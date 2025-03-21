import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import Anthropic from '@anthropic-ai/sdk';
import path from 'path';
import { fileURLToPath } from 'url';

// Initialize environment variables
dotenv.config();

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize the Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist'))); // Serve built frontend files

// API endpoint to convert color
app.post('/api/convert-color', async (req, res) => {
  try {
    const { colorName } = req.body;
    
    if (!colorName) {
      return res.status(400).json({ error: 'Color name is required' });
    }

    // Use the Anthropic SDK to create a message
    const message = await anthropic.messages.create({
      model: 'claude-3-7-sonnet-latest',
      max_tokens: 150,
      messages: [
        {
          role: 'user',
          content: `Convert the color "${colorName}" to its hexadecimal value. Reply ONLY with the hex value in the format #RRGGBB if the color is VALID, otherwise reply with "thats not a color, you silly goose"  with no explanation or additional text.`
        }
      ],
      temperature: 0
    });

    // Extract and validate the hex color
    const responseText = message.content[0].type === 'text' 
      ? message.content[0].text 
      : '';
    
    const hexColor = responseText.trim();
    
    // Simple validation to ensure it's a hex color
    if (/^#[0-9A-Fa-f]{6}$/.test(hexColor)) {
      return res.json({ hexColor, isValid: true });
    } else {
      // If Claude didn't return a valid hex, instead of providing a fallback,
      // notify the frontend that the color was invalid so we can show geese animation
      return res.json({ 
        isValid: false, 
        message: "thats not a color, you silly goose" 
      });
    }
  } catch (error) {
    console.error('Error calling Anthropic API:', error);
    res.status(500).json({ 
      error: 'Failed to convert color',
      details: error.message || 'Unknown error'
    });
  }
});

// Serve frontend for any other routes (for SPA routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 