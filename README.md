# Color Converter App

A fun and interactive color converter application that transforms color names into their hexadecimal values using the Anthropic Claude API. If an invalid color is entered, you'll be greeted by flying geese!

## Features

- Convert color names to hex values using natural language processing
- Interactive UI with real-time background color changes
- Responsive design that works on both desktop and mobile devices
- Flying geese animation for invalid color inputs

## Tech Stack

- React + Vite
- TypeScript
- Anthropic Claude API for natural language color conversion
- CSS animations for visual effects

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or higher)
- NPM or Yarn
- Anthropic API key

### Installation

1. Clone the repository
   ```
   git clone https://github.com/rishdawg/color-app.git
   cd color-app
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Create a `.env` file in the root directory and add your Anthropic API key
   ```
   ANTHROPIC_API_KEY=your_api_key_here
   ```

4. Start the development server
   ```
   npm run dev
   ```

5. Build for production
   ```
   npm run build
   ```

## Deployment

This app can be deployed on Vercel, Netlify, or similar platforms with serverless function support for the API integration.

## License

MIT
