import React, { useState, useEffect } from 'react'
import FlashCard from './components/FlashCard'
import Settings from './components/Settings'
import { sampleSongs } from './data/sampleSongs'
import { sampleLocations } from './data/sampleLocation'
import './App.css'

const App = () => {
  const [currentCard, setCurrentCard] = useState(0)
  const [score, setScore] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [availableCards, setAvailableCards] = useState([])
  const [correctCards, setCorrectCards] = useState([])
  const [showGameOver, setShowGameOver] = useState(false)
  const [cardRenderKey, setCardRenderKey] = useState(0)
  const [currentView, setCurrentView] = useState('welcome') // 'welcome', 'game', 'settings', 'deckSelection'
  const [allDecks, setAllDecks] = useState({}) // Object with deck IDs as keys
  const [selectedDeckId, setSelectedDeckId] = useState('default')

  // Initialize default deck and load custom decks
  useEffect(() => {
    const defaultSongDeck = {
      id: 'default',
      name: 'Default Songs',
      description: 'Original song collection',
      cards: sampleSongs,
      isDefault: true
    }

    const defaultLocationDeck = {
      id: 'locations',
      name: 'Default Locations',
      description: 'Famous places and landmarks',
      cards: sampleLocations,
      isDefault: true
    }

    const savedDecks = localStorage.getItem('customDecks')
    const customDecks = savedDecks ? JSON.parse(savedDecks) : {}
    
    const allDecksData = {
      default: defaultSongDeck,
      locations: defaultLocationDeck,
      ...customDecks
    }
    
    setAllDecks(allDecksData)
  }, [])

  // Initialize available cards when deck is selected
  useEffect(() => {
    if (allDecks[selectedDeckId]?.cards) {
      const shuffled = [...allDecks[selectedDeckId].cards].sort(() => Math.random() - 0.5)
      setAvailableCards(shuffled)
    }
  }, [allDecks, selectedDeckId])

  const handleSwipeRight = () => {
    setScore(score + 1)
    const newCorrectCards = [...correctCards, availableCards[currentCard]]
    setCorrectCards(newCorrectCards)
    
    const newAvailableCards = availableCards.filter((_, index) => index !== currentCard)
    setAvailableCards(newAvailableCards)
    
    if (newAvailableCards.length === 0) {
      setShowGameOver(true)
    } else {
      setCurrentCard(currentCard >= newAvailableCards.length ? 0 : currentCard)
      setCardRenderKey(prev => prev + 1)
    }
  }

  const handleSwipeLeft = () => {
    const currentCardData = availableCards[currentCard]
    let shuffledCards = [...availableCards].sort(() => Math.random() - 0.5)
    
    if (shuffledCards.length > 1 && shuffledCards[0].id === currentCardData.id) {
      [shuffledCards[0], shuffledCards[1]] = [shuffledCards[1], shuffledCards[0]]
    }
    
    setAvailableCards(shuffledCards)
    setCurrentCard(0)
    setCardRenderKey(prev => prev + 1)
  }

  const stopGame = () => {
    setShowGameOver(true)
  }

  const startNewGame = () => {
    if (!allDecks[selectedDeckId]?.cards || allDecks[selectedDeckId].cards.length === 0) {
      alert('Selected deck has no cards! Please choose a different deck.')
      return
    }

    const shuffled = [...allDecks[selectedDeckId].cards].sort(() => Math.random() - 0.5)
    setAvailableCards(shuffled)
    setCorrectCards([])
    setScore(0)
    setCurrentCard(0)
    setGameStarted(true)
    setShowGameOver(false)
    setCardRenderKey(0)
    setCurrentView('game')
  }

  const goToDeckSelection = () => {
    setCurrentView('deckSelection')
  }

  const goToSettings = () => {
    setCurrentView('settings')
  }

  const goToWelcome = () => {
    setCurrentView('welcome')
    setGameStarted(false)
    setShowGameOver(false)
  }

  const updateAllDecks = (newDecks) => {
    setAllDecks(newDecks)
  }

  const handleDeckSelect = (deckId) => {
    setSelectedDeckId(deckId)
    setCurrentView('welcome')
  }

  const getTotalCards = () => {
    return Object.values(allDecks).reduce((total, deck) => total + (deck.cards?.length || 0), 0)
  }

  const getSelectedDeck = () => {
    return allDecks[selectedDeckId] || allDecks.default || {
      id: 'default',
      name: 'Default Songs',
      description: 'Original song collection',
      cards: sampleSongs,
      isDefault: true
    }
  }

  // Welcome Screen
  if (currentView === 'welcome') {
    const selectedDeck = getSelectedDeck()
    const deckCount = Object.keys(allDecks).length

    // Show loading state if decks haven't been loaded yet
    if (deckCount === 0) {
      return (
        <div className="container">
          <div className="welcome-container">
            <div className="welcome-content animate-fade-in">
              <h1 className="welcome-title">Flashcard Game</h1>
              <p>Loading decks...</p>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="container">
        <div className="welcome-container">
          <div className="welcome-content animate-fade-in">
            <h1 className="welcome-title">Flashcard Game</h1>
            <h2 className="welcome-subtitle">How to Play:</h2>
            <div className="instructions">
              <p>• Show the flashcard content to your friend</p>
              <p>• They guess the answer</p>
              <p>• Swipe RIGHT if they guess correctly</p>
              <p>• Swipe LEFT to try the card again later</p>
              <p>• Try to get the highest score!</p>
            </div>
            
            <div className="deck-info">
              <h3 className="deck-title">Selected Deck:</h3>
              <div className="selected-deck">
                <span className="deck-name">{selectedDeck.name}</span>
                <span className="deck-count">({selectedDeck.cards?.length || 0} cards)</span>
              </div>
              <p className="deck-description">{selectedDeck.description}</p>
            </div>

            <div className="welcome-stats">
              <p>📚 Available Decks: {deckCount} | Total Cards: {getTotalCards()}</p>
            </div>
            
            <div className="welcome-buttons">
              <button className="start-button" onClick={startNewGame}>
                Start Game
              </button>
              <button className="deck-select-button" onClick={goToDeckSelection}>
                🎯 Select Deck
              </button>
              <button className="settings-button" onClick={goToSettings}>
                ⚙️ Manage Decks
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Deck Selection Screen
  if (currentView === 'deckSelection') {
    const deckCount = Object.keys(allDecks).length
    
    // Show loading state if decks haven't been loaded yet
    if (deckCount === 0) {
      return (
        <div className="container">
          <div className="deck-selection-container">
            <div className="deck-selection-content">
              <h1 className="deck-selection-title">🎯 Select a Deck</h1>
              <p>Loading decks...</p>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="container">
        <div className="deck-selection-container">
          <div className="deck-selection-content">
            <h1 className="deck-selection-title">🎯 Select a Deck</h1>
            <p className="deck-selection-subtitle">Choose which collection of cards to play with:</p>
            
            <div className="decks-grid">
              {Object.values(allDecks).map(deck => (
                <div 
                  key={deck.id} 
                  className={`deck-card ${selectedDeckId === deck.id ? 'selected' : ''} ${deck.isDefault ? 'default-deck' : 'custom-deck'}`}
                  onClick={() => handleDeckSelect(deck.id)}
                >
                  <div className="deck-card-header">
                    <h3 className="deck-card-name">{deck.name}</h3>
                    <span className="deck-card-count">{deck.cards?.length || 0} cards</span>
                  </div>
                  <p className="deck-card-description">{deck.description}</p>
                  <div className="deck-card-type">
                    {deck.isDefault ? '🎵 Default' : '⭐ Custom'}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="deck-selection-buttons">
              <button className="back-button" onClick={goToWelcome}>
                ← Back to Game
              </button>
              <button className="settings-button" onClick={goToSettings}>
                ⚙️ Manage Decks
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Settings Screen
  if (currentView === 'settings') {
    return (
      <Settings 
        allDecks={allDecks}
        updateAllDecks={updateAllDecks}
        goToWelcome={goToWelcome}
        selectedDeckId={selectedDeckId}
        setSelectedDeckId={setSelectedDeckId}
      />
    )
  }

  // Game Over Screen
  if (showGameOver) {
    const selectedDeck = getSelectedDeck()
                const totalCards = selectedDeck.cards?.length || 0
            const percentage = totalCards > 0 ? Math.round((score / totalCards) * 100) : 0
    
    return (
      <div className="container">
        <div className="game-over-container">
          <div className="game-over-content animate-scale-in">
            <h1 className="game-over-title">🎉 Game Complete! 🎉</h1>
            <div className="deck-played">
              <p>Deck: <strong>{selectedDeck.name}</strong></p>
            </div>
            <div className="score-summary">
              <p className="final-score">Final Score: {score}/{totalCards}</p>
              <p className="percentage-score">{percentage}% Success Rate</p>
            </div>
            
            {correctCards.length > 0 && (
              <div className="correct-cards-section">
                <h3 className="correct-cards-title">✅ Cards You Guessed Correctly:</h3>
                <div className="correct-cards-list">
                  {correctCards.map((card, index) => (
                    <div key={card.id} className="correct-card-item">
                      <span className="card-number">{index + 1}.</span>
                      <div className="card-info">
                        <span className="card-name">
                          "{card.type === 'song' ? card.title : card.location}"
                        </span>
                        <span className="card-artist">
                          {card.type === 'song' ? `by ${card.artist}` : (card.description || '')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {correctCards.length === 0 && (
              <div className="no-correct-cards">
                <p>😅 No cards guessed correctly this time!</p>
                <p>Don't worry, try again - you'll do better!</p>
              </div>
            )}
            
            <div className="game-over-buttons">
              <button className="start-button" onClick={startNewGame}>
                Play Again
              </button>
              <button className="secondary-button" onClick={goToDeckSelection}>
                🎯 Select Deck
              </button>
              <button className="secondary-button" onClick={goToWelcome}>
                Main Menu
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Perfect Game Screen
  if (availableCards.length === 0) {
    const selectedDeck = getSelectedDeck()
    const totalCards = selectedDeck.cards?.length || 0

    return (
      <div className="container">
        <div className="game-over-container">
          <div className="game-over-content animate-scale-in">
            <h1 className="game-over-title">🎉 Perfect Game! 🎉</h1>
            <div className="deck-played">
              <p>Deck: <strong>{selectedDeck.name}</strong></p>
            </div>
            <div className="score-summary">
              <p className="final-score">Final Score: {score}/{totalCards}</p>
              <p className="percentage-score">100% Success Rate!</p>
            </div>
            
            <div className="correct-cards-section">
              <h3 className="correct-cards-title">🏆 All Cards Completed:</h3>
              <div className="correct-cards-list">
                {correctCards.map((card, index) => (
                  <div key={card.id} className="correct-card-item">
                    <span className="card-number">{index + 1}.</span>
                    <div className="card-info">
                      <span className="card-name">
                        "{card.type === 'song' ? card.title : card.location}"
                      </span>
                      <span className="card-artist">
                        {card.type === 'song' ? `by ${card.artist}` : (card.description || '')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="game-over-buttons">
              <button className="start-button" onClick={startNewGame}>
                Play Again
              </button>
              <button className="secondary-button" onClick={goToDeckSelection}>
                🎯 Select Deck
              </button>
              <button className="secondary-button" onClick={goToWelcome}>
                Main Menu
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Game Screen
  // Don't render game screen if no cards available
  if (availableCards.length === 0 || !availableCards[currentCard]) {
    return (
      <div className="container">
        <div className="welcome-container">
          <div className="welcome-content animate-fade-in">
            <h1 className="welcome-title">Flashcard Game</h1>
            <p>Loading game...</p>
            <button className="start-button" onClick={goToWelcome}>
              ← Back to Menu
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="header">
        <div className="score-container">
          <div className="score-text">Score: {score}</div>
          <div className="remaining-text">Remaining: {availableCards.length}</div>
          <div className="deck-name-small">{getSelectedDeck().name}</div>
        </div>
        <div className="header-buttons">
          <button className="back-button" onClick={goToWelcome}>
            🏠 Menu
          </button>
          <button className="stop-button" onClick={stopGame}>
            <span className="stop-icon">⏹</span>
            Stop
          </button>
        </div>
      </div>

      <div className="card-container">
        <FlashCard
          key={`${availableCards[currentCard]?.id}-${cardRenderKey}`}
          card={availableCards[currentCard]}
          onSwipeRight={handleSwipeRight}
          onSwipeLeft={handleSwipeLeft}
        />
      </div>

      <div className="instructions-container">
        <p className="instruction-text">
          🎵 Sing the abbreviated lyrics to your friend!
        </p>
        <p className="swipe-instructions">
          ← Swipe left to try again later | Swipe right if guessed correctly →
        </p>
      </div>
    </div>
  )
}

export default App 