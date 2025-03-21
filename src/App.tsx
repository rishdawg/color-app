import { useState, useEffect } from 'react'
import { convertColorToHex, type ColorResponse } from './services/anthropicService'
import FlyingGeese from './components/FlyingGeese'
import './App.css'

function App() {
  const [color, setColor] = useState<string>('')
  const [backgroundColor, setBackgroundColor] = useState<string>('#ffffff')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [invalidColorMessage, setInvalidColorMessage] = useState<string | null>(null)

  // For debugging
  useEffect(() => {
    console.log("Invalid color message state:", invalidColorMessage);
  }, [invalidColorMessage]);

  const handleColorSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!color.trim()) return
    
    setIsLoading(true)
    setError(null)
    setInvalidColorMessage(null)
    
    try {
      console.log("Submitting color:", color);
      const response = await convertColorToHex(color)
      console.log("API response:", response);
      
      if (response.isValid) {
        console.log("Valid color:", response.hexColor);
        setBackgroundColor(response.hexColor)
        setInvalidColorMessage(null)
      } else {
        // If the color is invalid, show the silly goose message
        console.log("Invalid color, showing geese");
        setInvalidColorMessage(response.message)
      }
    } catch (err) {
      console.error('Error in color conversion:', err);
      setError('Failed to convert color. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // For testing - comment out for production
  const showTestGeese = () => {
    console.log("Showing test geese");
    setInvalidColorMessage("thats not a color, you silly goose");
  }

  return (
    <div className="app-container" style={{ backgroundColor }}>
      {invalidColorMessage && <FlyingGeese message={invalidColorMessage} />}
      
      <div className="content">
        <h1>Color Converter</h1>
        
        <div className="color-form">
          <form onSubmit={handleColorSubmit}>
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              placeholder="Enter a color name (e.g., 'sky blue')"
              disabled={isLoading}
              required
            />
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Converting...' : 'Change Color'}
            </button>
          </form>
          
          {error && <div className="error-message">{error}</div>}
          
          {backgroundColor !== '#ffffff' && !invalidColorMessage && (
            <div className="color-info">
              <p>Current color: <strong>{color}</strong></p>
              <p>Hex value: <strong>{backgroundColor}</strong></p>
            </div>
          )}
          
          {/* Temporary test button - remove in production */}
          <button 
            onClick={showTestGeese} 
            style={{ marginTop: '20px', backgroundColor: '#e74c3c' }}>
            Test Geese
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
