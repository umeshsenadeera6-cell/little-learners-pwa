import { h, esc, shuffle, pick, sample, byId, repeatEmoji, fmtTime } from "../core/dom.js";
import { DATA } from "../data/index.js";
import { Store } from "../core/store.js";
import { UI, Routes } from "../core/router.js";
import { AudioService } from "../core/audio-service.js";
import { FX } from "../core/fx.js";
import { Rewards } from "../core/rewards.js";
import { shapeSVG } from "../widgets/shape-svg.js";

/* ------------------------------ QUIZZES -------------------------------- */
/* One quiz engine; each module only supplies question builders. */
export const QuizBank = {
  abc: { title:"Letter Quiz", emoji:"🔤", colour:"var(--sun)",
    make: function(){
      var item = pick(DATA.alphabet);
      var others = sample(DATA.alphabet.filter(function(x){return x.id!==item.id;}), 2);
      var opts = shuffle([item].concat(others)).map(function(o){
        return { html:'<span class="letterform">'+o.letter+'</span>', correct:o.id===item.id, say:o.letter };
      });
      return { text:"Which letter starts the word "+item.word+"?",
               prompt:'<span class="qprompt">'+item.emoji+'</span>',
               say:"Which letter starts the word "+item.word+"?",
               layout:"three", opts:opts };
    }},
  numbers: { title:"Number Quiz", emoji:"🔢", colour:"var(--sky)",
    make: function(){
      var n = 1 + Math.floor(Math.random()*10);
      var emo = pick(["⭐","🍎","🎈","🐟","🍓","🐝"]);
      var wrongs = shuffle([n-2,n-1,n+1,n+2,n+3].filter(function(x){return x>0 && x!==n;})).slice(0,2);
      var opts = shuffle([n].concat(wrongs)).map(function(v){
        return { html:'<span>'+v+'</span>', correct:v===n, say:String(v) };
      });
      return { text:"How many "+(emo==="⭐"?"stars":"things")+"?",
               prompt:'<span class="qprompt" style="font-size:clamp(26px,8vw,40px);line-height:1.5;word-break:break-word">'+repeatEmoji(emo,n)+'</span>',
               say:"How many can you count?",
               layout:"three", opts:opts };
    }},
  colours: { title:"Colour Quiz", emoji:"🎨", colour:"var(--bubble)",
    make: function(){
      var c = pick(DATA.colours);
      var others = sample(DATA.colours.filter(function(x){return x.id!==c.id;}), 2);
      var opts = shuffle([c].concat(others)).map(function(o){
        return { html:'<span style="display:block;width:54px;height:54px;border-radius:50%;background:'+o.hex+';border:4px solid rgba(255,255,255,.7);box-shadow:inset 0 -6px 12px rgba(0,0,0,.15)"></span>',
                 correct:o.id===c.id, say:o.name };
      });
      return { text:"Which one is "+c.name.toUpperCase()+"?",
               prompt:'<span class="qprompt">🎨</span>',
               say:"Which one is "+c.name+"?",
               layout:"three", opts:opts };
    }},
  animals: { title:"Animal Quiz", emoji:"🐾", colour:"var(--leaf)",
    make: function(){
      var a = pick(DATA.animals);
      var others = sample(DATA.animals.filter(function(x){return x.id!==a.id;}), 2);
      var opts = shuffle([a].concat(others)).map(function(o){
        return { html:'<span style="font-size:30px">'+o.emoji+'</span><small>'+o.name+'</small>', correct:o.id===a.id, say:o.name };
      });
      return { text:"What animal is this?",
               prompt:'<span class="qprompt">'+a.emoji+'</span>',
               say:"What animal is this?",
               layout:"three", opts:opts };
    }},
  shapes: { title:"Shape Quiz", emoji:"🔷", colour:"var(--grape)",
    make: function(){
      var s = pick(DATA.shapes);
      var others = sample(DATA.shapes.filter(function(x){return x.id!==s.id;}), 2);
      var opts = shuffle([s].concat(others)).map(function(o){
        return { html:shapeSVG(o,"54px"), correct:o.id===s.id, say:o.name };
      });
      return { text:"Which one is a "+s.name.toUpperCase()+"?",
               prompt:'<span class="qprompt">🔍</span>',
               say:"Which one is a "+s.name+"?",
               layout:"three", opts:opts };
    }},
  words: { title:"Word Quiz", emoji:"📚", colour:"var(--mint)",
    make: function(){
      var w = pick(DATA.words);
      var others = sample(DATA.words.filter(function(x){return x.id!==w.id;}), 2);
      var opts = shuffle([w].concat(others)).map(function(o){
        return { html:'<span style="font-size:19px">'+o.word+'</span>', correct:o.id===w.id, say:o.word };
      });
      return { text:"What is this?",
               prompt:'<span class="qprompt">'+w.emoji+'</span>',
               say:"What is this?",
               layout:"three", opts:opts };
    }}
};

