import { useState } from 'react'
import { convertColorToHex, } from './services/anthropicService'
import FlyingGeese from './components/FlyingGeese'
import './App.css'

function App() {
  const [color, setColor] = useState<string>('')
  const [backgroundColor, setBackgroundColor] = useState<string>('#ffffff')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [invalidColorMessage, setInvalidColorMessage] = useState<string | null>(null)

  const handleColorSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!color.trim()) return
    
    setIsLoading(true)
    setError(null)
    setInvalidColorMessage(null)
    
    try {
      const response = await convertColorToHex(color)
      
      if (response.isValid) {
        setBackgroundColor(response.hexColor)
        setInvalidColorMessage(null)
      } else {
        // If the color is invalid, show the silly goose message
        setInvalidColorMessage(response.message)
      }
    } catch (err) {
      console.error('Error in color conversion:', err);
      setError('Failed to convert color. Please try again.')
    } finally {
      setIsLoading(false)
    }
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
        </div>
      </div>
    </div>
  )
}

export default App
