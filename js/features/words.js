import { h, esc, shuffle, pick, sample, byId, repeatEmoji, fmtTime } from "../core/dom.js";
import { DATA } from "../data/index.js";
import { Store } from "../core/store.js";
import { UI, Routes } from "../core/router.js";
import { AudioService } from "../core/audio-service.js";
import { FX } from "../core/fx.js";
import { Rewards } from "../core/rewards.js";
import { speakerBtn, backLink } from "../widgets/speaker-button.js";

/* ------------------------------- WORDS --------------------------------- */
Routes.words = function(p){
  var cat = p.cat || DATA.wordGroups[0].id;
  UI.setTitle("📚 Words", (byId(DATA.wordGroups,cat)||{}).name);
  var wrap = h('<div></div>');

  var tabs = h('<div class="pill-tabs" role="tablist"></div>');
  DATA.wordGroups.forEach(function(g){
    var b = h('<button class="pill" role="tab" aria-selected="'+(g.id===cat)+'">'+g.emoji+' '+g.name+'</button>');
    b.addEventListener("click", function(){ AudioService.effect("tap"); UI.setParams({cat:g.id}); });
    tabs.appendChild(b);
  });
  wrap.appendChild(tabs);

  var list = DATA.words.filter(function(w){return w.category===cat;});
  var grid = h('<div class="tile-grid"></div>');
  list.forEach(function(w, idx){
    var t = h('<button class="tile"><span class="e">'+w.emoji+'</span><span class="n">'+w.word+'</span>'+
      (Store.isSeen("words",w.id)?'<span class="done">⭐</span>':'')+'</button>');
    t.addEventListener("click", function(){ AudioService.effect("pop"); UI.go("word",{cat:cat,index:idx}); });
    grid.appendChild(t);
  });
  wrap.appendChild(grid);

  wrap.appendChild(h('<h2 class="section-title">✨ Try this</h2>'));
  var g1 = h('<button class="row-item"><span class="e">🧩</span><span class="t">Match the words</span><span class="m">Play ›</span></button>');
  g1.addEventListener("click", function(){ UI.go("game_match",{}); });
  wrap.appendChild(g1);
  return wrap;
};

Routes.word = function(p){
  var list = DATA.words.filter(function(w){return w.category===p.cat;});
  var i = Math.max(0, Math.min(list.length-1, p.index|0));
  var w = list[i];
  Store.markSeen("words", w.id);
  UI.setTitle(w.emoji + " " + w.word, (byId(DATA.wordGroups,p.cat)||{}).name);

  var wrap = h('<div></div>');
  var card = h('<div class="stage-card">'+
      '<div class="glow" style="background:var(--mint)"></div>'+
      '<button id="ll-w" class="bigemoji" aria-label="'+w.word+'">'+w.emoji+'</button>'+
      '<div class="word">'+w.word+'</div>'+
      '<div class="sentence">"'+esc(w.sentence)+'"</div>'+
      '<div class="tap-hint">👆 Tap the picture to hear the word</div>'+
    '</div>');
  wrap.appendChild(card);
  var wEl = card.querySelector("#ll-w");
  wEl.addEventListener("click", function(){ FX.bounce(wEl); AudioService.say(w.word, {asset:w.audio, rate:0.7}); });

  var sp = h('<div style="text-align:center;display:flex;gap:10px;justify-content:center;flex-wrap:wrap"></div>');
  sp.appendChild(speakerBtn(w.word, w.word, {asset:w.audio, rate:0.7}));
  var sentBtn = h('<button class="speaker" style="background:var(--bubble);color:#4A1030">🔊 <span>Sentence</span></button>');
  sentBtn.addEventListener("click", function(){ AudioService.say(w.sentence, {rate:0.75}); });
  sp.appendChild(sentBtn);
  wrap.appendChild(sp);

  var nav = h('<div class="navrow"></div>');
  var prev = h('<button class="btn ghost" '+(i===0?'disabled':'')+'>⬅️ Back</button>');
  var next = h('<button class="btn sun">'+(i===list.length-1?'Done 🎉':'Next ➡️')+'</button>');
  prev.addEventListener("click", function(){ AudioService.effect("page"); UI.setParams({cat:p.cat,index:i-1}); });
  next.addEventListener("click", function(){
    AudioService.effect("page");
    if(i===list.length-1){ FX.confetti(70); Rewards.star(1,next); UI.back(); }
    else UI.setParams({cat:p.cat,index:i+1});
  });
  nav.appendChild(prev); nav.appendChild(next);
  wrap.appendChild(nav);
  return wrap;
};
