import { h, esc, shuffle, pick, sample, byId, repeatEmoji, fmtTime } from "../core/dom.js";
import { DATA } from "../data/index.js";
import { Store } from "../core/store.js";
import { UI, Routes } from "../core/router.js";
import { AudioService } from "../core/audio-service.js";
import { FX } from "../core/fx.js";
import { Rewards } from "../core/rewards.js";
import { speakerBtn, backLink } from "../widgets/speaker-button.js";

/* ----------------------------- NUMBERS --------------------------------- */
Routes.numbers = function(p){
  var i = Math.max(0, Math.min(DATA.numbers.length-1, p.index|0));
  var item = DATA.numbers[i];
  Store.markSeen("numbers", item.id);
  UI.setTitle("🔢 Numbers", "Number " + item.value + " of 20");

  var wrap = h('<div></div>');

  var strip = h('<div class="strip" aria-label="Numbers"></div>');
  DATA.numbers.forEach(function(N, idx){
    var c = h('<button class="chip" '+(idx===i?'aria-current="true"':'')+'>'+N.value+
      (Store.isSeen("numbers",N.id)?'<span class="done">⭐</span>':'')+'</button>');
    c.addEventListener("click", function(){ AudioService.effect("tap"); UI.setParams({index:idx}); });
    strip.appendChild(c);
  });
  wrap.appendChild(strip);

  var card = h('<div class="stage-card">'+
      '<div class="glow" style="background:var(--sky)"></div>'+
      '<button id="ll-num" class="bigletter" style="color:var(--sky)" aria-label="Number '+item.value+'">'+item.value+'</button>'+
      '<div class="word">'+item.name+'</div>'+
      '<div class="count-area" id="ll-objs"></div>'+
      '<div class="sentence" id="ll-counted">Tap each '+esc(item.name.toLowerCase())+' object to count</div>'+
    '</div>');
  wrap.appendChild(card);

  var objs = card.querySelector("#ll-objs");
  var counted = 0;
  var cells = [];
  for(var k=0;k<item.value;k++){
    var o = h('<button class="cobj" aria-label="object '+(k+1)+'">'+item.emoji+'</button>');
    (function(el,idx){
      el.addEventListener("click", function(){
        if(el.classList.contains("lit")) return;
        el.classList.add("lit"); counted++;
        AudioService.say(String(counted), {rate:0.8});
        FX.bounce(el);
        if(counted===item.value){
          card.querySelector("#ll-counted").textContent = item.name + " " + item.emoji + " — well counted!";
          AudioService.effect("correct"); FX.confetti(40);
          setTimeout(function(){ AudioService.say(item.name, {rate:0.75}); }, 400);
        }
      });
    })(o,k);
    objs.appendChild(o); cells.push(o);
  }

  var numEl = card.querySelector("#ll-num");
  numEl.addEventListener("click", function(){ FX.bounce(numEl); AudioService.say(item.name, {asset:item.audio, rate:0.7}); });

  var sp = h('<div style="text-align:center"></div>');
  sp.appendChild(speakerBtn('Say "'+item.name+'"', item.name + ". " + item.value + " " + item.name, {asset:item.audio, rate:0.72}));
  wrap.appendChild(sp);

  var countBtn = h('<button class="btn leaf" style="width:100%;margin-top:14px">👉 Count with me</button>');
  countBtn.addEventListener("click", function(){
    cells.forEach(function(c){ c.classList.remove("lit"); });
    counted = 0;
    var n = 0;
    countBtn.disabled = true;
    var t = setInterval(function(){
      if(n>=cells.length){ clearInterval(t); countBtn.disabled=false; counted=cells.length;
        card.querySelector("#ll-counted").textContent = item.value + " — " + item.name + "!";
        AudioService.say(item.name, {rate:0.75});
        AudioService.effect("correct"); return; }
      cells[n].classList.add("lit"); FX.bounce(cells[n]);
      AudioService.say(String(n+1), {rate:0.85});
      n++;
    }, 720);
  });
  wrap.appendChild(countBtn);

  var nav = h('<div class="navrow"></div>');
  var prev = h('<button class="btn ghost" '+(i===0?'disabled':'')+'>⬅️ Back</button>');
  var next = h('<button class="btn sun">'+(i===DATA.numbers.length-1?'Finish 🎉':'Next ➡️')+'</button>');
  prev.addEventListener("click", function(){ AudioService.effect("page"); UI.setParams({index:i-1}); });
  next.addEventListener("click", function(){
    AudioService.effect("page");
    if(i===DATA.numbers.length-1){ FX.confetti(90); Rewards.star(2,next); UI.toast("🎉 You counted to twenty!"); UI.go("quiz",{mod:"numbers"}); }
    else UI.setParams({index:i+1});
  });
  nav.appendChild(prev); nav.appendChild(next);
  wrap.appendChild(nav);

  var qz = h('<button class="btn grape" style="width:100%;margin-top:12px">🧠 Number Quiz</button>');
  qz.addEventListener("click", function(){ AudioService.effect("tap"); UI.go("quiz",{mod:"numbers"}); });
  wrap.appendChild(qz);

  setTimeout(function(){
    var cur = strip.querySelector('[aria-current="true"]');
    if(cur && cur.scrollIntoView) cur.scrollIntoView({inline:"center", block:"nearest"});
  },80);
  return wrap;
};
