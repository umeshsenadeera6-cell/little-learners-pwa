import { h, esc, shuffle, pick, sample, byId, repeatEmoji, fmtTime } from "../core/dom.js";
import { DATA } from "../data/index.js";
import { Store } from "../core/store.js";
import { UI, Routes } from "../core/router.js";
import { AudioService } from "../core/audio-service.js";
import { FX } from "../core/fx.js";
import { Rewards } from "../core/rewards.js";

/* ------------------------------- GAMES --------------------------------- */
export const GAMES = [
  {id:"match",  route:"game_match",  emoji:"🧩", name:"Match It",       hint:"Animal → name",     bg:"linear-gradient(140deg,#FFD166,#FF9E4C)"},
  {id:"cases",  route:"game_cases",  emoji:"🔠", name:"Capital & Simple",hint:"Match A → a",       bg:"linear-gradient(140deg,#FF8E72,#FF5A5F)"},
  {id:"colour", route:"game_colour", emoji:"🎨", name:"Find the Colour",hint:"Tap the right one", bg:"linear-gradient(140deg,#FFA8CF,#FF7FB6)"},
  {id:"count",  route:"game_count",  emoji:"🔢", name:"Count Them",     hint:"How many?",         bg:"linear-gradient(140deg,#8ED8FF,#45B6F5)"},
  {id:"letter", route:"game_letter", emoji:"🔤", name:"Find the Letter",hint:"Spot the letter",   bg:"linear-gradient(140deg,#A8ECC0,#5CD292)"},
  {id:"memory", route:"game_memory", emoji:"🃏", name:"Memory Cards",   hint:"Find the pairs",    bg:"linear-gradient(140deg,#C7B2FF,#A97BEA)"}
];

Routes.games = function(){
  UI.setTitle("🎮 Let's Play!", "Fun games for little learners");
  var wrap = h('<div></div>');
  wrap.appendChild(h('<div class="hero-banner" style="background:linear-gradient(135deg,var(--grape),var(--bubble))"><h2>Time to play</h2><p>Every game gives you stars. No hurry — try as often as you like.</p><span class="big floaty">🎈</span></div>'));
  var grid = h('<div class="cat-grid" style="margin-top:16px"></div>');
  GAMES.forEach(function(g){
    var plays = Store.s.games[g.id]||0;
    var c = h('<button class="cat" style="background:'+g.bg+'">'+
      '<span class="blob"></span><span class="ring"></span>'+
      (plays?'<span class="pct">'+plays+'×</span>':'')+
      '<span class="emo">'+g.emoji+'</span><span class="name">'+g.name+'</span><span class="hint">'+g.hint+'</span></button>');
    c.addEventListener("click", function(){ AudioService.effect("pop"); UI.go(g.route,{}); });
    grid.appendChild(c);
  });
  wrap.appendChild(grid);
  return wrap;
};

function gameShell(title, sub, roundText){
  UI.setTitle(title, sub);
  var wrap = h('<div></div>');
  wrap.appendChild(h('<div class="qcard" id="ll-gamecard"><div class="qsub" id="ll-round">'+esc(roundText||"")+'</div><div class="qtext" id="ll-q"></div><div id="ll-body"></div><div class="feedback" id="ll-fb"></div></div>'));
  return wrap;
}
function gameFinish(wrap, gameId, msg, onAgain){
  Store.playedGame(gameId);
  FX.confetti(110); AudioService.effect("reward");
  AudioService.say(msg, {rate:0.78});
  Rewards.star(2);
  var done = h('<div class="stage-card pop" style="margin-top:14px"><div class="bigemoji floaty">🏆</div><div class="word">'+esc(msg)+'</div><div class="sentence">You earned 2 extra stars!</div></div>');
  wrap.appendChild(done);
  var row = h('<div class="btn-row"></div>');
  var a = h('<button class="btn sun">🔁 Play again</button>');
  a.addEventListener("click", function(){ AudioService.effect("tap"); onAgain(); });
  var b = h('<button class="btn primary">🎮 More games</button>');
  b.addEventListener("click", function(){ AudioService.effect("tap"); UI.selectTab("games"); });
  row.appendChild(a); row.appendChild(b);
  wrap.appendChild(row);
  done.scrollIntoView({block:"nearest"});
}

