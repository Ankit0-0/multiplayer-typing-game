const words = [
    "about", "above", "add", "after", "again", "air", "all", "almost", "along", "also", "always", "America", "an", "and", "animal", "another", "answer", "any", "are", "around", "as", "ask", "at", "away", "back", "be", "because", "been", "before", "began", "begin", "being", "below", "between", "big", "book", "both", "boy", "but", "by", "call", "came", "can", "car", "carry", "change", "children", "city", "close", "come", "could", "country", "cut", "day", "did", "different", "do", "does", "don't", "down", "each", "earth", "eat", "end", "enough", "even", "every", "example", "eye", "face", "family", "far", "father", "feet", "few", "find", "first", "follow", "food", "for", "form", "found", "four", "from", "get", "girl", "give", "go", "good", "got", "great", "group", "grow", "had", "hand", "hard", "has", "have", "he", "head", "hear", "help", "her", "here", "high", "him", "his", "home", "house", "how", "idea", "if", "important", "in", "Indian", "into", "is", "it", "its", "it's", "just", "keep", "kind", "know", "land", "large", "last", "later", "learn", "leave", "left", "let", "letter", "life", "light", "like", "line", "list", "little", "live", "long", "look", "made", "make", "man", "many", "may", "me", "mean", "men", "might", "mile", "miss", "more", "most", "mother", "mountain", "move", "much", "must", "my", "name", "near", "need", "never", "new", "next", "night", "no", "not", "now", "number", "of", "off", "often", "oil", "old", "on", "once", "one", "only", "open", "or", "other", "our", "out", "over", "own", "page", "paper", "part", "people", "picture", "place", "plant", "play", "point", "put", "question", "quick", "quickly", "quite", "read", "really", "right", "river", "run", "said", "same", "saw", "say", "school", "sea", "second", "see", "seem", "sentence", "set", "she", "should", "show", "side", "small", "so", "some", "something", "sometimes", "song", "soon", "sound", "spell", "start", "state", "still", "stop", "story", "study", "such", "take", "talk", "tell", "than", "that", "the", "their", "them", "then", "there", "these", "they", "thing", "think", "this", "those", "thought", "three", "through", "time", "to", "together", "too", "took", "tree", "try", "turn", "two", "under", "until", "up", "us", "use", "very", "walk", "want", "was", "watch", "water", "way", "we", "well", "went", "were", "what", "when", "where", "which", "while", "white", "who", "why", "will", "with", "without", "word", "work", "world", "would", "write", "year", "you", "young", "your"
    ];

const generateRandomString = () => {
  let randomString = "";
  while (randomString.length < 200) {
    const randomIndex = Math.floor(Math.random() * words.length);
    const randomWord = words[randomIndex];
    randomString += randomWord + " ";
  }
  return randomString.trim();
}


const alphabet = "abcdefghijklmnopqrstuvwxyz";


const generateRoomId = () => {
    const startIndex = Math.floor(Math.random() * (alphabet.length - 3)); // Ensure room id length is 4
    return alphabet.substring(startIndex, startIndex + 4);
  };
  

export { generateRandomString, generateRoomId };
