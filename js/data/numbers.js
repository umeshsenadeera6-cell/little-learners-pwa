/* Little Learners — content data. Add a lesson here; no screen changes needed. */

export const numbers = [
  [1,"One","🍎"],[2,"Two","🍌"],[3,"Three","⭐"],[4,"Four","🐟"],[5,"Five","🍓"],
  [6,"Six","🎈"],[7,"Seven","🌸"],[8,"Eight","🐝"],[9,"Nine","🍇"],[10,"Ten","🐢"],
  [11,"Eleven","🍀"],[12,"Twelve","🚗"],[13,"Thirteen","🦋"],[14,"Fourteen","🍪"],[15,"Fifteen","🌻"],
  [16,"Sixteen","🐞"],[17,"Seventeen","🍋"],[18,"Eighteen","🐠"],[19,"Nineteen","🎁"],[20,"Twenty","🏀"]
].map(function(r){
  return { id:String(r[0]), value:r[0], name:r[1], emoji:r[2],
           audio:"assets/audio/numbers/"+r[0]+".mp3" };
});
