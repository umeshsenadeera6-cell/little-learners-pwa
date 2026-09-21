import { Store } from "./store.js";

/* ------------------------------- AUDIO --------------------------------- */
/* One place decides how a sound is produced. Swap `useAssets` to true once
   real recordings live in assets/audio/** and nothing else has to change. */
export const AudioService = {
  useAssets:false,          // when true, try the bundled mp3 first
  assetCache:{},
  ctx:null,
  musicNode:null,
  get on(){ return Store.s.settings.sound; },

  _ctx: function(){
    if(!this.ctx){
      try{ this.ctx = new (window.AudioContext||window.webkitAudioContext)(); }catch(e){ this.ctx=null; }
    }
    if(this.ctx && this.ctx.state==="suspended"){ this.ctx.resume().catch(function(){}); }
    return this.ctx;
  },

  /* say(): speak a short phrase with a warm, slow, child-friendly voice */
  say: function(text, opts){
    if(!this.on || !text) return;
    opts = opts||{};
    if(this.useAssets && opts.asset){ if(this._playAsset(opts.asset)) return; }
    try{
      if(!("speechSynthesis" in window)) { this.effect("tap"); return; }
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(String(text));
      u.rate = opts.rate || 0.78;
      u.pitch = opts.pitch || 1.25;
      u.volume = 1;
      u.lang = opts.lang || "en-US";
      var v = this._voice();
      if(v) u.voice = v;
      window.speechSynthesis.speak(u);
    }catch(e){ this.effect("tap"); }
  },
  _voices:null,
  _voice: function(){
    try{
      if(!this._voices || !this._voices.length) this._voices = window.speechSynthesis.getVoices();
      var pref = ["Samantha","Google UK English Female","Google US English","Karen","Moira","Microsoft Zira"];
      for(var i=0;i<pref.length;i++){
        for(var j=0;j<this._voices.length;j++){
          if(this._voices[j].name.indexOf(pref[i])>-1) return this._voices[j];
        }
      }
      for(var k=0;k<this._voices.length;k++){ if(/^en/.test(this._voices[k].lang)) return this._voices[k]; }
    }catch(e){}
    return null;
  },
  _playAsset: function(path){
    try{
      var a = this.assetCache[path] || (this.assetCache[path] = new Audio(path));
      a.currentTime = 0; a.play(); return true;
    }catch(e){ return false; }
  },

  /* effect(): gentle UI sounds — never harsh, never loud */
  effect: function(name){
    if(!this.on) return;
    var c = this._ctx(); if(!c) return;
    var recipes = {
      tap:     [[660,0.0,0.07,0.10]],
      correct: [[784,0.0,0.12,0.13],[1046,0.10,0.18,0.12]],
      wrong:   [[392,0.0,0.14,0.10],[330,0.12,0.20,0.09]],
      reward:  [[523,0.0,0.12,0.12],[659,0.10,0.12,0.12],[784,0.20,0.14,0.12],[1046,0.32,0.30,0.12]],
      page:    [[520,0.0,0.06,0.06]],
      pop:     [[880,0.0,0.05,0.09]]
    };
    var r = recipes[name]||recipes.tap;
    for(var i=0;i<r.length;i++) this._tone(c, r[i][0], r[i][1], r[i][2], r[i][3]);
  },
  _tone: function(c, freq, delay, dur, vol){
    try{
      var o=c.createOscillator(), g=c.createGain(), t=c.currentTime+delay;
      o.type="sine"; o.frequency.setValueAtTime(freq,t);
      g.gain.setValueAtTime(0.0001,t);
      g.gain.exponentialRampToValueAtTime(vol,t+0.02);
      g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
      o.connect(g); g.connect(c.destination); o.start(t); o.stop(t+dur+0.05);
    }catch(e){}
  },

  /* very quiet background music — off by default */
  musicStart: function(){
    if(!Store.s.settings.music || this.musicNode) return;
    var c=this._ctx(); if(!c) return;
    try{
      var g=c.createGain(); g.gain.value=0.035; g.connect(c.destination);
      var notes=[523.25,587.33,659.25,783.99,659.25,587.33], i=0, self=this;
      var timer=setInterval(function(){
        if(!Store.s.settings.music){ self.musicStop(); return; }
        self._tone(c, notes[i%notes.length], 0, 0.5, 0.03); i++;
      }, 900);
      this.musicNode={timer:timer,gain:g};
    }catch(e){}
  },
  musicStop: function(){ if(this.musicNode){ clearInterval(this.musicNode.timer); this.musicNode=null; } }
};
