import { h, esc, shuffle, pick, sample, byId, repeatEmoji, fmtTime } from "../core/dom.js";
import { DATA } from "../data/index.js";
import { Store } from "../core/store.js";
import { UI, Routes } from "../core/router.js";
import { AudioService } from "../core/audio-service.js";
import { FX } from "../core/fx.js";
import { Rewards } from "../core/rewards.js";
import { progressRow, animateBars } from "../widgets/progress-row.js";
import { parentGate } from "./parent.js";

/* My Progress — stars, badges and module bars. */

Routes.progress = function(){
  UI.setTitle("⭐ My Progress", "Look how much you know!");
  var s = Store.s;
  var wrap = h('<div></div>');

  wrap.appendChild(h('<div class="stat-row" style="margin-top:8px">'+
    '<div class="stat"><div class="v">⭐ '+s.stars+'</div><div class="k">Total stars</div></div>'+
    '<div class="stat"><div class="v">🏆 '+s.badges.length+'</div><div class="k">Badges</div></div>'+
  '</div>'));

  var lessons = DATA.modules.reduce(function(t,m){ return t + Store.seenCount(m.id); }, 0);
  var totalLessons = DATA.modules.reduce(function(t,m){ return t + m.total; }, 0);
  wrap.appendChild(h('<div class="stat-row">'+
    '<div class="stat"><div class="v">📚 '+lessons+'</div><div class="k">of '+totalLessons+' lessons</div></div>'+
    '<div class="stat"><div class="v">🧠 '+s.quiz.correct+'</div><div class="k">Right answers</div></div>'+
  '</div>'));

  wrap.appendChild(h('<h2 class="section-title">📊 My lessons</h2>'));
  var pcard = h('<div class="card"></div>');
  DATA.modules.forEach(function(m){ pcard.appendChild(progressRow(m)); });
  wrap.appendChild(pcard);

  wrap.appendChild(h('<h2 class="section-title">🏆 My badges</h2>'));
  var bg = h('<div class="badge-grid"></div>');
  DATA.badges.forEach(function(b){
    var earned = s.badges.indexOf(b.id)>-1;
    var el = h('<button class="badge '+(earned?"earned":"")+'"><span class="e">'+(earned?b.emoji:"🔒")+'</span>'+
      '<span class="n">'+b.name+'</span><span class="d">'+b.desc+'</span></button>');
    el.addEventListener("click", function(){
      AudioService.effect("tap");
      UI.toast(earned ? ("🏆 "+b.name) : ("🔒 "+b.desc));
      if(earned) AudioService.say(b.name,{rate:0.8});
    });
    bg.appendChild(el);
  });
  wrap.appendChild(bg);

  var parent = h('<button class="btn ghost" style="width:100%;margin-top:18px">👨‍👩‍👧 Parent Area</button>');
  parent.addEventListener("click", function(){ AudioService.effect("tap"); parentGate(); });
  wrap.appendChild(parent);

  setTimeout(function(){ animateBars(wrap); }, 60);
  return wrap;
};
