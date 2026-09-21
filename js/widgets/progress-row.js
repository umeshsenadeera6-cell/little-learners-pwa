import { h } from "../core/dom.js";
import { Store } from "../core/store.js";

/* ProgressBar row + the fill animation used on Home, Progress and Parent. */
export function progressRow(m){
  var pct = Store.pct(m.id);
  var row = h('<div class="prow">'+
      '<span class="emo">'+m.emoji+'</span>'+
      '<span><span class="lab">'+m.name+'</span><span class="pbar" style="display:block;margin-top:5px"><span data-pct="'+pct+'"></span></span></span>'+
      '<span class="val">'+pct+'%</span>'+
    '</div>');
  return row;
}
export function animateBars(root){
  Array.prototype.forEach.call(root.querySelectorAll(".pbar>span"), function(b){
    b.style.width = (b.dataset.pct||0)+"%";
  });
}
