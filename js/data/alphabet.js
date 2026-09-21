/* Little Learners — content data. Add a lesson here; no screen changes needed. */

export const alphabet = [
  ["A","a","Apple","🍎"],["B","b","Ball","⚽"],["C","c","Cat","🐱"],["D","d","Dog","🐶"],
  ["E","e","Elephant","🐘"],["F","f","Fish","🐠"],["G","g","Grapes","🍇"],["H","h","Hat","🎩"],
  ["I","i","Ice cream","🍦"],["J","j","Juice","🧃"],["K","k","Kite","🪁"],["L","l","Lion","🦁"],
  ["M","m","Moon","🌙"],["N","n","Nest","🪺"],["O","o","Orange","🍊"],["P","p","Penguin","🐧"],
  ["Q","q","Queen","👑"],["R","r","Rainbow","🌈"],["S","s","Sun","☀️"],["T","t","Tree","🌳"],
  ["U","u","Umbrella","☂️"],["V","v","Van","🚐"],["W","w","Watermelon","🍉"],["X","x","Xylophone","🎼"],
  ["Y","y","Yo-yo","🪀"],["Z","z","Zebra","🦓"]
].map(function(r){
  return { id:r[0], letter:r[0], lowercase:r[1], word:r[2], emoji:r[3],
           image:"assets/images/"+r[2].toLowerCase().replace(/ /g,"_")+".png",
           audio:"assets/audio/letters/"+r[0].toLowerCase()+".mp3" };
});
