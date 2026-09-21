import { h, esc, shuffle, pick, sample, byId, repeatEmoji, fmtTime } from "../core/dom.js";
import { DATA } from "../data/index.js";
import { Store } from "../core/store.js";
import { UI, Routes } from "../core/router.js";
import { AudioService } from "../core/audio-service.js";
import { FX } from "../core/fx.js";
import { Rewards } from "../core/rewards.js";
import { speakerBtn } from "../widgets/speaker-button.js";
import { parentGate } from "./parent.js";

/* Built-in Dictation Word Lists */
export const DICTATION_PRESETS = {
  custom: { name: "Parent Words", emoji: "⭐" },
  sight: {
    name: "Sight Words",
    emoji: "📝",
    list: [
      { word: "the", emoji: "👉", hint: "The cat" },
      { word: "and", emoji: "➕", hint: "You and me" },
      { word: "can", emoji: "💪", hint: "I can do it" },
      { word: "see", emoji: "👀", hint: "I can see" },
      { word: "big", emoji: "🐘", hint: "Very big" },
      { word: "sun", emoji: "☀️", hint: "Bright sun" },
      { word: "run", emoji: "🏃", hint: "Run fast" },
      { word: "play", emoji: "🎮", hint: "Play games" }
    ]
  },
  animals: {
    name: "Animal Words",
    emoji: "🐶",
    list: DATA.animals.map(function (a) {
      return { word: a.name.toLowerCase().replace(/[^a-z]/g, ""), emoji: a.emoji, hint: a.name };
    }).filter(function (x) { return x.word.length <= 6; })
  },
  cvc: {
    name: "Easy Words",
    emoji: "🍎",
    list: [
      { word: "cat", emoji: "🐱", hint: "Meow" },
      { word: "dog", emoji: "🐶", hint: "Woof" },
      { word: "pen", emoji: "✏️", hint: "Write with it" },
      { word: "cup", emoji: "🥤", hint: "Drink from it" },
      { word: "hat", emoji: "🎩", hint: "Wear on head" },
      { word: "box", emoji: "📦", hint: "Square container" },
      { word: "bug", emoji: "🐛", hint: "Little insect" },
      { word: "bus", emoji: "🚌", hint: "Big vehicle" }
    ]
  }
};

