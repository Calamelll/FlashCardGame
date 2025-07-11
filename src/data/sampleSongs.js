// Sample songs for the flashcard game
// Note: These are either public domain, traditional songs, or fictional examples
// Replace with your own song collection

export const sampleSongs = [
  {
    id: 1,
    title: "Happy Birthday",
    artist: "Traditional",
    lyrics: "Happy birthday to you\nHappy birthday to you\nHappy birthday dear [name]\nHappy birthday to you",
    hint: "Everyone knows this celebration song!"
  },
  {
    id: 2,
    title: "Twinkle Twinkle Little Star",
    artist: "Traditional",
    lyrics: "Twinkle, twinkle, little star\nHow I wonder what you are\nUp above the world so high\nLike a diamond in the sky",
    hint: "Classic nursery rhyme about celestial objects"
  },
  {
    id: 3,
    title: "Old MacDonald Had a Farm",
    artist: "Traditional",
    lyrics: "Old MacDonald had a farm, E-I-E-I-O\nAnd on his farm he had a cow, E-I-E-I-O\nWith a moo-moo here and a moo-moo there",
    hint: "Barnyard animals make sounds in this song"
  },
  {
    id: 4,
    title: "Row Row Row Your Boat",
    artist: "Traditional",
    lyrics: "Row, row, row your boat\nGently down the stream\nMerrily, merrily, merrily, merrily\nLife is but a dream",
    hint: "A philosophical song about water transportation"
  },
  {
    id: 5,
    title: "Mary Had a Little Lamb",
    artist: "Traditional",
    lyrics: "Mary had a little lamb\nIts fleece was white as snow\nAnd everywhere that Mary went\nThe lamb was sure to go",
    hint: "A girl and her pet sheep companion"
  },
  {
    id: 6,
    title: "The Wheels on the Bus",
    artist: "Traditional",
    lyrics: "The wheels on the bus go round and round\nRound and round, round and round\nThe wheels on the bus go round and round\nAll through the town",
    hint: "Public transportation with circular motion"
  },
  {
    id: 7,
    title: "Sunshine Song",
    artist: "Demo Artist",
    lyrics: "Here comes the sun, shining so bright\nMaking everything feel just right\nBirds are singing, flowers bloom\nChasing away the winter gloom",
    hint: "Weather-related feel-good tune"
  },
  {
    id: 8,
    title: "Rainbow Dreams",
    artist: "Sample Band",
    lyrics: "Colors dancing in the sky\nRed and blue and green so high\nAfter rain the sun appears\nWashing away our fears",
    hint: "Colorful arc in the sky after storms"
  },
  {
    id: 9,
    title: "Ocean Waves",
    artist: "Demo Group",
    lyrics: "Listen to the waves crash down\nOn the sandy beach so brown\nSeagulls calling from above\nNature's song of peace and love",
    hint: "Seaside sounds and coastal birds"
  },
  {
    id: 10,
    title: "Mountain High",
    artist: "Example Artist",
    lyrics: "Climbing up the mountain tall\nStanding proud above it all\nFresh air blowing through my hair\nBeautiful view everywhere",
    hint: "High altitude adventure and scenery"
  },
  {
    id: 11,
    title: "Campfire Night",
    artist: "Folk Demo",
    lyrics: "Sitting by the fire so warm\nSafe from any kind of storm\nStars are twinkling up above\nSharing stories, sharing love",
    hint: "Outdoor evening gathering with flames"
  },
  {
    id: 12,
    title: "Dancing Leaves",
    artist: "Nature Sounds",
    lyrics: "Autumn leaves are falling down\nYellow, orange, red and brown\nSwirling in the gentle breeze\nDancing through the tall oak trees",
    hint: "Fall foliage in motion"
  }
];

// Helper function to get a random song
export const getRandomSong = () => {
  const randomIndex = Math.floor(Math.random() * sampleSongs.length);
  return sampleSongs[randomIndex];
};

// Helper function to shuffle songs
export const shuffleSongs = (songs) => {
  return [...songs].sort(() => Math.random() - 0.5);
}; 