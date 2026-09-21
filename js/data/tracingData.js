/* ---------------------------- TRACING DATA ------------------------------
   Normalized coordinates for SVG tracing templates (viewBox 0 0 100 100).
   Supports stroke order, animated guide arrows, starting points, and word associations.
   ------------------------------------------------------------------------ */

export const ALPHABET_TRACING = {
  A: {
    character: "A", word: "Apple", emoji: "🍎", hint: "A is for Apple",
    strokes: [
      { order: 1, path: "M 50 15 L 20 85", start: { x: 50, y: 15 }, end: { x: 20, y: 85 }, arrow: { x: 35, y: 50, dir: "↙" } },
      { order: 2, path: "M 50 15 L 80 85", start: { x: 50, y: 15 }, end: { x: 80, y: 85 }, arrow: { x: 65, y: 50, dir: "↘" } },
      { order: 3, path: "M 32 55 L 68 55", start: { x: 32, y: 55 }, end: { x: 68, y: 55 }, arrow: { x: 50, y: 55, dir: "→" } }
    ]
  },
  B: {
    character: "B", word: "Ball", emoji: "⚽", hint: "B is for Ball",
    strokes: [
      { order: 1, path: "M 25 15 L 25 85", start: { x: 25, y: 15 }, end: { x: 25, y: 85 }, arrow: { x: 25, y: 50, dir: "↓" } },
      { order: 2, path: "M 25 15 C 65 15, 65 48, 25 48", start: { x: 25, y: 15 }, end: { x: 25, y: 48 }, arrow: { x: 55, y: 31, dir: "⤵" } },
      { order: 3, path: "M 25 48 C 70 48, 70 85, 25 85", start: { x: 25, y: 48 }, end: { x: 25, y: 85 }, arrow: { x: 60, y: 66, dir: "⤵" } }
    ]
  },
  C: {
    character: "C", word: "Cat", emoji: "🐱", hint: "C is for Cat",
    strokes: [
      { order: 1, path: "M 75 30 C 35 10, 15 40, 25 70 C 35 90, 75 80, 75 70", start: { x: 75, y: 30 }, end: { x: 75, y: 70 }, arrow: { x: 25, y: 50, dir: "↙" } }
    ]
  },
  D: {
    character: "D", word: "Dog", emoji: "🐶", hint: "D is for Dog",
    strokes: [
      { order: 1, path: "M 25 15 L 25 85", start: { x: 25, y: 15 }, end: { x: 25, y: 85 }, arrow: { x: 25, y: 50, dir: "↓" } },
      { order: 2, path: "M 25 15 C 80 15, 80 85, 25 85", start: { x: 25, y: 15 }, end: { x: 25, y: 85 }, arrow: { x: 65, y: 50, dir: "⤵" } }
    ]
  },
  E: {
    character: "E", word: "Elephant", emoji: "🐘", hint: "E is for Elephant",
    strokes: [
      { order: 1, path: "M 30 15 L 30 85", start: { x: 30, y: 15 }, end: { x: 30, y: 85 }, arrow: { x: 30, y: 50, dir: "↓" } },
      { order: 2, path: "M 30 15 L 75 15", start: { x: 30, y: 15 }, end: { x: 75, y: 15 }, arrow: { x: 52, y: 15, dir: "→" } },
      { order: 3, path: "M 30 50 L 68 50", start: { x: 30, y: 50 }, end: { x: 68, y: 50 }, arrow: { x: 49, y: 50, dir: "→" } },
      { order: 4, path: "M 30 85 L 75 85", start: { x: 30, y: 85 }, end: { x: 75, y: 85 }, arrow: { x: 52, y: 85, dir: "→" } }
    ]
  },
  F: {
    character: "F", word: "Fish", emoji: "🐟", hint: "F is for Fish",
    strokes: [
      { order: 1, path: "M 30 15 L 30 85", start: { x: 30, y: 15 }, end: { x: 30, y: 85 }, arrow: { x: 30, y: 50, dir: "↓" } },
      { order: 2, path: "M 30 15 L 75 15", start: { x: 30, y: 15 }, end: { x: 75, y: 15 }, arrow: { x: 52, y: 15, dir: "→" } },
      { order: 3, path: "M 30 50 L 68 50", start: { x: 30, y: 50 }, end: { x: 68, y: 50 }, arrow: { x: 49, y: 50, dir: "→" } }
    ]
  },
  G: {
    character: "G", word: "Giraffe", emoji: "🦒", hint: "G is for Giraffe",
    strokes: [
      { order: 1, path: "M 75 30 C 35 10, 15 40, 25 70 C 35 90, 75 85, 75 55 L 50 55", start: { x: 75, y: 30 }, end: { x: 50, y: 55 }, arrow: { x: 25, y: 50, dir: "↙" } }
    ]
  },
  H: {
    character: "H", word: "Hat", emoji: "🎩", hint: "H is for Hat",
    strokes: [
      { order: 1, path: "M 25 15 L 25 85", start: { x: 25, y: 15 }, end: { x: 25, y: 85 }, arrow: { x: 25, y: 50, dir: "↓" } },
      { order: 2, path: "M 75 15 L 75 85", start: { x: 75, y: 15 }, end: { x: 75, y: 85 }, arrow: { x: 75, y: 50, dir: "↓" } },
      { order: 3, path: "M 25 50 L 75 50", start: { x: 25, y: 50 }, end: { x: 75, y: 50 }, arrow: { x: 50, y: 50, dir: "→" } }
    ]
  },
  I: {
    character: "I", word: "Ice Cream", emoji: "🍦", hint: "I is for Ice Cream",
    strokes: [
      { order: 1, path: "M 50 15 L 50 85", start: { x: 50, y: 15 }, end: { x: 50, y: 85 }, arrow: { x: 50, y: 50, dir: "↓" } },
      { order: 2, path: "M 30 15 L 70 15", start: { x: 30, y: 15 }, end: { x: 70, y: 15 }, arrow: { x: 50, y: 15, dir: "→" } },
      { order: 3, path: "M 30 85 L 70 85", start: { x: 30, y: 85 }, end: { x: 70, y: 85 }, arrow: { x: 50, y: 85, dir: "→" } }
    ]
  },
  J: {
    character: "J", word: "Juice", emoji: "🧃", hint: "J is for Juice",
    strokes: [
      { order: 1, path: "M 30 15 L 70 15", start: { x: 30, y: 15 }, end: { x: 70, y: 15 }, arrow: { x: 50, y: 15, dir: "→" } },
      { order: 2, path: "M 55 15 L 55 65 C 55 85, 25 85, 25 65", start: { x: 55, y: 15 }, end: { x: 25, y: 65 }, arrow: { x: 55, y: 50, dir: "↓" } }
    ]
  },
  K: {
    character: "K", word: "Kite", emoji: "🪁", hint: "K is for Kite",
    strokes: [
      { order: 1, path: "M 25 15 L 25 85", start: { x: 25, y: 15 }, end: { x: 25, y: 85 }, arrow: { x: 25, y: 50, dir: "↓" } },
      { order: 2, path: "M 70 20 L 25 50", start: { x: 70, y: 20 }, end: { x: 25, y: 50 }, arrow: { x: 48, y: 35, dir: "↙" } },
      { order: 3, path: "M 25 50 L 70 85", start: { x: 25, y: 50 }, end: { x: 70, y: 85 }, arrow: { x: 48, y: 67, dir: "↘" } }
    ]
  },
  L: {
    character: "L", word: "Lion", emoji: "🦁", hint: "L is for Lion",
    strokes: [
      { order: 1, path: "M 30 15 L 30 85", start: { x: 30, y: 15 }, end: { x: 30, y: 85 }, arrow: { x: 30, y: 50, dir: "↓" } },
      { order: 2, path: "M 30 85 L 75 85", start: { x: 30, y: 85 }, end: { x: 75, y: 85 }, arrow: { x: 52, y: 85, dir: "→" } }
    ]
  },
  M: {
    character: "M", word: "Monkey", emoji: "🐒", hint: "M is for Monkey",
    strokes: [
      { order: 1, path: "M 20 85 L 20 15", start: { x: 20, y: 85 }, end: { x: 20, y: 15 }, arrow: { x: 20, y: 50, dir: "↑" } },
      { order: 2, path: "M 20 15 L 50 65", start: { x: 20, y: 15 }, end: { x: 50, y: 65 }, arrow: { x: 35, y: 40, dir: "↘" } },
      { order: 3, path: "M 50 65 L 80 15", start: { x: 50, y: 65 }, end: { x: 80, y: 15 }, arrow: { x: 65, y: 40, dir: "↗" } },
      { order: 4, path: "M 80 15 L 80 85", start: { x: 80, y: 15 }, end: { x: 80, y: 85 }, arrow: { x: 80, y: 50, dir: "↓" } }
    ]
  },
  N: {
    character: "N", word: "Nest", emoji: "🪹", hint: "N is for Nest",
    strokes: [
      { order: 1, path: "M 25 85 L 25 15", start: { x: 25, y: 85 }, end: { x: 25, y: 15 }, arrow: { x: 25, y: 50, dir: "↑" } },
      { order: 2, path: "M 25 15 L 75 85", start: { x: 25, y: 15 }, end: { x: 75, y: 85 }, arrow: { x: 50, y: 50, dir: "↘" } },
      { order: 3, path: "M 75 85 L 75 15", start: { x: 75, y: 85 }, end: { x: 75, y: 15 }, arrow: { x: 75, y: 50, dir: "↑" } }
    ]
  },
  O: {
    character: "O", word: "Owl", emoji: "🦉", hint: "O is for Owl",
    strokes: [
      { order: 1, path: "M 50 15 C 15 15, 15 85, 50 85 C 85 85, 85 15, 50 15", start: { x: 50, y: 15 }, end: { x: 50, y: 15 }, arrow: { x: 20, y: 50, dir: "↺" } }
    ]
  },
  P: {
    character: "P", word: "Penguin", emoji: "🐧", hint: "P is for Penguin",
    strokes: [
      { order: 1, path: "M 25 15 L 25 85", start: { x: 25, y: 15 }, end: { x: 25, y: 85 }, arrow: { x: 25, y: 50, dir: "↓" } },
      { order: 2, path: "M 25 15 C 75 15, 75 52, 25 52", start: { x: 25, y: 15 }, end: { x: 25, y: 52 }, arrow: { x: 60, y: 33, dir: "⤵" } }
    ]
  },
  Q: {
    character: "Q", word: "Queen", emoji: "👑", hint: "Q is for Queen",
    strokes: [
      { order: 1, path: "M 50 15 C 15 15, 15 85, 50 85 C 85 85, 85 15, 50 15", start: { x: 50, y: 15 }, end: { x: 50, y: 15 }, arrow: { x: 20, y: 50, dir: "↺" } },
      { order: 2, path: "M 48 62 L 78 88", start: { x: 48, y: 62 }, end: { x: 78, y: 88 }, arrow: { x: 63, y: 75, dir: "↘" } }
    ]
  },
  R: {
    character: "R", word: "Rabbit", emoji: "🐰", hint: "R is for Rabbit",
    strokes: [
      { order: 1, path: "M 25 15 L 25 85", start: { x: 25, y: 15 }, end: { x: 25, y: 85 }, arrow: { x: 25, y: 50, dir: "↓" } },
      { order: 2, path: "M 25 15 C 75 15, 75 50, 25 50", start: { x: 25, y: 15 }, end: { x: 25, y: 50 }, arrow: { x: 60, y: 32, dir: "⤵" } },
      { order: 3, path: "M 45 50 L 75 85", start: { x: 45, y: 50 }, end: { x: 75, y: 85 }, arrow: { x: 60, y: 67, dir: "↘" } }
    ]
  },
  S: {
    character: "S", word: "Sun", emoji: "☀️", hint: "S is for Sun",
    strokes: [
      { order: 1, path: "M 70 25 C 25 10, 20 48, 50 50 C 80 52, 75 90, 30 75", start: { x: 70, y: 25 }, end: { x: 30, y: 75 }, arrow: { x: 35, y: 28, dir: "↺" } }
    ]
  },
  T: {
    character: "T", word: "Tiger", emoji: "🐯", hint: "T is for Tiger",
    strokes: [
      { order: 1, path: "M 20 15 L 80 15", start: { x: 20, y: 15 }, end: { x: 80, y: 15 }, arrow: { x: 50, y: 15, dir: "→" } },
      { order: 2, path: "M 50 15 L 50 85", start: { x: 50, y: 15 }, end: { x: 50, y: 85 }, arrow: { x: 50, y: 50, dir: "↓" } }
    ]
  },
  U: {
    character: "U", word: "Umbrella", emoji: "☂️", hint: "U is for Umbrella",
    strokes: [
      { order: 1, path: "M 25 15 L 25 60 C 25 90, 75 90, 75 60 L 75 15", start: { x: 25, y: 15 }, end: { x: 75, y: 15 }, arrow: { x: 25, y: 45, dir: "↓" } }
    ]
  },
  V: {
    character: "V", word: "Volcano", emoji: "🌋", hint: "V is for Volcano",
    strokes: [
      { order: 1, path: "M 20 15 L 50 85", start: { x: 20, y: 15 }, end: { x: 50, y: 85 }, arrow: { x: 35, y: 50, dir: "↘" } },
      { order: 2, path: "M 50 85 L 80 15", start: { x: 50, y: 85 }, end: { x: 80, y: 15 }, arrow: { x: 65, y: 50, dir: "↗" } }
    ]
  },
  W: {
    character: "W", word: "Whale", emoji: "🐳", hint: "W is for Whale",
    strokes: [
      { order: 1, path: "M 15 15 L 32 85", start: { x: 15, y: 15 }, end: { x: 32, y: 85 }, arrow: { x: 23, y: 50, dir: "↘" } },
      { order: 2, path: "M 32 85 L 50 40", start: { x: 32, y: 85 }, end: { x: 50, y: 40 }, arrow: { x: 41, y: 62, dir: "↗" } },
      { order: 3, path: "M 50 40 L 68 85", start: { x: 50, y: 40 }, end: { x: 68, y: 85 }, arrow: { x: 59, y: 62, dir: "↘" } },
      { order: 4, path: "M 68 85 L 85 15", start: { x: 68, y: 85 }, end: { x: 85, y: 15 }, arrow: { x: 76, y: 50, dir: "↗" } }
    ]
  },
  X: {
    character: "X", word: "Xylophone", emoji: "🎼", hint: "X is for Xylophone",
    strokes: [
      { order: 1, path: "M 20 15 L 80 85", start: { x: 20, y: 15 }, end: { x: 80, y: 85 }, arrow: { x: 50, y: 50, dir: "↘" } },
      { order: 2, path: "M 80 15 L 20 85", start: { x: 80, y: 15 }, end: { x: 20, y: 85 }, arrow: { x: 50, y: 50, dir: "↙" } }
    ]
  },
  Y: {
    character: "Y", word: "Yo-Yo", emoji: "🪀", hint: "Y is for Yo-Yo",
    strokes: [
      { order: 1, path: "M 20 15 L 50 50", start: { x: 20, y: 15 }, end: { x: 50, y: 50 }, arrow: { x: 35, y: 32, dir: "↘" } },
      { order: 2, path: "M 80 15 L 50 50", start: { x: 80, y: 15 }, end: { x: 50, y: 50 }, arrow: { x: 65, y: 32, dir: "↙" } },
      { order: 3, path: "M 50 50 L 50 85", start: { x: 50, y: 50 }, end: { x: 50, y: 85 }, arrow: { x: 50, y: 67, dir: "↓" } }
    ]
  },
  Z: {
    character: "Z", word: "Zebra", emoji: "🦓", hint: "Z is for Zebra",
    strokes: [
      { order: 1, path: "M 20 15 L 80 15", start: { x: 20, y: 15 }, end: { x: 80, y: 15 }, arrow: { x: 50, y: 15, dir: "→" } },
      { order: 2, path: "M 80 15 L 20 85", start: { x: 80, y: 15 }, end: { x: 20, y: 85 }, arrow: { x: 50, y: 50, dir: "↙" } },
      { order: 3, path: "M 20 85 L 80 85", start: { x: 20, y: 85 }, end: { x: 80, y: 85 }, arrow: { x: 50, y: 85, dir: "→" } }
    ]
  }
};

