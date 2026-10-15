/* ---------------------------------------------------------------------------
   Scratch — practice questions.

   Same kinds as python-questions.js:
     mcq   { prompt, code?, options[], answer (index), explain }
     fill  { prompt, code (with ___), accept[], explain }
     code  { prompt, panes, starter, checks[], hint, solution, explain?, actions? }

   Wrong options are deliberate: each is the answer a student gets from one
   specific mistake, and the explanation names that mistake.
   --------------------------------------------------------------------------- */

export const scratchQuestions = [
  /* ------------------------------------------------ 1.1 The Scratch screen */
  {
    id: "scr-1-1-a", lesson: "1.1", kind: "mcq",
    prompt: "What is the stage?",
    options: [
      "The big box where your project plays",
      "The list of blocks on the left",
      "One picture of a sprite",
      "The green flag button",
    ],
    answer: 0,
    explain: "The stage is where everything happens. Sprites move and talk there. The blocks on the left are the instructions, not the place they play.",
  },
  {
    id: "scr-1-1-b", lesson: "1.1", kind: "mcq",
    prompt: "What is a sprite?",
    options: [
      "A character or thing on the stage that can run scripts",
      "The picture behind everything on the stage",
      "A block that makes things move",
      "The button that starts a project",
    ],
    answer: 0,
    explain: "The cat is a sprite. So is a ball, a star or a dragon. The picture behind everything is the backdrop, not a sprite. That is an easy one to mix up.",
  },
  {
    id: "scr-1-1-c", lesson: "1.1", kind: "mcq",
    prompt: "You want a block that moves your sprite. Which colour group should you look in?",
    options: [
      "Blue — {{motion:Motion}}",
      "Purple — {{looks:Looks}}",
      "Yellow — {{events:Events}}",
      "Orange — {{control:Control}}",
    ],
    answer: 0,
    explain: "Motion blocks are blue. They move and turn sprites. Looks blocks are purple. They change how a sprite looks, like its size or costume, but they never move it.",
  },

  /* ------------------------------------------- 1.2 Green flag and say */
  {
    id: "scr-1-2-a", lesson: "1.2", kind: "mcq",
    prompt: "You click the green flag. What happens?",
    script: [
      { text: "when green flag clicked", cat: "events" },
      { text: "say [Hello!] for (2) seconds", cat: "looks" },
      { text: "say [Bye!] for (2) seconds", cat: "looks" },
    ],
    options: [
      "The cat says Hello! for 2 seconds, then Bye! for 2 seconds",
      "The cat says Bye! first, then Hello!",
      "The cat says Hello! and Bye! at the same time",
      "Nothing happens until you click the cat",
    ],
    answer: 0,
    explain: "Blocks run from top to bottom, one at a time. The first say block finishes its 2 seconds before the next one starts. So Hello! comes first, then Bye!.",
  },
  {
    id: "scr-1-2-b", lesson: "1.2", kind: "mcq",
    prompt: "This block sits on its own in the code area. It is not snapped under anything. What happens when you click the green flag?",
    script: [
      { text: "say [Hi!] for (2) seconds", cat: "looks" },
    ],
    options: [
      "Nothing happens",
      "The cat says Hi! for 2 seconds",
      "The cat says Hi! forever",
      "Scratch shows an error message",
    ],
    answer: 0,
    explain: "The green flag only starts scripts that begin with {{events:when green flag clicked}}. A block on its own isn't part of that script, so it never runs. Snap it under the hat block and it will.",
  },
  {
    id: "scr-1-2-c", lesson: "1.2", kind: "mcq",
    prompt: "This script runs. What happens to the speech bubble?",
    script: [
      { text: "when green flag clicked", cat: "events" },
      { text: "say [Hello!]", cat: "looks" },
    ],
    options: [
      "It stays there until something changes it",
      "It goes away after 2 seconds",
      "It goes away straight away",
      "The cat says Hello! out loud",
    ],
    answer: 0,
    explain: "This say block has no seconds in it. So it puts up the bubble and leaves it there. Clicking the red stop sign clears it. If you want it to go away by itself, use {{looks:say [Hello!] for (2) seconds}}.",
  },
  {
    id: "scr-1-2-d", lesson: "1.2", kind: "fill",
    prompt: "Make the bubble stay for 3 seconds. What number goes in the blank?",
    code: "say [Hello!] for (___) seconds",
    accept: ["3", "3.0"],
    explain: "The number in the block is how many seconds the bubble stays. Change 2 to 3 and it stays one second longer.",
  },

  /* ---------------------------------------------- 1.3 Costumes and backdrops */
  {
    id: "scr-1-3-a", lesson: "1.3", kind: "mcq",
    prompt: "You want to change the picture behind everything on the stage. What do you change?",
    options: [
      "The backdrop",
      "The costume",
      "The sprite",
      "The script",
    ],
    answer: 0,
    explain: "The stage has backdrops. Sprites have costumes. Changing a costume only changes how one sprite looks. The background stays the same.",
  },
  {
    id: "scr-1-3-b", lesson: "1.3", kind: "mcq",
    prompt: "The cat has 2 costumes: costume1 and costume2. It starts on costume1. Which costume is it on at the end?",
    script: [
      { text: "when green flag clicked", cat: "events" },
      { text: "next costume", cat: "looks" },
      { text: "next costume", cat: "looks" },
    ],
    options: [
      "costume1",
      "costume2",
      "costume3",
      "It gets stuck on costume2 because there is no costume3",
    ],
    answer: 0,
    explain: "The first {{looks:next costume}} goes to costume2. The second one has nowhere further to go, so it goes back round to costume1. It never gets stuck, and it never makes a new costume.",
  },
  {
    id: "scr-1-3-c", lesson: "1.3", kind: "mcq",
    prompt: "The cat is on costume2. You click this script two times. Which costume is it on now?",
    script: [
      { text: "when this sprite clicked", cat: "events" },
      { text: "switch costume to [costume2]", cat: "looks" },
    ],
    options: [
      "costume2",
      "costume1",
      "costume3",
      "costume4",
    ],
    answer: 0,
    explain: "{{looks:switch costume to [costume2]}} always picks costume2, however many times it runs. It is {{looks:next costume}} that moves along one at a time.",
  },

  /* ------------------------------------------------- 2.1 Moving and turning */
  {
    id: "scr-2-1-a", lesson: "2.1", kind: "mcq",
    prompt: "Where does the cat go?",
    script: [
      { text: "when green flag clicked", cat: "events" },
      { text: "point in direction (90)", cat: "motion" },
      { text: "move (10) steps", cat: "motion" },
      { text: "move (10) steps", cat: "motion" },
    ],
    options: [
      "20 steps to the right",
      "10 steps to the right",
      "20 steps up",
      "20 steps to the left",
    ],
    answer: 0,
    explain: "Direction 90 means right. Then both move blocks run, one after the other. 10 steps and 10 more steps makes 20. Each block adds on. The second one doesn't replace the first.",
  },
  {
    id: "scr-2-1-b", lesson: "2.1", kind: "mcq",
    prompt: "Which direction makes a sprite face up?",
    options: ["`0`", "`90`", "`180`", "`-90`"],
    answer: 0,
    explain: "In Scratch, 0 is up. 90 is right, 180 is down and -90 is left. Lots of people guess 90 for up. That is the most common mix-up.",
  },
  {
    id: "scr-2-1-c", lesson: "2.1", kind: "mcq",
    prompt: "Which way is the cat facing at the end?",
    script: [
      { text: "when green flag clicked", cat: "events" },
      { text: "point in direction (90)", cat: "motion" },
      { text: "turn ↻ (90) degrees", cat: "motion" },
    ],
    options: [
      "Down — direction 180",
      "Up — direction 0",
      "Still right — direction 90",
      "Left — direction -90",
    ],
    answer: 0,
    explain: "The cat starts facing right. ↻ turns clockwise, the way a clock's hands go. A quarter turn clockwise from right points down. Turning the other way, ↺, would point it up.",
  },
  {
    id: "scr-2-1-d", lesson: "2.1", kind: "fill",
    prompt: "The cat is facing right. Make it turn to face left. What number goes in the blank?",
    code: "turn ↻ (___) degrees",
    accept: ["180", "-180"],
    explain: "Right and left are opposite ways. Facing the opposite way takes a half turn, and a half turn is 180 degrees. (-180 works too: half a turn the other way lands in the same place.) 90 would only be a quarter turn, so the cat would face down.",
  },

  /* ------------------------------------------------ 2.2 Coordinates: x and y */
  {
    id: "scr-2-2-a", lesson: "2.2", kind: "mcq",
    prompt: "Where on the stage is x: 0, y: 0?",
    options: [
      "Right in the middle",
      "The bottom-left corner",
      "The top-left corner",
      "The top-right corner",
    ],
    answer: 0,
    explain: "In Scratch, 0, 0 is the middle of the stage. If you have used graph paper, you might guess the bottom-left corner. In Scratch, the corners are numbers like x: -240, y: -180.",
  },
  {
    id: "scr-2-2-b", lesson: "2.2", kind: "mcq",
    prompt: "Where does the sprite end up?",
    script: [
      { text: "when green flag clicked", cat: "events" },
      { text: "go to x: (0) y: (0)", cat: "motion" },
      { text: "change x by (50)", cat: "motion" },
      { text: "change y by (-30)", cat: "motion" },
    ],
    options: [
      "x: 50, y: -30 — a bit right and a bit down",
      "x: -30, y: 50 — a bit left and a bit up",
      "x: 50, y: 30 — a bit right and a bit up",
      "x: 0, y: 0 — change blocks don't move it",
    ],
    answer: 0,
    explain: "It starts in the middle. Changing x by 50 moves it right. Changing y by -30 moves it down, because of the minus. Swapping x and y gives the second answer. Forgetting the minus gives the third.",
  },
  {
    id: "scr-2-2-c", lesson: "2.2", kind: "mcq",
    prompt: "You want the sprite to go straight up. Which block do you use?",
    options: [
      "{{motion:change y by (10)}}",
      "{{motion:change x by (10)}}",
      "{{motion:change y by (-10)}}",
      "{{motion:move (10) steps}}",
    ],
    answer: 0,
    explain: "y is up and down, and a bigger y is higher. x is left and right. A minus y goes down. {{motion:move (10) steps}} goes whichever way the sprite is facing, which might not be up.",
  },
  {
    id: "scr-2-2-d", lesson: "2.2", kind: "mcq",
    prompt: "Which of these spots is off the stage?",
    options: [
      "x: 300, y: 0",
      "x: 200, y: 150",
      "x: -240, y: 0",
      "x: 0, y: -180",
    ],
    answer: 0,
    explain: "x only goes from -240 to 240. 300 is past the right edge. The other three are on the stage. -240 is the left edge and -180 is the bottom edge, but they still count.",
  },
  {
    id: "scr-2-2-e", lesson: "2.2", kind: "fill",
    prompt: "Send the sprite to the very top of the stage, in the middle. What number goes in the blank?",
    code: "go to x: (0) y: (___)",
    accept: ["180"],
    explain: "y goes up to 180 at the top of the stage. x is 0, so the sprite is in the middle from left to right.",
  },

  /* --------------------------------------- 2.3 Size, colour, show and hide */
  {
    id: "scr-2-3-a", lesson: "2.3", kind: "mcq",
    prompt: "What size is the sprite at the end?",
    script: [
      { text: "when green flag clicked", cat: "events" },
      { text: "set size to (100) %", cat: "looks" },
      { text: "change size by (50)", cat: "looks" },
    ],
    options: ["150%", "50%", "100%", "200%"],
    answer: 0,
    explain: "{{looks:set size to (100) %}} makes it 100%. Then {{looks:change size by (50)}} adds 50, so it is 150%. A change block adds on to what is already there. It doesn't set the size to 50.",
  },
  {
    id: "scr-2-3-b", lesson: "2.3", kind: "mcq",
    prompt: "This script ran, and the sprite vanished. Now you click the green flag again. Can you see the sprite when the script starts?",
    script: [
      { text: "when green flag clicked", cat: "events" },
      { text: "say [Bye!] for (2) seconds", cat: "looks" },
      { text: "hide", cat: "looks" },
    ],
    options: [
      "No — it stays hidden until a show block runs",
      "Yes — the green flag always brings every sprite back",
      "Yes — hide only lasts for 2 seconds",
      "No — hide deleted the sprite",
    ],
    answer: 0,
    explain: "The green flag does not undo {{looks:hide}}. The sprite stays hidden until a {{looks:show}} block runs. It isn't deleted. It is still there, just invisible. That is why good scripts start with {{looks:show}}.",
  },
  {
    id: "scr-2-3-c", lesson: "2.3", kind: "mcq",
    prompt: "What does {{looks:change [color] effect by (25)}} change?",
    options: [
      "The colours of the sprite",
      "The size of the sprite",
      "The colour of the backdrop",
      "The colour of the blocks",
    ],
    answer: 0,
    explain: "It shifts the colours of the sprite that runs it. The backdrop stays the same. {{looks:clear graphic effects}} puts the sprite's colours back to normal.",
  },
  {
    id: "scr-2-3-d", lesson: "2.3", kind: "fill",
    prompt: "Make the sprite half as big as normal. What number goes in the blank?",
    code: "set size to (___) %",
    accept: ["50", "50%"],
    explain: "100% is normal size, so half of that is 50%. 200% would make it twice as big.",
  },
  /* ------------------------------------------------------- 3.1 Hat blocks */
  {
    id: "scr-3-1-a", lesson: "3.1", kind: "mcq",
    prompt: "Which block starts a script when you click the green flag?",
    options: [
      "{{events:when green flag clicked}}",
      "{{control:forever}}",
      "{{looks:say [Go!]}}",
      "{{events:when this sprite clicked}}",
    ],
    answer: 0,
    explain: "Hat blocks start scripts, and this hat waits for the green flag. {{events:when this sprite clicked}} is a hat too, but it waits for a click on the sprite. {{control:forever}} repeats blocks — it can't start anything.",
  },
  {
    id: "scr-3-1-b", lesson: "3.1", kind: "mcq",
    prompt: "You click the green flag. What does this script do?",
    script: [
      { text: "when [space] key pressed", cat: "events" },
      { text: "say [Jump!] for (2) seconds", cat: "looks" },
    ],
    options: [
      "Nothing — it waits for the space key",
      "It says Jump! for 2 seconds",
      "It says Jump! forever",
      "It says Jump! once for every key you press",
    ],
    answer: 0,
    explain: "The hat decides when a script runs. This one only listens for the space key. Clicking the green flag starts green flag scripts, not this one.",
  },
  {
    id: "scr-3-1-c", lesson: "3.1", kind: "mcq",
    prompt: "These two blocks sit in the code area with no hat on top. What happens when you click the green flag?",
    script: [
      { text: "move (10) steps", cat: "motion" },
      { text: "turn right (15) degrees", cat: "motion" },
    ],
    options: [
      "Nothing — no hat tells them when to run",
      "The sprite moves and turns",
      "The sprite moves but doesn't turn",
      "Scratch shows an error message",
    ],
    answer: 0,
    explain: "Blocks with no hat never start by themselves. Scratch doesn't show an error — they just sit there. Put {{events:when green flag clicked}} on top and they'll run.",
  },
  {
    id: "scr-3-1-d", lesson: "3.1", kind: "fill",
    prompt: "Fill in the blank so the script runs when you click the sprite.",
    code: "when this ___ clicked\nsay [Ouch!] for (1) seconds",
    accept: ["sprite"],
    explain: "{{events:when this sprite clicked}} starts the script when you click that sprite. Each sprite has its own, so clicking the cat won't start the dog's script.",
  },

  /* ------------------------------------------ 3.2 wait, repeat and forever */
  {
    id: "scr-3-2-a", lesson: "3.2", kind: "mcq",
    prompt: "What happens when you click the green flag?",
    script: [
      { text: "when green flag clicked", cat: "events" },
      { text: "repeat (3)", cat: "control" },
      { text: "say [Hello!] for (1) seconds", cat: "looks", indent: 1 },
      { text: "say [Bye!] for (1) seconds", cat: "looks" },
    ],
    options: [
      "It says Hello! 3 times, then Bye! once",
      "It says Hello! and Bye! 3 times each",
      "It says Hello! once, then Bye! 3 times",
      "It says Hello! forever",
    ],
    answer: 0,
    explain: "Only blocks inside the {{control:repeat (3)}} get repeated. The Bye! block is under the loop, not inside it, so it runs once when the loop is done.",
  },
  {
    id: "scr-3-2-b", lesson: "3.2", kind: "mcq",
    prompt: "When does this script stop?",
    script: [
      { text: "when green flag clicked", cat: "events" },
      { text: "forever", cat: "control" },
      { text: "move (10) steps", cat: "motion", indent: 1 },
      { text: "if on edge, bounce", cat: "motion", indent: 1 },
    ],
    options: [
      "Only when you click the red stop sign",
      "After 10 moves",
      "When the sprite reaches the edge",
      "After 1 second",
    ],
    answer: 0,
    explain: "{{control:forever}} never stops by itself. The 10 is how far each move goes, not how many moves. Hitting the edge just makes the sprite bounce and keep going.",
  },
  {
    id: "scr-3-2-c", lesson: "3.2", kind: "mcq",
    prompt: "How many times does the cat meow?",
    script: [
      { text: "when green flag clicked", cat: "events" },
      { text: "repeat (2)", cat: "control" },
      { text: "repeat (3)", cat: "control", indent: 1 },
      { text: "play sound [Meow] until done", cat: "sound", indent: 2 },
    ],
    options: ["6", "5", "3", "2"],
    answer: 0,
    explain: "The inside loop meows 3 times. The outside loop does all of that twice. 2 lots of 3 is 6. If you got 5, you added 2 and 3 instead.",
  },
  {
    id: "scr-3-2-d", lesson: "3.2", kind: "fill",
    prompt: "Fill in the blank so the cat waits 2 seconds before it talks.",
    code: "when green flag clicked\nwait (___) seconds\nsay [Hi!]",
    accept: ["2", "(2)"],
    explain: "{{control:wait (2) seconds}} pauses the script for 2 seconds. Then the next block, the say, runs.",
  },

  /* ---------------------------------------------- 3.3 Broadcasting messages */
  {
    id: "scr-3-3-a", lesson: "3.3", kind: "mcq",
    prompt: "Which hat block runs when a message arrives?",
    options: [
      "{{events:when I receive [go]}}",
      "{{events:broadcast [go]}}",
      "{{events:when green flag clicked}}",
      "{{events:when this sprite clicked}}",
    ],
    answer: 0,
    explain: "{{events:when I receive [go]}} waits for the go message. {{events:broadcast [go]}} is the one that sends it — it isn't a hat, so it can't start a script.",
  },
  {
    id: "scr-3-3-b", lesson: "3.3", kind: "mcq",
    prompt: "The Dog has this script: {{events:when I receive [jump]}} {{looks:say [Boing!] for (2) seconds}}\n\nThe Cat runs the script below. When does the Cat say Done!?",
    script: [
      { text: "when green flag clicked", cat: "events" },
      { text: "broadcast [jump]", cat: "events" },
      { text: "say [Done!]", cat: "looks" },
    ],
    options: [
      "Straight away, while the Dog is still saying Boing!",
      "After the Dog has finished saying Boing!",
      "Never — the Cat waits for the Dog to reply",
      "Before the message is sent",
    ],
    answer: 0,
    explain: "Plain {{events:broadcast [jump]}} sends the message and carries on at once. So both sprites talk at the same time. To wait for the Dog, use {{events:broadcast [jump] and wait}}.",
  },
  {
    id: "scr-3-3-c", lesson: "3.3", kind: "mcq",
    prompt: "Same Dog script as before. Now the Cat uses broadcast and wait. When does the Cat say Done!?",
    script: [
      { text: "when green flag clicked", cat: "events" },
      { text: "broadcast [jump] and wait", cat: "events" },
      { text: "say [Done!]", cat: "looks" },
    ],
    options: [
      "After the Dog has finished saying Boing! — about 2 seconds later",
      "Straight away, while the Dog is still saying Boing!",
      "Never — and wait means it waits forever",
      "Before the Dog starts",
    ],
    answer: 0,
    explain: "{{events:broadcast [jump] and wait}} sends the message, then waits until every script that got it has finished. The Dog's script takes 2 seconds, so the Cat waits 2 seconds.",
  },
  {
    id: "scr-3-3-d", lesson: "3.3", kind: "fill",
    prompt: "Fill in the blank so this script runs when the message game over arrives.",
    code: "when I ___ [game over]\nsay [Bye!]",
    accept: ["receive"],
    explain: "{{events:when I receive [game over]}} is the hat that listens for a message. Any sprite can have one, and they all run when the message is sent.",
  },

  /* ------------------------------------------------- 4.1 Touching and sensing */
  {
    id: "scr-4-1-a", lesson: "4.1", kind: "mcq",
    prompt: "What shape are the blocks that answer true or false?",
    options: [
      "Pointy at both ends",
      "Round at both ends",
      "A hat shape",
      "A C shape that wraps around blocks",
    ],
    answer: 0,
    explain: "Pointy blocks, like {{sensing:<touching [edge] ?>}}, answer yes-or-no questions. Round blocks give a number or words. Hats start scripts, and C shapes like {{control:forever}} wrap around blocks.",
  },
  {
    id: "scr-4-1-b", lesson: "4.1", kind: "mcq",
    prompt: "Which block tells you how far the sprite is from the mouse?",
    options: [
      "{{sensing:(distance to [mouse-pointer])}}",
      "{{sensing:<touching [mouse-pointer] ?>}}",
      "{{motion:go to [mouse-pointer]}}",
      "{{motion:point towards [mouse-pointer]}}",
    ],
    answer: 0,
    explain: "{{sensing:(distance to [mouse-pointer])}} gives a number: how many steps away the mouse is. The touching block only says true or false. The two blue Motion blocks move or turn the sprite.",
  },
  {
    id: "scr-4-1-c", lesson: "4.1", kind: "mcq",
    prompt: "What's the difference between these two blocks?\n\n{{events:when [space] key pressed}} and {{sensing:<key [space] pressed?>}}",
    options: [
      "The hat starts a script. The pointy block only answers true or false when a script asks it.",
      "They do the same thing in two colours",
      "The pointy block starts a script. The hat answers true or false.",
      "The hat only works in games",
    ],
    answer: 0,
    explain: "The yellow hat goes on top and starts a script each time you press space. The blue pointy block goes in a slot, like in {{control:if <> then}}, and answers: is space held down right now?",
  },
  {
    id: "scr-4-1-d", lesson: "4.1", kind: "fill",
    prompt: "Fill in the blank to check if the sprite is touching the edge of the stage.",
    code: "if <touching [___] ?> then\n  turn right (180) degrees",
    accept: ["edge"],
    explain: "Pick edge in the dropdown of {{sensing:<touching [edge] ?>}}. It's true when any part of the sprite touches the side of the stage.",
  },

  /* ------------------------------------------------ 4.2 if and if-else blocks */
  {
    id: "scr-4-2-a", lesson: "4.2", kind: "mcq",
    prompt: "You click the green flag, wait 5 seconds, then press space. What happens?",
    script: [
      { text: "when green flag clicked", cat: "events" },
      { text: "say [Press space!] for (2) seconds", cat: "looks" },
      { text: "if <key [space] pressed?> then", cat: "control" },
      { text: "say [You did it!]", cat: "looks", indent: 1 },
    ],
    options: [
      "Nothing — the if checked once, before you pressed space",
      "It says You did it!",
      "It waits until you press space, then says You did it!",
      "It says You did it! over and over",
    ],
    answer: 0,
    explain: "This {{control:if <> then}} checks one time, 2 seconds after the flag. Space wasn't down then, so it skipped. It doesn't wait. Put the if inside {{control:forever}} to keep checking.",
  },
  {
    id: "scr-4-2-b", lesson: "4.2", kind: "mcq",
    prompt: "What does the sprite say?",
    script: [
      { text: "when green flag clicked", cat: "events" },
      { text: "if <(5) > (3)> then", cat: "control" },
      { text: "say [Big]", cat: "looks", indent: 1 },
      { text: "else", cat: "control" },
      { text: "say [Small]", cat: "looks", indent: 1 },
    ],
    options: ["Big", "Small", "Big, then Small", "Nothing"],
    answer: 0,
    explain: "5 is more than 3, so the question is true. True runs the top part only. An if-else never runs both parts.",
  },
  {
    id: "scr-4-2-c", lesson: "4.2", kind: "mcq",
    prompt: "When does the sprite change colour?",
    script: [
      { text: "when green flag clicked", cat: "events" },
      { text: "forever", cat: "control" },
      { text: "if <touching [mouse-pointer] ?> then", cat: "control", indent: 1 },
      { text: "change [color] effect by (25)", cat: "looks", indent: 2 },
    ],
    options: [
      "Whenever the mouse is over it",
      "Only once, right at the start",
      "Every time you click the green flag",
      "Never — an if can't go inside forever",
    ],
    answer: 0,
    explain: "{{control:forever}} asks the question again and again. Each time the mouse is touching the sprite, the colour changes a bit more. An if inside forever is the normal way to keep checking.",
  },
  {
    id: "scr-4-2-d", lesson: "4.2", kind: "fill",
    prompt: "Fill in the blank. The bottom part of an if-else runs when the answer is…",
    code: "if <touching [edge] ?> then\n  (this runs when the answer is true)\nelse\n  (this runs when the answer is ___)",
    accept: ["false"],
    explain: "Every question has two answers: true or false. True runs the top part. False runs the part under else.",
  },

  /* --------------------------------------------------- 4.3 Asking and answering */
  {
    id: "scr-4-3-a", lesson: "4.3", kind: "mcq",
    prompt: "The player types Sam. What does the sprite say?",
    script: [
      { text: "when green flag clicked", cat: "events" },
      { text: "ask [What's your name?] and wait", cat: "sensing" },
      { text: "say (join [Hi] (answer))", cat: "looks" },
    ],
    options: ["HiSam", "Hi Sam", "Hianswer", "Sam"],
    answer: 0,
    explain: "{{operators:(join [Hi] (answer))}} sticks the text together exactly. There's no space after Hi, so the words touch. Typing `Hi ` with a space fixes it. Hianswer is what you get if you type the word answer instead of dropping in the answer block.",
  },
  {
    id: "scr-4-3-b", lesson: "4.3", kind: "mcq",
    prompt: "The player types YES in capitals. What does the sprite say?",
    script: [
      { text: "when green flag clicked", cat: "events" },
      { text: "ask [Do you like cats?] and wait", cat: "sensing" },
      { text: "if <(answer) = [yes]> then", cat: "control" },
      { text: "say [Me too!]", cat: "looks", indent: 1 },
      { text: "else", cat: "control" },
      { text: "say [Oh well.]", cat: "looks", indent: 1 },
    ],
    options: ["Me too!", "Oh well.", "Me too! and then Oh well.", "Nothing"],
    answer: 0,
    explain: "Scratch's = block ignores capital letters. YES, Yes and yes all count as the same. So the answer is true and the top part runs.",
  },
  {
    id: "scr-4-3-c", lesson: "4.3", kind: "mcq",
    prompt: "After {{sensing:ask [What's your name?] and wait}}, where does the player's typing go?",
    options: [
      "Into the {{sensing:(answer)}} block",
      "Into the ask block",
      "Into a new variable called name",
      "Nowhere — Scratch can't read typing",
    ],
    answer: 0,
    explain: "Whatever the player types is kept in {{sensing:(answer)}}. Scratch doesn't make a variable for you. If you want one, you make it yourself and set it to the answer.",
  },
  {
    id: "scr-4-3-d", lesson: "4.3", kind: "mcq",
    prompt: "The player types Ava for the first question and 9 for the second. What does the sprite say?",
    script: [
      { text: "when green flag clicked", cat: "events" },
      { text: "ask [What's your name?] and wait", cat: "sensing" },
      { text: "ask [How old are you?] and wait", cat: "sensing" },
      { text: "say (answer)", cat: "looks" },
    ],
    options: ["9", "Ava", "Ava 9", "Nothing"],
    answer: 0,
    explain: "{{sensing:(answer)}} only keeps the newest thing typed. The second question replaced Ava with 9. To keep both, save the first answer in a variable before you ask again.",
  },
  /* ------------------------------------------------- 5.1 Making a variable */
  {
    id: "scr-5-1-a", lesson: "5.1", kind: "mcq",
    prompt: "In your game, every sprite needs to change the score. What do you pick when you make the `score` variable?",
    options: ["For all sprites", "For this sprite only", "It doesn't matter", "Make a different score variable in each sprite"],
    answer: 0,
    explain: "For all sprites makes one box every sprite can use. For this sprite only hides it from the others. A score in each sprite would be lots of separate boxes, so the points would never add up together.",
  },
  {
    id: "scr-5-1-b", lesson: "5.1", kind: "mcq",
    prompt: "What does the sprite say?",
    script: [
      { text: "when green flag clicked", cat: "events" },
      { text: "set [score] to (5)", cat: "variables" },
      { text: "set [score] to (2)", cat: "variables" },
      { text: "say (score)", cat: "looks" },
    ],
    options: ["2", "5", "7", "52"],
    answer: 0,
    explain: "Set throws away what was in the box and puts in the new number. So 5 goes in, then 2 replaces it. 7 is what you get if you think set adds — that's what change does.",
  },
  {
    id: "scr-5-1-c", lesson: "5.1", kind: "mcq",
    prompt: "What is in `score` at the end?",
    script: [
      { text: "when green flag clicked", cat: "events" },
      { text: "set [score] to (3)", cat: "variables" },
      { text: "change [score] by (4)", cat: "variables" },
    ],
    options: ["7", "4", "3", "34"],
    answer: 0,
    explain: "Change adds to what is already there: 3 + 4 = 7. Picking 4 means you thought change works like set and replaces the number.",
  },

  /* ---------------------------------------- 5.2 Changing and showing the score */
  {
    id: "scr-5-2-a", lesson: "5.2", kind: "mcq",
    prompt: "Mia's game has no {{variables:set [score] to (0)}} block anywhere. Last game she ended with 8 points. She clicks the green flag and clicks the sprite 3 times. What does the score show?",
    script: [
      { text: "when this sprite clicked", cat: "events" },
      { text: "change [score] by (1)", cat: "variables" },
    ],
    options: ["11", "3", "8", "0"],
    answer: 0,
    explain: "Scratch keeps the old score. Nothing set it back to 0, so it goes 9, 10, 11. Saying 3 is the classic mistake: the green flag does not reset variables by itself. You need {{variables:set [score] to (0)}}.",
  },
  {
    id: "scr-5-2-b", lesson: "5.2", kind: "mcq",
    prompt: "What is the score at the end?",
    script: [
      { text: "when green flag clicked", cat: "events" },
      { text: "set [score] to (0)", cat: "variables" },
      { text: "repeat (3)", cat: "control" },
      { text: "change [score] by (2)", cat: "variables", indent: 1 },
    ],
    options: ["6", "2", "3", "5"],
    answer: 0,
    explain: "The change block is inside repeat 3, so it runs 3 times: 2, 4, 6. Saying 2 means you ran it once. Saying 5 means you added the 3 and the 2 instead of repeating.",
  },
  {
    id: "scr-5-2-c", lesson: "5.2", kind: "fill",
    prompt: "Fill in the blank so the score goes DOWN by 1.",
    code: "change [score] by (___)",
    accept: ["-1"],
    explain: "There is no \"take away\" block. You change by a minus number instead: change by -1 takes one away.",
  },
  {
    id: "scr-5-2-d", lesson: "5.2", kind: "mcq",
    prompt: "How can players see the score on the stage while they play?",
    options: [
      "Tick the box next to `score`, or use {{variables:show variable [score]}}",
      "Use {{looks:say (score)}} once when the game starts",
      "Use {{variables:hide variable [score]}} when the game starts",
      "Put the score in the backdrop's name",
    ],
    answer: 0,
    explain: "A shown variable stays on the stage and updates by itself. A say block at the start shows the number only once, so it would show 0 all game. A new variable starts with its box ticked, but anyone can untick it, and hide variable takes it off the stage — so show it on purpose.",
  },

  /* --------------------------------------------------- 5.3 Timers and lives */
  {
    id: "scr-5-3-a", lesson: "5.3", kind: "mcq",
    prompt: "The player loses all 3 lives. What happens?",
    script: [
      { text: "when green flag clicked", cat: "events" },
      { text: "set [lives] to (3)", cat: "variables" },
      { text: "if <(lives) < (1)> then", cat: "control" },
      { text: "stop [all]", cat: "control", indent: 1 },
    ],
    options: [
      "Nothing — the if checked only once, at the start",
      "The game stops",
      "The game stops after 3 seconds",
      "Lives goes back to 3",
    ],
    answer: 0,
    explain: "The if runs once, right after lives is set to 3. 3 is not less than 1, so it skips the stop. It never checks again. Put the if inside {{control:forever}} so it keeps checking.",
  },
  {
    id: "scr-5-3-b", lesson: "5.3", kind: "mcq",
    prompt: "Which category has {{sensing:timer}} and {{sensing:reset timer}}?",
    options: ["Sensing", "Control", "Operators", "Variables"],
    answer: 0,
    explain: "The timer is in Sensing, the light blue blocks. Control is tempting because it has wait blocks, but the stopwatch itself lives in Sensing.",
  },
  {
    id: "scr-5-3-c", lesson: "5.3", kind: "mcq",
    prompt: "How many lives are left?",
    script: [
      { text: "when green flag clicked", cat: "events" },
      { text: "set [lives] to (3)", cat: "variables" },
      { text: "change [lives] by (-1)", cat: "variables" },
      { text: "change [lives] by (-1)", cat: "variables" },
    ],
    options: ["1", "2", "5", "0"],
    answer: 0,
    explain: "3, then 2, then 1. Two blocks take away two lives. Saying 5 means you missed the minus signs and added instead.",
  },
  {
    id: "scr-5-3-d", lesson: "5.3", kind: "fill",
    prompt: "Finish the block so the script waits until 60 seconds have passed.",
    code: "wait until <(timer) > (___)>",
    accept: ["60"],
    explain: "The timer counts seconds, so you compare it with 60. It counts up, so the test is \"greater than 60\".",
  },

  /* -------------------------------------------------- 6.1 Planning your game */
  {
    id: "scr-6-1-a", lesson: "6.1", kind: "mcq",
    prompt: "You are about to make Catch the Apples. What should you do first?",
    options: [
      "Plan the sprites, variables and rules",
      "Build every script at once, then test at the end",
      "Draw lots of costumes",
      "Share it so people can try it",
    ],
    answer: 0,
    explain: "A plan tells you what to build. Building everything before testing is the big trap: when something breaks, you don't know which part did it. Plan, then build and test one small piece at a time.",
  },
  {
    id: "scr-6-1-b", lesson: "6.1", kind: "mcq",
    prompt: "Which rule needs a variable?",
    options: [
      "Catch an apple to get 1 point",
      "The bowl is blue",
      "The sky is the backdrop",
      "The apple is red",
    ],
    answer: 0,
    explain: "Points have to be remembered and counted, so they need a box: the `score` variable. Colours and backdrops are just how things look.",
  },
  {
    id: "scr-6-1-c", lesson: "6.1", kind: "mcq",
    prompt: "The Apple takes away a life when it is missed. The Bowl's scripts need to read `lives` too. How should you make `lives`?",
    options: [
      "For all sprites",
      "For this sprite only, inside the Apple",
      "For this sprite only, inside the Bowl",
      "Make one `lives` in each sprite",
    ],
    answer: 0,
    explain: "If more than one sprite uses it, make it For all sprites. A `lives` in each sprite would be two different boxes with the same name, and they would disagree.",
  },

  /* ----------------------------------------------- 6.2 Building the main loop */
  {
    id: "scr-6-2-a", lesson: "6.2", kind: "mcq",
    prompt: "Where can you snap a block underneath {{control:forever}}?",
    options: [
      "Nowhere — forever never finishes, so it has no bump at the bottom",
      "Anywhere, like any other block",
      "Only {{control:stop [all]}}",
      "Only a say block",
    ],
    answer: 0,
    explain: "A block under forever would wait for forever to finish, and it never does. So Scratch gives forever a flat bottom. Things that must keep happening go inside it.",
  },
  {
    id: "scr-6-2-b", lesson: "6.2", kind: "mcq",
    prompt: "In one game, the apple touches the bowl 3 times and falls past the bottom 2 times. What are score and lives?",
    script: [
      { text: "when green flag clicked", cat: "events" },
      { text: "set [score] to (0)", cat: "variables" },
      { text: "set [lives] to (3)", cat: "variables" },
      { text: "forever", cat: "control" },
      { text: "change y by (-5)", cat: "motion", indent: 1 },
      { text: "if <touching [Bowl]?> then", cat: "control", indent: 1 },
      { text: "change [score] by (1)", cat: "variables", indent: 2 },
      { text: "go to x: (pick random (-200) to (200)) y: (170)", cat: "motion", indent: 2 },
      { text: "if <(y position) < (-170)> then", cat: "control", indent: 1 },
      { text: "change [lives] by (-1)", cat: "variables", indent: 2 },
      { text: "go to x: (pick random (-200) to (200)) y: (170)", cat: "motion", indent: 2 },
    ],
    options: ["score 3, lives 1", "score 3, lives 2", "score 5, lives 3", "score 3, lives 3"],
    answer: 0,
    explain: "Each catch adds 1: score 3. Each miss takes 1 away: 3, 2, 1. Lives 2 means you counted one miss. Score 5 means you counted the misses as points too.",
  },
  {
    id: "scr-6-2-c", lesson: "6.2", kind: "mcq",
    prompt: "The bowl moves right, but it won't move left. What is wrong?",
    script: [
      { text: "when green flag clicked", cat: "events" },
      { text: "forever", cat: "control" },
      { text: "if <key [right arrow] pressed?> then", cat: "control", indent: 1 },
      { text: "change x by (10)", cat: "motion", indent: 2 },
      { text: "if <key [left arrow] pressed?> then", cat: "control", indent: 1 },
      { text: "change x by (10)", cat: "motion", indent: 2 },
    ],
    options: [
      "The left arrow part changes x by 10, not -10",
      "x can't go below 0",
      "Only one if can go inside a forever",
      "The left arrow needs its own green flag script",
    ],
    answer: 0,
    explain: "Bigger x is further right. Both ifs add 10, so the left arrow moves the bowl right too. Change it to -10. You can have lots of ifs inside one forever, and x can go below 0 — the middle of the stage is 0.",
  },

  /* ----------------------------------------------- 6.3 Polish, test and share */
  {
    id: "scr-6-3-a", lesson: "6.3", kind: "mcq",
    prompt: "Which is safe to write in your shared project's notes?",
    options: [
      "Use the arrow keys to catch the apples!",
      "Made by Sam Lee, age 9, Oak Street School",
      "I live at 12 Pine Road",
      "Here is a photo of me",
    ],
    answer: 0,
    explain: "Notes are for how to play. Anyone on the internet can read them, so never add your real name, school, where you live or photos. Your Scratch username is enough.",
  },
  {
    id: "scr-6-3-b", lesson: "6.3", kind: "fill",
    prompt: "Finish the block that plays the Pop sound when an apple is caught.",
    code: "start ___ [Pop]",
    accept: ["sound"],
    explain: "The block is {{sound:start sound [Pop]}}, in the pink Sound category. It starts the sound and lets the script keep going at once.",
  },
  {
    id: "scr-6-3-c", lesson: "6.3", kind: "mcq",
    prompt: "You test the game twice. The second game starts with a score of 9. Which block did you forget?",
    script: [
      { text: "when green flag clicked", cat: "events" },
      { text: "show variable [score]", cat: "variables" },
      { text: "set [lives] to (3)", cat: "variables" },
      { text: "forever", cat: "control" },
      { text: "change y by (-5)", cat: "motion", indent: 1 },
    ],
    options: [
      "{{variables:set [score] to (0)}} under the green flag",
      "{{variables:change [score] by (1)}}",
      "{{variables:show variable [score]}}",
      "A second {{control:forever}}",
    ],
    answer: 0,
    explain: "The score is never set back to 0, so it starts where the last game ended. This is why testing twice in a row matters — one test would never find it.",
  },
];
