/* Little Learners — Fullscreen & Dual Orientation Controller */

export function isFullscreen() {
  return !!(
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement
  );
}

export function toggleFullscreen() {
  if (!isFullscreen()) {
    var elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch(function () {});
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen().catch(function () {});
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }
}

export function initFullscreen() {
  var btn = document.getElementById("btn-fullscreen");
  if (btn) {
    btn.addEventListener("click", function () {
      toggleFullscreen();
    });
  }

  function updateBtn() {
    if (btn) {
      btn.textContent = isFullscreen() ? "🗗" : "⛶";
      btn.setAttribute("title", isFullscreen() ? "Exit Fullscreen" : "Full Screen");
      btn.setAttribute("aria-label", isFullscreen() ? "Exit Fullscreen" : "Full Screen");
    }
  }

  document.addEventListener("fullscreenchange", updateBtn);
  document.addEventListener("webkitfullscreenchange", updateBtn);

  /* Ensure prompt stays hidden as both orientations are natively supported */
  var prompt = document.getElementById("rotate-prompt");
  if (prompt) prompt.hidden = true;
}
