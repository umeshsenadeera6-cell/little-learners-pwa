import { h, esc, shuffle, pick, sample, byId, repeatEmoji, fmtTime } from "../core/dom.js";
import { DATA } from "../data/index.js";
import { Store } from "../core/store.js";
import { UI, Routes } from "../core/router.js";
import { AudioService } from "../core/audio-service.js";
import { FX } from "../core/fx.js";
import { Rewards } from "../core/rewards.js";
import { progressRow, animateBars } from "../widgets/progress-row.js";

/* -------------------------------- HOME --------------------------------- */
Routes.home = function(){
  UI.setTitle("🌈 Little Learners", "Learn • Play • Grow");
  var wrap = h('<div></div>');

  var hour = new Date().getHours();
  var greet = hour<12 ? "Good morning!" : (hour<17 ? "Good afternoon!" : "Good evening!");
  var mascot = hour<12 ? "🐥" : (hour<17 ? "🦊" : "🦉");
  var banner = h(
    '<div class="hero-banner">'+
      '<h2>'+greet+'</h2>'+
      '<p>Tap a card and let’s learn something new.</p>'+
      '<span class="big floaty">'+mascot+'</span>'+
    '</div>');
  wrap.appendChild(banner);

  wrap.appendChild(h('<h2 class="section-title">🎒 What shall we learn?</h2>'));
  var grid = h('<div class="cat-grid"></div>');
  DATA.modules.forEach(function(m){
    var pct = Store.pct(m.id);
    var c = h(
      '<button class="cat" style="background:'+m.bg+'">'+
        '<span class="blob"></span><span class="ring"></span>'+
        (pct>0?'<span class="pct">'+pct+'%</span>':'')+
        '<span class="emo">'+m.emoji+'</span>'+
        '<span class="name">'+m.name+'</span>'+
        '<span class="hint">'+m.hint+'</span>'+
      '</button>');
    c.addEventListener("click", function(){
      AudioService.effect("pop"); AudioService.say(m.name);
      UI.go(m.route);
    });
    grid.appendChild(c);
  });
  wrap.appendChild(grid);

  var play = h('<button class="btn primary" style="width:100%;margin-top:18px;font-size:20px">🎮 LET’S PLAY!</button>');
  play.addEventListener("click", function(){ AudioService.effect("pop"); UI.selectTab("games"); });
  wrap.appendChild(play);

  var st = h('<h2 class="section-title">⭐ My Progress<span class="more">See all ›</span></h2>');
  st.addEventListener("click", function(){ UI.selectTab("progress"); });
  wrap.appendChild(st);

  var pcard = h('<div class="card"></div>');
  DATA.modules.slice(0,4).forEach(function(m){
    pcard.appendChild(progressRow(m));
  });
  wrap.appendChild(pcard);

  var badges = Store.s.badges.length;
  var foot = h('<div class="stat-row" style="margin-top:14px">'+
      '<div class="stat"><div class="v">⭐ '+Store.s.stars+'</div><div class="k">Stars</div></div>'+
      '<div class="stat"><div class="v">🏆 '+badges+'</div><div class="k">Badges</div></div>'+
    '</div>');
  wrap.appendChild(foot);

  setTimeout(function(){ animateBars(wrap); }, 60);
  return wrap;
};
