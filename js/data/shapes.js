/* Little Learners — content data. Add a lesson here; no screen changes needed. */

export const shapes = [
  {id:"circle",name:"Circle",svg:'<circle cx="50" cy="50" r="42"/>',ex:[["⚽","Ball"],["🍊","Orange"],["🕐","Clock"]]},
  {id:"square",name:"Square",svg:'<rect x="10" y="10" width="80" height="80" rx="6"/>',ex:[["🪟","Window"],["🧇","Waffle"],["📦","Box"]]},
  {id:"triangle",name:"Triangle",svg:'<polygon points="50,8 94,90 6,90"/>',ex:[["🍕","Pizza"],["⛰️","Mountain"],["🎪","Tent"]]},
  {id:"rectangle",name:"Rectangle",svg:'<rect x="6" y="24" width="88" height="52" rx="6"/>',ex:[["🚪","Door"],["📱","Phone"],["📕","Book"]]},
  {id:"star",name:"Star",svg:'<polygon points="50,4 62,37 97,37 68,58 79,92 50,71 21,92 32,58 3,37 38,37"/>',ex:[["⭐","Star"],["✨","Sparkle"],["🌟","Night sky"]]},
  {id:"heart",name:"Heart",svg:'<path d="M50 90 C10 62 6 34 24 22 C38 13 50 26 50 33 C50 26 62 13 76 22 C94 34 90 62 50 90Z"/>',ex:[["❤️","Love"],["💌","Card"],["🎈","Balloon"]]},
  {id:"oval",name:"Oval",svg:'<ellipse cx="50" cy="50" rx="45" ry="31"/>',ex:[["🥚","Egg"],["🏉","Ball"],["🪞","Mirror"]]},
  {id:"diamond",name:"Diamond",svg:'<polygon points="50,5 95,50 50,95 5,50"/>',ex:[["💎","Gem"],["🪁","Kite"],["♦️","Card"]]}
];
shapes.forEach(function(s,i){ s.hue = ["var(--coral)","var(--sky)","var(--sun)","var(--leaf)","var(--grape)","var(--bubble)","var(--mint)","var(--clay)"][i]; });
