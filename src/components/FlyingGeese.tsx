import { useState, useEffect, useRef } from 'react';
import './FlyingGeese.css';

// Define the goose properties
interface Goose {
  id: number;
  x: number;
  y: number;
  speed: number;
  size: number;
  rotation: number;
  direction: number;
  variant: number; // For different goose types
}

interface FlyingGeeseProps {
  message: string;
}

const FlyingGeese: React.FC<FlyingGeeseProps> = ({ message }) => {
  const [geese, setGeese] = useState<Goose[]>([]);
  const animationRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Function to create geese based on window dimensions
  const createGeese = (count: number = 12) => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      speed: 2 + Math.random() * 5,
      size: 40 + Math.random() * 40,
      rotation: Math.random() * 360,
      direction: Math.random() > 0.5 ? 1 : -1,
      variant: Math.floor(Math.random() * 3), // 0, 1, or 2 for different goose types
    }));
  };

  // Initialize geese
  useEffect(() => {
    console.log("FlyingGeese component mounted");
    
    // Create initial geese
    setGeese(createGeese());

    // Handle window resize
    const handleResize = () => {
      setGeese(createGeese());
    };

    window.addEventListener('resize', handleResize);

    // Animation frame for updating goose positions
    const animationFrame = () => {
      setGeese(prevGeese => 
        prevGeese.map(goose => {
          // Move geese horizontally
          let newX = goose.x + goose.speed * goose.direction;
          
          // If goose goes off screen, loop it back
          if (newX > window.innerWidth + 100) {
            newX = -100;
          } else if (newX < -100) {
            newX = window.innerWidth + 100;
          }
          
          // Create some vertical movement
          const newY = goose.y + Math.sin(Date.now() * 0.001 + goose.id) * 2;
          
          return {
            ...goose,
            x: newX,
            y: newY,
          };
        })
      );
      
      animationRef.current = requestAnimationFrame(animationFrame);
    };
    
    // Start animation
    animationRef.current = requestAnimationFrame(animationFrame);
    
    console.log(`Animation started with ${geese.length} geese`);
    
    // Cleanup function
    return () => {
      console.log("FlyingGeese component unmounting");
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="flying-geese-container" ref={containerRef}>
      <div className="silly-message">{message}</div>
      {geese.map(goose => (
        <div 
          key={goose.id}
          className={`goose goose-variant-${goose.variant}`}
          style={{
            left: `${goose.x}px`,
            top: `${goose.y}px`,
            width: `${goose.size}px`,
            height: `${goose.size}px`,
            transform: `rotate(${goose.direction > 0 ? 0 : 180}deg)`,
          }}
        >
          HONK
        </div>
      ))}
    </div>
  );
};

export default FlyingGeese; 