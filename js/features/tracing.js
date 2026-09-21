import { h, esc } from "../core/dom.js";
import { DATA } from "../data/index.js";
import { Store } from "../core/store.js";
import { UI, Routes } from "../core/router.js";
import { AudioService } from "../core/audio-service.js";
import { FX } from "../core/fx.js";
import { Rewards } from "../core/rewards.js";
import { TracingEngine } from "../engine/tracingEngine.js";
import { parentGate } from "./parent.js";

/* --------------------------- TRACING FEATURE ---------------------------- */

/* Help helper to get dataset by category */
function getTracingCategoryData(cat) {
  if (cat === "numbers") return DATA.NUMBER_TRACING;
  if (cat === "shapes") return DATA.SHAPE_TRACING;
  return DATA.ALPHABET_TRACING;
}

function getTracingKeys(cat) {
  return Object.keys(getTracingCategoryData(cat));
}

/* 1. MAIN TRACING DASHBOARD */
Routes.tracing = function (p) {
  UI.setTitle("✏️ Trace & Learn", "Follow the dots and learn to write!");
  var wrap = h('<div></div>');

  /* Daily Challenge Banner */
  var daily = Store.s.dailyChallenge || { done: 0, total: 3, date: new Date().toDateString() };
  if (daily.date !== new Date().toDateString()) {
    daily = { done: 0, total: 3, date: new Date().toDateString() };
    Store.s.dailyChallenge = daily;
    Store.save();
  }
  var pctDaily = Math.min(100, Math.round((daily.done / daily.total) * 100));

  var challengeCard = h(
    '<div class="qcard" style="background:linear-gradient(135deg,#FFF7E6,#FFE8B5);border:3px solid var(--clay);margin-bottom:20px;text-align:left;position:relative;overflow:hidden">' +
      '<div style="display:flex;align-items:center;gap:12px">' +
        '<div style="font-size:38px">🎯</div>' +
        '<div style="flex:1">' +
          '<div style="font-weight:900;font-size:17px;color:var(--ink)">Today\'s Tracing Challenge</div>' +
          '<div style="font-size:13.5px;color:var(--ink-soft);font-weight:800;margin:2px 0 6px">Trace 3 items today to earn ⭐ +5 bonus stars!</div>' +
          '<div class="pbar" style="height:12px"><span style="width:' + pctDaily + '%"></span></div>' +
        '</div>' +
        '<div style="font-weight:900;font-size:16px;color:var(--ink-soft);white-space:nowrap">' + daily.done + ' / ' + daily.total + '</div>' +
      '</div>' +
    '</div>'
  );
  wrap.appendChild(challengeCard);

  /* Calculate Progress Percentages */
  var abcKeys = Object.keys(DATA.ALPHABET_TRACING);
  var numKeys = Object.keys(DATA.NUMBER_TRACING);
  var shpKeys = Object.keys(DATA.SHAPE_TRACING);

  var abcSeen = abcKeys.filter(function (k) { return Store.isSeen("tracing_abc", k); }).length;
  var numSeen = numKeys.filter(function (k) { return Store.isSeen("tracing_num", k); }).length;
  var shpSeen = shpKeys.filter(function (k) { return Store.isSeen("tracing_shp", k); }).length;

  var abcPct = Math.round((abcSeen / abcKeys.length) * 100);
  var numPct = Math.round((numSeen / numKeys.length) * 100);
  var shpPct = Math.round((shpSeen / shpKeys.length) * 100);

  /* Category Cards Grid */
  var grid = h('<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px;margin-bottom:24px"></div>');

  var cardsData = [
    { cat: "abc", name: "🔤 ABC Tracing", desc: "Trace letters A–Z", seen: abcSeen, total: abcKeys.length, pct: abcPct, bg: "linear-gradient(135deg,#FFD166,#FFAA4C)" },
    { cat: "numbers", name: "🔢 Number Tracing", desc: "Trace numbers 1–20", seen: numSeen, total: numKeys.length, pct: numPct, bg: "linear-gradient(135deg,#8ED8FF,#45B6F5)" },
    { cat: "shapes", name: "🔷 Shape Tracing", desc: "Trace basic shapes", seen: shpSeen, total: shpKeys.length, pct: shpPct, bg: "linear-gradient(135deg,#C7B2FF,#A97BEA)" }
  ];

  cardsData.forEach(function (c) {
    var card = h(
      '<div class="stage-card pop" style="background:' + c.bg + ';color:#2C1A00;text-align:left;padding:20px;border-radius:24px;box-shadow:0 8px 0 rgba(0,0,0,0.1);cursor:pointer;position:relative;overflow:hidden">' +
        '<div style="font-size:24px;font-weight:900;margin-bottom:4px">' + c.name + '</div>' +
        '<div style="font-size:14px;font-weight:800;opacity:0.9;margin-bottom:14px">' + c.desc + '</div>' +
        '<div style="font-size:13.5px;font-weight:900;margin-bottom:6px;display:flex;justify-content:space-between">' +
          '<span>' + c.seen + ' / ' + c.total + ' completed</span>' +
          '<span>' + c.pct + '%</span>' +
        '</div>' +
        '<div class="pbar" style="background:rgba(255,255,255,0.4);height:12px"><span style="background:#FFF;width:' + c.pct + '%"></span></div>' +
        '<button class="btn sun" style="margin-top:16px;width:100%;font-size:16px;box-shadow:0 4px 0 rgba(0,0,0,0.15)">▶ START TRACING</button>' +
      '</div>'
    );
    card.addEventListener("click", function () {
      AudioService.effect("tap");
      UI.go("trace_grid", { cat: c.cat });
    });
    grid.appendChild(card);
  });
  wrap.appendChild(grid);

  /* Free Draw Banner */
  var freedrawCard = h(
    '<div class="qcard pop" style="background:linear-gradient(135deg,#A8ECC0,#5CD292);color:#0A3A1B;cursor:pointer;display:flex;align-items:center;gap:16px;padding:18px 24px">' +
      '<div style="font-size:42px">🎨</div>' +
      '<div style="flex:1;text-align:left">' +
        '<div style="font-size:20px;font-weight:900">Free Draw Studio</div>' +
        '<div style="font-size:14px;font-weight:800;opacity:0.9">Draw, doodle and practice writing freely with colorful pencils!</div>' +
      '</div>' +
      '<button class="btn sun" style="padding:10px 22px;font-size:15px">🎨 OPEN STUDIO</button>' +
    '</div>'
  );
  freedrawCard.addEventListener("click", function () {
    AudioService.effect("tap");
    UI.go("trace_freedraw", {});
  });
  wrap.appendChild(freedrawCard);

  return wrap;
};

