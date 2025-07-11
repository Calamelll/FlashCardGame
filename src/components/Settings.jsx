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
  const [newSong, setNewSong] = useState({
    title: '',
    artist: '',
    lyrics: '',
    hint: ''
  })
  const [showNewSongForm, setShowNewSongForm] = useState(false)
  const [editingSong, setEditingSong] = useState(null)
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
      songs: [],
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
      songs: [...originalDeck.songs],
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

  // Add song to active deck
  const addSongToActiveDeck = () => {
    if (!newSong.title || !newSong.artist || !newSong.lyrics) {
      alert('Please fill in all required fields!')
      return
    }

    const activeDeck = getActiveDeck()
    if (activeDeck.isDefault) {
      alert('Cannot add songs to default deck! Please create a custom deck first.')
      return
    }

    const songToAdd = {
      id: Date.now(),
      title: newSong.title,
      artist: newSong.artist,
      lyrics: newSong.lyrics,
      hint: newSong.hint || ''
    }

    const updatedDeck = {
      ...activeDeck,
      songs: [...activeDeck.songs, songToAdd]
    }

    const updatedDecks = {
      ...allDecks,
      [activeDeck.id]: updatedDeck
    }

    updateAllDecks(updatedDecks)
    saveDecksToStorage(updatedDecks)
    
    setNewSong({ title: '', artist: '', lyrics: '', hint: '' })
    setShowNewSongForm(false)
  }

  // Edit song in active deck
  const editSong = (song) => {
    setEditingSong(song)
    setNewSong({
      title: song.title,
      artist: song.artist,
      lyrics: song.lyrics,
      hint: song.hint || ''
    })
    setShowNewSongForm(true)
  }

  // Save edited song
  const saveEditedSong = () => {
    if (!newSong.title || !newSong.artist || !newSong.lyrics) {
      alert('Please fill in all required fields!')
      return
    }

    const activeDeck = getActiveDeck()
    const updatedSongs = activeDeck.songs.map(song => 
      song.id === editingSong.id 
        ? { ...song, title: newSong.title, artist: newSong.artist, lyrics: newSong.lyrics, hint: newSong.hint }
        : song
    )

    const updatedDeck = {
      ...activeDeck,
      songs: updatedSongs
    }

    const updatedDecks = {
      ...allDecks,
      [activeDeck.id]: updatedDeck
    }

    updateAllDecks(updatedDecks)
    saveDecksToStorage(updatedDecks)
    
    setEditingSong(null)
    setNewSong({ title: '', artist: '', lyrics: '', hint: '' })
    setShowNewSongForm(false)
  }

  // Delete song from active deck
  const deleteSong = (songId) => {
    const activeDeck = getActiveDeck()
    
    if (activeDeck.isDefault) {
      alert('Cannot delete songs from default deck!')
      return
    }

    if (window.confirm('Are you sure you want to delete this song?')) {
      const updatedSongs = activeDeck.songs.filter(song => song.id !== songId)
      
      const updatedDeck = {
        ...activeDeck,
        songs: updatedSongs
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
  const importSongs = () => {
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
  const cancelNewSongForm = () => {
    setNewSong({ title: '', artist: '', lyrics: '', hint: '' })
    setShowNewSongForm(false)
    setEditingSong(null)
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
    const totalSongs = Object.values(allDecks).reduce((sum, deck) => sum + (deck.songs?.length || 0), 0)
    const customSongs = Object.values(allDecks)
      .filter(deck => !deck.isDefault)
      .reduce((sum, deck) => sum + (deck.songs?.length || 0), 0)

    return { totalDecks, customDecks, totalSongs, customSongs }
  }

  const stats = getStats()
  const activeDeck = getActiveDeck()

  return (
    <div className="settings-container">
      <div className="settings-content">
        <div className="settings-header">
          <h1 className="settings-title">🎵 Deck Management</h1>
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
              <span className="stat-number">{stats.totalSongs}</span>
              <span className="stat-label">Total Songs</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{stats.customSongs}</span>
              <span className="stat-label">Custom Songs</span>
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
                      <span className="deck-item-count">{deck.songs?.length || 0} songs</span>
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

        {/* Song Management for Active Deck */}
        <div className="song-management-section">
          <div className="section-header">
            <h2 className="section-title">
              🎵 Songs in "{activeDeck.name}"
              <span className="song-count">({activeDeck.songs?.length || 0} songs)</span>
            </h2>
            <div className="song-actions">
              {!activeDeck.isDefault && (
                <>
                  <button 
                    className="add-song-button"
                    onClick={() => setShowNewSongForm(true)}
                  >
                    + Add Song
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
              <p>💡 Default deck is read-only. Create a custom deck to add or edit songs.</p>
            </div>
          )}

          {/* Song Forms */}
          {showNewSongForm && (
            <div className="form-overlay">
              <div className="form-container">
                <h3 className="form-title">
                  {editingSong ? 'Edit Song' : 'Add New Song'}
                </h3>
                <div className="form-group">
                  <label className="form-label">Song Title *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newSong.title}
                    onChange={(e) => setNewSong({...newSong, title: e.target.value})}
                    placeholder="Enter song title..."
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Artist *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newSong.artist}
                    onChange={(e) => setNewSong({...newSong, artist: e.target.value})}
                    placeholder="Enter artist name..."
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Abbreviated Lyrics *</label>
                  <textarea
                    className="form-textarea"
                    value={newSong.lyrics}
                    onChange={(e) => setNewSong({...newSong, lyrics: e.target.value})}
                    placeholder="Enter abbreviated lyrics..."
                    rows="4"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Hint (Optional)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newSong.hint}
                    onChange={(e) => setNewSong({...newSong, hint: e.target.value})}
                    placeholder="Enter a hint..."
                  />
                </div>
                <div className="form-buttons">
                  <button className="cancel-button" onClick={cancelNewSongForm}>
                    Cancel
                  </button>
                  <button 
                    className="save-button" 
                    onClick={editingSong ? saveEditedSong : addSongToActiveDeck}
                  >
                    {editingSong ? 'Save Changes' : 'Add Song'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {showImportForm && (
            <div className="form-overlay">
              <div className="form-container">
                <h3 className="form-title">Import Songs from JSON</h3>
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
                  <button className="save-button" onClick={importSongs}>
                    Import Songs
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Song List */}
          <div className="song-list">
            {activeDeck.songs?.map((song, index) => (
              <div key={song.id} className="song-item">
                <div className="song-item-header">
                  <div className="song-item-info">
                    <h4 className="song-item-title">
                      {index + 1}. {song.title}
                    </h4>
                    <p className="song-item-artist">by {song.artist}</p>
                  </div>
                  <div className="song-item-actions">
                    {!activeDeck.isDefault && (
                      <>
                        <button 
                          className="song-action-button"
                          onClick={() => editSong(song)}
                        >
                          ✏️ Edit
                        </button>
                        <button 
                          className="song-action-button danger"
                          onClick={() => deleteSong(song.id)}
                        >
                          🗑️ Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <div className="song-item-content">
                  <div className="song-item-lyrics">
                    <strong>Lyrics:</strong> {song.lyrics}
                  </div>
                  {song.hint && (
                    <div className="song-item-hint">
                      <strong>Hint:</strong> {song.hint}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {(!activeDeck.songs || activeDeck.songs.length === 0) && (
            <div className="empty-state">
              <p>No songs in this deck yet.</p>
              {!activeDeck.isDefault && (
                <p>Add some songs to get started!</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Settings 