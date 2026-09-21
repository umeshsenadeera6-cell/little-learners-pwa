import { h, esc, shuffle, pick, sample, byId, repeatEmoji, fmtTime } from "../core/dom.js";
import { DATA } from "../data/index.js";
import { Store } from "../core/store.js";
import { UI, Routes } from "../core/router.js";
import { AudioService } from "../core/audio-service.js";
import { FX } from "../core/fx.js";
import { Rewards } from "../core/rewards.js";
import { parentGate } from "./parent.js";

/* ------------------------------ SETTINGS ------------------------------- */
function toggleRow(emoji, label, key, note){
  var on = Store.s.settings[key];
  var row = h('<div class="row-item"><span class="e">'+emoji+'</span>'+
    '<span class="t">'+label+(note?'<br><span style="font-size:12px;font-weight:800;color:var(--ink-soft)">'+note+'</span>':'')+'</span>'+
    '<span class="sw" role="switch" tabindex="0" aria-checked="'+on+'" aria-label="'+label+'"></span></div>');
  var sw = row.querySelector(".sw");
  function flip(){
    var v = !Store.s.settings[key];
    Store.s.settings[key] = v; Store.save();
    sw.setAttribute("aria-checked", String(v));
    applySettings();
    if(key!=="sound" || v) AudioService.effect("tap");
    UI.toast(label + (v ? " on" : " off"));
  }
  sw.addEventListener("click", flip);
  sw.addEventListener("keydown", function(e){ if(e.key===" "||e.key==="Enter"){ e.preventDefault(); flip(); } });
  return row;
}

Routes.settings = function(){
  UI.setTitle("⚙️ Settings", "Sound, motion and more");
  var wrap = h('<div></div>');

  wrap.appendChild(h('<h2 class="section-title">🔊 Sound</h2>'));
  wrap.appendChild(toggleRow("🔈","Sound", "sound", "Pronunciation and gentle effects"));
  wrap.appendChild(toggleRow("🎵","Background music", "music", "Soft and quiet — off by default"));

  wrap.appendChild(h('<h2 class="section-title">✨ Motion</h2>'));
  wrap.appendChild(toggleRow("🎞️","Animations", "animation", "Bounces, confetti and stars"));

  wrap.appendChild(h('<h2 class="section-title">🎨 Appearance</h2>'));
  var themes = [["system","🌗 Match device"],["light","☀️ Light"],["dark","🌙 Night"]];
  var trow = h('<div class="pill-tabs"></div>');
  themes.forEach(function(t){
    var b = h('<button class="pill" aria-selected="'+(Store.s.settings.theme===t[0])+'">'+t[1]+'</button>');
    b.addEventListener("click", function(){
      Store.s.settings.theme = t[0]; Store.save(); applySettings(); AudioService.effect("tap"); UI.render();
    });
    trow.appendChild(b);
  });
  wrap.appendChild(trow);

  wrap.appendChild(h('<h2 class="section-title">🌍 Language</h2>'));
  var langs = [["en","🇬🇧 English","Ready"],["si","🇱🇰 සිංහල","Coming soon"],["ta","🇱🇰 தமிழ்","Coming soon"],["ja","🇯🇵 日本語","Coming soon"]];
  langs.forEach(function(l){
    var b = h('<button class="row-item"><span class="e">'+l[1].split(" ")[0]+'</span><span class="t">'+l[1].split(" ").slice(1).join(" ")+'</span><span class="m">'+(Store.s.settings.language===l[0]?"✅ On":l[2])+'</span></button>');
    b.addEventListener("click", function(){
      if(l[0]!=="en"){ UI.toast(l[2]+" 🙂"); AudioService.effect("tap"); return; }
      Store.s.settings.language = l[0]; Store.save(); UI.render();
    });
    wrap.appendChild(b);
  });

  wrap.appendChild(h('<h2 class="section-title">👨‍👩‍👧 Grown-ups</h2>'));
  var pa = h('<button class="row-item"><span class="e">🔐</span><span class="t">Parent Area</span><span class="m">Locked ›</span></button>');
  pa.addEventListener("click", function(){ AudioService.effect("tap"); parentGate(); });
  wrap.appendChild(pa);

  var ab = h('<button class="row-item"><span class="e">ℹ️</span><span class="t">About Little Learners</span><span class="m">›</span></button>');
  ab.addEventListener("click", function(){
    AudioService.effect("tap");
    UI.modal('<div style="font-size:40px">🌈</div><h2>Little Learners</h2>'+
      '<p>A calm, colourful first learning app for children aged 3–6.<br>Version 1.0 · Works offline · No ads, no chat, no tracking.</p>'+
      '<button class="btn primary" id="okb" style="width:100%">Okay</button>',
      function(m){ m.querySelector("#okb").addEventListener("click", function(){ UI.closeModal(); }); });
  });
  wrap.appendChild(ab);

  var offline = h('<div class="card" style="margin-top:16px;background:var(--surface2);border:3px solid var(--line)">'+
    '<div style="font-weight:900;font-size:14.5px;line-height:1.55">📴 <strong>Offline ready.</strong> Every lesson, quiz and game runs without internet. '+
    'Progress is saved on this device only.</div></div>');
  wrap.appendChild(offline);
  return wrap;
};

export function applySettings(){
  var t = Store.s.settings.theme;
  if(t==="system") document.documentElement.removeAttribute("data-theme");
  else document.documentElement.setAttribute("data-theme", t);
  document.body.classList.toggle("no-anim", !Store.s.settings.animation);
  if(Store.s.settings.music && Store.s.settings.sound) AudioService.musicStart(); else AudioService.musicStop();
  if(!Store.s.settings.sound){ try{ window.speechSynthesis.cancel(); }catch(e){} }
}
