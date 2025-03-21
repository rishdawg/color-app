// We're now using our backend API instead of calling Anthropic directly
// This solves CORS issues and keeps API key secure

// Define the return type to include both valid and invalid responses
export type ColorResponse = 
  | { isValid: true; hexColor: string }
  | { isValid: false; message: string };

export const convertColorToHex = async (colorName: string): Promise<ColorResponse> => {
  try {
    const response = await fetch('/api/convert-color', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ colorName }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error calling color conversion API:', error);
    throw error;
  }
};