/* Game 1 — Match animal to name */
Routes.game_match = function(){
  var wrap = gameShell("🧩 Match It", "Animal → name", "Match each animal with its name");
  var card = wrap.querySelector("#ll-gamecard");
  card.querySelector("#ll-q").textContent = "Tap an animal, then tap its name.";
  var body = card.querySelector("#ll-body");
  var fb = card.querySelector("#ll-fb");

  var pairs = sample(DATA.animals, 4);
  var left = shuffle(pairs), right = shuffle(pairs);
  var sel = null, done = 0;

  var grid = h('<div class="match-wrap" style="margin-top:16px"></div>');
  var colL = h('<div class="match-col"></div>'), colR = h('<div class="match-col"></div>');
  grid.appendChild(colL); grid.appendChild(colR); body.appendChild(grid);

  left.forEach(function(a){
    var b = h('<button class="mitem" aria-pressed="false" aria-label="'+a.name+'">'+a.emoji+'</button>');
    b.addEventListener("click", function(){
      if(b.classList.contains("done")) return;
      Array.prototype.forEach.call(colL.children, function(x){ x.setAttribute("aria-pressed","false"); });
      b.setAttribute("aria-pressed","true"); sel = {a:a, el:b};
      AudioService.say(a.sound, {rate:0.8, pitch:1.4});
    });
    colL.appendChild(b);
  });
  right.forEach(function(a){
    var b = h('<button class="mitem word">'+a.name+'</button>');
    b.addEventListener("click", function(){
      if(b.classList.contains("done")) return;
      AudioService.say(a.name, {rate:0.8});
      if(!sel){ fb.className="feedback try"; fb.textContent="Tap an animal first 😊"; return; }
      if(sel.a.id === a.id){
        sel.el.classList.add("done"); b.classList.add("done");
        sel.el.setAttribute("aria-pressed","false");
        fb.className="feedback good"; fb.textContent="🎉 Yes! "+a.name;
        Rewards.star(1, b); sel=null; done++;
        if(done===pairs.length){ setTimeout(function(){ gameFinish(wrap,"match","You matched them all!", function(){ UI.setParams({r:Math.random()}); }); }, 600); }
      } else {
        b.classList.add("miss");
        fb.className="feedback try"; fb.textContent="Try Again! 😊";
        AudioService.effect("wrong");
        setTimeout(function(){ b.classList.remove("miss"); }, 500);
      }
    });
    colR.appendChild(b);
  });
  return wrap;
};

/* Game 2 — Find the colour */
Routes.game_colour = function(p){
  var round = (p.round|0) || 0, total = 5;
  if(round>=total){
    var w0 = gameShell("🎨 Find the Colour","Colour hunt","Finished!");
    w0.querySelector("#ll-q").textContent = "You found every colour!";
    gameFinish(w0, "colour", "Colour champion!", function(){ UI.setParams({round:0}); });
    return w0;
  }
  var wrap = gameShell("🎨 Find the Colour", "Colour hunt", "Round "+(round+1)+" of "+total);
  var card = wrap.querySelector("#ll-gamecard");
  var target = pick(DATA.colours);
  var others = sample(DATA.colours.filter(function(c){return c.id!==target.id;}), 3);
  card.querySelector("#ll-q").textContent = "Find " + target.name.toUpperCase();
  var body = card.querySelector("#ll-body"), fb = card.querySelector("#ll-fb");
  var grid = h('<div class="opts two" style="margin-top:18px"></div>');
  shuffle([target].concat(others)).forEach(function(c){
    var b = h('<button class="opt"><span style="display:block;width:62px;height:62px;border-radius:50%;background:'+c.hex+';border:4px solid rgba(255,255,255,.7);box-shadow:inset 0 -8px 14px rgba(0,0,0,.15)"></span></button>');
    b.addEventListener("click", function(){
      AudioService.say(c.name,{rate:0.8});
      if(c.id===target.id){
        b.classList.add("right"); fb.className="feedback good"; fb.textContent="🎉 That's "+target.name+"!";
        Rewards.star(1,b); FX.confetti(30);
        setTimeout(function(){ UI.setParams({round:round+1}); }, 1100);
      } else {
        b.classList.add("wrong"); fb.className="feedback try"; fb.textContent="Try Again! 😊";
        AudioService.effect("wrong");
        setTimeout(function(){ b.classList.remove("wrong"); }, 600);
      }
    });
    grid.appendChild(b);
  });
  body.appendChild(grid);
  setTimeout(function(){ AudioService.say("Find "+target.name, {rate:0.75}); }, 300);
  return wrap;
};

