import { h, esc, shuffle, pick, sample, byId, repeatEmoji, fmtTime } from "../core/dom.js";
import { DATA } from "../data/index.js";
import { Store } from "../core/store.js";
import { UI, Routes } from "../core/router.js";
import { AudioService } from "../core/audio-service.js";
import { FX } from "../core/fx.js";
import { Rewards } from "../core/rewards.js";
import { speakerBtn, backLink } from "../widgets/speaker-button.js";

/* ----------------------------- COLOURS --------------------------------- */
Routes.colours = function(p){
  var i = Math.max(0, Math.min(DATA.colours.length-1, p.index|0));
  var c = DATA.colours[i];
  Store.markSeen("colours", c.id);
  UI.setTitle("🎨 Colours", c.name);

  var wrap = h('<div></div>');

  var strip = h('<div class="strip" aria-label="Colours"></div>');
  DATA.colours.forEach(function(C, idx){
    var b = h('<button class="chip" style="background:'+C.hex+';border-color:rgba(0,0,0,.12)" aria-label="'+C.name+'" '+(idx===i?'aria-current="true"':'')+'>'+
      (Store.isSeen("colours",C.id)?'<span class="done">⭐</span>':'&nbsp;')+'</button>');
    b.addEventListener("click", function(){ AudioService.effect("tap"); UI.setParams({index:idx}); });
    strip.appendChild(b);
  });
  wrap.appendChild(strip);

  var card = h('<div class="stage-card">'+
      '<button id="ll-sw" style="display:block;width:min(56vw,220px);margin:6px auto 0;aspect-ratio:1/1;border-radius:36px;background:'+c.hex+';border:6px solid rgba(255,255,255,.75);box-shadow:inset 0 -12px 24px rgba(0,0,0,.14),0 10px 0 var(--press)" aria-label="'+c.name+'"></button>'+
      '<div class="word" style="margin-top:14px">'+c.name.toUpperCase()+'</div>'+
      '<div class="sentence">This colour is '+c.name.toLowerCase()+'.</div>'+
      '<div class="examples" id="ll-ex"></div>'+
    '</div>');
  wrap.appendChild(card);

  var sw = card.querySelector("#ll-sw");
  sw.addEventListener("click", function(){ FX.bounce(sw); AudioService.say(c.name, {rate:0.7}); });

  var exHost = card.querySelector("#ll-ex");
  c.ex.forEach(function(e){
    var b = h('<button class="ex"><span class="e">'+e[0]+'</span><span class="n">'+esc(e[1])+'</span></button>');
    b.addEventListener("click", function(){ FX.bounce(b); AudioService.say(c.name + " " + e[1], {rate:0.78}); });
    exHost.appendChild(b);
  });

  var sp = h('<div style="text-align:center"></div>');
  sp.appendChild(speakerBtn('Say "'+c.name+'"', c.name + ". " + c.ex[0][1] + " is " + c.name.toLowerCase(), {rate:0.72}));
  wrap.appendChild(sp);

  var nav = h('<div class="navrow"></div>');
  var prev = h('<button class="btn ghost" '+(i===0?'disabled':'')+'>⬅️ Back</button>');
  var next = h('<button class="btn sun">'+(i===DATA.colours.length-1?'Finish 🎉':'Next ➡️')+'</button>');
  prev.addEventListener("click", function(){ AudioService.effect("page"); UI.setParams({index:i-1}); });
  next.addEventListener("click", function(){
    AudioService.effect("page");
    if(i===DATA.colours.length-1){ FX.confetti(90); Rewards.star(2,next); UI.toast("🎉 All colours learned!"); UI.go("quiz",{mod:"colours"}); }
    else UI.setParams({index:i+1});
  });
  nav.appendChild(prev); nav.appendChild(next);
  wrap.appendChild(nav);

  wrap.appendChild(h('<h2 class="section-title">🌈 All colours</h2>'));
  var grid = h('<div class="colour-grid"></div>');
  DATA.colours.forEach(function(C, idx){
    var cell = h('<button class="colour-cell"><span class="swatch" style="background:'+C.hex+'"></span><span class="n">'+C.name+'</span></button>');
    cell.addEventListener("click", function(){ AudioService.say(C.name,{rate:.72}); UI.setParams({index:idx}); });
    grid.appendChild(cell);
  });
  wrap.appendChild(grid);

  var qz = h('<button class="btn grape" style="width:100%;margin-top:16px">🧠 Colour Quiz</button>');
  qz.addEventListener("click", function(){ AudioService.effect("tap"); UI.go("quiz",{mod:"colours"}); });
  wrap.appendChild(qz);

  setTimeout(function(){
    var cur = strip.querySelector('[aria-current="true"]');
    if(cur && cur.scrollIntoView) cur.scrollIntoView({inline:"center", block:"nearest"});
  },80);
  return wrap;
};
