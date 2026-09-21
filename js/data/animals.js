/* Little Learners — content data. Add a lesson here; no screen changes needed. */

export const animalGroups = [
  { id:"farm", name:"Farm Animals", emoji:"🚜", colour:"var(--leaf)" },
  { id:"wild", name:"Wild Animals", emoji:"🌴", colour:"var(--sun)" },
  { id:"ocean", name:"Ocean Animals", emoji:"🌊", colour:"var(--sky)" },
  { id:"insect", name:"Little Bugs", emoji:"🍃", colour:"var(--bubble)" }
];

export const animals = [
  ["Cow","farm","🐄","Moo!","Cows give us milk."],
  ["Chicken","farm","🐔","Cluck cluck!","Chickens lay eggs."],
  ["Pig","farm","🐖","Oink oink!","Pigs love to roll in mud."],
  ["Sheep","farm","🐑","Baa baa!","Sheep give us soft wool."],
  ["Goat","farm","🐐","Maa!","Goats love to climb."],
  ["Horse","farm","🐴","Neigh!","Horses can run very fast."],
  ["Lion","wild","🦁","Roar!","Lions live in groups."],
  ["Elephant","wild","🐘","Pawoo!","Elephants have long trunks."],
  ["Giraffe","wild","🦒","Hum!","Giraffes have very long necks."],
  ["Tiger","wild","🐯","Grrr!","Tigers have stripes."],
  ["Bear","wild","🐻","Growl!","Bears love honey."],
  ["Zebra","wild","🦓","Neigh!","Zebras are black and white."],
  ["Monkey","wild","🐵","Ooh ooh!","Monkeys swing on trees."],
  ["Dolphin","ocean","🐬","Click click!","Dolphins love to jump."],
  ["Whale","ocean","🐳","Woooo!","Whales are very big."],
  ["Fish","ocean","🐠","Blub blub!","Fish swim with fins."],
  ["Octopus","ocean","🐙","Blub!","An octopus has eight arms."],
  ["Crab","ocean","🦀","Click!","Crabs walk sideways."],
  ["Turtle","ocean","🐢","Hmm!","Turtles carry their home."],
  ["Bee","insect","🐝","Bzzz!","Bees make sweet honey."],
  ["Ladybug","insect","🐞","Tick!","Ladybugs have tiny spots."],
  ["Butterfly","insect","🦋","Flutter!","Butterflies have pretty wings."],
  ["Ant","insect","🐜","Tap tap!","Ants work together."],
  ["Grasshopper","insect","🦗","Chirp!","Grasshoppers jump high."],
  ["Snail","insect","🐌","Shhh!","Snails move very slowly."]
].map(function(r){
  return { id:r[0].toLowerCase(), name:r[0], category:r[1], emoji:r[2], sound:r[3], fact:r[4],
           image:"assets/images/animals/"+r[0].toLowerCase()+".png",
           audio:"assets/audio/animals/"+r[0].toLowerCase()+".mp3" };
});
