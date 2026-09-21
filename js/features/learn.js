import { h, esc, shuffle, pick, sample, byId, repeatEmoji, fmtTime } from "../core/dom.js";
import { DATA } from "../data/index.js";
import { Store } from "../core/store.js";
import { UI, Routes } from "../core/router.js";
import { AudioService } from "../core/audio-service.js";
import { FX } from "../core/fx.js";
import { Rewards } from "../core/rewards.js";

/* ------------------------------- LEARN --------------------------------- */
Routes.learn = function(){
  UI.setTitle("📚 Learn", "Pick a lesson");
  var wrap = h('<div></div>');
  wrap.appendChild(h('<div class="hero-banner" style="background:linear-gradient(135deg,var(--sky),var(--grape))"><h2>Six ways to learn</h2><p>Letters, numbers, colours, animals, shapes and words.</p><span class="big floaty">🎓</span></div>'));
  var grid = h('<div class="cat-grid" style="margin-top:16px"></div>');
  DATA.modules.forEach(function(m){
    var pct = Store.pct(m.id);
    var c = h('<button class="cat" style="background:'+m.bg+'">'+
        '<span class="blob"></span><span class="ring"></span>'+
        '<span class="pct">'+Store.seenCount(m.id)+'/'+m.total+'</span>'+
        '<span class="emo">'+m.emoji+'</span>'+
        '<span class="name">'+m.name+'</span>'+
        '<span class="hint">'+m.hint+'</span></button>');
    c.addEventListener("click", function(){ AudioService.effect("pop"); UI.go(m.route); });
    grid.appendChild(c);
  });
  wrap.appendChild(grid);

  wrap.appendChild(h('<h2 class="section-title">🧠 Quick Quizzes</h2>'));
  var quizzes = [
    {t:"Letter Quiz", e:"🔤", r:"quiz", p:{mod:"abc"}},
    {t:"Number Quiz", e:"🔢", r:"quiz", p:{mod:"numbers"}},
    {t:"Colour Quiz", e:"🎨", r:"quiz", p:{mod:"colours"}},
    {t:"Animal Quiz", e:"🐾", r:"quiz", p:{mod:"animals"}},
    {t:"Shape Quiz",  e:"🔷", r:"quiz", p:{mod:"shapes"}}
  ];
  quizzes.forEach(function(q){
    var b = h('<button class="row-item"><span class="e">'+q.e+'</span><span class="t">'+q.t+'</span><span class="m">Play ›</span></button>');
    b.addEventListener("click", function(){ AudioService.effect("tap"); UI.go(q.r, q.p); });
    wrap.appendChild(b);
  });
  return wrap;
};
