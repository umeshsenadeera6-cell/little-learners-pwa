import { h, esc } from "../core/dom.js";
import { AudioService } from "../core/audio-service.js";
import { UI } from "../core/router.js";

/* AudioButton — every learning item gets one. */
export function speakerBtn(label, text, opts){
  var b = h('<button class="speaker" aria-label="Hear '+esc(label)+'">🔊 <span>'+esc(label)+'</span></button>');
  b.addEventListener("click", function(){
    b.classList.remove("playing"); void b.offsetWidth; b.classList.add("playing");
    AudioService.say(text, opts||{});
  });
  return b;
}
export function backLink(text, handler){
  var b = h('<button class="back-btn">⬅️ '+esc(text)+'</button>');
  b.addEventListener("click", function(){ AudioService.effect("page"); handler ? handler() : UI.back(); });
  return b;
}
