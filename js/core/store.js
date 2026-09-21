import { DATA } from "../data/index.js";

/* Local-first persistence. Mirrors the Flutter StorageService (SharedPreferences / Hive). */
/* Local-first persistence. In the Flutter build this maps 1:1 to a
   StorageService backed by SharedPreferences / Hive — same shape, same keys. */
const KEY = "little_learners_v1";
export const Store = {
  _listeners: [],
  subscribe: function(fn){ this._listeners.push(fn); },
  notify: function(){ for(var i=0;i<this._listeners.length;i++){ try{ this._listeners[i](this.s); }catch(e){} } },
  s: null,
  fresh: function(){
    return {
      stars:0, badges:[], seconds:0,
      seen:{abc:{},numbers:{},colours:{},animals:{},shapes:{},words:{}},
      quiz:{correct:0, wrong:0, byModule:{}},
      games:{},
      customDictation:[
        {word:"star", emoji:"⭐", hint:"Shines in the sky"},
        {word:"apple", emoji:"🍎", hint:"Sweet red fruit"},
        {word:"happy", emoji:"😊", hint:"Feeling joyful"}
      ],
      settings:{sound:true, music:false, animation:true, language:"en", theme:"system"},
      lastVisit:Date.now()
    };
  },
  load: function(){
    var d = this.fresh();
    try{
      var raw = localStorage.getItem(KEY);
      if(raw){
        var p = JSON.parse(raw);
        d.stars = p.stars||0; d.seconds = p.seconds||0;
        d.badges = Array.isArray(p.badges)?p.badges:[];
        d.games = p.games||{};
        if(Array.isArray(p.customDictation)) d.customDictation = p.customDictation;
        if(p.seen) for(var k in d.seen){ d.seen[k] = p.seen[k]||{}; }
        if(p.quiz) d.quiz = {correct:p.quiz.correct||0, wrong:p.quiz.wrong||0, byModule:p.quiz.byModule||{}};
        if(p.settings) for(var q in d.settings){ if(q in p.settings) d.settings[q]=p.settings[q]; }
      }
    }catch(e){ /* private mode / blocked storage — carry on in memory */ }
    this.s = d; return d;
  },
  save: function(){ try{ localStorage.setItem(KEY, JSON.stringify(this.s)); }catch(e){} },
  reset: function(){ this.s = this.fresh(); this.save(); },
  addCustomWord: function(word, emoji, hint){
    if(!word) return false;
    var clean = word.trim().toLowerCase().replace(/[^a-z]/g, "");
    if(!clean) return false;
    if(!this.s.customDictation) this.s.customDictation = [];
    this.s.customDictation.push({word:clean, emoji:emoji||"✍️", hint:hint||""});
    this.save(); this.notify(); return true;
  },
  removeCustomWord: function(index){
    if(this.s.customDictation && index >= 0 && index < this.s.customDictation.length){
      this.s.customDictation.splice(index, 1);
      this.save(); this.notify(); return true;
    }
    return false;
  },
  importCustomWords: function(rawText){
    if(!rawText) return 0;
    var parts = rawText.split(/[\n,;]+/);
    var added = 0;
    var self = this;
    parts.forEach(function(p){
      var w = p.trim().toLowerCase().replace(/[^a-z]/g, "");
      if(w && w.length >= 2){
        if(!self.s.customDictation) self.s.customDictation = [];
        self.s.customDictation.push({word:w, emoji:"✍️", hint:""});
        added++;
      }
    });
    if(added > 0){ this.save(); this.notify(); }
    return added;
  },
  markSeen: function(mod, id){
    if(!this.s.seen[mod]) this.s.seen[mod] = {};
    if(!this.s.seen[mod][id]){ this.s.seen[mod][id] = 1; this.save(); Store.notify(); return true; }
    return false;
  },
  isSeen: function(mod,id){ return !!(this.s.seen[mod] && this.s.seen[mod][id]); },
  seenCount: function(mod){ return Object.keys(this.s.seen[mod]||{}).length; },
  moduleTotal: function(mod){ var m = DATA.modules.filter(function(x){return x.id===mod;})[0]; return m?m.total:1; },
  pct: function(mod){ return Math.round(100*this.seenCount(mod)/this.moduleTotal(mod)); },
  addStars: function(n){ this.s.stars += n; this.save(); Store.notify(); },
  quizResult: function(mod, ok){
    var q=this.s.quiz; if(ok) q.correct++; else q.wrong++;
    if(!q.byModule[mod]) q.byModule[mod]={correct:0,wrong:0};
    q.byModule[mod][ok?"correct":"wrong"]++;
    this.save(); Store.notify();
  },
  playedGame: function(id){ this.s.games[id]=(this.s.games[id]||0)+1; this.save(); Store.notify(); }
};