/* Game 3 — Count the objects */
Routes.game_count = function(p){
  var round = (p.round|0) || 0, total = 5;
  if(round>=total){
    var w0 = gameShell("🔢 Count Them","Counting game","Finished!");
    w0.querySelector("#ll-q").textContent = "You counted everything!";
    gameFinish(w0, "count", "Counting star!", function(){ UI.setParams({round:0}); });
    return w0;
  }
  var wrap = gameShell("🔢 Count Them", "Counting game", "Round "+(round+1)+" of "+total);
  var card = wrap.querySelector("#ll-gamecard");
  var emo = pick(["🍎","⭐","🎈","🐟","🍓","🐝","🌻"]);
  var n = 2 + Math.floor(Math.random()*8);
  card.querySelector("#ll-q").textContent = "How many " + emo + " ?";
  var body = card.querySelector("#ll-body"), fb = card.querySelector("#ll-fb");
  var show = h('<div class="count-area" style="margin-top:14px"></div>');
  for(var i=0;i<n;i++){
    var o = h('<span class="cobj lit">'+emo+'</span>');
    show.appendChild(o);
  }
  body.appendChild(show);
  var wrongs = shuffle([n-2,n-1,n+1,n+2].filter(function(x){return x>0 && x!==n;})).slice(0,2);
  var grid = h('<div class="opts three" style="margin-top:14px"></div>');
  shuffle([n].concat(wrongs)).forEach(function(v){
    var b = h('<button class="opt">'+v+'</button>');
    b.addEventListener("click", function(){
      AudioService.say(String(v),{rate:0.8});
      if(v===n){
        b.classList.add("right"); fb.className="feedback good"; fb.textContent="🎉 Excellent!";
        Rewards.star(1,b); FX.confetti(30);
        setTimeout(function(){ UI.setParams({round:round+1}); }, 1100);
      } else {
        b.classList.add("wrong"); fb.className="feedback try"; fb.textContent="Try Again! 😊";
        AudioService.effect("wrong");
        setTimeout(function(){ b.classList.remove("wrong"); }, 600);
      }
    });
    grid.appendChild(b);
  });
  body.appendChild(grid);
  return wrap;
};

/* Game 4 — Find the letter */
Routes.game_letter = function(p){
  var round = (p.round|0) || 0, total = 5;
  if(round>=total){
    var w0 = gameShell("🔤 Find the Letter","Letter hunt","Finished!");
    w0.querySelector("#ll-q").textContent = "You found every letter!";
    gameFinish(w0, "letter", "Letter hero!", function(){ UI.setParams({round:0}); });
    return w0;
  }
  var wrap = gameShell("🔤 Find the Letter", "Letter hunt", "Round "+(round+1)+" of "+total);
  var card = wrap.querySelector("#ll-gamecard");
  var target = pick(DATA.alphabet);
  var others = sample(DATA.alphabet.filter(function(x){return x.id!==target.id;}), 5);
  card.querySelector("#ll-q").textContent = "Find the letter " + target.letter;
  var body = card.querySelector("#ll-body"), fb = card.querySelector("#ll-fb");
  var grid = h('<div class="opts three" style="margin-top:18px"></div>');
  shuffle([target].concat(others)).forEach(function(L){
    var b = h('<button class="opt letterform">'+L.letter+'</button>');
    b.addEventListener("click", function(){
      AudioService.say(L.letter,{rate:0.7});
      if(L.id===target.id){
        b.classList.add("right"); fb.className="feedback good"; fb.textContent="🎉 You got it!";
        Rewards.star(1,b); FX.confetti(30);
        setTimeout(function(){ UI.setParams({round:round+1}); }, 1100);
      } else {
        b.classList.add("wrong"); fb.className="feedback try"; fb.textContent="Try Again! 😊";
        AudioService.effect("wrong");
        setTimeout(function(){ b.classList.remove("wrong"); }, 600);
      }
    });
    grid.appendChild(b);
  });
  body.appendChild(grid);
  setTimeout(function(){ AudioService.say("Find the letter "+target.letter, {rate:0.7}); }, 300);
  return wrap;
};

