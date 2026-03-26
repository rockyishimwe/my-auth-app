import { useState, useEffect, useRef } from 'react';
import '../styles/variables.css';

export default function ProgressRing({ progress = 0, size = 120, strokeWidth = 8, color = 'var(--work)', interactive = false }) {
  const [isDragging, setIsDragging] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(progress);
  const svgRef = useRef(null);

  useEffect(() => {
    setCurrentProgress(progress);
  }, [progress]);

  const getProgressFromAngle = (angle) => {
    // Convert angle to progress (0-100)
    let normalizedAngle = angle % 360;
    if (normalizedAngle < 0) normalizedAngle += 360;
    
    // Map angle (0-360) to progress (0-100)
    // Starting from top (270 degrees) going clockwise
    const startAngle = 270;
    const endAngle = 630; // 270 + 360
    
    if (normalizedAngle < startAngle) {
      normalizedAngle += 360;
    }
    
    const mappedProgress = ((normalizedAngle - startAngle) / (endAngle - startAngle)) * 100;
    return Math.max(0, Math.min(100, mappedProgress));
  };

  const handleMouseDown = (e) => {
    if (!interactive) return;
    setIsDragging(true);
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !svgRef.current) return;
    
    const rect = svgRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
    const newProgress = getProgressFromAngle(angle);
    
    setCurrentProgress(newProgress);
    if (typeof interactive === 'function') {
      interactive(newProgress);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (currentProgress / 100) * circumference;
  const angle = (currentProgress / 100) * 360 - 90; // Start from top

  return (
    <div 
      style={{ 
        position: 'relative',
        width: `${size}px`,
        height: `${size}px`,
        cursor: interactive ? 'grab' : 'default'
      }}
      onMouseDown={handleMouseDown}
    >
      <svg
        ref={svgRef}
        width={size}
        height={size}
        style={{ transform: 'rotate(-90deg)' }}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--border)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            transition: isDragging ? 'none' : 'stroke-dashoffset 0.3s ease',
            cursor: isDragging ? 'grabbing' : 'grab'
          }}
        />
      </svg>
      
      {/* Center text */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: `${size / 4}px`,
          fontWeight: 'bold',
          color: 'var(--text)',
          textAlign: 'center',
          userSelect: 'none'
        }}
      >
        {currentProgress}%
      </div>
    </div>
  );
}
