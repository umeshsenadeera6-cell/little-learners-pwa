/* Little Learners — content data. Add a lesson here; no screen changes needed. */

export const wordGroups = [
  {id:"food",name:"Food",emoji:"🍽️"},
  {id:"family",name:"Family",emoji:"👨‍👩‍👧"},
  {id:"objects",name:"Objects",emoji:"🧸"},
  {id:"nature",name:"Nature",emoji:"🌿"}
];

export const words = [
  ["Apple","food","🍎","I eat a red apple."],
  ["Banana","food","🍌","The banana is yellow."],
  ["Milk","food","🥛","I drink my milk."],
  ["Bread","food","🍞","Bread is soft and warm."],
  ["Cake","food","🎂","The cake is for my birthday."],
  ["Mom","family","👩","My mom hugs me."],
  ["Dad","family","👨","My dad reads to me."],
  ["Baby","family","👶","The baby is sleeping."],
  ["Brother","family","👦","My brother plays with me."],
  ["Sister","family","👧","My sister sings a song."],
  ["Book","objects","📕","I read my book."],
  ["Ball","objects","⚽","I kick the ball."],
  ["Chair","objects","🪑","I sit on the chair."],
  ["Table","objects","🪵","My lunch is on the table."],
  ["Car","objects","🚗","The car goes beep beep."],
  ["Sun","nature","☀️","The sun is bright."],
  ["Moon","nature","🌙","The moon comes at night."],
  ["Tree","nature","🌳","This is a tree."],
  ["Flower","nature","🌷","The flower smells sweet."],
  ["Cloud","nature","☁️","The cloud is white and fluffy."]
].map(function(r){
  return { id:r[0].toLowerCase(), word:r[0], category:r[1], emoji:r[2], sentence:r[3],
           audio:"assets/audio/words/"+r[0].toLowerCase()+".mp3" };
});
