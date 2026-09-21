import { Store } from "./store.js";

/* -------------------------------- FX ----------------------------------- */
export const FX = {
  get on(){ return Store.s.settings.animation; },
  confetti: function(count){
    if(!this.on) return;
    var host=document.getElementById("fx");
    var cols=["#FF7A59","#FFC43C","#45C2F0","#5CD292","#A97BEA","#FF8FC5"];
    for(var i=0;i<(count||45);i++){
      var d=document.createElement("div");
      d.className="conf";
      d.style.left=(Math.random()*100)+"%";
      d.style.background=cols[i%cols.length];
      d.style.animationDuration=(1.5+Math.random()*1.4)+"s";
      d.style.animationDelay=(Math.random()*0.35)+"s";
      d.style.opacity=0.85;
      host.appendChild(d);
      (function(el){ setTimeout(function(){ el.remove(); }, 3400); })(d);
    }
  },
  starPop: function(el){
    if(!this.on) return;
    var host=document.getElementById("fx");
    var r = el && el.getBoundingClientRect ? el.getBoundingClientRect() : null;
    var x = r ? r.left + r.width/2 : window.innerWidth/2;
    var y = r ? r.top : window.innerHeight/2;
    for(var i=0;i<5;i++){
      var d=document.createElement("div");
      d.className="starpop"; d.textContent="⭐";
      d.style.left=(x - 16 + (Math.random()*80-40))+"px";
      d.style.top=(y + (Math.random()*30-10))+"px";
      d.style.animationDelay=(i*0.07)+"s";
      host.appendChild(d);
      (function(el2){ setTimeout(function(){ el2.remove(); }, 1400); })(d);
    }
  },
  bounce: function(el){ if(!this.on||!el) return; el.classList.remove("bouncing"); void el.offsetWidth; el.classList.add("bouncing"); },
  wiggle: function(el){ if(!this.on||!el) return; el.classList.remove("wiggling"); void el.offsetWidth; el.classList.add("wiggling"); }
};