/* Game 5 — Memory cards */
Routes.game_memory = function(){
  var wrap = gameShell("🃏 Memory Cards", "Find the pairs", "Tap two cards to find a pair");
  var card = wrap.querySelector("#ll-gamecard");
  card.querySelector("#ll-q").textContent = "Find all 6 pairs!";
  var body = card.querySelector("#ll-body"), fb = card.querySelector("#ll-fb");

  var pool = sample(DATA.animals, 4).map(function(a){return {k:a.id, e:a.emoji, n:a.name};})
    .concat(sample(DATA.words, 2).map(function(w){return {k:w.id, e:w.emoji, n:w.word};}));
  var deck = shuffle(pool.concat(pool));

  var grid = h('<div class="mem-grid" style="margin-top:16px"></div>');
  var open = [], matched = 0, busy = false;

  deck.forEach(function(item){
    var c = h('<button class="mem" aria-label="card"><span class="inner">'+
      '<span class="face back">❓</span><span class="face front">'+item.e+'</span></span></button>');
    c.dataset.k = item.k;
    c.addEventListener("click", function(){
      if(busy || c.classList.contains("open") || c.classList.contains("matched")) return;
      c.classList.add("open"); AudioService.effect("pop");
      open.push({el:c, item:item});
      if(open.length===2){
        busy = true;
        if(open[0].item.k === open[1].item.k){
          setTimeout(function(){
            open.forEach(function(o){ o.el.classList.add("matched"); o.el.classList.remove("open"); });
            fb.className="feedback good"; fb.textContent="🎉 "+open[0].item.n+"!";
            AudioService.say(open[0].item.n, {rate:0.8});
            Rewards.star(1, open[0].el);
            matched++; open = []; busy=false;
            if(matched===pool.length){ setTimeout(function(){ gameFinish(wrap,"memory","Memory master!", function(){ UI.setParams({r:Math.random()}); }); }, 500); }
          }, 420);
        } else {
          fb.className="feedback try"; fb.textContent="Try Again! 😊";
          AudioService.effect("wrong");
          setTimeout(function(){
            open.forEach(function(o){ o.el.classList.remove("open"); });
            open = []; busy=false;
          }, 900);
        }
      }
    });
    grid.appendChild(c);
  });
  body.appendChild(grid);
  return wrap;
};

/* Game 6 — Capital & Simple Letter Match */
Routes.game_cases = function(){
  var wrap = gameShell("🔠 Capital & Simple", "Match A → a", "Match each Capital letter with its Simple letter");
  var card = wrap.querySelector("#ll-gamecard");
  card.querySelector("#ll-q").textContent = "Tap a Capital letter, then tap its Simple letter!";
  var body = card.querySelector("#ll-body");
  var fb = card.querySelector("#ll-fb");

  var items = sample(DATA.alphabet, 4);
  var left = shuffle(items), right = shuffle(items);
  var sel = null, done = 0;

  var grid = h('<div class="match-wrap" style="margin-top:16px"></div>');
  var colL = h('<div class="match-col"></div>'), colR = h('<div class="match-col"></div>');
  grid.appendChild(colL); grid.appendChild(colR); body.appendChild(grid);

  left.forEach(function(item){
    var b = h('<button class="mitem letterform" aria-pressed="false" style="color:var(--coral);font-size:36px;font-weight:800">'+item.letter+'</button>');
    b.addEventListener("click", function(){
      if(b.classList.contains("done")) return;
      Array.prototype.forEach.call(colL.children, function(x){ x.setAttribute("aria-pressed","false"); });
      b.setAttribute("aria-pressed","true"); sel = {item:item, el:b};
      AudioService.say("Capital " + item.letter, {rate:0.75});
    });
    colL.appendChild(b);
  });

  right.forEach(function(item){
    var b = h('<button class="mitem letterform" style="color:#2B86C5;font-size:36px;font-weight:800">'+item.lowercase+'</button>');
    b.addEventListener("click", function(){
      if(b.classList.contains("done")) return;
      AudioService.say("Simple " + item.lowercase, {rate:0.75});
      if(!sel){ fb.className="feedback try"; fb.textContent="Tap a Capital letter first 😊"; return; }
      if(sel.item.id === item.id){
        sel.el.classList.add("done"); b.classList.add("done");
        sel.el.setAttribute("aria-pressed","false");
        fb.className="feedback good"; fb.textContent="🎉 Great job! "+item.letter+" matches "+item.lowercase;
        Rewards.star(1, b); sel=null; done++;
        if(done===items.length){
          setTimeout(function(){
            gameFinish(wrap, "cases", "Capital & Simple Master!", function(){ UI.setParams({r:Math.random()}); });
          }, 600);
        }
      } else {
        b.classList.add("miss");
        fb.className="feedback try"; fb.textContent="Try Again! 😊";
        AudioService.effect("wrong");
        setTimeout(function(){ b.classList.remove("miss"); }, 500);
      }
    });
    colR.appendChild(b);
  });
  return wrap;
};