/* 2. LESSON SELECTION GRID */
Routes.trace_grid = function (p) {
  var cat = p.cat || "abc";
  var catNames = { abc: "🔤 ABC Tracing", numbers: "🔢 Number Tracing", shapes: "🔷 Shape Tracing" };
  UI.setTitle("✏️ " + catNames[cat], "Select a lesson to trace!");

  var wrap = h('<div></div>');
  var dataMap = getTracingCategoryData(cat);
  var keys = Object.keys(dataMap);
  var storeKey = "tracing_" + cat;

  var grid = h('<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(80px,1fr));gap:12px;margin:16px 0"></div>');

  keys.forEach(function (key, idx) {
    var item = dataMap[key];
    var isDone = Store.isSeen(storeKey, key);
    var isCurrent = idx === 0 || Store.isSeen(storeKey, keys[idx - 1]);

    var tile = h(
      '<button class="tile pop" style="min-height:90px;position:relative;padding:10px;display:flex;flex-direction:column;align-items:center;justify-content:center">' +
        '<span style="font-size:32px;font-weight:900;font-family:\'Baloo 2\',sans-serif">' + (item.emoji || key) + '</span>' +
        '<span style="font-size:13px;font-weight:900;margin-top:2px">' + key + '</span>' +
        (isDone ? '<span style="position:absolute;top:4px;right:6px;font-size:14px">⭐</span>' : '') +
      '</button>'
    );

    if (isDone) {
      tile.style.background = "var(--mint)";
      tile.style.borderColor = "var(--clay)";
    } else if (isCurrent) {
      tile.style.background = "var(--sun)";
    }

    tile.addEventListener("click", function () {
      AudioService.effect("pop");
      UI.go("trace_lesson", { cat: cat, key: key, index: idx });
    });
    grid.appendChild(tile);
  });

  wrap.appendChild(grid);
  return wrap;
};

