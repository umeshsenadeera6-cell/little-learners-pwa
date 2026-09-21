/* Little Learners — application entry point.
   Imports every feature for its side effect (each one registers its routes),
   then boots the shell. */
import { Store } from "./core/store.js";
import { UI, Routes } from "./core/router.js";
import { AudioService } from "./core/audio-service.js";
import "./core/rewards.js";

import "./features/home.js";
import "./features/learn.js";
import "./features/alphabet.js";
import "./features/numbers.js";
import "./features/colours.js";
import "./features/animals.js";
import "./features/shapes.js";
import "./features/words.js";
import "./features/quiz.js";
import "./features/games.js";
import "./features/progress.js";
import "./features/parent.js";
import { applySettings } from "./features/settings.js";

/* ------------------------------ BOOT ---------------------------------- */

(function boot(){
  Store.load();
  applySettings();
  UI.init();
  UI.selectTab("home");

  /* Home-screen shortcuts: index.html?go=abc | numbers | colours | animals |
     shapes | words | games | progress */
  try{
    var go = new URLSearchParams(location.search).get("go");
    if(go){
      if(["home","learn","games","progress"].indexOf(go) > -1) UI.selectTab(go);
      else if(Routes[go]) { UI.selectTab("learn"); UI.go(go, {}); }
    }
  }catch(e){}

  /* warm up the voice list (some browsers load it async) */
  try{
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = function(){ AudioService._voices = null; };
  }catch(e){}

  /* first real gesture unlocks audio on mobile browsers */
  var unlocked = false;
  document.addEventListener("pointerdown", function(){
    if(unlocked) return; unlocked = true;
    AudioService._ctx();
    if(Store.s.settings.music) AudioService.musicStart();
  }, {once:false});

  /* gentle time-on-task counter for the parent area */
  setInterval(function(){
    if(document.hidden) return;
    Store.s.seconds += 10; Store.save(); Store.notify();
  }, 10000);

  /* keep state across artifact republishes */
  try{
    if(window.claude && window.claude.hot){
      window.claude.hot.snapshot(function(){ return {tab:UI.tab, stack:UI.stack}; });
    }
  }catch(e){}
})();

/* --------------------------- SERVICE WORKER ---------------------------- */
/* Registered last so a failure here can never stop the app from running. */
if("serviceWorker" in navigator){
  window.addEventListener("load", function(){
    navigator.serviceWorker.register("./service-worker.js").catch(function(){
      /* offline caching unavailable (e.g. opened from file://) — app still works */
    });
  });
}