Routes.dictation = function (p) {
  var catKey = p.cat || "sight";
  var mode = p.mode || "bubbles"; // "bubbles" or "keyboard"
  var index = p.index | 0;

  UI.setTitle("✍️ Dictation Studio", "Listen, Build & Spell");

  var wordList = [];
  if (catKey === "custom") {
    wordList = Store.s.customDictation || [];
    if (wordList.length === 0) {
      wordList = [
        { word: "star", emoji: "⭐", hint: "Shines bright" },
        { word: "happy", emoji: "😊", hint: "Feeling joyful" }
      ];
    }
  } else {
    wordList = (DICTATION_PRESETS[catKey] && DICTATION_PRESETS[catKey].list) || DICTATION_PRESETS.sight.list;
  }

  index = Math.max(0, Math.min(wordList.length - 1, index));
  var currentItem = wordList[index];
  var targetWord = currentItem.word.toLowerCase();

  var wrap = h('<div></div>');

  /* Category & Mode Bar */
  var topRow = h('<div style="display:flex;gap:8px;overflow-x:auto;padding-bottom:10px;scrollbar-width:none"></div>');

  Object.keys(DICTATION_PRESETS).forEach(function (k) {
    var item = DICTATION_PRESETS[k];
    var btn = h('<button class="pill" ' + (catKey === k ? 'aria-selected="true"' : '') + '>' + item.emoji + ' ' + item.name + '</button>');
    btn.addEventListener("click", function () {
      AudioService.effect("tap");
      UI.setParams({ cat: k, mode: mode, index: 0 });
    });
    topRow.appendChild(btn);
  });

  /* Parent Upload Quick Button */
  var parentBtn = h('<button class="pill" style="background:var(--surface);border-color:var(--coral)">➕ Parent Upload</button>');
  parentBtn.addEventListener("click", function () {
    AudioService.effect("tap");
    parentGate();
  });
  topRow.appendChild(parentBtn);
  wrap.appendChild(topRow);

  /* Mode Switcher: Bubbles vs Keyboard */
  var modeRow = h('<div style="display:flex;justify-content:center;gap:10px;margin-bottom:14px"></div>');
  var bBubbles = h('<button class="btn ' + (mode === "bubbles" ? "sun" : "ghost") + '" style="padding:8px 18px;font-size:14px">🎈 Bubble Tiles</button>');
  var bKeyboard = h('<button class="btn ' + (mode === "keyboard" ? "sun" : "ghost") + '" style="padding:8px 18px;font-size:14px">⌨️ ABC Keyboard</button>');

  bBubbles.addEventListener("click", function () {
    AudioService.effect("tap");
    UI.setParams({ cat: catKey, mode: "bubbles", index: index });
  });
  bKeyboard.addEventListener("click", function () {
    AudioService.effect("tap");
    UI.setParams({ cat: catKey, mode: "keyboard", index: index });
  });

  modeRow.appendChild(bBubbles);
  modeRow.appendChild(bKeyboard);
  wrap.appendChild(modeRow);

  /* Dictation Card Stage */
  var card = h(
    '<div class="qcard" style="position:relative;overflow:hidden">' +
      '<div class="qsub">Word ' + (index + 1) + ' of ' + wordList.length + '</div>' +
      '<div style="margin:12px 0">' +
        '<button id="ll-dict-speak" class="speaker bouncing" style="font-size:22px;padding:16px 32px">🔊 Tap to Listen</button>' +
      '</div>' +
      '<div style="display:flex;gap:10px;justify-content:center;margin-bottom:16px">' +
        '<button id="ll-dict-slow" class="btn ghost" style="padding:8px 16px;font-size:13.5px">🐢 Say Slowly</button>' +
        '<button id="ll-dict-hint" class="btn ghost" style="padding:8px 16px;font-size:13.5px">💡 Picture Hint</button>' +
      '</div>' +
      '<div id="ll-hint-box" hidden style="font-size:52px;margin-bottom:12px;animation:pop .3s">' +
        (currentItem.emoji || "✍️") +
        '<div style="font-size:14px;font-weight:900;color:var(--ink-soft)">' + esc(currentItem.hint || currentItem.word) + '</div>' +
      '</div>' +
      '<!-- Answer Slots -->' +
      '<div id="ll-slots" style="display:flex;gap:8px;justify-content:center;margin:16px 0 20px;flex-wrap:wrap"></div>' +
      '<!-- Letter Input Area -->' +
      '<div id="ll-input-host"></div>' +
      '<div class="feedback" id="ll-fb"></div>' +
    '</div>'
  );
  wrap.appendChild(card);

  var speakBtn = card.querySelector("#ll-dict-speak");
  var slowBtn = card.querySelector("#ll-dict-slow");
  var hintBtn = card.querySelector("#ll-dict-hint");
  var hintBox = card.querySelector("#ll-hint-box");
  var slotsHost = card.querySelector("#ll-slots");
  var inputHost = card.querySelector("#ll-input-host");
  var fb = card.querySelector("#ll-fb");

  /* Setup slots */
  var userLetters = [];
  function renderSlots() {
    slotsHost.innerHTML = "";
    for (var i = 0; i < targetWord.length; i++) {
      var char = userLetters[i] || "";
      var slot = h(
        '<div class="chip letterform" style="width:54px;height:58px;font-size:28px;font-weight:800;' +
          (char ? 'background:var(--sun);border-color:var(--clay);color:#4A3200;transform:scale(1.04)' : 'background:var(--surface2);border:3px dashed var(--line)') +
          '">' + char.toUpperCase() + '</div>'
      );
      slotsHost.appendChild(slot);
    }
  }

  /* Audio Dictation triggers */
  function playDictation(slow) {
    FX.bounce(speakBtn);
    if (slow) {
      AudioService.say(targetWord.split("").join(" . "), { rate: 0.5, pitch: 1.1 });
    } else {
      AudioService.say("Spell the word: " + targetWord + ". " + targetWord, { rate: 0.75 });
    }
  }

  speakBtn.addEventListener("click", function () { playDictation(false); });
  slowBtn.addEventListener("click", function () { playDictation(true); });
  hintBtn.addEventListener("click", function () {
    hintBox.hidden = !hintBox.hidden;
    AudioService.effect("tap");
  });

  /* Check Answer */
  function checkWord() {
    var attempt = userLetters.join("").toLowerCase();
    if (attempt === targetWord) {
      fb.className = "feedback good";
      fb.textContent = "🎉 Excellent! " + targetWord.toUpperCase() + " is correct!";
      AudioService.effect("reward");
      FX.confetti(60);
      Rewards.star(1, speakBtn);
      setTimeout(function () {
        AudioService.say("Great job! " + targetWord + " is correct!", { rate: 0.8 });
      }, 300);

      setTimeout(function () {
        if (index < wordList.length - 1) {
          UI.setParams({ cat: catKey, mode: mode, index: index + 1 });
        } else {
          UI.toast("🎉 You completed this dictation list!");
          UI.setParams({ cat: catKey, mode: mode, index: 0 });
        }
      }, 1600);
    } else if (userLetters.length === targetWord.length) {
      fb.className = "feedback try";
      fb.textContent = "Try Again! 😊";
      AudioService.effect("wrong");
      setTimeout(function () {
        userLetters = [];
        renderSlots();
        renderInput();
        fb.textContent = "";
      }, 800);
    }
  }

  function addLetter(letter) {
    if (userLetters.length < targetWord.length) {
      userLetters.push(letter);
      AudioService.say(letter, { rate: 0.8 });
      renderSlots();
      checkWord();
    }
  }

  function removeLastLetter() {
    if (userLetters.length > 0) {
      userLetters.pop();
      AudioService.effect("tap");
      renderSlots();
      renderInput();
      fb.textContent = "";
    }
  }

  /* Render Letter Bubbles or ABC Keyboard */
  function renderInput() {
    inputHost.innerHTML = "";

    if (mode === "bubbles") {
      /* Generate tiles: target characters + random distractors */
      var alphabet = "abcdefghijklmnopqrstuvwxyz";
      var distractors = [];
      while (distractors.length < 2) {
        var r = alphabet[Math.floor(Math.random() * 26)];
        if (targetWord.indexOf(r) === -1 && distractors.indexOf(r) === -1) distractors.push(r);
      }
      var pool = shuffle(targetWord.split("").concat(distractors));

      var tileGrid = h('<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin:14px 0"></div>');
      pool.forEach(function (char) {
        var b = h('<button class="chip letterform pop" style="min-width:58px;height:60px;font-size:28px;font-weight:800;background:var(--surface);border:4px solid var(--line);box-shadow:0 6px 0 var(--press)">' + char.toUpperCase() + '</button>');
        b.addEventListener("click", function () {
          addLetter(char);
        });
        tileGrid.appendChild(b);
      });
      inputHost.appendChild(tileGrid);
    } else {
      /* Onscreen Keyboard */
      var kbd = h('<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:6px;max-width:500px;margin:14px auto 0"></div>');
      var keys = "abcdefghijklmnopqrstuvwxyz".split("");
      keys.forEach(function (char) {
        var k = h('<button class="chip letterform" style="min-width:0;height:48px;font-size:20px;font-weight:800">' + char.toUpperCase() + '</button>');
        k.addEventListener("click", function () {
          addLetter(char);
        });
        kbd.appendChild(k);
      });
      inputHost.appendChild(kbd);
    }

    /* Undo & Skip Row */
    var actionRow = h('<div style="display:flex;gap:12px;justify-content:center;margin-top:16px"></div>');
    var undoBtn = h('<button class="btn ghost" style="padding:10px 20px;font-size:14px">⌫ Undo</button>');
    var skipBtn = h('<button class="btn primary" style="padding:10px 20px;font-size:14px">Next Word ➡️</button>');

    undoBtn.addEventListener("click", function () { removeLastLetter(); });
    skipBtn.addEventListener("click", function () {
      AudioService.effect("page");
      UI.setParams({ cat: catKey, mode: mode, index: (index + 1) % wordList.length });
    });

    actionRow.appendChild(undoBtn);
    actionRow.appendChild(skipBtn);
    inputHost.appendChild(actionRow);
  }

  renderSlots();
  renderInput();

  setTimeout(function () {
    playDictation(false);
  }, 400);

  return wrap;
};