/* 3. MAIN TRACING LESSON WORKSPACE */
Routes.trace_lesson = function (p) {
  var cat = p.cat || "abc";
  var dataMap = getTracingCategoryData(cat);
  var keys = Object.keys(dataMap);
  var index = p.index | 0;
  index = Math.max(0, Math.min(keys.length - 1, index));
  var key = keys[index];
  var template = dataMap[key];

  UI.setTitle("✏️ Trace " + key, (template.word || template.hint));

  var wrap = h('<div style="max-width:800px;margin:0 auto"></div>');

  /* Header Controls Bar */
  var topControls = h(
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px">' +
      '<button id="ll-trace-back" class="btn ghost" style="padding:8px 16px;font-size:14px">⬅️ Lessons</button>' +
      '<div style="font-size:15px;font-weight:900;color:var(--ink-soft)">Progress: ' + (index + 1) + ' / ' + keys.length + '</div>' +
      '<button id="ll-trace-full" class="btn ghost" style="padding:8px 16px;font-size:14px">⛶ Fullscreen</button>' +
    '</div>'
  );
  wrap.appendChild(topControls);

  topControls.querySelector("#ll-trace-back").addEventListener("click", function () {
    AudioService.effect("page");
    UI.go("trace_grid", { cat: cat });
  });

  topControls.querySelector("#ll-trace-full").addEventListener("click", function () {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(function () {});
    } else {
      document.exitFullscreen().catch(function () {});
    }
  });

  /* Main Tracing Stage Card */
  var stageCard = h(
    '<div class="qcard" style="padding:16px;position:relative;background:var(--surface);border:4px solid var(--line);border-radius:28px;box-shadow:0 10px 0 var(--press)">' +
      '<!-- Top Info -->' +
      '<div style="display:flex;align-items:center;justify-content:center;gap:12px;margin-bottom:10px">' +
        '<span style="font-size:42px">' + (template.emoji || "✍️") + '</span>' +
        '<div>' +
          '<div style="font-size:28px;font-weight:900;line-height:1;color:var(--ink)">' + esc(template.character) + '</div>' +
          '<div style="font-size:14px;font-weight:800;color:var(--ink-soft)">' + esc(template.hint || template.word) + '</div>' +
        '</div>' +
      '</div>' +

      '<!-- Interactive SVG Tracing Canvas -->' +
      '<div style="position:relative;width:100%;max-width:420px;height:380px;margin:0 auto;background:var(--surface2);border:3px dashed var(--line);border-radius:24px;touch-action:none;user-select:none;overflow:hidden">' +
        '<svg id="ll-trace-svg" viewBox="0 0 100 100" style="width:100%;height:100%;touch-action:none;user-select:none;cursor:crosshair">' +
          '<!-- Background Guide Paths -->' +
          '<g id="ll-guide-group"></g>' +
          '<!-- Completed User Strokes -->' +
          '<g id="ll-completed-group"></g>' +
          '<!-- Active Drawing User Stroke -->' +
          '<path id="ll-active-user-path" d="" fill="none" stroke="var(--coral)" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" />' +
          '<!-- Demo Hand Pointer -->' +
          '<circle id="ll-demo-hand" r="4" fill="var(--sun)" stroke="#000" stroke-width="1" hidden />' +
        '</svg>' +
        '<div id="ll-trace-toast" style="position:absolute;bottom:12px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.75);color:#FFF;padding:6px 16px;border-radius:999px;font-size:13px;font-weight:900;pointer-events:none;opacity:0;transition:opacity .3s">Follow the dots 😊</div>' +
      '</div>' +

      '<!-- Tracing Action Buttons -->' +
      '<div style="display:flex;gap:10px;justify-content:center;margin-top:16px;flex-wrap:wrap">' +
        '<button id="ll-trace-listen" class="speaker" style="padding:10px 18px;font-size:14px">🔊 Listen</button>' +
        '<button id="ll-trace-demo" class="btn ghost" style="padding:10px 18px;font-size:14px">▶ Watch Demo</button>' +
        '<button id="ll-trace-reset" class="btn ghost" style="padding:10px 18px;font-size:14px">↻ Try Again</button>' +
        '<button id="ll-trace-next" class="btn primary" style="padding:10px 18px;font-size:14px">Next ➡️</button>' +
      '</div>' +
    '</div>'
  );
  wrap.appendChild(stageCard);

  var svgEl = stageCard.querySelector("#ll-trace-svg");
  var guideGroup = stageCard.querySelector("#ll-guide-group");
  var completedGroup = stageCard.querySelector("#ll-completed-group");
  var activeUserPath = stageCard.querySelector("#ll-active-user-path");
  var demoHand = stageCard.querySelector("#ll-demo-hand");
  var toastEl = stageCard.querySelector("#ll-trace-toast");

  var listenBtn = stageCard.querySelector("#ll-trace-listen");
  var demoBtn = stageCard.querySelector("#ll-trace-demo");
  var resetBtn = stageCard.querySelector("#ll-trace-reset");
  var nextBtn = stageCard.querySelector("#ll-trace-next");

  /* Render SVG Guide Paths (Dotted guide, pulsing start dot, stroke numbers) */
  function renderGuide(currentStrokeIdx) {
    guideGroup.innerHTML = "";
    template.strokes.forEach(function (s, idx) {
      var isCurrent = idx === currentStrokeIdx;
      var isPast = idx < currentStrokeIdx;

      // Guide Path
      var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", s.path);
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", isPast ? "var(--mint)" : isCurrent ? "var(--clay)" : "rgba(0,0,0,0.15)");
      path.setAttribute("stroke-width", "7");
      path.setAttribute("stroke-linecap", "round");
      path.setAttribute("stroke-linejoin", "round");
      if (!isPast) path.setAttribute("stroke-dasharray", "3 4");
      guideGroup.appendChild(path);

      // Start Dot
      if (isCurrent) {
        var startCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        startCircle.setAttribute("cx", s.start.x);
        startCircle.setAttribute("cy", s.start.y);
        startCircle.setAttribute("r", "5");
        startCircle.setAttribute("fill", "var(--coral)");
        startCircle.setAttribute("stroke", "#FFF");
        startCircle.setAttribute("stroke-width", "2");
        guideGroup.appendChild(startCircle);

        // Stroke Order Number ① ② ③
        if (s.arrow) {
          var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
          text.setAttribute("x", s.start.x + 6);
          text.setAttribute("y", s.start.y - 4);
          text.setAttribute("font-size", "10");
          text.setAttribute("font-weight", "900");
          text.setAttribute("fill", "var(--coral)");
          text.textContent = "①②③④⑤"[idx] || (idx + 1);
          guideGroup.appendChild(text);
        }
      }
    });
  }

  function renderUserStrokes(completedArray) {
    completedGroup.innerHTML = "";
    completedArray.forEach(function (pts) {
      if (!pts || pts.length < 2) return;
      var d = "M " + pts[0].x + " " + pts[0].y;
      for (var i = 1; i < pts.length; i++) {
        d += " L " + pts[i].x + " " + pts[i].y;
      }
      var p = document.createElementNS("http://www.w3.org/2000/svg", "path");
      p.setAttribute("d", d);
      p.setAttribute("fill", "none");
      p.setAttribute("stroke", "var(--coral)");
      p.setAttribute("stroke-width", "8");
      p.setAttribute("stroke-linecap", "round");
      p.setAttribute("stroke-linejoin", "round");
      completedGroup.appendChild(p);
    });
  }

  /* Tracing Engine Setup */
  var engine = new TracingEngine(svgEl, template, {
    onStart: function () {
      AudioService.effect("tap");
    },
    onTrace: function (pt, userPts, isOnPath) {
      if (userPts.length >= 2) {
        var d = "M " + userPts[0].x + " " + userPts[0].y;
        for (var i = 1; i < userPts.length; i++) {
          d += " L " + userPts[i].x + " " + userPts[i].y;
        }
        activeUserPath.setAttribute("d", d);
      }
      if (isOnPath && Math.random() < 0.3) {
        AudioService.effect("pop");
      }
    },
    onOffPath: function (msg) {
      toastEl.style.opacity = "1";
      setTimeout(function () { toastEl.style.opacity = "0"; }, 1200);
    },
    onStrokeComplete: function (finishedIdx, nextIdx) {
      activeUserPath.setAttribute("d", "");
      renderUserStrokes(engine.completedStrokes);
      renderGuide(nextIdx);
      AudioService.effect("correct");
    },
    onComplete: function (score) {
      Store.markSeen("tracing_" + cat, key);
      // Increment daily challenge
      var d = Store.s.dailyChallenge;
      if (d && d.done < d.total) {
        d.done++;
        if (d.done === d.total) {
          Store.addStars(5);
          UI.toast("🎉 Daily Tracing Challenge Complete! +5 Stars!");
        }
      }
      Store.addStars(1);
      AudioService.effect("reward");
      FX.confetti(60);
      showSuccessModal(score);
    }
  });

  renderGuide(0);

  /* Audio pronunciation button */
  listenBtn.addEventListener("click", function () {
    AudioService.say(template.word || template.character, { rate: 0.65 });
  });

  /* Animated Stroke Demo Playback */
  demoBtn.addEventListener("click", function () {
    playAnimatedDemo();
  });

  function playAnimatedDemo() {
    demoHand.hidden = false;
    var strokes = template.strokes;
    var strokeIdx = 0;

    function animateStroke() {
      if (strokeIdx >= strokes.length) {
        demoHand.hidden = true;
        AudioService.say("Your turn!", { rate: 0.8 });
        return;
      }
      var s = strokes[strokeIdx];
      var pathEl = document.createElementNS("http://www.w3.org/2000/svg", "path");
      pathEl.setAttribute("d", s.path);
      var totalLen = pathEl.getTotalLength ? pathEl.getTotalLength() : 100;
      var step = 0;
      var totalSteps = 40;

      var timer = setInterval(function () {
        step++;
        var len = (step / totalSteps) * totalLen;
        var pt = pathEl.getPointAtLength ? pathEl.getPointAtLength(len) : { x: 50, y: 50 };
        demoHand.setAttribute("cx", pt.x);
        demoHand.setAttribute("cy", pt.y);

        if (step >= totalSteps) {
          clearInterval(timer);
          strokeIdx++;
          setTimeout(animateStroke, 300);
        }
      }, 25);
    }
    animateStroke();
  }

  resetBtn.addEventListener("click", function () {
    AudioService.effect("tap");
    activeUserPath.setAttribute("d", "");
    completedGroup.innerHTML = "";
    engine.setTemplate(template);
    renderGuide(0);
  });

  nextBtn.addEventListener("click", function () {
    AudioService.effect("page");
    UI.go("trace_lesson", { cat: cat, key: keys[(index + 1) % keys.length], index: (index + 1) % keys.length });
  });

  /* Success Celebration Modal */
  function showSuccessModal(score) {
    var title = score >= 90 ? "🌟 Amazing!" : "⭐ Great Job!";
    UI.modal(
      '<div style="font-size:52px;animation:pop .4s">🎉</div>' +
      '<h2>' + title + '</h2>' +
      '<p style="font-size:16px;font-weight:900">You traced <strong>' + template.character + '</strong> perfectly!</p>' +
      '<div style="font-size:24px;font-weight:900;color:var(--sun);margin:12px 0">⭐ +1 Star Earned!</div>' +
      '<div class="btn-row" style="margin-top:16px">' +
        '<button class="btn ghost" id="ll-succ-retry">↻ Try Again</button>' +
        '<button class="btn primary" id="ll-succ-next">Next Lesson ➡️</button>' +
      '</div>',
      function (m) {
        m.querySelector("#ll-succ-retry").addEventListener("click", function () {
          UI.closeModal();
          resetBtn.click();
        });
        m.querySelector("#ll-succ-next").addEventListener("click", function () {
          UI.closeModal();
          nextBtn.click();
        });
      }
    );
  }

  // Clean up tracing engine on view unmount
  wrap.addEventListener("DOMNodeRemovedFromDocument", function () {
    engine.destroy();
  });

  // Auto-pronounce on mount
  setTimeout(function () {
    if (UI.current() && UI.current().name === "trace_lesson") {
      AudioService.say(template.word || template.character, { rate: 0.65 });
    }
  }, 400);

  return wrap;
};

