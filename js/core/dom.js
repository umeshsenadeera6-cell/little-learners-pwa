/* Tiny DOM + array helpers shared by every screen. */
export function h(html){ var t=document.createElement("template"); t.innerHTML=html.trim(); return t.content.firstElementChild; }
export function esc(s){ return String(s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c];}); }
export function shuffle(a){ a=a.slice(); for(var i=a.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)); var t=a[i]; a[i]=a[j]; a[j]=t; } return a; }
export function pick(a){ return a[Math.floor(Math.random()*a.length)]; }
export function sample(a,n){ return shuffle(a).slice(0,n); }
export function byId(list,id){ return list.filter(function(x){return x.id===id;})[0]; }
export function repeatEmoji(e,n){ var o=""; for(var i=0;i<n;i++) o+=e; return o; }

export function fmtTime(sec){
  var m = Math.floor(sec/60), hr = Math.floor(m/60);
  if(hr) return hr+"h "+(m%60)+"m";
  if(m) return m+" min";
  return sec+" sec";
}
