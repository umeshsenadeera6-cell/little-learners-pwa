import { h, esc, shuffle, pick, sample, byId, repeatEmoji, fmtTime } from "../core/dom.js";
import { DATA } from "../data/index.js";
import { Store } from "../core/store.js";
import { UI, Routes } from "../core/router.js";
import { AudioService } from "../core/audio-service.js";
import { FX } from "../core/fx.js";
import { Rewards } from "../core/rewards.js";
import { speakerBtn, backLink } from "../widgets/speaker-button.js";

/* ----------------------------- ANIMALS --------------------------------- */
Routes.animals = function(p){
  var group = p.group || null;
  UI.setTitle("🐶 Animals", group ? (byId(DATA.animalGroups,group)||{}).name : "Choose a group");
  var wrap = h('<div></div>');

  if(!group){
    wrap.appendChild(h('<div class="hero-banner" style="background:linear-gradient(135deg,var(--leaf),var(--mint))"><h2>Meet the animals</h2><p>25 friendly animals are waiting to say hello.</p><span class="big floaty">🦁</span></div>'));
    var grid = h('<div class="cat-grid" style="margin-top:16px"></div>');
    DATA.animalGroups.forEach(function(g){
      var list = DATA.animals.filter(function(a){return a.category===g.id;});
      var seen = list.filter(function(a){return Store.isSeen("animals",a.id);}).length;
      var c = h('<button class="cat" style="background:'+g.colour+'">'+
        '<span class="blob"></span><span class="ring"></span>'+
        '<span class="pct">'+seen+'/'+list.length+'</span>'+
        '<span class="emo">'+list[0].emoji+list[1].emoji+'</span>'+
        '<span class="name">'+g.name.split(" ")[0]+'</span>'+
        '<span class="hint">'+list.length+' animals</span></button>');
      c.addEventListener("click", function(){ AudioService.effect("pop"); UI.go("animals",{group:g.id}); });
      grid.appendChild(c);
    });
    wrap.appendChild(grid);

    var qz = h('<button class="btn grape" style="width:100%;margin-top:18px">🧠 Animal Quiz</button>');
    qz.addEventListener("click", function(){ AudioService.effect("tap"); UI.go("quiz",{mod:"animals"}); });
    wrap.appendChild(qz);
    return wrap;
  }

  var list = DATA.animals.filter(function(a){return a.category===group;});
  var tiles = h('<div class="tile-grid"></div>');
  list.forEach(function(a, idx){
    var t = h('<button class="tile"><span class="e">'+a.emoji+'</span><span class="n">'+a.name+'</span>'+
      (Store.isSeen("animals",a.id)?'<span class="done">⭐</span>':'')+'</button>');
    t.addEventListener("click", function(){ AudioService.effect("pop"); UI.go("animal",{group:group,index:idx}); });
    tiles.appendChild(t);
  });
  wrap.appendChild(tiles);
  var qz2 = h('<button class="btn grape" style="width:100%;margin-top:18px">🧠 Animal Quiz</button>');
  qz2.addEventListener("click", function(){ AudioService.effect("tap"); UI.go("quiz",{mod:"animals"}); });
  wrap.appendChild(qz2);
  return wrap;
};

Routes.animal = function(p){
  var list = DATA.animals.filter(function(a){return a.category===p.group;});
  var i = Math.max(0, Math.min(list.length-1, p.index|0));
  var a = list[i];
  Store.markSeen("animals", a.id);
  UI.setTitle(a.emoji + " " + a.name, (byId(DATA.animalGroups,p.group)||{}).name);

  var wrap = h('<div></div>');
  var card = h('<div class="stage-card">'+
      '<div class="glow" style="background:var(--leaf)"></div>'+
      '<button id="ll-a" class="bigemoji floaty" aria-label="'+a.name+'">'+a.emoji+'</button>'+
      '<div class="word">'+a.name+'</div>'+
      '<div class="sentence">This is a '+a.name.toLowerCase()+'.</div>'+
      '<div class="tap-hint">👆 Tap to hear the sound</div>'+
    '</div>');
  wrap.appendChild(card);
  var aEl = card.querySelector("#ll-a");
  aEl.addEventListener("click", function(){
    FX.wiggle(aEl);
    AudioService.say(a.sound, {asset:a.audio, rate:0.75, pitch:1.4});
  });

  var sp = h('<div style="text-align:center"></div>');
  sp.appendChild(speakerBtn(a.sound, a.name + ". " + a.sound, {asset:a.audio, rate:0.75, pitch:1.4}));
  wrap.appendChild(sp);

  var fact = h('<div class="card" style="margin-top:16px;display:flex;gap:12px;align-items:center">'+
    '<span style="font-size:30px">💡</span><span style="font-weight:900;font-size:15.5px">'+esc(a.fact)+'</span></div>');
  fact.addEventListener("click", function(){ AudioService.say(a.fact, {rate:0.75}); });
  wrap.appendChild(fact);

  var nav = h('<div class="navrow"></div>');
  var prev = h('<button class="btn ghost" '+(i===0?'disabled':'')+'>⬅️ Back</button>');
  var next = h('<button class="btn sun">'+(i===list.length-1?'Done 🎉':'Next ➡️')+'</button>');
  prev.addEventListener("click", function(){ AudioService.effect("page"); UI.setParams({group:p.group,index:i-1}); });
  next.addEventListener("click", function(){
    AudioService.effect("page");
    if(i===list.length-1){ FX.confetti(70); Rewards.star(1,next); UI.back(); }
    else UI.setParams({group:p.group,index:i+1});
  });
  nav.appendChild(prev); nav.appendChild(next);
  wrap.appendChild(nav);

  var qz = h('<button class="btn grape" style="width:100%;margin-top:12px">🧠 Animal Quiz</button>');
  qz.addEventListener("click", function(){ AudioService.effect("tap"); UI.go("quiz",{mod:"animals"}); });
  wrap.appendChild(qz);
  return wrap;
};
