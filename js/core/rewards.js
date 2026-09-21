import { Store } from "./store.js";
import { FX } from "./fx.js";
import { AudioService } from "./audio-service.js";
import { DATA } from "../data/index.js";
import { showToast } from "./toast.js";

/* ------------------------------ REWARDS -------------------------------- */
export const Rewards = {
  check: function(){
    var s = Store.s, gained = [];
    DATA.badges.forEach(function(b){
      if(s.badges.indexOf(b.id)===-1){
        var ok=false; try{ ok=b.test(s); }catch(e){}
        if(ok){ s.badges.push(b.id); gained.push(b); }
      }
    });
    if(gained.length){ Store.save(); setTimeout(function(){ Rewards.badgeToast(gained[0]); }, 500); }
  },
  badgeToast: function(b){
    showToast("🏆 " + b.name + "!");
    AudioService.effect("reward");
    AudioService.say(b.name, {rate:0.8});
    FX.confetti(70);
  },
  star: function(n, el){
    n = n||1;
    Store.addStars(n);
    FX.starPop(el);
    AudioService.effect("correct");
  }
};

/* Any change to the saved state re-checks the badge rules. */
Store.subscribe(function(){ Rewards.check(); });
