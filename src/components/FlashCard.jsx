import React, { useState, useRef, useEffect } from 'react'
import './FlashCard.css'

const FlashCard = ({ song, onSwipeRight, onSwipeLeft }) => {
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [swipeDirection, setSwipeDirection] = useState(null)
  const cardRef = useRef(null)
  const startPos = useRef({ x: 0, y: 0 })
  const currentPos = useRef({ x: 0, y: 0 })

  const SWIPE_THRESHOLD = 100

  // Mouse events
  const handleMouseDown = (e) => {
    setIsDragging(true)
    startPos.current = { x: e.clientX, y: e.clientY }
    currentPos.current = { x: e.clientX, y: e.clientY }
    setSwipeDirection(null)
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return
    
    const deltaX = e.clientX - startPos.current.x
    const deltaY = e.clientY - startPos.current.y
    
    setDragOffset({ x: deltaX, y: deltaY })
    currentPos.current = { x: e.clientX, y: e.clientY }
    
    // Update swipe direction indicators
    if (Math.abs(deltaX) > 20) {
      setSwipeDirection(deltaX > 0 ? 'right' : 'left')
    } else {
      setSwipeDirection(null)
    }
  }

  const handleMouseUp = () => {
    if (!isDragging) return
    
    const deltaX = dragOffset.x
    
    if (deltaX > SWIPE_THRESHOLD) {
      // Swipe right - correct
      animateCardExit('right')
      setTimeout(() => onSwipeRight(), 300)
    } else if (deltaX < -SWIPE_THRESHOLD) {
      // Swipe left - try again
      animateCardExit('left')
      setTimeout(() => onSwipeLeft(), 300)
    } else {
      // Return to center
      animateCardReturn()
    }
    
    setIsDragging(false)
  }

  // Touch events
  const handleTouchStart = (e) => {
    setIsDragging(true)
    const touch = e.touches[0]
    startPos.current = { x: touch.clientX, y: touch.clientY }
    currentPos.current = { x: touch.clientX, y: touch.clientY }
    setSwipeDirection(null)
  }

  const handleTouchMove = (e) => {
    if (!isDragging) return
    e.preventDefault()
    
    const touch = e.touches[0]
    const deltaX = touch.clientX - startPos.current.x
    const deltaY = touch.clientY - startPos.current.y
    
    setDragOffset({ x: deltaX, y: deltaY })
    currentPos.current = { x: touch.clientX, y: touch.clientY }
    
    // Update swipe direction indicators
    if (Math.abs(deltaX) > 20) {
      setSwipeDirection(deltaX > 0 ? 'right' : 'left')
    } else {
      setSwipeDirection(null)
    }
  }

  const handleTouchEnd = () => {
    if (!isDragging) return
    
    const deltaX = dragOffset.x
    
    if (deltaX > SWIPE_THRESHOLD) {
      // Swipe right - correct
      animateCardExit('right')
      setTimeout(() => onSwipeRight(), 300)
    } else if (deltaX < -SWIPE_THRESHOLD) {
      // Swipe left - try again
      animateCardExit('left')
      setTimeout(() => onSwipeLeft(), 300)
    } else {
      // Return to center
      animateCardReturn()
    }
    
    setIsDragging(false)
  }

  const animateCardExit = (direction) => {
    if (cardRef.current) {
      const exitX = direction === 'right' ? '100vw' : '-100vw'
      cardRef.current.style.transform = `translateX(${exitX}) rotate(${direction === 'right' ? '25deg' : '-25deg'})`
      cardRef.current.style.opacity = '0'
    }
  }

  const animateCardReturn = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = 'translateX(0) rotate(0deg)'
      cardRef.current.style.opacity = '1'
    }
    setDragOffset({ x: 0, y: 0 })
    setSwipeDirection(null)
  }

  // Add global mouse move and up listeners
  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      if (isDragging) {
        handleMouseMove(e)
      }
    }

    const handleGlobalMouseUp = () => {
      if (isDragging) {
        handleMouseUp()
      }
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove)
      document.addEventListener('mouseup', handleGlobalMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove)
      document.removeEventListener('mouseup', handleGlobalMouseUp)
    }
  }, [isDragging, dragOffset])

  // Reset card position when song changes
  useEffect(() => {
    setDragOffset({ x: 0, y: 0 })
    setSwipeDirection(null)
    setIsDragging(false)
    if (cardRef.current) {
      cardRef.current.style.transform = 'translateX(0) rotate(0deg)'
      cardRef.current.style.opacity = '1'
    }
  }, [song?.id])

  if (!song) return null

  const rotation = Math.min(25, Math.max(-25, dragOffset.x * 0.1))
  const opacity = Math.max(0.5, 1 - Math.abs(dragOffset.x) * 0.002)

  return (
    <div className="flash-card-container">
      <div
        ref={cardRef}
        className={`flash-card ${isDragging ? 'dragging' : ''}`}
        style={{
          transform: `translateX(${dragOffset.x}px) translateY(${dragOffset.y * 0.3}px) rotate(${rotation}deg)`,
          opacity: opacity,
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Swipe Indicators */}
        <div
          className={`swipe-indicator correct-indicator ${swipeDirection === 'right' ? 'visible' : ''}`}
        >
          <span className="indicator-text">✓ CORRECT</span>
        </div>
        
        <div
          className={`swipe-indicator try-again-indicator ${swipeDirection === 'left' ? 'visible' : ''}`}
        >
          <span className="indicator-text">← TRY AGAIN</span>
        </div>

        {/* Card Content */}
        <div className="card-content">
          <div className="song-header">
            <h2 className="song-title">{song.title}</h2>
            <p className="artist-name">by {song.artist}</p>
          </div>
          
          <div className="lyrics-container">
            <h3 className="lyrics-title">Lyrics:</h3>
            <p className="lyrics-text">{song.lyrics}</p>
          </div>
          
          <div className="hint-container">
            <h3 className="hint-title">💡 Hint:</h3>
            <p className="hint-text">{song.hint}</p>
          </div>
        </div>

        {/* Drag instruction */}
        <div className="drag-instruction">
          <p>← Drag to swipe →</p>
        </div>
      </div>
    </div>
  )
}

export default FlashCard 