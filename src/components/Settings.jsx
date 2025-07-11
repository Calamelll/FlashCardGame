import React, { useState, useEffect } from 'react'
import './Settings.css'

const Settings = ({ 
  allDecks, 
  updateAllDecks, 
  goToWelcome, 
  selectedDeckId, 
  setSelectedDeckId 
}) => {
  const [newDeckName, setNewDeckName] = useState('')
  const [newDeckDescription, setNewDeckDescription] = useState('')
  const [showNewDeckForm, setShowNewDeckForm] = useState(false)
  const [activeDeckId, setActiveDeckId] = useState(selectedDeckId)
  const [newCard, setNewCard] = useState({
    type: 'song',
    title: '',
    artist: '',
    lyrics: '',
    name: '',
    location: '',
    description: '',
    photo: '',
    hint: ''
  })
  const [showNewCardForm, setShowNewCardForm] = useState(false)
  const [editingCard, setEditingCard] = useState(null)
  const [importText, setImportText] = useState('')
  const [showImportForm, setShowImportForm] = useState(false)
  const [importError, setImportError] = useState('')

  // Update active deck when selectedDeckId changes
  useEffect(() => {
    setActiveDeckId(selectedDeckId)
  }, [selectedDeckId])

  // Get active deck
  const getActiveDeck = () => {
    return allDecks[activeDeckId] || allDecks.default
  }

  // Save custom decks to localStorage
  const saveDecksToStorage = (decks) => {
    const customDecks = {}
    Object.entries(decks).forEach(([id, deck]) => {
      if (!deck.isDefault) {
        customDecks[id] = deck
      }
    })
    localStorage.setItem('customDecks', JSON.stringify(customDecks))
  }

  // Create new deck
  const createNewDeck = () => {
    if (!newDeckName.trim()) {
      alert('Please enter a deck name!')
      return
    }

    const newDeckId = `custom_${Date.now()}`
    const newDeck = {
      id: newDeckId,
      name: newDeckName.trim(),
      description: newDeckDescription.trim() || 'Custom deck',
      cards: [],
      isDefault: false
    }

    const updatedDecks = {
      ...allDecks,
      [newDeckId]: newDeck
    }

    updateAllDecks(updatedDecks)
    saveDecksToStorage(updatedDecks)
    setNewDeckName('')
    setNewDeckDescription('')
    setShowNewDeckForm(false)
    setActiveDeckId(newDeckId)
  }

  // Delete deck
  const deleteDeck = (deckId) => {
    const deck = allDecks[deckId]
    if (deck?.isDefault) {
      alert('Cannot delete default deck!')
      return
    }

    if (window.confirm(`Are you sure you want to delete "${deck.name}"? This cannot be undone.`)) {
      const updatedDecks = { ...allDecks }
      delete updatedDecks[deckId]
      
      updateAllDecks(updatedDecks)
      saveDecksToStorage(updatedDecks)
      
      // If deleted deck was selected, switch to default
      if (deckId === selectedDeckId) {
        setSelectedDeckId('default')
      }
      if (deckId === activeDeckId) {
        setActiveDeckId('default')
      }
    }
  }

  // Duplicate deck
  const duplicateDeck = (deckId) => {
    const originalDeck = allDecks[deckId]
    if (!originalDeck) return

    const newDeckId = `custom_${Date.now()}`
    const duplicatedDeck = {
      id: newDeckId,
      name: `${originalDeck.name} (Copy)`,
      description: originalDeck.description,
      cards: [...originalDeck.cards],
      isDefault: false
    }

    const updatedDecks = {
      ...allDecks,
      [newDeckId]: duplicatedDeck
    }

    updateAllDecks(updatedDecks)
    saveDecksToStorage(updatedDecks)
    setActiveDeckId(newDeckId)
  }

  // Add card to active deck
  const addCardToActiveDeck = () => {
    const activeDeck = getActiveDeck()
    if (activeDeck.isDefault) {
      alert('Cannot add cards to default deck! Please create a custom deck first.')
      return
    }

    let cardToAdd = {
      id: Date.now(),
      type: newCard.type,
      hint: newCard.hint || ''
    }

    // Validate and create card based on type
    if (newCard.type === 'song') {
      if (!newCard.title || !newCard.artist || !newCard.lyrics) {
        alert('Please fill in all required fields for song card!')
        return
      }
      cardToAdd = {
        ...cardToAdd,
        title: newCard.title,
        artist: newCard.artist,
        lyrics: newCard.lyrics
      }
    } else if (newCard.type === 'location') {
      if (!newCard.name || !newCard.location || !newCard.description) {
        alert('Please fill in all required fields for location card!')
        return
      }
      cardToAdd = {
        ...cardToAdd,
        name: newCard.name,
        location: newCard.location,
        description: newCard.description,
        photo: newCard.photo || ''
      }
    }

    const updatedDeck = {
      ...activeDeck,
      cards: [...activeDeck.cards, cardToAdd]
    }

    const updatedDecks = {
      ...allDecks,
      [activeDeck.id]: updatedDeck
    }

    updateAllDecks(updatedDecks)
    saveDecksToStorage(updatedDecks)
    
    setNewCard({ 
      type: 'song',
      title: '',
      artist: '',
      lyrics: '',
      name: '',
      location: '',
      description: '',
      photo: '',
      hint: ''
    })
    setShowNewCardForm(false)
  }

  // Edit card in active deck
  const editCard = (card) => {
    setEditingCard(card)
    if (card.type === 'song') {
      setNewCard({
        type: 'song',
        title: card.title,
        artist: card.artist,
        lyrics: card.lyrics,
        name: '',
        location: '',
        description: '',
        photo: '',
        hint: card.hint || ''
      })
    } else if (card.type === 'location') {
      setNewCard({
        type: 'location',
        title: '',
        artist: '',
        lyrics: '',
        name: card.name,
        location: card.location,
        description: card.description,
        photo: card.photo || '',
        hint: card.hint || ''
      })
    }
    setShowNewCardForm(true)
  }

  // Save edited card
  const saveEditedCard = () => {
    const activeDeck = getActiveDeck()
    
    let updatedCard = {
      ...editingCard,
      type: newCard.type,
      hint: newCard.hint || ''
    }

    // Validate and update card based on type
    if (newCard.type === 'song') {
      if (!newCard.title || !newCard.artist || !newCard.lyrics) {
        alert('Please fill in all required fields for song card!')
        return
      }
      updatedCard = {
        ...updatedCard,
        title: newCard.title,
        artist: newCard.artist,
        lyrics: newCard.lyrics
      }
    } else if (newCard.type === 'location') {
      if (!newCard.name || !newCard.location || !newCard.description) {
        alert('Please fill in all required fields for location card!')
        return
      }
      updatedCard = {
        ...updatedCard,
        name: newCard.name,
        location: newCard.location,
        description: newCard.description,
        photo: newCard.photo || ''
      }
    }

    const updatedCards = activeDeck.cards.map(card => 
      card.id === editingCard.id ? updatedCard : card
    )

    const updatedDeck = {
      ...activeDeck,
      cards: updatedCards
    }

    const updatedDecks = {
      ...allDecks,
      [activeDeck.id]: updatedDeck
    }

    updateAllDecks(updatedDecks)
    saveDecksToStorage(updatedDecks)
    
    setEditingCard(null)
    setNewCard({ 
      type: 'song',
      title: '',
      artist: '',
      lyrics: '',
      name: '',
      location: '',
      description: '',
      photo: '',
      hint: ''
    })
    setShowNewCardForm(false)
  }

  // Delete card from active deck
  const deleteCard = (cardId) => {
    const activeDeck = getActiveDeck()
    
    if (activeDeck.isDefault) {
      alert('Cannot delete cards from default deck!')
      return
    }

    if (window.confirm('Are you sure you want to delete this card?')) {
      const updatedCards = activeDeck.cards.filter(card => card.id !== cardId)
      
      const updatedDeck = {
        ...activeDeck,
        cards: updatedCards
      }

      const updatedDecks = {
        ...allDecks,
        [activeDeck.id]: updatedDeck
      }

      updateAllDecks(updatedDecks)
      saveDecksToStorage(updatedDecks)
    }
  }

  // Import songs to active deck
  const importCards = () => {
    try {
      const importedSongs = JSON.parse(importText)
      
      if (!Array.isArray(importedSongs)) {
        throw new Error('Data must be an array of song objects')
      }

      const activeDeck = getActiveDeck()
      if (activeDeck.isDefault) {
        alert('Cannot import songs to default deck! Please create a custom deck first.')
        return
      }

      const validSongs = importedSongs.filter(song => 
        song.title && song.artist && song.lyrics
      ).map(song => ({
        id: Date.now() + Math.random(),
        title: song.title,
        artist: song.artist,
        lyrics: song.lyrics,
        hint: song.hint || ''
      }))

      if (validSongs.length === 0) {
        throw new Error('No valid songs found in import data')
      }

      const updatedDeck = {
        ...activeDeck,
        songs: [...activeDeck.songs, ...validSongs]
      }

      const updatedDecks = {
        ...allDecks,
        [activeDeck.id]: updatedDeck
      }

      updateAllDecks(updatedDecks)
      saveDecksToStorage(updatedDecks)
      
      setImportText('')
      setImportError('')
      setShowImportForm(false)
      alert(`Successfully imported ${validSongs.length} songs!`)
    } catch (error) {
      setImportError(`Import failed: ${error.message}`)
    }
  }

  // Cancel forms
  const cancelNewCardForm = () => {
    setNewCard({ 
      type: 'song',
      title: '',
      artist: '',
      lyrics: '',
      name: '',
      location: '',
      description: '',
      photo: '',
      hint: ''
    })
    setShowNewCardForm(false)
    setEditingCard(null)
  }

  const cancelImportForm = () => {
    setImportText('')
    setImportError('')
    setShowImportForm(false)
  }

  const cancelNewDeckForm = () => {
    setNewDeckName('')
    setNewDeckDescription('')
    setShowNewDeckForm(false)
  }

  // Get statistics
  const getStats = () => {
    const totalDecks = Object.keys(allDecks).length
    const customDecks = Object.values(allDecks).filter(deck => !deck.isDefault).length
    const totalCards = Object.values(allDecks).reduce((sum, deck) => sum + (deck.cards?.length || 0), 0)
    const customCards = Object.values(allDecks)
      .filter(deck => !deck.isDefault)
      .reduce((sum, deck) => sum + (deck.cards?.length || 0), 0)

    return { totalDecks, customDecks, totalCards, customCards }
  }

  const stats = getStats()
  const activeDeck = getActiveDeck()

  return (
    <div className="settings-container">
      <div className="settings-content">
        <div className="settings-header">
          <h1 className="settings-title">🎴 Deck Management</h1>
          <button className="back-button" onClick={goToWelcome}>
            ← Back to Game
          </button>
        </div>

        {/* Statistics */}
        <div className="stats-section">
          <h2 className="section-title">📊 Statistics</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-number">{stats.totalDecks}</span>
              <span className="stat-label">Total Decks</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{stats.customDecks}</span>
              <span className="stat-label">Custom Decks</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{stats.totalCards}</span>
              <span className="stat-label">Total Cards</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{stats.customCards}</span>
              <span className="stat-label">Custom Cards</span>
            </div>
          </div>
        </div>

        {/* Deck Management */}
        <div className="deck-management-section">
          <div className="section-header">
            <h2 className="section-title">📚 Deck Management</h2>
            <button 
              className="add-deck-button"
              onClick={() => setShowNewDeckForm(true)}
            >
              + Create New Deck
            </button>
          </div>

          {/* New Deck Form */}
          {showNewDeckForm && (
            <div className="form-overlay">
              <div className="form-container">
                <h3 className="form-title">Create New Deck</h3>
                <div className="form-group">
                  <label className="form-label">Deck Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newDeckName}
                    onChange={(e) => setNewDeckName(e.target.value)}
                    placeholder="Enter deck name..."
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-textarea"
                    value={newDeckDescription}
                    onChange={(e) => setNewDeckDescription(e.target.value)}
                    placeholder="Describe this deck..."
                    rows="3"
                  />
                </div>
                <div className="form-buttons">
                  <button className="cancel-button" onClick={cancelNewDeckForm}>
                    Cancel
                  </button>
                  <button className="save-button" onClick={createNewDeck}>
                    Create Deck
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Deck List */}
          <div className="deck-list">
            {Object.values(allDecks).map(deck => (
              <div key={deck.id} className={`deck-item ${activeDeckId === deck.id ? 'active' : ''}`}>
                <div className="deck-item-header">
                  <div className="deck-item-info">
                    <h3 className="deck-item-name">{deck.name}</h3>
                    <p className="deck-item-description">{deck.description}</p>
                    <div className="deck-item-meta">
                      <span className="deck-item-count">{deck.cards?.length || 0} cards</span>
                      <span className="deck-item-type">
                        {deck.isDefault ? '🎵 Default' : '⭐ Custom'}
                      </span>
                    </div>
                  </div>
                  <div className="deck-item-actions">
                    <button 
                      className="deck-action-button"
                      onClick={() => setActiveDeckId(deck.id)}
                    >
                      {activeDeckId === deck.id ? '✓ Active' : 'Select'}
                    </button>
                    <button 
                      className="deck-action-button"
                      onClick={() => duplicateDeck(deck.id)}
                    >
                      📋 Copy
                    </button>
                    {!deck.isDefault && (
                      <button 
                        className="deck-action-button danger"
                        onClick={() => deleteDeck(deck.id)}
                      >
                        🗑️ Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card Management for Active Deck */}
        <div className="card-management-section">
          <div className="section-header">
            <h2 className="section-title">
              🎴 Cards in "{activeDeck.name}"
              <span className="card-count">({activeDeck.cards?.length || 0} cards)</span>
            </h2>
            <div className="card-actions">
              {!activeDeck.isDefault && (
                <>
                  <button 
                    className="add-card-button"
                    onClick={() => setShowNewCardForm(true)}
                  >
                    + Add Card
                  </button>
                  <button 
                    className="import-button"
                    onClick={() => setShowImportForm(true)}
                  >
                    📥 Import JSON
                  </button>
                </>
              )}
            </div>
          </div>

          {activeDeck.isDefault && (
            <div className="read-only-notice">
              <p>💡 Default deck is read-only. Create a custom deck to add or edit cards.</p>
            </div>
          )}

          {/* Card Forms */}
          {showNewCardForm && (
            <div className="form-overlay">
              <div className="form-container">
                <h3 className="form-title">
                  {editingCard ? 'Edit Card' : 'Add New Card'}
                </h3>
                <div className="form-group">
                  <label className="form-label">Card Type *</label>
                  <select 
                    className="form-select"
                    value={newCard.type}
                    onChange={(e) => setNewCard({...newCard, type: e.target.value})}
                  >
                    <option value="song">Song Card</option>
                    <option value="location">Location Card</option>
                  </select>
                </div>
                
                {newCard.type === 'song' ? (
                  <>
                    <div className="form-group">
                      <label className="form-label">Song Title *</label>
                      <input
                        type="text"
                        className="form-input"
                        value={newCard.title}
                        onChange={(e) => setNewCard({...newCard, title: e.target.value})}
                        placeholder="Enter song title..."
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Artist *</label>
                      <input
                        type="text"
                        className="form-input"
                        value={newCard.artist}
                        onChange={(e) => setNewCard({...newCard, artist: e.target.value})}
                        placeholder="Enter artist name..."
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Abbreviated Lyrics *</label>
                      <textarea
                        className="form-textarea"
                        value={newCard.lyrics}
                        onChange={(e) => setNewCard({...newCard, lyrics: e.target.value})}
                        placeholder="Enter abbreviated lyrics..."
                        rows="4"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Hint (Optional)</label>
                      <input
                        type="text"
                        className="form-input"
                        value={newCard.hint}
                        onChange={(e) => setNewCard({...newCard, hint: e.target.value})}
                        placeholder="Enter a hint..."
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="form-group">
                      <label className="form-label">Location Name *</label>
                      <input
                        type="text"
                        className="form-input"
                        value={newCard.name}
                        onChange={(e) => setNewCard({...newCard, name: e.target.value})}
                        placeholder="Enter location name..."
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Location Address *</label>
                      <input
                        type="text"
                        className="form-input"
                        value={newCard.location}
                        onChange={(e) => setNewCard({...newCard, location: e.target.value})}
                        placeholder="Enter location address..."
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Description *</label>
                      <textarea
                        className="form-textarea"
                        value={newCard.description}
                        onChange={(e) => setNewCard({...newCard, description: e.target.value})}
                        placeholder="Enter location description..."
                        rows="4"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Photo URL</label>
                      <input
                        type="text"
                        className="form-input"
                        value={newCard.photo}
                        onChange={(e) => setNewCard({...newCard, photo: e.target.value})}
                        placeholder="Enter photo URL..."
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Hint (Optional)</label>
                      <input
                        type="text"
                        className="form-input"
                        value={newCard.hint}
                        onChange={(e) => setNewCard({...newCard, hint: e.target.value})}
                        placeholder="Enter a hint..."
                      />
                    </div>
                  </>
                )}
                
                <div className="form-buttons">
                  <button className="cancel-button" onClick={cancelNewCardForm}>
                    Cancel
                  </button>
                  <button 
                    className="save-button" 
                    onClick={editingCard ? saveEditedCard : addCardToActiveDeck}
                  >
                    {editingCard ? 'Save Changes' : 'Add Card'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {showImportForm && (
            <div className="form-overlay">
              <div className="form-container">
                <h3 className="form-title">Import Cards from JSON</h3>
                <div className="form-group">
                  <label className="form-label">JSON Data</label>
                  <textarea
                    className="form-textarea"
                    value={importText}
                    onChange={(e) => setImportText(e.target.value)}
                    placeholder={`Paste JSON array here:\n[\n  {\n    "title": "Song Name",\n    "artist": "Artist Name",\n    "lyrics": "Abbreviated lyrics...",\n    "hint": "Optional hint"\n  }\n]`}
                    rows="10"
                  />
                </div>
                {importError && (
                  <div className="error-message">{importError}</div>
                )}
                <div className="form-buttons">
                  <button className="cancel-button" onClick={cancelImportForm}>
                    Cancel
                  </button>
                  <button className="save-button" onClick={importCards}>
                    Import Cards
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Card List */}
          <div className="card-list">
            {activeDeck.cards?.map((card, index) => (
              <div key={card.id} className="card-item">
                <div className="card-item-header">
                  <div className="card-item-info">
                    <h4 className="card-item-title">
                      {index + 1}. {card.type === 'song' ? card.title : card.name}
                    </h4>
                    <p className="card-item-subtitle">
                      {card.type === 'song' ? `by ${card.artist}` : card.location}
                    </p>
                  </div>
                  <div className="card-item-actions">
                    {!activeDeck.isDefault && (
                      <>
                        <button 
                          className="card-action-button"
                          onClick={() => editCard(card)}
                        >
                          ✏️ Edit
                        </button>
                        <button 
                          className="card-action-button danger"
                          onClick={() => deleteCard(card.id)}
                        >
                          🗑️ Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <div className="card-item-content">
                  <div className="card-item-text">
                    <strong>{card.type === 'song' ? 'Lyrics:' : 'Description:'}</strong> {card.type === 'song' ? card.lyrics : card.description}
                  </div>
                  {card.hint && (
                    <div className="card-item-hint">
                      <strong>Hint:</strong> {card.hint}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {(!activeDeck.cards || activeDeck.cards.length === 0) && (
            <div className="empty-state">
              <p>No cards in this deck yet.</p>
              {!activeDeck.isDefault && (
                <p>Add some cards to get started!</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Settings 