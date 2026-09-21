import { h, esc, shuffle, pick, sample, byId, repeatEmoji, fmtTime } from "../core/dom.js";
import { DATA } from "../data/index.js";
import { Store } from "../core/store.js";
import { UI, Routes } from "../core/router.js";
import { AudioService } from "../core/audio-service.js";
import { FX } from "../core/fx.js";
import { Rewards } from "../core/rewards.js";
import { progressRow, animateBars } from "../widgets/progress-row.js";
import { GAMES } from "./games.js";

/* ---------------------------- PARENT AREA ------------------------------ */
export function parentGate(){
  var a = 3 + Math.floor(Math.random()*7), b = 2 + Math.floor(Math.random()*7);
  var answer = a + b;
  var opts = shuffle([answer, answer+2, answer-1, answer+5]).slice(0,3);
  if(opts.indexOf(answer)===-1) opts[0] = answer;
  opts = shuffle(opts);

  UI.modal(
    '<div style="font-size:42px">👨‍👩‍👧</div>'+
    '<h2>Parent Area</h2>'+
    '<p>Just checking a grown-up is here.<br>What is <strong>'+a+' + '+b+'</strong>?</p>'+
    '<div class="gate-keys" id="gk"></div>'+
    '<button class="btn ghost" id="gcancel" style="width:100%;margin-top:14px">Cancel</button>',
    function(m){
      var host = m.querySelector("#gk");
      opts.forEach(function(v){
        var btn = h('<button class="btn sun">'+v+'</button>');
        btn.addEventListener("click", function(){
          if(v===answer){ AudioService.effect("correct"); UI.closeModal(); UI.go("parent"); }
          else { btn.classList.add("wrong"); AudioService.effect("wrong"); btn.textContent="✖"; setTimeout(function(){ btn.textContent=v; },600); }
        });
        host.appendChild(btn);
      });
      m.querySelector("#gcancel").addEventListener("click", function(){ UI.closeModal(); });
    }
  );
}

Routes.parent = function(){
  UI.setTitle("👨‍👩‍👧 Parent Area", "Private — for grown-ups");
  var s = Store.s;
  var wrap = h('<div></div>');

  wrap.appendChild(h('<div class="card" style="background:var(--surface2);border:3px solid var(--line)">'+
    '<div style="font-weight:900;font-size:15px">This area is separated from the child interface and is reached through a simple maths gate. '+
    'Nothing here is shared online — all learning data stays on this device.</div></div>'));

  wrap.appendChild(h('<h2 class="section-title">📈 Learning summary</h2>'));
  var lessons = DATA.modules.reduce(function(t,m){ return t + Store.seenCount(m.id); }, 0);
  var attempts = s.quiz.correct + s.quiz.wrong;
  var accuracy = attempts ? Math.round(100*s.quiz.correct/attempts) : 0;
  wrap.appendChild(h('<div class="stat-row">'+
    '<div class="stat"><div class="v">'+lessons+'</div><div class="k">Lessons opened</div></div>'+
    '<div class="stat"><div class="v">'+s.stars+'</div><div class="k">Stars earned</div></div>'+
  '</div>'));
  wrap.appendChild(h('<div class="stat-row">'+
    '<div class="stat"><div class="v">'+accuracy+'%</div><div class="k">Quiz accuracy</div></div>'+
    '<div class="stat"><div class="v" style="font-size:22px">'+fmtTime(s.seconds)+'</div><div class="k">Time learning</div></div>'+
  '</div>'));

  wrap.appendChild(h('<h2 class="section-title">📚 Module progress</h2>'));
  var pcard = h('<div class="card"></div>');
  DATA.modules.forEach(function(m){
    var q = s.quiz.byModule[m.id] || {correct:0,wrong:0};
    var row = h('<div style="margin-bottom:14px">'+
      '<div style="display:flex;align-items:center;gap:8px;font-weight:900;font-size:14.5px">'+
        '<span style="font-size:20px">'+m.emoji+'</span><span>'+m.name+'</span>'+
        '<span style="margin-left:auto;color:var(--ink-soft);font-size:13px">'+Store.seenCount(m.id)+'/'+m.total+'</span></div>'+
      '<div class="pbar" style="margin-top:6px"><span data-pct="'+Store.pct(m.id)+'"></span></div>'+
      '<div style="font-size:12.5px;color:var(--ink-soft);margin-top:5px;font-weight:800">Quiz: '+q.correct+' correct · '+q.wrong+' retried</div>'+
    '</div>');
    pcard.appendChild(row);
  });
  wrap.appendChild(pcard);

  wrap.appendChild(h('<h2 class="section-title">🎮 Games played</h2>'));
  var gcard = h('<div class="card"></div>');
  GAMES.forEach(function(g){
    gcard.appendChild(h('<div style="display:flex;align-items:center;gap:10px;padding:7px 0;font-weight:900;font-size:14.5px">'+
      '<span style="font-size:20px">'+g.emoji+'</span><span>'+g.name+'</span>'+
      '<span style="margin-left:auto;color:var(--ink-soft)">'+(s.games[g.id]||0)+'×</span></div>'));
  });
  wrap.appendChild(gcard);

  wrap.appendChild(h('<h2 class="section-title">🔒 Safety & privacy</h2>'));
  wrap.appendChild(h('<div class="card"><div style="font-size:14.5px;font-weight:800;line-height:1.55">'+
    '✅ No chat, profiles or messaging<br>'+
    '✅ No advertising inside lessons<br>'+
    '✅ No external links in the child area<br>'+
    '✅ No personal information collected<br>'+
    '✅ Works fully offline'+
  '</div></div>'));

  var reset = h('<button class="btn ghost" style="width:100%;margin-top:18px">🧹 Reset all progress</button>');
  reset.addEventListener("click", function(){
    UI.modal('<div style="font-size:38px">🧹</div><h2>Reset progress?</h2><p>Stars, badges and lesson history will be cleared. This cannot be undone.</p>'+
      '<div class="btn-row"><button class="btn ghost" id="rno">Keep it</button><button class="btn primary" id="ryes">Reset</button></div>',
      function(m){
        m.querySelector("#rno").addEventListener("click", function(){ UI.closeModal(); });
        m.querySelector("#ryes").addEventListener("click", function(){
          Store.reset(); UI.closeModal(); UI.syncStars(); UI.toast("Progress cleared"); UI.selectTab("home");
        });
      });
  });
  wrap.appendChild(reset);

  var out = h('<button class="btn primary" style="width:100%;margin-top:10px">👶 Back to the kids app</button>');
  out.addEventListener("click", function(){ UI.selectTab("home"); });
  wrap.appendChild(out);

  setTimeout(function(){ animateBars(wrap); }, 60);
  return wrap;
};
