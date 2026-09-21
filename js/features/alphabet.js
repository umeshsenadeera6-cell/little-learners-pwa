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
  var mode = p.mode || "both"; // "both", "capital", "simple"
  var item = DATA.alphabet[i];
  Store.markSeen("abc", item.id);
  UI.setTitle("🔤 ABC Letters", "Letter " + (i+1) + " of 26");

  var wrap = h('<div></div>');

  /* Mode selector pills: Both (Aa), Capital (A), Simple (a) */
  var pills = h('<div class="pill-tabs" style="justify-content:center;margin-bottom:8px"></div>');
  var pBoth = h('<button class="pill" '+(mode==="both"?'aria-selected="true"':'')+'>Both (Aa)</button>');
  var pCap  = h('<button class="pill" '+(mode==="capital"?'aria-selected="true"':'')+'>Capital (A)</button>');
  var pSim  = h('<button class="pill" '+(mode==="simple"?'aria-selected="true"':'')+'>Simple (a)</button>');

  pBoth.addEventListener("click", function(){ AudioService.effect("tap"); UI.setParams({index:i, mode:"both"}); });
  pCap.addEventListener("click",  function(){ AudioService.effect("tap"); UI.setParams({index:i, mode:"capital"}); });
  pSim.addEventListener("click",  function(){ AudioService.effect("tap"); UI.setParams({index:i, mode:"simple"}); });

  pills.appendChild(pBoth);
  pills.appendChild(pCap);
  pills.appendChild(pSim);
  wrap.appendChild(pills);

  /* alphabet strip */
  var strip = h('<div class="strip" aria-label="Alphabet"></div>');
  DATA.alphabet.forEach(function(L, idx){
    var label = mode === "capital" ? L.letter : (mode === "simple" ? L.lowercase : (L.letter + L.lowercase));
    var c = h('<button class="chip letterform" '+(idx===i?'aria-current="true"':'')+'>'+label+
      (Store.isSeen("abc",L.id)?'<span class="done">⭐</span>':'')+'</button>');
    c.addEventListener("click", function(){ AudioService.effect("tap"); UI.setParams({index:idx, mode:mode}); });
    strip.appendChild(c);
  });
  wrap.appendChild(strip);

  /* stage display based on mode */
  var stageHtml = '';
  if (mode === "both") {
    stageHtml =
      '<div class="stage-card">' +
        '<div class="glow" style="background:var(--sun)"></div>' +
        '<div style="display:flex;gap:20px;justify-content:center;align-items:center;flex-wrap:wrap;margin-bottom:12px">' +
          '<button id="ll-cap" class="bigletter letterform" style="color:var(--coral);cursor:pointer;background:var(--surface2);padding:12px 24px;border-radius:24px;border:4px solid var(--line)" aria-label="Capital letter '+item.letter+'">' +
            item.letter +
            '<div style="font-family:Nunito;font-size:13px;font-weight:900;color:var(--ink-soft);margin-top:2px">Capital</div>' +
          '</button>' +
          '<button id="ll-sim" class="bigletter letterform" style="color:#2B86C5;cursor:pointer;background:var(--surface2);padding:12px 24px;border-radius:24px;border:4px solid var(--line)" aria-label="Simple letter '+item.lowercase+'">' +
            item.lowercase +
            '<div style="font-family:Nunito;font-size:13px;font-weight:900;color:var(--ink-soft);margin-top:2px">Simple</div>' +
          '</button>' +
        '</div>' +
        '<div><button id="ll-emoji" class="bigemoji" aria-label="'+esc(item.word)+'">'+item.emoji+'</button></div>' +
        '<div class="word">'+esc(item.word)+'</div>' +
        '<div class="sentence">Capital <b>'+item.letter+'</b> and simple <b>'+item.lowercase+'</b> are for '+esc(item.word)+'.</div>' +
        '<div class="tap-hint">👆 Tap Capital or Simple letter to hear it</div>' +
      '</div>';
  } else if (mode === "capital") {
    stageHtml =
      '<div class="stage-card">' +
        '<div class="glow" style="background:var(--sun)"></div>' +
        '<button id="ll-cap" class="bigletter letterform" style="color:var(--coral);cursor:pointer" aria-label="Capital letter '+item.letter+'">' +
          item.letter +
          '<div style="font-family:Nunito;font-size:14px;font-weight:900;color:var(--ink-soft)">Capital Letter</div>' +
        '</button>' +
        '<div><button id="ll-emoji" class="bigemoji" aria-label="'+esc(item.word)+'">'+item.emoji+'</button></div>' +
        '<div class="word">'+esc(item.word)+'</div>' +
        '<div class="sentence">Capital letter <b>'+item.letter+'</b> starts '+esc(item.word)+'.</div>' +
        '<div class="tap-hint">👆 Tap the Capital letter or picture</div>' +
      '</div>';
  } else {
    stageHtml =
      '<div class="stage-card">' +
        '<div class="glow" style="background:var(--sun)"></div>' +
        '<button id="ll-sim" class="bigletter letterform" style="color:#2B86C5;cursor:pointer" aria-label="Simple letter '+item.lowercase+'">' +
          item.lowercase +
          '<div style="font-family:Nunito;font-size:14px;font-weight:900;color:var(--ink-soft)">Simple Letter</div>' +
        '</button>' +
        '<div><button id="ll-emoji" class="bigemoji" aria-label="'+esc(item.word)+'">'+item.emoji+'</button></div>' +
        '<div class="word">'+esc(item.word)+'</div>' +
        '<div class="sentence">Simple letter <b>'+item.lowercase+'</b> starts '+esc(item.word)+'.</div>' +
        '<div class="tap-hint">👆 Tap the Simple letter or picture</div>' +
      '</div>';
  }

  var card = h(stageHtml);
  wrap.appendChild(card);

  var capEl = card.querySelector("#ll-cap");
  var simEl = card.querySelector("#ll-sim");
  var emojiEl = card.querySelector("#ll-emoji");

  if (capEl) {
    capEl.addEventListener("click", function(){
      FX.bounce(capEl); if(emojiEl) FX.wiggle(emojiEl);
      AudioService.say("Capital " + item.letter, {rate:0.75});
    });
  }
  if (simEl) {
    simEl.addEventListener("click", function(){
      FX.bounce(simEl); if(emojiEl) FX.wiggle(emojiEl);
      AudioService.say("Simple " + item.lowercase, {rate:0.75});
    });
  }
  if (emojiEl) {
    emojiEl.addEventListener("click", function(){
      FX.bounce(emojiEl);
      AudioService.say(item.word, {rate:0.8});
    });
  }

  var speakText = mode === "both"
    ? "Capital " + item.letter + " and simple " + item.lowercase + ". " + item.word + " starts with " + item.letter
    : (mode === "capital" ? "Capital " + item.letter + ". " + item.word : "Simple " + item.lowercase + ". " + item.word);

  var spRow = h('<div style="text-align:center;margin-top:10px"></div>');
  spRow.appendChild(speakerBtn('Listen: "' + (mode==="both" ? item.letter+item.lowercase : (mode==="capital"?item.letter:item.lowercase)) + '"', speakText, {rate:0.75}));
  wrap.appendChild(spRow);

  /* nav */
  var nav = h('<div class="navrow"></div>');
  var prev = h('<button class="btn ghost" '+(i===0?'disabled':'')+'>⬅️ Back</button>');
  var next = h('<button class="btn sun">'+(i===25?'Finish 🎉':'Next ➡️')+'</button>');
  prev.addEventListener("click", function(){ AudioService.effect("page"); UI.setParams({index:i-1, mode:mode}); });
  next.addEventListener("click", function(){
    AudioService.effect("page");
    if(i===25){ FX.confetti(90); AudioService.effect("reward"); Rewards.star(2, next); UI.toast("🎉 You finished the alphabet!"); UI.go("quiz",{mod:"abc"}); }
    else UI.setParams({index:i+1, mode:mode});
  });
  nav.appendChild(prev); nav.appendChild(next);
  wrap.appendChild(nav);

  var qz = h('<button class="btn grape" style="width:100%;margin-top:12px">🧠 Letter Quiz</button>');
  qz.addEventListener("click", function(){ AudioService.effect("tap"); UI.go("quiz",{mod:"abc"}); });
  wrap.appendChild(qz);

  setTimeout(function(){
    var cur = strip.querySelector('[aria-current="true"]');
    if(cur && cur.scrollIntoView) cur.scrollIntoView({inline:"center", block:"nearest"});
    if(capEl) FX.bounce(capEl);
  }, 80);
  return wrap;
};
