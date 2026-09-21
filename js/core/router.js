import { h } from "./dom.js";
import { Store } from "./store.js";
import { AudioService } from "./audio-service.js";
import { showToast } from "./toast.js";

/* ------------------------------ UI SHELL ------------------------------- */
export const Routes = {};
export const UI = {
  stack: [],
  tab: "home",
  view: null, titleMain:null, titleSub:null, backBtn:null,

  init: function(){
    this.view = document.getElementById("view");
    this.titleMain = document.getElementById("ttl-main");
    this.titleSub = document.getElementById("ttl-sub");
    this.backBtn = document.getElementById("btn-back");
    var self=this;
    this.backBtn.addEventListener("click", function(){ AudioService.effect("page"); self.back(); });
    document.getElementById("btn-settings").addEventListener("click", function(){ AudioService.effect("tap"); self.go("settings"); });
    document.getElementById("starchip").addEventListener("click", function(){ AudioService.effect("tap"); self.selectTab("progress"); });
    Array.prototype.forEach.call(document.querySelectorAll("#tabbar button"), function(b){
      b.addEventListener("click", function(){ AudioService.effect("tap"); self.selectTab(b.dataset.tab); });
    });
    this.syncStars();
  },

  selectTab: function(tab){
    this.tab = tab;
    Array.prototype.forEach.call(document.querySelectorAll("#tabbar button"), function(b){
      if(b.dataset.tab===tab) b.setAttribute("aria-current","page"); else b.removeAttribute("aria-current");
    });
    this.stack = [];
    var map = {home:"home", learn:"learn", tracing:"tracing", dictation:"dictation", games:"games", progress:"progress"};
    this.go(map[tab], null, true);
  },

  go: function(name, params, replace){
    if(replace) this.stack = [];
    this.stack.push({name:name, params:params||{}});
    this.render();
  },
  back: function(){
    if(this.stack.length>1){ this.stack.pop(); this.render(); }
    else { this.selectTab(this.tab==="home"?"home":this.tab); }
  },
  current: function(){ return this.stack[this.stack.length-1]; },

  render: function(){
    var cur = this.current();
    var fn = Routes[cur.name] || Routes.home;
    this.view.innerHTML = "";
    this.backBtn.hidden = this.stack.length<=1;
    var node = fn(cur.params||{});
    node.classList.add("screen");
    this.view.appendChild(node);
    this.view.scrollTop = 0;
    this.syncStars();
  },

  setTitle: function(main, sub){
    this.titleMain.textContent = main;
    this.titleSub.textContent = sub || "";
  },
  syncStars: function(){ document.getElementById("starcount").textContent = Store.s.stars; },

  toast: showToast,

  modal: function(html, onMount){
    this.closeModal();
    var m = h('<div id="modal"><div class="box">'+html+'</div></div>');
    document.getElementById("app").appendChild(m);
    m.addEventListener("click", function(e){ if(e.target===m) UI.closeModal(); });
    if(onMount) onMount(m);
    return m;
  },
  closeModal: function(){ var m=document.getElementById("modal"); if(m) m.remove(); }
};

/* Re-render the current screen with new parameters (used by every lesson player). */
UI.setParams = function(p){ this.current().params = p; this.render(); };

/* The star chip follows the store. */
Store.subscribe(function(){ UI.syncStars(); });
