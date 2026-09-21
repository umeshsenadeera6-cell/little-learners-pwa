import { h, esc, shuffle, pick, sample, byId, repeatEmoji, fmtTime } from "../core/dom.js";
import { DATA } from "../data/index.js";
import { Store } from "../core/store.js";
import { UI, Routes } from "../core/router.js";
import { AudioService } from "../core/audio-service.js";
import { FX } from "../core/fx.js";
import { Rewards } from "../core/rewards.js";
import { speakerBtn, backLink } from "../widgets/speaker-button.js";

/* ------------------------------- ABC ----------------------------------- */
Routes.abc = function(p){
  var i = Math.max(0, Math.min(DATA.alphabet.length-1, p.index|0));
  var item = DATA.alphabet[i];
  Store.markSeen("abc", item.id);
  UI.setTitle("🔤 ABC", "Letter " + (i+1) + " of 26");

  var wrap = h('<div></div>');

  /* alphabet strip */
  var strip = h('<div class="strip" aria-label="Alphabet"></div>');
  DATA.alphabet.forEach(function(L, idx){
    var c = h('<button class="chip" '+(idx===i?'aria-current="true"':'')+'>'+L.letter+
      (Store.isSeen("abc",L.id)?'<span class="done">⭐</span>':'')+'</button>');
    c.addEventListener("click", function(){ AudioService.effect("tap"); UI.setParams({index:idx}); });
    strip.appendChild(c);
  });
  wrap.appendChild(strip);

  /* stage */
  var card = h('<div class="stage-card">'+
      '<div class="glow" style="background:var(--sun)"></div>'+
      '<button id="ll-letter" class="bigletter" style="color:var(--coral)" aria-label="Letter '+item.letter+'">'+item.letter+'<small>'+item.lowercase+'</small></button>'+
      '<div><button id="ll-emoji" class="bigemoji" aria-label="'+esc(item.word)+'">'+item.emoji+'</button></div>'+
      '<div class="word">'+esc(item.word)+'</div>'+
      '<div class="sentence">'+esc(item.word)+' starts with '+item.letter+'.</div>'+
      '<div class="tap-hint">👆 Tap the letter or the picture</div>'+
    '</div>');
  wrap.appendChild(card);

  var letterEl = card.querySelector("#ll-letter");
  var emojiEl = card.querySelector("#ll-emoji");
  letterEl.addEventListener("click", function(){
    FX.bounce(letterEl); FX.wiggle(emojiEl);
    AudioService.say(item.letter + ". " + item.letter, {asset:item.audio, rate:0.6});
  });
  emojiEl.addEventListener("click", function(){
    FX.bounce(emojiEl);
    AudioService.say(item.word, {rate:0.8});
  });

  var spRow = h('<div style="text-align:center"></div>');
  spRow.appendChild(speakerBtn('Say "'+item.letter+'"', item.letter+". "+item.word+". "+item.word+" starts with "+item.letter, {asset:item.audio, rate:0.7}));
  wrap.appendChild(spRow);

  /* nav */
  var nav = h('<div class="navrow"></div>');
  var prev = h('<button class="btn ghost" '+(i===0?'disabled':'')+'>⬅️ Back</button>');
  var next = h('<button class="btn sun">'+(i===25?'Finish 🎉':'Next ➡️')+'</button>');
  prev.addEventListener("click", function(){ AudioService.effect("page"); UI.setParams({index:i-1}); });
  next.addEventListener("click", function(){
    AudioService.effect("page");
    if(i===25){ FX.confetti(90); AudioService.effect("reward"); Rewards.star(2, next); UI.toast("🎉 You finished the alphabet!"); UI.go("quiz",{mod:"abc"}); }
    else UI.setParams({index:i+1});
  });
  nav.appendChild(prev); nav.appendChild(next);
  wrap.appendChild(nav);

  var qz = h('<button class="btn grape" style="width:100%;margin-top:12px">🧠 Letter Quiz</button>');
  qz.addEventListener("click", function(){ AudioService.effect("tap"); UI.go("quiz",{mod:"abc"}); });
  wrap.appendChild(qz);

  setTimeout(function(){
    var cur = strip.querySelector('[aria-current="true"]');
    if(cur && cur.scrollIntoView) cur.scrollIntoView({inline:"center", block:"nearest"});
    FX.bounce(letterEl);
  }, 80);
  return wrap;
};
