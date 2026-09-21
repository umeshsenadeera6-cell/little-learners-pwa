/* Badge rules. Each badge owns its own unlock test. */
import { Store } from "../core/store.js";

export const badges = [
  {id:"first_star", emoji:"🌟", name:"First Star",        desc:"Earn 1 star",         test:function(s){return s.stars>=1;}},
  {id:"super",      emoji:"🏆", name:"Super Learner",     desc:"Collect 10 stars",    test:function(s){return s.stars>=10;}},
  {id:"collector",  emoji:"🎖️", name:"Star Collector",    desc:"Collect 30 stars",    test:function(s){return s.stars>=30;}},
  {id:"abc_champ",  emoji:"🥇", name:"Alphabet Champion", desc:"See all 26 letters",  test:function(s){return Store.seenCount("abc")>=26;}},
  {id:"num_star",   emoji:"🔢", name:"Number Star",       desc:"See all 20 numbers",  test:function(s){return Store.seenCount("numbers")>=20;}},
  {id:"colour_art", emoji:"🎨", name:"Colour Artist",     desc:"Learn all 10 colours",test:function(s){return Store.seenCount("colours")>=10;}},
  {id:"animal_pal", emoji:"🐾", name:"Animal Friend",     desc:"Meet 25 animals",     test:function(s){return Store.seenCount("animals")>=25;}},
  {id:"shape_master",emoji:"🔷",name:"Shape Master",      desc:"Learn all 8 shapes",  test:function(s){return Store.seenCount("shapes")>=8;}},
  {id:"word_wizard",emoji:"🪄", name:"Word Wizard",       desc:"Learn 20 words",      test:function(s){return Store.seenCount("words")>=20;}},
  {id:"quiz_ace",   emoji:"🧠", name:"Quiz Whiz",         desc:"Get 20 right answers",test:function(s){return s.quiz.correct>=20;}},
  {id:"gamer",      emoji:"🎮", name:"Game Champ",        desc:"Play all 5 games",    test:function(s){return Object.keys(s.games||{}).length>=5;}},
  {id:"daily",      emoji:"📅", name:"Busy Bee",          desc:"Learn for 5 minutes", test:function(s){return s.seconds>=300;}}
];
