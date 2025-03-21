import Anthropic from '@anthropic-ai/sdk';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
  
  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { colorName } = req.body;
    
    if (!colorName) {
      return res.status(400).json({ error: 'Color name is required' });
    }
    
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });
    
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
    
    if (/^#[0-9A-Fa-f]{6}$/.test(hexColor)) {
      return res.status(200).json({ hexColor, isValid: true });
    } else {
      return res.status(200).json({ 
        isValid: false, 
        message: "thats not a color, you silly goose" 
      });
    }
  } catch (error) {
    console.error('Error calling Anthropic API:', error);
    return res.status(500).json({ 
      error: 'Failed to convert color',
      details: error.message || 'Unknown error'
    });
  }
} 