export const QUIZ_LENGTH = 6;

Routes.quiz = function(p){
  var mod = p.mod || "abc";
  var bank = QuizBank[mod];
  var qIndex = p.q|0, score = p.score|0;
  UI.setTitle(bank.emoji + " " + bank.title, "Question " + (qIndex+1) + " of " + QUIZ_LENGTH);

  if(qIndex >= QUIZ_LENGTH) return quizDone(mod, score);

  var q = bank.make();
  var wrap = h('<div></div>');

  var meter = '<div class="qmeter">';
  for(var m=0;m<QUIZ_LENGTH;m++) meter += '<i class="'+(m<qIndex?"on":(m===qIndex?"now":""))+'"></i>';
  meter += '</div>';

  var card = h('<div class="qcard">'+
      '<div class="qsub">'+bank.title+'</div>'+
      '<div class="qtext">'+esc(q.text)+'</div>'+
      q.prompt +
      '<div class="opts '+q.layout+'" id="ll-opts"></div>'+
      '<div class="feedback" id="ll-fb"></div>'+
      meter+
    '</div>');
  wrap.appendChild(card);

  var fb = card.querySelector("#ll-fb");
  var optsHost = card.querySelector("#ll-opts");
  var locked = false;

  q.opts.forEach(function(o){
    var b = h('<button class="opt">'+o.html+'</button>');
    b.addEventListener("click", function(){
      if(locked) return;
      AudioService.say(o.say, {rate:0.8});
      if(o.correct){
        locked = true;
        b.classList.add("right");
        fb.className = "feedback good";
        fb.textContent = pick(["🎉 Great Job!","🎉 Excellent!","🎉 You got it!","🎉 Awesome!"]) + "  ⭐ +1 Star";
        Store.quizResult(mod, true);
        Rewards.star(1, b);
        FX.confetti(35);
        setTimeout(function(){
          UI.setParams({mod:mod, q:qIndex+1, score:score+1});
        }, 1400);
      } else {
        b.classList.add("wrong");
        fb.className = "feedback try";
        fb.textContent = "Try Again! 😊";
        Store.quizResult(mod, false);
        AudioService.effect("wrong");
        setTimeout(function(){ b.classList.remove("wrong"); }, 700);
      }
    });
    optsHost.appendChild(b);
  });

  var hear = h('<button class="btn ghost" style="width:100%;margin-top:14px">🔊 Say the question again</button>');
  hear.addEventListener("click", function(){ AudioService.say(q.say, {rate:0.75}); });
  wrap.appendChild(hear);

  var quit = h('<button class="btn" style="width:100%;margin-top:10px">🏠 Back to learning</button>');
  quit.addEventListener("click", function(){ AudioService.effect("page"); UI.back(); });
  wrap.appendChild(quit);

  setTimeout(function(){ AudioService.say(q.say, {rate:0.75}); }, 350);
  return wrap;
};

function quizDone(mod, score){
  var bank = QuizBank[mod];
  UI.setTitle("🎉 All done!", bank.title);
  FX.confetti(110);
  AudioService.effect("reward");
  setTimeout(function(){ AudioService.say("Well done! You are a super learner.", {rate:0.78}); }, 300);
  Rewards.star(2);

  var wrap = h('<div></div>');
  wrap.appendChild(h('<div class="stage-card pop" style="padding-top:28px">'+
      '<div class="glow" style="background:'+bank.colour+'"></div>'+
      '<div class="bigemoji floaty">🏆</div>'+
      '<div class="word">Well done!</div>'+
      '<div class="sentence">You answered '+score+' of '+QUIZ_LENGTH+' by yourself.</div>'+
      '<div style="font-size:34px;margin-top:10px">'+repeatEmoji("⭐", Math.max(1,score))+'</div>'+
    '</div>'));

  var row = h('<div class="btn-row"></div>');
  var again = h('<button class="btn sun">🔁 Again</button>');
  again.addEventListener("click", function(){ AudioService.effect("tap"); UI.setParams({mod:mod, q:0, score:0}); });
  var home = h('<button class="btn primary">🏠 Home</button>');
  home.addEventListener("click", function(){ AudioService.effect("tap"); UI.selectTab("home"); });
  row.appendChild(again); row.appendChild(home);
  wrap.appendChild(row);
  return wrap;
}
