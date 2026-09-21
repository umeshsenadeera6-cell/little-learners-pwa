/* Small bottom toast. Used by rewards and by any screen through UI.toast(). */
export function showToast(msg){
  var t = document.getElementById("toast");
  if(!t) return;
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(function(){ t.classList.remove("show"); }, 2200);
}