export const NUMBER_TRACING = {
  "1": {
    character: "1", word: "One Star", emoji: "⭐", hint: "Trace number 1",
    strokes: [
      { order: 1, path: "M 35 30 L 50 15 L 50 85", start: { x: 35, y: 30 }, end: { x: 50, y: 85 }, arrow: { x: 50, y: 50, dir: "↓" } },
      { order: 2, path: "M 30 85 L 70 85", start: { x: 30, y: 85 }, end: { x: 70, y: 85 }, arrow: { x: 50, y: 85, dir: "→" } }
    ]
  },
  "2": {
    character: "2", word: "Two Apples", emoji: "🍎", hint: "Trace number 2",
    strokes: [
      { order: 1, path: "M 25 30 C 25 10, 75 10, 75 35 C 75 55, 25 85, 25 85", start: { x: 25, y: 30 }, end: { x: 25, y: 85 }, arrow: { x: 60, y: 25, dir: "⤵" } },
      { order: 2, path: "M 25 85 L 75 85", start: { x: 25, y: 85 }, end: { x: 75, y: 85 }, arrow: { x: 50, y: 85, dir: "→" } }
    ]
  },
  "3": {
    character: "3", word: "Three Cats", emoji: "🐱", hint: "Trace number 3",
    strokes: [
      { order: 1, path: "M 25 20 L 70 20 L 45 48", start: { x: 25, y: 20 }, end: { x: 45, y: 48 }, arrow: { x: 48, y: 20, dir: "→" } },
      { order: 2, path: "M 45 48 C 80 48, 80 85, 25 85", start: { x: 45, y: 48 }, end: { x: 25, y: 85 }, arrow: { x: 65, y: 66, dir: "⤵" } }
    ]
  },
  "4": {
    character: "4", word: "Four Balls", emoji: "⚽", hint: "Trace number 4",
    strokes: [
      { order: 1, path: "M 60 15 L 20 60 L 75 60", start: { x: 60, y: 15 }, end: { x: 75, y: 60 }, arrow: { x: 40, y: 37, dir: "↙" } },
      { order: 2, path: "M 60 15 L 60 85", start: { x: 60, y: 15 }, end: { x: 60, y: 85 }, arrow: { x: 60, y: 50, dir: "↓" } }
    ]
  },
  "5": {
    character: "5", word: "Five Fish", emoji: "🐟", hint: "Trace number 5",
    strokes: [
      { order: 1, path: "M 70 18 L 30 18 L 30 45", start: { x: 70, y: 18 }, end: { x: 30, y: 45 }, arrow: { x: 50, y: 18, dir: "←" } },
      { order: 2, path: "M 30 45 C 80 40, 80 85, 25 85", start: { x: 30, y: 45 }, end: { x: 25, y: 85 }, arrow: { x: 60, y: 65, dir: "⤵" } }
    ]
  },
  "6": {
    character: "6", word: "Six Ducks", emoji: "🦆", hint: "Trace number 6",
    strokes: [
      { order: 1, path: "M 65 20 C 30 20, 20 50, 20 65 C 20 85, 75 85, 75 62 C 75 42, 20 48, 20 65", start: { x: 65, y: 20 }, end: { x: 20, y: 65 }, arrow: { x: 28, y: 40, dir: "↙" } }
    ]
  },
  "7": {
    character: "7", word: "Seven Stars", emoji: "✨", hint: "Trace number 7",
    strokes: [
      { order: 1, path: "M 25 18 L 75 18 L 35 85", start: { x: 25, y: 18 }, end: { x: 35, y: 85 }, arrow: { x: 50, y: 18, dir: "→" } }
    ]
  },
  "8": {
    character: "8", word: "Eight Bees", emoji: "🐝", hint: "Trace number 8",
    strokes: [
      { order: 1, path: "M 50 15 C 25 15, 25 48, 50 50 C 75 52, 75 85, 50 85 C 25 85, 25 52, 50 50 C 75 48, 75 15, 50 15", start: { x: 50, y: 15 }, end: { x: 50, y: 15 }, arrow: { x: 32, y: 30, dir: "↺" } }
    ]
  },
  "9": {
    character: "9", word: "Nine Balloons", emoji: "🎈", hint: "Trace number 9",
    strokes: [
      { order: 1, path: "M 75 38 C 75 15, 20 15, 20 38 C 20 60, 75 60, 75 38 L 75 85", start: { x: 75, y: 38 }, end: { x: 75, y: 85 }, arrow: { x: 45, y: 20, dir: "↺" } }
    ]
  },
  "10": {
    character: "10", word: "Ten Flowers", emoji: "🌸", hint: "Trace number 10",
    strokes: [
      { order: 1, path: "M 20 30 L 30 15 L 30 85", start: { x: 20, y: 30 }, end: { x: 30, y: 85 }, arrow: { x: 30, y: 50, dir: "↓" } },
      { order: 2, path: "M 65 15 C 45 15, 45 85, 65 85 C 85 85, 85 15, 65 15", start: { x: 65, y: 15 }, end: { x: 65, y: 15 }, arrow: { x: 50, y: 50, dir: "↺" } }
    ]
  },
  "11": {
    character: "11", word: "Eleven Hearts", emoji: "❤️", hint: "Trace number 11",
    strokes: [
      { order: 1, path: "M 25 30 L 38 15 L 38 85", start: { x: 25, y: 30 }, end: { x: 38, y: 85 }, arrow: { x: 38, y: 50, dir: "↓" } },
      { order: 2, path: "M 62 30 L 75 15 L 75 85", start: { x: 62, y: 30 }, end: { x: 75, y: 85 }, arrow: { x: 75, y: 50, dir: "↓" } }
    ]
  },
  "12": {
    character: "12", word: "Twelve Gems", emoji: "💎", hint: "Trace number 12",
    strokes: [
      { order: 1, path: "M 15 30 L 28 15 L 28 85", start: { x: 15, y: 30 }, end: { x: 28, y: 85 }, arrow: { x: 28, y: 50, dir: "↓" } },
      { order: 2, path: "M 45 30 C 45 10, 85 10, 85 35 C 85 55, 45 85, 85 85", start: { x: 45, y: 30 }, end: { x: 85, y: 85 }, arrow: { x: 70, y: 25, dir: "⤵" } }
    ]
  },
  "13": {
    character: "13", word: "Thirteen Coins", emoji: "🪙", hint: "Trace number 13",
    strokes: [
      { order: 1, path: "M 15 30 L 28 15 L 28 85", start: { x: 15, y: 30 }, end: { x: 28, y: 85 }, arrow: { x: 28, y: 50, dir: "↓" } },
      { order: 2, path: "M 45 20 L 85 20 L 62 48 C 90 48, 90 85, 45 85", start: { x: 45, y: 20 }, end: { x: 45, y: 85 }, arrow: { x: 65, y: 20, dir: "→" } }
    ]
  },
  "14": {
    character: "14", word: "Fourteen Flags", emoji: "🚩", hint: "Trace number 14",
    strokes: [
      { order: 1, path: "M 15 30 L 28 15 L 28 85", start: { x: 15, y: 30 }, end: { x: 28, y: 85 }, arrow: { x: 28, y: 50, dir: "↓" } },
      { order: 2, path: "M 75 15 L 45 60 L 88 60", start: { x: 75, y: 15 }, end: { x: 88, y: 60 }, arrow: { x: 60, y: 37, dir: "↙" } },
      { order: 3, path: "M 75 15 L 75 85", start: { x: 75, y: 15 }, end: { x: 75, y: 85 }, arrow: { x: 75, y: 50, dir: "↓" } }
    ]
  },
  "15": {
    character: "15", word: "Fifteen Sweets", emoji: "🍬", hint: "Trace number 15",
    strokes: [
      { order: 1, path: "M 15 30 L 28 15 L 28 85", start: { x: 15, y: 30 }, end: { x: 28, y: 85 }, arrow: { x: 28, y: 50, dir: "↓" } },
      { order: 2, path: "M 82 18 L 50 18 L 50 45 C 90 40, 90 85, 45 85", start: { x: 82, y: 18 }, end: { x: 45, y: 85 }, arrow: { x: 66, y: 18, dir: "←" } }
    ]
  },
  "16": {
    character: "16", word: "Sixteen Books", emoji: "📚", hint: "Trace number 16",
    strokes: [
      { order: 1, path: "M 15 30 L 28 15 L 28 85", start: { x: 15, y: 30 }, end: { x: 28, y: 85 }, arrow: { x: 28, y: 50, dir: "↓" } },
      { order: 2, path: "M 80 20 C 55 20, 48 50, 48 65 C 48 85, 88 85, 88 62 C 88 42, 48 48, 48 65", start: { x: 80, y: 20 }, end: { x: 48, y: 65 }, arrow: { x: 54, y: 40, dir: "↙" } }
    ]
  },
  "17": {
    character: "17", word: "Seventeen Leaves", emoji: "🍃", hint: "Trace number 17",
    strokes: [
      { order: 1, path: "M 15 30 L 28 15 L 28 85", start: { x: 15, y: 30 }, end: { x: 28, y: 85 }, arrow: { x: 28, y: 50, dir: "↓" } },
      { order: 2, path: "M 48 18 L 88 18 L 55 85", start: { x: 48, y: 18 }, end: { x: 55, y: 85 }, arrow: { x: 68, y: 18, dir: "→" } }
    ]
  },
  "18": {
    character: "18", word: "Eighteen Bells", emoji: "🔔", hint: "Trace number 18",
    strokes: [
      { order: 1, path: "M 15 30 L 28 15 L 28 85", start: { x: 15, y: 30 }, end: { x: 28, y: 85 }, arrow: { x: 28, y: 50, dir: "↓" } },
      { order: 2, path: "M 68 15 C 48 15, 48 48, 68 50 C 88 52, 88 85, 68 85 C 48 85, 48 52, 68 50 C 88 48, 88 15, 68 15", start: { x: 68, y: 15 }, end: { x: 68, y: 15 }, arrow: { x: 55, y: 30, dir: "↺" } }
    ]
  },
  "19": {
    character: "19", word: "Nineteen Gifts", emoji: "🎁", hint: "Trace number 19",
    strokes: [
      { order: 1, path: "M 15 30 L 28 15 L 28 85", start: { x: 15, y: 30 }, end: { x: 28, y: 85 }, arrow: { x: 28, y: 50, dir: "↓" } },
      { order: 2, path: "M 88 38 C 88 15, 48 15, 48 38 C 48 60, 88 60, 88 38 L 88 85", start: { x: 88, y: 38 }, end: { x: 88, y: 85 }, arrow: { x: 68, y: 20, dir: "↺" } }
    ]
  },
  "20": {
    character: "20", word: "Twenty Crowns", emoji: "👑", hint: "Trace number 20",
    strokes: [
      { order: 1, path: "M 12 30 C 12 10, 42 10, 42 35 C 42 55, 12 85, 42 85", start: { x: 12, y: 30 }, end: { x: 42, y: 85 }, arrow: { x: 30, y: 25, dir: "⤵" } },
      { order: 2, path: "M 70 15 C 52 15, 52 85, 70 85 C 88 85, 88 15, 70 15", start: { x: 70, y: 15 }, end: { x: 70, y: 15 }, arrow: { x: 58, y: 50, dir: "↺" } }
    ]
  }
};

