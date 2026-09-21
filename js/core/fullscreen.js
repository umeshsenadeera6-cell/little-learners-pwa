/* Little Learners — Fullscreen & Orientation Controller */

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
    lockOrientation();
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

export function lockOrientation() {
  try {
    if (screen.orientation && screen.orientation.lock) {
      screen.orientation.lock("landscape").catch(function () {
        /* Orientation locking unsupported or requires user gesture/standalone mode */
      });
    }
  } catch (e) {}
}

export function checkOrientation() {
  var prompt = document.getElementById("rotate-prompt");
  if (!prompt) return;

  var isPortrait = window.innerHeight > window.innerWidth && window.innerWidth < 768;
  var isTouch = "ontouchend" in window || navigator.maxTouchPoints > 0;

  if (isPortrait && isTouch) {
    prompt.hidden = false;
  } else {
    prompt.hidden = true;
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

  window.addEventListener("resize", checkOrientation);
  window.addEventListener("orientationchange", checkOrientation);

  /* Attempt locking on first user touch / click */
  document.addEventListener("pointerdown", function () {
    lockOrientation();
  }, { once: true });

  checkOrientation();
}
