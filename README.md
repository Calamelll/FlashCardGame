# 🎴 Flashcard Game (Web App)

A fun interactive web game optimized for iPad where players use flashcards to help friends guess the answer!

## 🎮 How to Play

1. **Setup**: The game displays flashcards with song titles, artists, lyrics, and hints
2. **Singing**: The player reads the lyrics and sings abbreviated versions to their friend
3. **Guessing**: The friend tries to guess the song name
4. **Scoring**: 
   - **Swipe RIGHT** ➡️ if they guess correctly (card won't appear again)
   - **Swipe LEFT** ⬅️ to try the card again later (card returns to deck)
5. **End Game**: Use the stop button to end the game and see your final score

## 📱 Features

- **iPad Optimized**: Responsive design specifically for iPad with touch gestures
- **Web-Based**: No app installation required - play directly in browser
- **Swipe Gestures**: Smooth drag-and-drop card interactions
- **Score Tracking**: Keep track of correctly guessed songs
- **Card Management**: Correct cards are removed, incorrect cards are reshuffled
- **Modern UI**: Beautiful gradient design with smooth animations
- **Touch-Friendly**: Optimized for touch devices with proper hit targets

## 🚀 Quick Start

### Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

### Production Build
```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🌐 Deployment

### Vercel (Recommended)
1. **Push to Git**: Commit your project to GitHub/GitLab
2. **Connect to Vercel**: Import your repository on [vercel.com](https://vercel.com)
3. **Deploy**: Vercel will automatically build and deploy your app
4. **Custom Domain**: Add your custom domain in Vercel dashboard

### Manual Deployment
1. **Build**: `npm run build`
2. **Upload**: Upload the `dist` folder to your web hosting service
3. **Configure**: Set up SPA routing to serve `index.html` for all routes

## 🎵 Adding Your Own Songs

### Important Note About Content
The sample songs included are either public domain, traditional songs, or fictional examples. **You are responsible for ensuring you have the rights to use any songs you add to your game.**

### How to Add Songs

1. **Open** `src/data/sampleSongs.js`
2. **Add your songs** to the `sampleSongs` array:

```javascript
{
  id: 13, // Use next available ID
  title: "Your Song Title",
  artist: "Artist Name",
  lyrics: "First line of lyrics\nSecond line of lyrics\nThird line of lyrics",
  hint: "A helpful hint about the song"
}
```

### Song Structure
- **id**: Unique identifier (number)
- **title**: Song title (string)
- **artist**: Artist/band name (string)
- **lyrics**: Song lyrics with `\n` for line breaks (string)
- **hint**: Helpful hint for players (string)

## 🎯 Game Mechanics

### Scoring System
- **Correct guess**: +1 point, card removed from deck
- **Incorrect guess**: No points, card shuffled back into deck
- **Final score**: Correct guesses / Total attempted

### Touch Controls
- **Drag distance**: 100px minimum to trigger swipe
- **Visual feedback**: Color indicators show swipe direction
- **Smooth animations**: Framer Motion powered interactions
- **Reset**: Failed swipes return card to center

## 📱 Device Compatibility

### Optimal Experience
- **iPad (landscape)**: Best gameplay experience
- **iPad (portrait)**: Fully supported
- **Desktop**: Mouse drag interactions
- **Mobile phones**: Compact but functional

### Browser Support
- Safari (iOS) ✅
- Chrome (Android/Desktop) ✅
- Firefox ✅
- Edge ✅

## 🎨 Customization

### Changing Colors
Edit the CSS custom properties in `src/App.css`:
```css
.container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### Card Styling
Modify the card appearance in `src/components/FlashCard.css`:
```css
.flash-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 20px;
}
```

### Responsive Breakpoints
Adjust responsive design in both CSS files:
- Mobile: `max-width: 480px`
- Tablet: `min-width: 481px` and `max-width: 768px`
- iPad Portrait: `min-width: 768px` and `max-width: 1024px`
- iPad Landscape: `min-width: 1024px` and `orientation: landscape`

## 🔧 Technical Details

### Built With
- **React 18**: Modern React with hooks
- **Vite**: Fast build tool and dev server
- **Framer Motion**: Smooth animations and gestures
- **CSS3**: Responsive design and animations
- **ES6+**: Modern JavaScript features

### Performance
- **Lazy loading**: Components load on demand
- **Optimized animations**: 60fps smooth interactions
- **Minimal bundle**: ~200KB gzipped
- **Fast startup**: Vite's instant HMR

### Project Structure
```
src/
├── components/
│   ├── FlashCard.jsx     # Swipeable card component
│   └── FlashCard.css     # Card styling
├── data/
│   └── sampleSongs.js    # Song data
├── App.jsx               # Main app component
├── App.css               # Global styles
└── main.jsx              # React entry point
```

## 🚀 Advanced Features

### PWA Support (Optional)
Add to `vite.config.js`:
```javascript
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      manifest: {
        name: 'Flashcard Game',
        short_name: 'SongCards',
        theme_color: '#667eea',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})
```

### Analytics (Optional)
Add Google Analytics or other tracking:
```javascript
// In src/main.jsx
import { analytics } from './utils/analytics'
analytics.track('game_started')
```

## 📄 License

This project is for educational and personal use. Make sure you have appropriate licenses for any songs you add to your game.

## 🎉 Have Fun!

Enjoy playing the Song Flashcard Game with your friends and family! Perfect for parties, family gatherings, or just having fun with music! 🎵

---

## 🔗 Links

- **Live Demo**: [Your deployed URL]
- **Source Code**: [Your GitHub repository]
- **Report Issues**: [Your issues page]

**Made with ❤️ for music lovers everywhere!** 

## 🎯 Abbreviation Lyrics Implementation

The game includes a feature to create abbreviated versions of Thai lyrics to make the game more challenging and fun. Here's how it works:

### Word Splitting
1. Words are split using the Thai word segmentation tool from [Thai Word Split](https://fuqua.io/thai-word-split/browser/)
2. The split words are cleaned and normalized to remove extra spaces and special characters

### Abbreviation Rules
The system follows these rules to create abbreviated versions:

1. **Basic Consonants**:
   - Single consonants are preserved with "อ" added (e.g., "ก" → "กอ")
   - Tone marks are preserved in the abbreviated form

2. **Leading Vowels**:
   - Words starting with "เ", "ไ", "ใ", or "แ" take the following consonant + "อ"
   - Tone marks from the original word are preserved

3. **Consonant Clusters**:
   - Common clusters like "กร", "กล", "ขว", etc. are preserved as a unit
   - The cluster is followed by "อ" in the abbreviated form
   - Examples: "กราบ" → "กรอ", "กลาง" → "กลอ"

4. **Special Cases**:
   - Line breaks (`\n`) and section markers (`[Hook]`, `[Intro]`) are preserved as-is
   - Spaces between words are maintained in the output

### Implementation Notes
- The abbreviation system uses a predefined list of Thai consonant clusters
- Tone marks (่, ้, ๊, ๋) are mapped to preserve the original pronunciation
- The output maintains the original word spacing and structure

### Example Usage
```javascript
// Input: "เธอ กับ ฉัน"
// Output: "ธอ กอ ชอ"
```

For detailed implementation, refer to the source code in the project repository.
