/* ---------------------------------------------------------------------------
   Everything Pip says.

   Pip is curious and a bit clumsy. Never sarcastic, never patronising.
   Short sentences, second person, encouraging without gushing:
     "Nice — that's exactly it"     not  "AMAZING JOB SUPERSTAR!!!"
     "Not yet — look again"         not  "Wrong!"

   Every situation needs at least 8 lines, each under 12 words
   (npm run check:content enforces both). pipLine() never repeats the last
   line it gave for a situation, so Pip doesn't say the same thing all
   afternoon.
   --------------------------------------------------------------------------- */

export const pipLines = {
  // Course page corner, waving. A small, real coding tip.
  tip: [
    "Read the error message. It usually names the line.",
    "Stuck? Say what each line does, out loud.",
    "Small steps. Run your code after every change.",
    "Spelling counts. Computers don't guess what you meant.",
    "Try it first. Mistakes show you where to look.",
    "Change one thing at a time, then test it.",
    "A good name makes code easier to read.",
    "Hints are there to use. I use them too.",
    "Copy nothing. Typing it yourself helps it stick.",
    "Break big problems into tiny ones.",
  ],

  // A code exercise is running.
  thinking: [
    "Hmm, let me watch this run…",
    "Running it now. Fingers crossed.",
    "Counting the lines… one, two…",
    "Let's see what the computer does.",
    "Beep. Thinking. Beep.",
    "Following your code step by step…",
    "Checking every line. Hold on.",
    "Ooh, it's running!",
  ],

  // Correct answer.
  correct: [
    "Nice — that's exactly it.",
    "Yes! You got it.",
    "That's right. Good thinking.",
    "Spot on.",
    "You worked that out. Nice.",
    "Correct. On to the next one.",
    "That's the one.",
    "Got it in one.",
    "Exactly right. I'm taking notes.",
    "Yep. That's how it works.",
  ],

  // Wrong answer. Never shame. Shrug it off together.
  wrong: [
    "Not yet — try again.",
    "Not yet. Read the explanation, then try again.",
    "Close. Have another look.",
    "Oops. That trips me up too.",
    "Not quite. Mistakes are how we find the bug.",
    "Hmm, not that one. Look again.",
    "Not yet — check each line carefully.",
    "Almost. Read it once more, slowly.",
    "That's a useful mistake. Try again.",
  ],

  // Lesson complete card.
  lessonDone: [
    "Lesson done. You're getting good at this.",
    "That's another one finished. Nice work.",
    "You learned something new today.",
    "Done! I learned it with you.",
    "Lesson complete. Ready for the next?",
    "Nice — that lesson is yours now.",
    "Finished. Your brain did real work.",
    "One more lesson in the bag.",
  ],

  // A topic is complete — a building went up.
  topicDone: [
    "A new building! Byteville is growing.",
    "You built that by learning. Look!",
    "Topic finished. Byteville has a new spot.",
    "Look what your learning built.",
    "Byteville just got bigger.",
    "That whole topic is done. Nice building.",
    "New building unlocked. Want to visit?",
    "You did a whole topic. That's big.",
  ],

  // Course complete.
  courseDone: [
    "You finished the whole course. Wow.",
    "A whole course! The lights are on.",
    "Course complete. Print your certificate!",
    "You did every lesson. That's real work.",
    "The whole district is glowing now.",
    "Finished! I'm proud to learn with you.",
    "That's a whole course. Take a bow.",
    "Done. You can really code now.",
  ],

  // The Workshop.
  workshop: [
    "Welcome to the Workshop. Look around!",
    "Every Spark here came from learning.",
    "I'll wear whatever you pick.",
    "Ooh, what are we building today?",
    "Save up for something big, or spend now.",
    "Can I try the hat on? Please?",
    "Pick anything. It's your Workshop.",
    "Earn Sparks in lessons, spend them here.",
  ],

  // Just bought something.
  bought: [
    "Ooh, nice pick.",
    "That's ours now. Want to try it on?",
    "Thank you! I love it.",
    "Good choice. Equip it to see.",
    "You earned that one.",
    "Bought. Now let's see how it looks.",
    "That one took real learning to earn.",
    "New stuff! Let's try it.",
  ],

  // Byteville, walking around.
  byteville: [
    "Welcome to Byteville. You built all this.",
    "Every building here is something you learned.",
    "Tap a building to see what built it.",
    "Byteville grows when you finish a topic.",
    "I like walking here. It's quiet.",
    "More lessons, more town.",
    "Look, that's where you learned loops!",
    "This street is your learning, drawn as a town.",
  ],

  // Empty states — Pip is asleep.
  sleeping: [
    "Zzz… wake me when you start a lesson.",
    "Nothing here yet. I'm saving my energy.",
    "Zzz… dreaming about loops.",
    "Quiet in here. Start a lesson to wake me.",
    "Nap time. Learning time is coming.",
    "Zzz… is it time to code yet?",
    "Nothing yet. Every town starts as a field.",
    "Zzz… I'll be here when you're ready.",
  ],
};

const last = {};

export function pipLine(situation) {
  const pool = pipLines[situation] || pipLines.tip;
  if (pool.length === 1) return pool[0];
  let i;
  do i = Math.floor(Math.random() * pool.length);
  while (i === last[situation]);
  last[situation] = i;
  return pool[i];
}
