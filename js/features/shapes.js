import { h, esc, shuffle, pick, sample, byId, repeatEmoji, fmtTime } from "../core/dom.js";
import { DATA } from "../data/index.js";
import { Store } from "../core/store.js";
import { UI, Routes } from "../core/router.js";
import { AudioService } from "../core/audio-service.js";
import { FX } from "../core/fx.js";
import { Rewards } from "../core/rewards.js";
import { speakerBtn, backLink } from "../widgets/speaker-button.js";
import { shapeSVG } from "../widgets/shape-svg.js";

/* ------------------------------ SHAPES --------------------------------- */
Routes.shapes = function(p){
  var i = Math.max(0, Math.min(DATA.shapes.length-1, p.index|0));
  var s = DATA.shapes[i];
  Store.markSeen("shapes", s.id);
  UI.setTitle("🔷 Shapes", s.name);

  var wrap = h('<div></div>');
  var strip = h('<div class="strip" aria-label="Shapes"></div>');
  DATA.shapes.forEach(function(S, idx){
    var b = h('<button class="chip" style="padding:6px" aria-label="'+S.name+'" '+(idx===i?'aria-current="true"':'')+'>'+
      shapeSVG(S,"30px")+(Store.isSeen("shapes",S.id)?'<span class="done">⭐</span>':'')+'</button>');
    b.addEventListener("click", function(){ AudioService.effect("tap"); UI.setParams({index:idx}); });
    strip.appendChild(b);
  });
  wrap.appendChild(strip);

  var card = h('<div class="stage-card">'+
      '<div class="glow" style="background:'+s.hue+'"></div>'+
      '<button id="ll-shape" style="background:none;display:block;margin:0 auto" aria-label="'+s.name+'">'+shapeSVG(s)+'</button>'+
      '<div class="word">'+s.name.toUpperCase()+'</div>'+
      '<div class="sentence">This is a '+s.name.toLowerCase()+'.</div>'+
      '<div class="examples" id="ll-ex"></div>'+
    '</div>');
  wrap.appendChild(card);
  var shapeEl = card.querySelector("#ll-shape");
  shapeEl.addEventListener("click", function(){ FX.bounce(shapeEl); AudioService.say(s.name,{rate:0.7}); });
  var exHost = card.querySelector("#ll-ex");
  s.ex.forEach(function(e){
    var b = h('<button class="ex"><span class="e">'+e[0]+'</span><span class="n">'+esc(e[1])+'</span></button>');
    b.addEventListener("click", function(){ FX.bounce(b); AudioService.say("A "+e[1]+" is a "+s.name,{rate:0.75}); });
    exHost.appendChild(b);
  });

  var sp = h('<div style="text-align:center"></div>');
  sp.appendChild(speakerBtn('Say "'+s.name+'"', s.name + ". A " + s.ex[0][1].toLowerCase() + " is a " + s.name.toLowerCase(), {rate:0.72}));
  wrap.appendChild(sp);

  var nav = h('<div class="navrow"></div>');
  var prev = h('<button class="btn ghost" '+(i===0?'disabled':'')+'>⬅️ Back</button>');
  var next = h('<button class="btn sun">'+(i===DATA.shapes.length-1?'Finish 🎉':'Next ➡️')+'</button>');
  prev.addEventListener("click", function(){ AudioService.effect("page"); UI.setParams({index:i-1}); });
  next.addEventListener("click", function(){
    AudioService.effect("page");
    if(i===DATA.shapes.length-1){ FX.confetti(80); Rewards.star(2,next); UI.toast("🎉 All shapes learned!"); UI.go("quiz",{mod:"shapes"}); }
    else UI.setParams({index:i+1});
  });
  nav.appendChild(prev); nav.appendChild(next);
  wrap.appendChild(nav);

  var qz = h('<button class="btn grape" style="width:100%;margin-top:12px">🧠 Shape Quiz</button>');
  qz.addEventListener("click", function(){ AudioService.effect("tap"); UI.go("quiz",{mod:"shapes"}); });
  wrap.appendChild(qz);

  setTimeout(function(){
    var cur = strip.querySelector('[aria-current="true"]');
    if(cur && cur.scrollIntoView) cur.scrollIntoView({inline:"center", block:"nearest"});
  },80);
  return wrap;
};
