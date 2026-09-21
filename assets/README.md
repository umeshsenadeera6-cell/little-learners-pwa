# Assets

The app ships with emoji illustrations and browser speech so it runs with zero
media files. Drop real assets in here when you have them — nothing in the UI
needs to change.

```
assets/
├── audio/
│   ├── letters/    a.mp3 … z.mp3
│   ├── numbers/    1.mp3 … 20.mp3
│   ├── animals/    lion.mp3, cow.mp3 …
│   ├── words/      apple.mp3, tree.mp3 …
│   └── effects/    correct.mp3, try-again.mp3, reward.mp3
└── images/
    └── animals/    lion.png, cow.png …
```

Every content item in `js/data/` already carries its path (`audio`, `image`).

## Switching from speech synthesis to recorded audio

Open `js/core/audio-service.js` and set:

```js
useAssets: true
```

`AudioService.say()` then plays the bundled file when the item has one and falls
back to speech synthesis when it does not. No screen imports an audio file
directly, so this is the only line that changes.

Recording guidance: one short clear phrase per file, a warm unhurried voice,
peak around -3 dB, no music bed, MP3 or AAC at 96–128 kbps mono.
