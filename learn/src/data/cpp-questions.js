/* ---------------------------------------------------------------------------
   C++ — practice questions.

   Same kinds as python-questions.js:
     mcq   { prompt, code?, options[], answer (index), explain }
     fill  { prompt, code (with ___), accept[], explain }
     code  { prompt, panes, starter, checks[], hint, solution, explain?, actions? }

   Wrong options are deliberate: each is the answer a student gets from one
   specific mistake, and the explanation names that mistake.
   --------------------------------------------------------------------------- */

export const cppQuestions = [
  /* ---------------------------------------------------- 1.1 Where C++ shows up */
  {
    id: "cpp-1-1-a", lesson: "1.1", kind: "mcq",
    prompt: "Which of these is most likely to be written in C++?",
    options: [
      "A 3D game engine",
      "The colours and fonts of a web page",
      "A formula in a spreadsheet",
      "A text message",
    ],
    answer: 0,
    explain: "Game engines have to draw a whole 3D world many times a second, so they use a fast, compiled language — very often C++. Web page colours are CSS, and a spreadsheet formula is written in the spreadsheet's own formula language.",
  },
  {
    id: "cpp-1-1-b", lesson: "1.1", kind: "mcq",
    prompt: "Why is C++ fast?",
    options: [
      "The compiler turns it into machine code before the program runs",
      "It is the easiest language for a computer to read while it runs",
      "It skips checking your code for mistakes",
      "It only runs on very fast computers",
    ],
    answer: 0,
    explain: "C++ is translated into the processor's own instructions once, ahead of time, so nothing has to translate it while it runs. It doesn't skip checks — the compiler is actually very strict, which is why compile errors are so common.",
  },
  {
    id: "cpp-1-1-c", lesson: "1.1", kind: "mcq",
    prompt: "What is the relationship between C, C++ and C#?",
    options: [
      "Three different languages; C++ was built on top of C",
      "Three versions of the same language",
      "C# is just the newest version of C++",
      "C++ is the older one, and C was made from it",
    ],
    answer: 0,
    explain: "C came first. C++ added classes and objects on top of C. C# is a separate Microsoft language that is closer to Java. The similar names fool lots of people into thinking C# is \"C++ version 2\" — it isn't.",
  },

  /* ---------------------------------------------------- 1.2 First program */
  {
    id: "cpp-1-2-a", lesson: "1.2", kind: "mcq",
    prompt: "What does this print?",
    code: `cout << "Hi" << "there" << endl;\ncout << "Bye";`,
    options: [
      "`Hithere`, then `Bye` on the next line",
      "`Hi there`, then `Bye` on the next line",
      "`Hi`, `there` and `Bye` on three separate lines",
      "`HithereBye` all on one line",
    ],
    answer: 0,
    explain: "`<<` sends each piece to the screen exactly as written, with no space added between them — so `Hithere`. `endl` then ends that line, so `Bye` starts on a new one. Each `<<` is not a new line; only `endl` (or `\\n`) is.",
  },
  {
    id: "cpp-1-2-b", lesson: "1.2", kind: "mcq",
    prompt: "This program has `#include <iostream>` but no `using namespace std;`. What happens?",
    code: `#include <iostream>\n\nint main() {\n    cout << "Hi";\n    return 0;\n}`,
    options: [
      "It won't compile: the compiler doesn't know `cout` — it would need `std::cout`",
      "It prints `Hi` — the `using` line is optional decoration",
      "It compiles, then crashes when it reaches `cout`",
      "It compiles and runs but prints nothing",
    ],
    answer: 0,
    explain: "`cout` lives in the `std` group. Without `using namespace std;`, you have to give its full name, `std::cout`. The compiler catches this before anything runs, so it's a compile error, not a crash.",
  },
  {
    id: "cpp-1-2-c", lesson: "1.2", kind: "fill",
    prompt: "Fill in the blank so this program can use `cout`.",
    code: `#include <___>\nusing namespace std;\n\nint main() {\n    cout << "Hello!";\n    return 0;\n}`,
    accept: ["iostream"],
    explain: "`<iostream>` is the input/output part of the standard library — it's where `cout` and `cin` come from.",
  },
  {
    id: "cpp-1-2-d", lesson: "1.2", kind: "mcq",
    prompt: "What does this print?",
    code: `cout << "Score: " << 3 + 4 << endl;`,
    options: ["`Score: 7`", "`Score: 34`", "`Score: 3 + 4`", "It won't compile"],
    answer: 0,
    explain: "The `+` is done first, giving 7, and then 7 is sent to the screen. `34` is what Java or JavaScript would print, because they glue text with `+` — C++ uses `<<` for that, so the `+` here is plain maths.",
  },

  /* ---------------------------------------------------- 1.3 Comments, semicolons */
  {
    id: "cpp-1-3-a", lesson: "1.3", kind: "mcq",
    prompt: "What happens when you try to build and run this?",
    code: `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello"\n    return 0;\n}`,
    options: [
      "The compiler stops with an error about a missing `;` — nothing runs",
      "It prints `Hello`, then shows an error",
      "It prints `Hello` — the semicolon is optional on the last line",
      "It runs but prints nothing",
    ],
    answer: 0,
    explain: "The compiler reads the whole file before anything runs. The missing semicolon after `cout << \"Hello\"` means the program can't be built at all, so not even `Hello` appears. Many beginners expect the lines before a mistake to run first — in C++ they don't.",
  },
  {
    id: "cpp-1-3-b", lesson: "1.3", kind: "mcq",
    prompt: "What does this print?",
    code: `// cout << "A";\ncout << "B"; // cout << "C";\n/* cout << "D"; */\ncout << "E";`,
    options: ["`BE`", "`ABCDE`", "`BCE`", "`B`"],
    answer: 0,
    explain: "The first line is all comment. On the second line, `B` prints and everything after `//` is ignored, so `C` never prints. The `/* */` line is a comment too. Only `B` and `E` are real instructions.",
  },
  {
    id: "cpp-1-3-c", lesson: "1.3", kind: "mcq",
    prompt: "Which of these mistakes will the compiler catch before the program runs?",
    options: [
      "Spelling `cout` as `cuot`",
      "Using the wrong formula, so the answer is wrong",
      "The user typing letters when the program asks for a number",
      "Forgetting that someone might enter a negative age",
    ],
    answer: 0,
    explain: "`cuot` isn't a name C++ knows, so the code doesn't make sense and won't compile. The other three are perfectly valid C++ — the compiler can't know your formula is wrong or what a user will type. Those mistakes only show up when the program runs.",
  },

  /* ---------------------------------------------------- 2.1 Types */
  {
    id: "cpp-2-1-a", lesson: "2.1", kind: "mcq",
    prompt: "What does this print?",
    code: `char c = 'A';\nc = c + 1;\ncout << c;`,
    options: ["`B`", "`66`", "`A1`", "It won't compile"],
    answer: 0,
    explain: "`'A'` is the number 65, so `c + 1` is 66. Storing 66 back in a `char` box makes it the character with code 66, which is `B`. You'd only see `66` if you printed `c + 1` directly without storing it in a `char`.",
  },
  {
    id: "cpp-2-1-b", lesson: "2.1", kind: "mcq",
    prompt: "What does this print?",
    code: `cout << 'A' + 1;`,
    options: ["`66`", "`B`", "`A1`", "`'B'`"],
    answer: 0,
    explain: "Adding a number to a `char` gives a number: 65 + 1 = 66. Nothing turns it back into a character, so `cout` prints `66`. Compare the question before this one, where storing the result in a `char` variable made it show as `B`.",
  },
  {
    id: "cpp-2-1-c", lesson: "2.1", kind: "mcq",
    prompt: "What does this print?",
    code: `bool done = true;\ncout << done;`,
    options: ["`1`", "`true`", "`True`", "`done`"],
    answer: 0,
    explain: "By default `cout` prints a `bool` as a number: `1` for true and `0` for false. `true` is what you might expect from Java or JavaScript; `done` would need quotes to print as text.",
  },
  {
    id: "cpp-2-1-d", lesson: "2.1", kind: "mcq",
    prompt: "Which line correctly stores the name Sam?",
    options: [
      "`string name = \"Sam\";`",
      "`string name = 'Sam';`",
      "`char name = \"Sam\";`",
      "`String name = \"Sam\";`",
    ],
    answer: 0,
    explain: "Text goes in double quotes, in a `string`. Single quotes are only for one `char`, so `'Sam'` is an error. A `char` box can't hold three letters. `String` with a capital S is the Java spelling — C++ doesn't know it.",
  },

  /* ---------------------------------------------------- 2.2 Arithmetic and cin */
  {
    id: "cpp-2-2-a", lesson: "2.2", kind: "mcq",
    prompt: "What does this print?",
    code: `cout << 7 / 2 << endl;`,
    options: ["`3`", "`3.5`", "`4`", "`1`"],
    answer: 0,
    explain: "Both 7 and 2 are whole numbers, so this is integer division: 2 goes into 7 three whole times and the leftover is thrown away. `3.5` is the maths answer, `4` assumes rounding (C++ never rounds here), and `1` is the remainder — that's what `7 % 2` gives.",
  },
  {
    id: "cpp-2-2-b", lesson: "2.2", kind: "mcq",
    prompt: "What does this print?",
    code: `cout << 17 % 5;`,
    options: ["`2`", "`3`", "`3.4`", "`12`"],
    answer: 0,
    explain: "`%` is the remainder: 5 goes into 17 three times (15) with 2 left over. `3` is the number of times it goes in — that's `17 / 5`. `3.4` is ordinary division, and `12` is `17 - 5`.",
  },
  {
    id: "cpp-2-2-c", lesson: "2.2", kind: "mcq",
    prompt: "Two test scores, 7 and 8. What does this print?",
    code: `double avg = (7 + 8) / 2;\ncout << avg;`,
    options: ["`7`", "`7.5`", "`7.0`", "`8`"],
    answer: 0,
    explain: "The right-hand side is worked out first: 15 / 2 is whole-number division, giving 7. Only then is 7 put in the double box. A `double` on the left doesn't change how the division on the right was done. And `cout` prints the double 7.0 as just `7`.",
  },
  {
    id: "cpp-2-2-d", lesson: "2.2", kind: "mcq",
    prompt: "The user types `Ada Lovelace` and presses Enter. What does this print after `Name? `?",
    code: `string name;\ncout << "Name? ";\ncin >> name;\ncout << "Hi " << name;`,
    options: ["`Hi Ada`", "`Hi Ada Lovelace`", "`Hi Lovelace`", "Nothing — it waits for more input"],
    answer: 0,
    explain: "`cin >>` reads one word and stops at the first space, so `name` is just `Ada`. To read a whole line including spaces, use `getline(cin, name);` instead.",
  },
  {
    id: "cpp-2-2-e", lesson: "2.2", kind: "fill",
    prompt: "Fill in the blank so `avg` really is 7.5.",
    code: `double avg = (7 + 8) / ___;`,
    accept: ["2.0", "2.", "2.00"],
    explain: "Dividing by `2.0` instead of `2` makes one side a double, so the division keeps its decimal part: 15 / 2.0 is 7.5.",
  },

  /* ---------------------------------------------------- 2.3 Constants and conversion */
  {
    id: "cpp-2-3-a", lesson: "2.3", kind: "mcq",
    prompt: "What does this print?",
    code: `int x = 3.9;\ncout << x;`,
    options: ["`3`", "`4`", "`3.9`", "It won't compile"],
    answer: 0,
    explain: "An `int` can only hold whole numbers, so C++ chops off the `.9` and keeps 3. It does not round, which is why `4` is wrong. The compiler may warn you, but it still builds the program.",
  },
  {
    id: "cpp-2-3-b", lesson: "2.3", kind: "mcq",
    prompt: "What does this print?",
    code: `int a = 7, b = 2;\ncout << static_cast<double>(a) / b;`,
    options: ["`3.5`", "`3`", "`4`", "`3.50`"],
    answer: 0,
    explain: "`a` becomes the double 7.0 *before* the division, so it's 7.0 / 2 = 3.5. You'd get `3` if the cast came after dividing. `cout` doesn't add a trailing zero, so `3.50` isn't printed.",
  },
  {
    id: "cpp-2-3-c", lesson: "2.3", kind: "mcq",
    prompt: "What does this print?",
    code: `cout << static_cast<double>(7 / 2);`,
    options: ["`3`", "`3.5`", "`3.0`", "`4`"],
    answer: 0,
    explain: "The brackets come first: `7 / 2` is whole-number division, so it's already 3. Casting 3 to a double gives 3.0, which `cout` prints as `3`. The cast is too late to bring the .5 back. `3.0` is tempting, but `cout` drops the `.0`.",
  },
  {
    id: "cpp-2-3-d", lesson: "2.3", kind: "mcq",
    prompt: "What happens with this code?",
    code: `const int MAX_LIVES = 3;\nMAX_LIVES = 5;\ncout << MAX_LIVES;`,
    options: [
      "It won't compile: a `const` can't be changed",
      "It prints `5`",
      "It prints `3` — the change is ignored",
      "It compiles, then crashes on the second line",
    ],
    answer: 0,
    explain: "`const` is a promise the compiler holds you to. Trying to assign to `MAX_LIVES` is a compile error, so nothing runs. It isn't quietly ignored, and it isn't a crash — the program never gets built.",
  },
  {
    id: "cpp-2-3-e", lesson: "2.3", kind: "fill",
    prompt: "Fill in the blank so the tax rate can never be changed by accident.",
    code: `___ double TAX_RATE = 0.08;`,
    accept: ["const", "constexpr"],
    explain: "`const` before the type locks the value in (`constexpr` works too — it's an even stricter kind of constant). Any line that later tries to change `TAX_RATE` won't compile.",
  },
  /* ------------------------------------------------------------ 3.1 if and else */
  {
    id: "cpp-3-1-a", lesson: "3.1", kind: "mcq",
    prompt: "What does this print?",
    code: `int score = 95;\nif (score >= 60) {\n    cout << "Pass";\n} else if (score >= 90) {\n    cout << "Top marks";\n}`,
    options: ["`Pass`", "`Top marks`", "`PassTop marks`", "Nothing"],
    answer: 0,
    explain: "C++ runs the first branch whose test is true and skips the rest. 95 >= 60 is true, so it prints Pass and never reaches the 90 test. Top marks is what you'd get with the strictest test first — the fix is to swap the order.",
  },
  {
    id: "cpp-3-1-b", lesson: "3.1", kind: "mcq",
    prompt: "What does this print?",
    code: `int temp = 30;\nif (temp < 10)\n    cout << "Cold" << endl;\n    cout << "Wear a coat" << endl;\ncout << "Done" << endl;`,
    options: [
      "`Done` only",
      "`Wear a coat` then `Done`",
      "`Cold`, `Wear a coat`, then `Done`",
      "Nothing — the `if` is false",
    ],
    answer: 1,
    explain: "Without braces, an `if` controls only the next single statement — the Cold line. The coat line is indented to look like it belongs, but the compiler ignores indentation, so it always runs. Done only is what the indentation suggests; braces would make it true.",
  },
  {
    id: "cpp-3-1-c", lesson: "3.1", kind: "mcq",
    prompt: "What does this print?",
    code: `int coins = 3;\nif (coins > 10);\n{\n    cout << "Rich!" << endl;\n}\ncout << "Coins: " << coins << endl;`,
    options: [
      "`Coins: 3` only",
      "`Rich!` then `Coins: 3`",
      "Nothing — it doesn't compile",
      "`Rich!` only",
    ],
    answer: 1,
    explain: "The `;` straight after the condition is an empty statement — that's the whole body of the `if`. The block in braces is no longer attached to anything, so it runs every time. Coins: 3 only is what the programmer meant. It does compile; that's what makes the bug sneaky.",
  },
  {
    id: "cpp-3-1-d", lesson: "3.1", kind: "fill",
    prompt: "Fill in the blank so the program prints Odd whenever `n` isn't even.",
    code: `if (n % 2 == 0) {\n    cout << "Even";\n} ___ {\n    cout << "Odd";\n}`,
    accept: ["else"],
    explain: "`else` catches every case the `if` didn't. Since a whole number is either even or not, you don't need to test `n % 2 == 1` as well.",
  },

  /* ------------------------------------------- 3.2 Comparison and logical operators */
  {
    id: "cpp-3-2-a", lesson: "3.2", kind: "mcq",
    prompt: "What does this print?",
    code: `int age = 10;\nif (age = 18) {\n    cout << "Adult, age " << age << endl;\n} else {\n    cout << "Child, age " << age << endl;\n}`,
    options: [
      "`Child, age 10`",
      "`Adult, age 18`",
      "`Adult, age 10`",
      "Nothing — it doesn't compile",
    ],
    answer: 1,
    explain: "One `=` stores 18 in `age`. The value of that assignment is 18, which isn't zero, so the test counts as true — and `age` really is 18 now. Child, age 10 is what `==` would give. Java won't compile this, but C++ does — many compilers warn about it, especially with warnings turned on (`-Wall`).",
  },
  {
    id: "cpp-3-2-b", lesson: "3.2", kind: "mcq",
    prompt: "What does this print?",
    code: `int lives = 3;\nif (lives) {\n    cout << "Keep playing" << endl;\n}\nlives = 0;\nif (lives) {\n    cout << "Still going" << endl;\n} else {\n    cout << "Game over" << endl;\n}`,
    options: [
      "`Keep playing` then `Game over`",
      "`Keep playing` then `Still going`",
      "`Game over` only",
      "Nothing — `if (lives)` isn't a real condition",
    ],
    answer: 0,
    explain: "In a condition, zero means false and any other number means true. 3 is true, so Keep playing prints; after `lives = 0` the second test is false, so the else runs. Still going is what you'd get by thinking any variable that exists counts as true.",
  },
  {
    id: "cpp-3-2-c", lesson: "3.2", kind: "mcq",
    prompt: "What happens when this runs?",
    code: `int count = 0;\nint total = 50;\nif (count != 0 && total / count > 5) {\n    cout << "Big average" << endl;\n} else {\n    cout << "No data" << endl;\n}`,
    options: [
      "It prints `No data`",
      "It crashes dividing by zero",
      "It prints `Big average`",
      "It prints nothing",
    ],
    answer: 0,
    explain: "`count != 0` is false, and false `&&` anything is false, so C++ skips the right side entirely — the division never happens. That's short-circuiting, and it's why the guard goes on the left. Swap the two sides and it really does divide by zero — that's undefined behaviour in C++, which often crashes the program and can do something stranger.",
  },
  {
    id: "cpp-3-2-d", lesson: "3.2", kind: "mcq",
    prompt: "What does this print?",
    code: `int x = 3;\nif (!(x > 3)) cout << "A";\nif (!x > 3) cout << "B";\ncout << "C";`,
    options: ["`AC`", "`ABC`", "`C`", "`BC`"],
    answer: 0,
    explain: "`!(x > 3)` flips false to true, so A prints. But `!` grabs only what's right next to it: `!x > 3` means `(!x) > 3`. `!x` is false (0, since x isn't zero), and 0 > 3 is false, so B doesn't print. ABC comes from assuming both lines mean the same thing — use brackets whenever `!` should cover a whole comparison.",
  },
  {
    id: "cpp-3-2-e", lesson: "3.2", kind: "fill",
    prompt: "Fill in the blank so this only prints for ages 13 to 19.",
    code: `if (age >= 13 ___ age <= 19) {\n    cout << "Teen ticket" << endl;\n}`,
    accept: ["&&", "and"],
    explain: "Both conditions must be true at once, so it's `&&`. With `||`, every age passes — any number is either at least 13 or at most 19.",
  },

  /* ------------------------------------------------------------- 3.3 switch */
  {
    id: "cpp-3-3-a", lesson: "3.3", kind: "mcq",
    prompt: "What does this print?",
    code: `int day = 2;\nswitch (day) {\n    case 1: cout << "Mon ";\n    case 2: cout << "Tue ";\n    case 3: cout << "Wed ";\n        break;\n    case 4: cout << "Thu ";\n}`,
    options: ["`Tue Wed`", "`Tue`", "`Tue Wed Thu`", "`Mon Tue Wed`"],
    answer: 0,
    explain: "The switch jumps to `case 2` and runs from there, falling through into `case 3` because there's no `break`. The `break` after Wed stops it. Tue alone is what you'd expect if each case stopped by itself; Mon only prints if day is 1.",
  },
  {
    id: "cpp-3-3-b", lesson: "3.3", kind: "mcq",
    prompt: "What does this print?",
    code: `char grade = 'b';\nswitch (grade) {\n    case 'A': cout << "Great"; break;\n    case 'B': cout << "Good"; break;\n    default:  cout << "Keep going"; break;\n}`,
    options: ["`Keep going`", "`Good`", "`GoodKeep going`", "Nothing — it doesn't compile"],
    answer: 0,
    explain: "`'b'` and `'B'` are different characters, so no case matches and `default` runs. Good is what you'd get if `char` comparisons ignored capitals — they don't. To accept both, stack two labels: `case 'b': case 'B':` — a useful kind of fall-through.",
  },
  {
    id: "cpp-3-3-c", lesson: "3.3", kind: "mcq",
    prompt: "Which of these can't you use as the value in `switch (...)`?",
    options: [
      "A `string`, like `pet` holding \"cat\"",
      "An `int`, like `choice`",
      "A `char`, like `answer`",
      "A `bool`, like `ready`",
    ],
    answer: 0,
    explain: "`switch` only works on whole-number types, and `char` and `bool` count as those. A `string` won't compile — test it with `if (pet == \"cat\")` and `else if` instead.",
  },
  {
    id: "cpp-3-3-d", lesson: "3.3", kind: "fill",
    prompt: "Choosing 1 prints Start game and then Quit as well. Fill in the missing statement so case 1 stops where it should.",
    code: `switch (choice) {\n    case 1:\n        cout << "Start game" << endl;\n        ___;\n    case 2:\n        cout << "Quit" << endl;\n        break;\n}`,
    accept: ["break", "break;"],
    explain: "`break` jumps out of the switch. Without it, case 1 falls straight through into case 2's code.",
  },

  /* ------------------------------------------------------------ 4.1 for loops */
  {
    id: "cpp-4-1-a", lesson: "4.1", kind: "mcq",
    prompt: "What does this print?",
    code: `for (int i = 1; i < 5; i++) {\n    cout << i << " ";\n}`,
    options: ["`1 2 3 4`", "`1 2 3 4 5`", "`0 1 2 3 4`", "`2 3 4 5`"],
    answer: 0,
    explain: "`i` starts at 1 and the loop stops as soon as `i < 5` is false, so 5 is never printed. 1 2 3 4 5 is the `<=` answer — the classic off-by-one. 0 1 2 3 4 forgets the loop starts at 1.",
  },
  {
    id: "cpp-4-1-b", lesson: "4.1", kind: "mcq",
    prompt: "What does this print?",
    code: `int i;\nfor (i = 0; i < 3; i++);\n{\n    cout << "i is " << i << endl;\n}`,
    options: [
      "`i is 3`, once",
      "`i is 0`, `i is 1`, `i is 2`",
      "`i is 0`, once",
      "Nothing — it doesn't compile",
    ],
    answer: 0,
    explain: "The `;` after the `for (...)` is the loop's whole body: an empty statement, run three times. Then the block underneath runs once, when `i` has already reached 3. The three-line answer is what the programmer meant. It compiles because `i` was declared before the loop.",
  },
  {
    id: "cpp-4-1-c", lesson: "4.1", kind: "mcq",
    prompt: "What does this print?",
    code: `for (int n = 20; n > 0; n -= 6) {\n    cout << n << " ";\n}`,
    options: ["`20 14 8 2`", "`20 14 8`", "`20 14 8 2 -4`", "`14 8 2`"],
    answer: 0,
    explain: "Write out n: 20, 14, 8, 2 — all greater than 0. The next value, -4, fails the test before it's printed. 20 14 8 stops one pass early; the -4 version forgets the condition is checked before printing. The first value printed is the start value, 20.",
  },

  /* ---------------------------------------------------- 4.2 while and do-while */
  {
    id: "cpp-4-2-a", lesson: "4.2", kind: "mcq",
    prompt: "What does this print?",
    code: `int tickets = 0;\ndo {\n    cout << "Selling ticket" << endl;\n    tickets--;\n} while (tickets > 0);\ncout << "tickets = " << tickets << endl;`,
    options: [
      "`Selling ticket` then `tickets = -1`",
      "`tickets = 0` only",
      "`Selling ticket` forever",
      "`Selling ticket` then `tickets = 0`",
    ],
    answer: 0,
    explain: "A do-while runs its body before checking anything, so one ticket is \"sold\" even though there were none, and `tickets` drops to -1. Then -1 > 0 is false and the loop ends. tickets = 0 only is what a plain `while` would print — it checks first.",
  },
  {
    id: "cpp-4-2-b", lesson: "4.2", kind: "mcq",
    prompt: "What does this print?",
    code: `int n = 1;\nwhile (n < 50) {\n    n = n * 2;\n}\ncout << n;`,
    options: ["`64`", "`32`", "`50`", "`128`"],
    answer: 0,
    explain: "n goes 1, 2, 4, 8, 16, 32 — all under 50 — and the pass that starts at 32 doubles it to 64. Only then is the test checked again, and it fails. 32 is the last value that passed the test, not the final value. The loop never lands exactly on 50.",
  },
  {
    id: "cpp-4-2-c", lesson: "4.2", kind: "mcq",
    prompt: "What happens when this runs?",
    code: `int countdown = 3;\nwhile (countdown > 0) {\n    cout << countdown << " ";\n}\ncout << "Liftoff!";`,
    options: [
      "It prints `3 ` over and over and never reaches Liftoff",
      "It prints `3 2 1 Liftoff!`",
      "It prints `3 Liftoff!`",
      "It prints `Liftoff!` only",
    ],
    answer: 0,
    explain: "Nothing inside the loop changes `countdown`, so `countdown > 0` stays true forever: an infinite loop. 3 2 1 Liftoff! is what it does once you add `countdown--;` inside the braces. Every while loop needs a line that moves it towards stopping.",
  },
  {
    id: "cpp-4-2-d", lesson: "4.2", kind: "fill",
    prompt: "The player has to guess at least once before there's anything to check. Fill in the keyword that starts this loop.",
    code: `int guess;\n___ {\n    cout << "Guess: ";\n    cin >> guess;\n} while (guess != 7);`,
    accept: ["do"],
    explain: "`do { ... } while (...);` runs the body first and checks afterwards, so the question is always asked at least once.",
  },

  /* ----------------------------------------------- 4.3 Nested loops and patterns */
  {
    id: "cpp-4-3-a", lesson: "4.3", kind: "mcq",
    prompt: "What does this print?",
    code: `int count = 0;\nfor (int r = 0; r < 4; r++) {\n    for (int c = 0; c < 3; c++) {\n        count++;\n    }\n}\ncout << count;`,
    options: ["`12`", "`7`", "`3`", "`4`"],
    answer: 0,
    explain: "The inner loop runs all 3 of its passes for each of the 4 outer passes: 4 × 3 = 12. 7 comes from adding the loop counts instead of multiplying them. 3 forgets that the inner loop starts over every time.",
  },
  {
    id: "cpp-4-3-b", lesson: "4.3", kind: "mcq",
    prompt: "What does this print?",
    code: `for (int r = 1; r <= 3; r++) {\n    for (int c = 1; c <= r; c++) {\n        cout << "#";\n    }\n    cout << endl;\n}`,
    options: [
      "Three lines: `#`, `##`, `###`",
      "Three lines, each `###`",
      "One line: `######`",
      "Three lines: `###`, `##`, `#`",
    ],
    answer: 0,
    explain: "The inner loop runs up to `r`, so row 1 gets one #, row 2 gets two, row 3 gets three. Three lines of ### is what `c <= 3` would print. The `endl` after the inner loop is what starts a new line for each row.",
  },
  {
    id: "cpp-4-3-c", lesson: "4.3", kind: "mcq",
    prompt: "What does this print?",
    code: `for (int r = 1; r <= 2; r++) {\n    for (int c = 1; c <= 3; c++) {\n        cout << r * c << " ";\n    }\n    cout << endl;\n}`,
    options: [
      "Two lines: `1 2 3` and `2 4 6`",
      "One line: `1 2 3 2 4 6`",
      "Three lines: `1 2`, `2 4` and `3 6`",
      "Two lines: `2 4 6` and `3 6 9`",
    ],
    answer: 0,
    explain: "The outer loop makes the rows (r is 1, then 2), and the inner loop makes the columns. Row 1 is 1×1, 1×2, 1×3; row 2 is 2, 4, 6. The single-line answer ignores the `endl`. Three lines swaps which loop makes the rows.",
  },
  /* ------------------------------------------------------------ 5.1 Arrays */
  {
    id: "cpp-5-1-a", lesson: "5.1", kind: "mcq",
    prompt: "What does this print?",
    code: `int scores[4] = {10, 20, 30, 40};\ncout << scores[2] + scores[0];`,
    options: ["40", "30", "1030", "It won't compile — you can't do maths with array elements"],
    answer: 0,
    explain: "`scores[2]` is the *third* box, 30, because indexes start at 0, and `scores[0]` is 10, so the total is 40. Getting 30 means you counted from 1 and read `scores[2]` as 20. Each element is an ordinary `int`, so `+` adds them — it doesn't join them into \"1030\".",
  },
  {
    id: "cpp-5-1-b", lesson: "5.1", kind: "mcq",
    prompt: "`int cans[3] = {5, 9, 2};` — which of these reads the last element?",
    options: ["`cans[2]`", "`cans[3]`", "`cans[-1]`", "`cans.last()`"],
    answer: 0,
    explain: "A 3-slot array has indexes 0, 1 and 2, so the last one is `cans[2]`. `cans[3]` is the classic slip — it's one past the end. `cans[-1]` gets you the last item in Python, not C++, and plain arrays have no member functions like `.last()`.",
  },
  {
    id: "cpp-5-1-c", lesson: "5.1", kind: "mcq",
    prompt: "A 3-slot array `cans` is read with `cout << cans[3];`. What does C++ do?",
    options: [
      "Nothing stops it — it reads whatever memory comes next. That's undefined behaviour: it might print junk, crash, or look fine",
      "It throws an error that says the index is out of bounds, like Java does",
      "It prints 0, because empty slots are 0",
      "It refuses to compile",
    ],
    answer: 0,
    explain: "C++ doesn't check array indexes, at compile time or while running. It goes to where box 3 would be and reads whatever is there. Java's out-of-bounds error is what students expect, which is exactly why this bug is so sneaky in C++ — the program often keeps running with a wrong value.",
  },
  {
    id: "cpp-5-1-d", lesson: "5.1", kind: "fill",
    prompt: "This array holds five temperatures. Fill in its size.",
    code: `int temps[___] = {61, 64, 70, 58, 66};`,
    accept: ["5"],
    explain: "The size is how many boxes, so 5 — even though the last index is 4. You could also leave the brackets empty, `int temps[] = {...}`, and the compiler would count them for you.",
  },

  /* --------------------------------------------------- 5.2 Vectors and 2D */
  {
    id: "cpp-5-2-a", lesson: "5.2", kind: "mcq",
    prompt: "What does this print?",
    code: `vector<int> v = {3, 1, 4};\nv.push_back(1);\nv.push_back(5);\ncout << v.size() << " " << v[3];`,
    options: ["5 1", "5 5", "3 1", "4 1"],
    answer: 0,
    explain: "Two `push_back`s turn 3 items into 5, so `size()` is 5. The vector is now 3, 1, 4, 1, 5, and index 3 is the fourth item: 1. \"5 5\" comes from thinking `v[3]` is the last thing you added. \"3 1\" forgets that `push_back` really grows the vector.",
  },
  {
    id: "cpp-5-2-b", lesson: "5.2", kind: "mcq",
    prompt: "What happens when this runs?",
    code: `vector<int> v = {7, 8, 9};\ncout << v.at(3);`,
    options: [
      "The program stops with an `out_of_range` error, because `.at()` checks the index",
      "It prints 9, the last item",
      "It prints 0",
      "It quietly reads past the end, the same as `v[3]` would",
    ],
    answer: 0,
    explain: "The valid indexes are 0, 1 and 2. `.at()` checks, so index 3 makes it throw `std::out_of_range` and the program stops with a message. That check is the whole difference between `.at(3)` and `v[3]` — square brackets don't check, and reading past the end with them is undefined behaviour.",
  },
  {
    id: "cpp-5-2-c", lesson: "5.2", kind: "mcq",
    prompt: "What does this print?",
    code: `int grid[2][3] = {{1, 2, 3},\n                  {4, 5, 6}};\ncout << grid[1][2];`,
    options: ["6", "2", "5", "3"],
    answer: 0,
    explain: "The first index is the row and the second is the column, both counting from 0. Row 1 is the second row, {4, 5, 6}, and column 2 is its third value: 6. Getting 2 means you counted both indexes from 1. Getting 5 means only the column was counted from 1, and 3 means only the row was.",
  },
  {
    id: "cpp-5-2-d", lesson: "5.2", kind: "fill",
    prompt: "Add 88 to the end of the `scores` vector.",
    code: `scores.___(88);`,
    accept: ["push_back", "emplace_back"],
    explain: "`push_back` adds a value at the end and makes the vector one longer. (`emplace_back` does the same job here.) Arrays have nothing like it, because their size is fixed — that's the main reason to use a vector.",
  },

  /* -------------------------------------------------- 5.3 Pointers and refs */
  {
    id: "cpp-5-3-a", lesson: "5.3", kind: "mcq",
    prompt: "What does this print?",
    code: `int x = 5;\nint* p = &x;\n*p = 9;\ncout << x;`,
    options: ["9", "5", "The address of `x`", "It won't compile"],
    answer: 0,
    explain: "`p` holds the address of `x`, so `*p` means \"the value at x's address\" — which is `x` itself. Setting `*p` to 9 sets `x` to 9. Answering 5 treats `p` as a separate copy of `x`; it isn't a copy, it's directions to the original.",
  },
  {
    id: "cpp-5-3-b", lesson: "5.3", kind: "mcq",
    prompt: "After `int* p = &x;`, what is actually stored in `p`?",
    options: [
      "The address of `x` — a number saying where `x` is in memory",
      "A copy of the value of `x`",
      "The name \"x\"",
      "`x` itself, moved into `p`",
    ],
    answer: 0,
    explain: "A pointer's value is an address: a plain number that identifies a spot in memory. It doesn't contain `x`'s value — you have to follow it with `*p` to get that — and names don't exist at all once the program is compiled. `x` stays exactly where it was.",
  },
  {
    id: "cpp-5-3-c", lesson: "5.3", kind: "mcq",
    prompt: "What does this print?",
    code: `int a = 3;\nint b = 7;\nint* p = &a;\np = &b;\n*p = *p + 1;\ncout << a << " " << b;`,
    options: ["3 8", "4 7", "4 8", "3 7"],
    answer: 0,
    explain: "`p = &b;` (no star) changes where `p` points — from `a` to `b`. It doesn't touch either value. Then `*p = *p + 1` adds 1 to whatever `p` points at now, which is `b`. \"4 7\" is the classic mix-up: thinking `p` still points at `a`, or that `p = &b` copied `b` into `a`.",
  },
  {
    id: "cpp-5-3-d", lesson: "5.3", kind: "mcq",
    prompt: "What does this print?",
    code: `int score = 10;\nint& r = score;\nr = r + 5;\ncout << score << " " << r;`,
    options: ["15 15", "10 15", "15 10", "10 10"],
    answer: 0,
    explain: "`int& r = score;` makes `r` another name for `score` — there's only one box. Adding 5 through `r` adds 5 to `score`, so both names show 15. \"10 15\" is what you'd expect if `r` were a copy, which is what `int r = score;` (no `&`) would make.",
  },
  {
    id: "cpp-5-3-e", lesson: "5.3", kind: "fill",
    prompt: "Make `p` hold the address of `x`.",
    code: `int x = 42;\nint* p = ___x;`,
    accept: ["&"],
    explain: "`&` in front of a variable means \"the address of\". `int* p = &x;` stores where `x` lives. Writing `int* p = x;` doesn't compile — 42 is a value, not an address.",
  },

  /* ------------------------------------------------------- 6.1 Functions */
  {
    id: "cpp-6-1-a", lesson: "6.1", kind: "mcq",
    prompt: "What does this print?",
    code: `int square(int n) {\n  return n * n;\n}\n\nint main() {\n  cout << square(3) + square(2);\n}`,
    options: ["13", "25", "10", "94"],
    answer: 0,
    explain: "Each call runs separately: `square(3)` is 9, `square(2)` is 4, and 9 + 4 is 13. Getting 25 means you added first and squared once, as if it said `square(3 + 2)`. Getting 10 means you doubled instead of squared. The results are `int`s, so `+` adds rather than joining them into \"94\".",
  },
  {
    id: "cpp-6-1-b", lesson: "6.1", kind: "mcq",
    prompt: "Why won't this compile?",
    code: `void addOne(int n) {\n  cout << n + 1;\n}\n\nint main() {\n  int result = addOne(4);\n}`,
    options: [
      "`addOne` is `void`, so it gives back nothing to store in `result`",
      "Functions aren't allowed to use `cout`",
      "The 4 needs to be in quotes",
      "`result` should be a `string`",
    ],
    answer: 0,
    explain: "`void` means the function hands nothing back. It *prints* 5, but printing isn't returning — there's still no value for `result` to hold. To store the answer, make it `int addOne(int n)` and `return n + 1;`. Mixing up printing and returning is one of the most common beginner mistakes in every language.",
  },
  {
    id: "cpp-6-1-c", lesson: "6.1", kind: "mcq",
    prompt: "What happens when you compile this?",
    code: `int main() {\n  cout << triple(4);\n}\n\nint triple(int n) {\n  return n * 3;\n}`,
    options: [
      "It fails: `triple` is used before the compiler has seen it. A prototype `int triple(int n);` above `main` fixes it",
      "It compiles and prints 12",
      "It compiles and prints 4",
      "It compiles, but crashes when it runs",
    ],
    answer: 0,
    explain: "The compiler reads top to bottom, so when it reaches `triple(4)` it has never heard of `triple` and reports an undeclared identifier. Python and JavaScript let you call functions defined further down; C++ needs to be told first. Either move `triple` above `main` or add the one-line prototype.",
  },
  {
    id: "cpp-6-1-d", lesson: "6.1", kind: "fill",
    prompt: "This function returns an average that can have a decimal part, like 7.5. Fill in its return type.",
    code: `___ average(int a, int b) {\n  return (a + b) / 2.0;\n}`,
    accept: ["double", "float"],
    explain: "Dividing by `2.0` gives a decimal, so the function should return a `double` (`float` also keeps the .5, with fewer digits of precision). If you wrote `int`, the 7.5 would be chopped to 7 on the way out, because the return type decides what kind of value comes back.",
  },

  /* ---------------------------------------------- 6.2 Value vs reference */
  {
    id: "cpp-6-2-a", lesson: "6.2", kind: "mcq",
    prompt: "What does this print?",
    code: `void swapNums(int a, int b) {\n  int temp = a;\n  a = b;\n  b = temp;\n}\n\nint main() {\n  int x = 1, y = 2;\n  swapNums(x, y);\n  cout << x << " " << y;\n}`,
    options: ["1 2", "2 1", "2 2", "1 1"],
    answer: 0,
    explain: "`a` and `b` are copies of `x` and `y`. The function swaps the copies perfectly, then ends and throws them away — `x` and `y` were never touched. \"2 1\" is what you'd get with `int& a, int& b`. This is the textbook pass-by-value bug.",
  },
  {
    id: "cpp-6-2-b", lesson: "6.2", kind: "mcq",
    prompt: "What does this print?",
    code: `void addBonus(int& points) {\n  points = points + 10;\n}\n\nint main() {\n  int score = 50;\n  addBonus(score);\n  addBonus(score);\n  cout << score;\n}`,
    options: ["70", "50", "60", "10"],
    answer: 0,
    explain: "The `&` makes `points` another name for `score`, so each call really adds 10: 50, then 60, then 70. Answering 50 means you treated it as a copy, which is what it would be without the `&`. 60 forgets the second call also changes the same variable.",
  },
  {
    id: "cpp-6-2-c", lesson: "6.2", kind: "mcq",
    prompt: "What does this print? (Note: there's no space between the two numbers.)",
    code: `void change(int a, int& b) {\n  a = 0;\n  b = 0;\n}\n\nint main() {\n  int x = 4, y = 4;\n  change(x, y);\n  cout << x << y;\n}`,
    options: ["40", "00", "44", "04"],
    answer: 0,
    explain: "Only the second parameter has `&`. `a` is a copy of `x`, so `x` stays 4; `b` is another name for `y`, so `y` becomes 0. Look at each parameter separately — one `&` doesn't apply to the whole list.",
  },

  /* --------------------------------------------------------- 6.3 Classes */
  {
    id: "cpp-6-3-a", lesson: "6.3", kind: "mcq",
    prompt: "What does this print?",
    code: `class Jar {\npublic:\n  int coins = 0;\n  void add(int n) {\n    coins = coins + n;\n  }\n};\n\nint main() {\n  Jar a;\n  Jar b;\n  a.add(5);\n  b.add(2);\n  a.add(1);\n  cout << a.coins << " " << b.coins;\n}`,
    options: ["6 2", "8 8", "5 2", "6 0"],
    answer: 0,
    explain: "Every object gets its own copy of the member variables. `a` collects 5 and 1, so 6; `b` collects 2. \"8 8\" comes from thinking all `Jar`s share one `coins`. \"5 2\" misses that the second `a.add(1)` adds to the same jar.",
  },
  {
    id: "cpp-6-3-b", lesson: "6.3", kind: "mcq",
    prompt: "Why won't this compile?",
    code: `class Pet {\nprivate:\n  int hunger = 3;\npublic:\n  void feed() { hunger = 0; }\n};\n\nint main() {\n  Pet p;\n  p.hunger = 0;\n}`,
    options: [
      "`hunger` is private, so only `Pet`'s own member functions can change it. Call `p.feed()` instead",
      "`hunger` was never given a value",
      "You can't make a `Pet` without `new`",
      "Member variables can't be numbers",
    ],
    answer: 0,
    explain: "`private` means code outside the class can't touch it — and `main` is outside the class. That's the point: the class decides how `hunger` changes, through `feed()`. Objects in C++ don't need `new`; `Pet p;` makes one directly, which surprises students coming from Java.",
  },
  {
    id: "cpp-6-3-c", lesson: "6.3", kind: "mcq",
    prompt: "What does this print?",
    code: `class DonationJar {\nprivate:\n  string cause;\n  int total;\npublic:\n  DonationJar(string c) {\n    cause = c;\n    total = 0;\n  }\n  void donate(int amount) {\n    if (amount > 0) {\n      total = total + amount;\n    }\n  }\n  int getTotal() { return total; }\n};\n\nint main() {\n  DonationJar jar("Food bank");\n  jar.donate(20);\n  jar.donate(-5);\n  jar.donate(15);\n  cout << jar.getTotal();\n}`,
    options: ["35", "30", "20", "0"],
    answer: 0,
    explain: "The constructor starts `total` at 0. The `if` inside `donate` ignores amounts that aren't positive, so the -5 is skipped: 20 + 15 = 35. Getting 30 means the -5 was subtracted. Guarding data like this is exactly why `total` is private.",
  },
  {
    id: "cpp-6-3-d", lesson: "6.3", kind: "fill",
    prompt: "This class won't compile. Fill in the one character missing after the closing brace.",
    code: `class Pet {\npublic:\n  string name;\n}___`,
    accept: [";"],
    explain: "A class definition ends with `};` — brace *and* semicolon. Functions and loops don't need one after their `}`, which is why it's so easy to forget here. The compiler's message is \"expected ';' after class\".",
  },
];