/* 4. FREE DRAW STUDIO ROUTE */
Routes.trace_freedraw = function () {
  UI.setTitle("🎨 Free Draw Studio", "Doodle & write freely!");
  var wrap = h('<div style="max-width:800px;margin:0 auto"></div>');

  var currentColor = "#FF5964";
  var currentSize = 8;
  var isEraser = false;

  var colors = ["#FF5964", "#FFADAD", "#FFD166", "#06D6A0", "#118AB2", "#A97BEA", "#000000", "#FFFFFF"];

  var card = h(
    '<div class="qcard" style="padding:16px;border:4px solid var(--line);border-radius:28px">' +
      '<!-- Canvas Tools Bar -->' +
      '<div style="display:flex;gap:8px;justify-content:center;align-items:center;margin-bottom:12px;flex-wrap:wrap">' +
        '<div id="ll-color-palette" style="display:flex;gap:6px"></div>' +
        '<div style="width:2px;height:24px;background:var(--line)"></div>' +
        '<button id="ll-btn-pencil" class="pill" aria-selected="true">✏️ Pencil</button>' +
        '<button id="ll-btn-eraser" class="pill">🧽 Eraser</button>' +
        '<button id="ll-btn-clear" class="btn ghost" style="padding:6px 14px;font-size:13px">🗑️ Clear</button>' +
        '<button id="ll-btn-save" class="btn primary" style="padding:6px 14px;font-size:13px">💾 Save</button>' +
      '</div>' +

      '<!-- HTML5 Canvas -->' +
      '<div style="width:100%;height:380px;background:#FFF;border:3px solid var(--line);border-radius:20px;touch-action:none;overflow:hidden">' +
        '<canvas id="ll-freedraw-canvas" width="700" height="450" style="width:100%;height:100%;touch-action:none;cursor:crosshair"></canvas>' +
      '</div>' +
    '</div>'
  );
  wrap.appendChild(card);

  var canvas = card.querySelector("#ll-freedraw-canvas");
  var ctx = canvas.getContext("2d");
  var paletteHost = card.querySelector("#ll-color-palette");

  var btnPencil = card.querySelector("#ll-btn-pencil");
  var btnEraser = card.querySelector("#ll-btn-eraser");
  var btnClear = card.querySelector("#ll-btn-clear");
  var btnSave = card.querySelector("#ll-btn-save");

  // Render color options
  colors.forEach(function (c) {
    var dot = h('<button style="width:28px;height:28px;border-radius:50%;background:' + c + ';border:3px solid ' + (c === currentColor ? 'var(--clay)' : 'transparent') + ';cursor:pointer;transform:' + (c === currentColor ? 'scale(1.15)' : 'scale(1)') + '"></button>');
    dot.addEventListener("click", function () {
      currentColor = c;
      isEraser = false;
      btnPencil.setAttribute("aria-selected", "true");
      btnEraser.removeAttribute("aria-current");
      renderPalette();
    });
    paletteHost.appendChild(dot);
  });

  function renderPalette() {
    var dots = paletteHost.children;
    for (var i = 0; i < dots.length; i++) {
      var c = colors[i];
      dots[i].style.borderColor = (c === currentColor && !isEraser) ? "var(--clay)" : "transparent";
      dots[i].style.transform = (c === currentColor && !isEraser) ? "scale(1.15)" : "scale(1)";
    }
  }

  btnPencil.addEventListener("click", function () {
    isEraser = false;
    btnPencil.setAttribute("aria-selected", "true");
    btnEraser.removeAttribute("aria-selected");
  });

  btnEraser.addEventListener("click", function () {
    isEraser = true;
    btnEraser.setAttribute("aria-selected", "true");
    btnPencil.removeAttribute("aria-selected");
    renderPalette();
  });

  btnClear.addEventListener("click", function () {
    AudioService.effect("tap");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });

  btnSave.addEventListener("click", function () {
    AudioService.effect("reward");
    var link = document.createElement("a");
    link.download = "my-drawing.png";
    link.href = canvas.toDataURL();
    link.click();
    UI.toast("🎉 Saved your drawing!");
  });

  // Canvas Drawing Pointer Events
  var drawing = false;
  var lastPos = null;

  function getCanvasPos(e) {
    var rect = canvas.getBoundingClientRect();
    var scaleX = canvas.width / rect.width;
    var scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  }

  canvas.addEventListener("pointerdown", function (e) {
    e.preventDefault();
    drawing = true;
    lastPos = getCanvasPos(e);
  });

  canvas.addEventListener("pointermove", function (e) {
    if (!drawing) return;
    e.preventDefault();
    var currentPos = getCanvasPos(e);

    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(currentPos.x, currentPos.y);
    ctx.strokeStyle = isEraser ? "#FFFFFF" : currentColor;
    ctx.lineWidth = isEraser ? 24 : currentSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();

    lastPos = currentPos;
  });

  window.addEventListener("pointerup", function () { drawing = false; });

  return wrap;
};