export const SHAPE_TRACING = {
  circle: {
    character: "Circle", word: "Circle", emoji: "⭕", hint: "Trace a round Circle",
    strokes: [
      { order: 1, path: "M 50 15 C 15 15, 15 85, 50 85 C 85 85, 85 15, 50 15", start: { x: 50, y: 15 }, end: { x: 50, y: 15 }, arrow: { x: 20, y: 50, dir: "↺" } }
    ]
  },
  square: {
    character: "Square", word: "Square", emoji: "⬜", hint: "Trace a 4-sided Square",
    strokes: [
      { order: 1, path: "M 20 20 L 80 20 L 80 80 L 20 80 Z", start: { x: 20, y: 20 }, end: { x: 20, y: 20 }, arrow: { x: 50, y: 20, dir: "→" } }
    ]
  },
  triangle: {
    character: "Triangle", word: "Triangle", emoji: "🔺", hint: "Trace a 3-sided Triangle",
    strokes: [
      { order: 1, path: "M 50 15 L 15 85 L 85 85 Z", start: { x: 50, y: 15 }, end: { x: 50, y: 15 }, arrow: { x: 32, y: 50, dir: "↙" } }
    ]
  },
  rectangle: {
    character: "Rectangle", word: "Rectangle", emoji: "▭", hint: "Trace a wide Rectangle",
    strokes: [
      { order: 1, path: "M 15 30 L 85 30 L 85 70 L 15 70 Z", start: { x: 15, y: 30 }, end: { x: 15, y: 30 }, arrow: { x: 50, y: 30, dir: "→" } }
    ]
  },
  star: {
    character: "Star", word: "Star", emoji: "⭐", hint: "Trace a shiny Star",
    strokes: [
      { order: 1, path: "M 50 10 L 63 38 L 93 38 L 68 56 L 78 85 L 50 66 L 22 85 L 32 56 L 7 38 L 37 38 Z", start: { x: 50, y: 10 }, end: { x: 50, y: 10 }, arrow: { x: 57, y: 24, dir: "↘" } }
    ]
  },
  heart: {
    character: "Heart", word: "Heart", emoji: "❤️", hint: "Trace a lovely Heart",
    strokes: [
      { order: 1, path: "M 50 30 C 50 15, 20 10, 20 38 C 20 62, 50 85, 50 85 C 50 85, 80 62, 80 38 C 80 10, 50 15, 50 30", start: { x: 50, y: 30 }, end: { x: 50, y: 30 }, arrow: { x: 28, y: 22, dir: "↺" } }
    ]
  },
  oval: {
    character: "Oval", word: "Oval", emoji: "⬭", hint: "Trace an egg-shaped Oval",
    strokes: [
      { order: 1, path: "M 50 20 C 15 20, 15 80, 50 80 C 85 80, 85 20, 50 20", start: { x: 50, y: 20 }, end: { x: 50, y: 20 }, arrow: { x: 20, y: 50, dir: "↺" } }
    ]
  },
  diamond: {
    character: "Diamond", word: "Diamond", emoji: "◇", hint: "Trace a bright Diamond",
    strokes: [
      { order: 1, path: "M 50 15 L 85 50 L 50 85 L 15 50 Z", start: { x: 50, y: 15 }, end: { x: 50, y: 15 }, arrow: { x: 67, y: 32, dir: "↘" } }
    ]
  }
};
