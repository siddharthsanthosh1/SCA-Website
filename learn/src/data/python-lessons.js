/* ---------------------------------------------------------------------------
   Intro to Python for Kids — lessons.

   Follows the Student Code Alliance course outline: 6 topics, 18 lessons.

   Block types:
     { t: "p",       text }                      paragraph (supports `code` spans and **bold**)
     { t: "list",    items: [] }                 bulleted list
     { t: "code",    code, caption? }            a code sample
     { t: "callout", tone: "info|tip|warn", title, text }
   --------------------------------------------------------------------------- */

export const pythonTopics = [
  {
    id: "t1",
    title: "Getting Started with Python",
    blurb: "What a program is, and how to make the computer say something.",
    lessons: [
      {
        id: "1.1",
        title: "What is Programming?",
        minutes: 5,
        blurb: "Computers only do what we tell them.",
        blocks: [
          { t: "p", text: "A computer is fast, but it is not clever. It only does exactly what it is told, in exactly the order it is told. A **program** is that list of instructions." },
          { t: "p", text: "Think about a recipe. *Crack two eggs. Whisk them. Pour them in the pan.* If you swap two steps, breakfast goes wrong. A computer is the same, except it never guesses what you meant." },
          { t: "callout", tone: "tip", title: "The golden rule", text: "If your program does something strange, the computer did not make a mistake. It did exactly what you wrote. Your job is to find the step that says the wrong thing." },
          { t: "p", text: "Programs are everywhere. The microwave counting down, the traffic light changing, the game you played last night — every one of them is a list of instructions somebody wrote." },
        ],
        questions: ["py-1-1-a", "py-1-1-b", "py-1-1-c"],
      },
      {
        id: "1.2",
        title: "Meet Python and print()",
        minutes: 7,
        blurb: "Your first real Python command.",
        blocks: [
          { t: "p", text: "Python is a programming language — a set of words the computer understands. It was designed to look close to English, which is why it is a great first language." },
          { t: "p", text: "The command `print()` puts text on the screen. Whatever you put inside the brackets is what shows up." },
          { t: "code", code: `print("Hello!")`, caption: "This prints: Hello!" },
          { t: "p", text: "Text goes inside **quotes**. Python needs a quote at the start and a quote at the end, so it knows where your words begin and finish." },
          { t: "code", code: `print("I am learning Python")\nprint("This is fun")`, caption: "Two lines run top to bottom, so this prints two lines." },
          { t: "callout", tone: "warn", title: "Watch the closing quote", text: 'Writing print("Hello) gives an error, because Python is still waiting for the quote that closes the text. Errors like this are normal — every programmer makes them daily.' },
        ],
        questions: ["py-1-2-a", "py-1-2-b", "py-1-2-c", "py-1-2-d"],
      },
      {
        id: "1.3",
        title: "Your First Program",
        minutes: 8,
        blurb: "Put several lines together.",
        blocks: [
          { t: "p", text: "A program is more than one line. Python runs your lines in order, from the top of the file to the bottom — exactly like reading a page." },
          { t: "code", code: `print("My name is Ada")\nprint("I am 10 years old")\nprint("My favourite colour is green")` },
          { t: "p", text: "Order matters. Move the last line to the top and the program still works, but it says things in a different order. That is your first taste of real control: you decide what happens when." },
          { t: "callout", tone: "info", title: "Comments", text: "A line starting with # is a note for humans. Python ignores it completely. Use comments to remind yourself what a tricky bit does." },
          { t: "code", code: `# This program introduces me\nprint("My name is Ada")` },
        ],
        questions: ["py-1-3-a", "py-1-3-b", "py-1-3-c"],
      },
    ],
  },
  {
    id: "t2",
    title: "Variables and Data",
    blurb: "Storing information so your program can use it later.",
    lessons: [
      {
        id: "2.1",
        title: "Variables: Boxes That Hold Information",
        minutes: 7,
        blurb: "Give a value a name.",
        blocks: [
          { t: "p", text: "A **variable** is a labelled box. You put something in it, write a name on the side, and later you ask for the box by name instead of remembering what is inside." },
          { t: "code", code: `name = "Sam"\nage = 10\n\nprint(name)\nprint(age)` },
          { t: "p", text: "The `=` sign does not mean *equals* the way it does in maths. It means **put this value into this box**. Read `age = 10` as \"age gets 10\"." },
          { t: "p", text: "You can change what is in a box at any time. The newest value wins." },
          { t: "code", code: `score = 0\nscore = 5\nprint(score)`, caption: "This prints 5. The 0 is gone." },
          { t: "callout", tone: "tip", title: "Naming boxes", text: "Use names that say what is inside. `score` tells you more than `x` ever will — especially in three weeks when you have forgotten how your own program works." },
        ],
        questions: ["py-2-1-a", "py-2-1-b", "py-2-1-c"],
      },
      {
        id: "2.2",
        title: "Numbers and Words",
        minutes: 8,
        blurb: "Two kinds of data, two kinds of behaviour.",
        blocks: [
          { t: "p", text: "Python treats numbers and words differently. Numbers do maths. Words — called **strings** — get joined together." },
          { t: "code", code: `print(2 + 3)\nprint("2" + "3")`, caption: "The first prints 5. The second prints 23." },
          { t: "p", text: "The quotes are what make the difference. `2` is a number. `\"2\"` is a piece of text that happens to look like a number." },
          { t: "p", text: "Joining strings together is called **concatenation**. Remember to add your own spaces — Python will not add them for you." },
          { t: "code", code: `first = "Ada"\nlast = "Lovelace"\nprint(first + " " + last)`, caption: "Prints: Ada Lovelace" },
          { t: "callout", tone: "warn", title: "You cannot add a word to a number", text: 'print("Age: " + 10) is an error. Turn the number into text first with str(10), or use an f-string: print(f"Age: {age}").' },
        ],
        questions: ["py-2-2-a", "py-2-2-b", "py-2-2-c", "py-2-2-d"],
      },
      {
        id: "2.3",
        title: "Asking the User Questions",
        minutes: 8,
        blurb: "input() makes your program a conversation.",
        blocks: [
          { t: "p", text: "So far your programs have done all the talking. `input()` lets them listen. It shows a question, waits for the person to type, and hands you back whatever they typed." },
          { t: "code", code: `name = input("What is your name? ")\nprint("Hi " + name + "!")` },
          { t: "p", text: "Notice the pattern: `input()` **gives back** a value, so you almost always store it in a variable. On its own, `input()` throws the answer away." },
          { t: "callout", tone: "warn", title: "input() always gives you text", text: "Even if someone types 7, you get the string \"7\", not the number 7. To do maths with it, convert it: age = int(input(\"Age? \"))." },
          { t: "code", code: `age = int(input("How old are you? "))\nprint(age + 1)`, caption: "Now the maths works." },
        ],
        questions: ["py-2-3-a", "py-2-3-b", "py-2-3-c"],
      },
    ],
  },
  {
    id: "t3",
    title: "Making Decisions",
    blurb: "Programs that choose what to do.",
    lessons: [
      {
        id: "3.1",
        title: "If Statements",
        minutes: 8,
        blurb: "Do something only when a condition is true.",
        blocks: [
          { t: "p", text: "Up to now every line has run, every time. An **if statement** lets your program skip lines when a condition is not met." },
          { t: "code", code: `number = 15\n\nif number > 10:\n    print("Big number!")` },
          { t: "p", text: "Two details matter enormously here. The colon `:` at the end of the if line, and the **indentation** — the four spaces in front of the print. The indented lines are the ones that only run when the condition is true." },
          { t: "callout", tone: "warn", title: "Indentation is not decoration", text: "In most languages indenting is a style choice. In Python it changes what your program does. Lines indented under an if belong to that if; lines pushed back to the left run no matter what." },
          { t: "code", code: `temperature = 30\n\nif temperature > 25:\n    print("It's hot")\n    print("Drink water")\nprint("Have a good day")`, caption: 'The last line prints always — it is not indented.' },
        ],
        questions: ["py-3-1-a", "py-3-1-b", "py-3-1-c"],
      },
      {
        id: "3.2",
        title: "Comparing Things",
        minutes: 7,
        blurb: "The operators that make conditions.",
        blocks: [
          { t: "p", text: "A condition is a question with a yes-or-no answer. Python answers `True` or `False`." },
          { t: "list", items: [
            "`==` is equal to",
            "`!=` is not equal to",
            "`>` is greater than",
            "`<` is less than",
            "`>=` is greater than or equal to",
            "`<=` is less than or equal to",
          ] },
          { t: "callout", tone: "warn", title: "One equals or two?", text: "`=` puts a value in a box. `==` asks whether two things are the same. Mixing them up is the single most common beginner bug in every language, not just Python." },
          { t: "code", code: `print(5 == 5)\nprint(5 != 5)\nprint(3 > 7)`, caption: "Prints True, False, False." },
          { t: "p", text: "Strings compare too, and the comparison is case-sensitive — `\"Blue\"` and `\"blue\"` are not equal." },
        ],
        questions: ["py-3-2-a", "py-3-2-b", "py-3-2-c"],
      },
      {
        id: "3.3",
        title: "else and elif",
        minutes: 9,
        blurb: "Backup plans and extra choices.",
        blocks: [
          { t: "p", text: "`else` is the backup plan: run this when the if was false." },
          { t: "code", code: `age = 8\n\nif age >= 10:\n    print("Yes!")\nelse:\n    print("Not yet!")` },
          { t: "p", text: "`elif` — short for *else if* — checks another condition before giving up. You can chain as many as you like." },
          { t: "code", code: `size = 50\n\nif size < 10:\n    print("small")\nelif size < 100:\n    print("medium")\nelse:\n    print("large")`, caption: "Prints: medium" },
          { t: "callout", tone: "tip", title: "Order matters", text: "Python checks from the top and stops at the first true one. Put your narrowest condition first, or a broad one will catch everything before the specific check gets a turn." },
        ],
        questions: ["py-3-3-a", "py-3-3-b", "py-3-3-c"],
      },
    ],
  },
];

pythonTopics.push(
  {
    id: "t4",
    title: "Loops",
    blurb: "Making the computer repeat itself so you don't have to.",
    lessons: [
      {
        id: "4.1",
        title: "For Loops",
        minutes: 8,
        blurb: "Repeat something a set number of times.",
        blocks: [
          { t: "p", text: "If you want to print something five times, you could write five print lines. If you want it five hundred times, you need a **loop**." },
          { t: "code", code: `for i in range(5):\n    print("Hi!")`, caption: "Prints Hi! five times." },
          { t: "p", text: "`range(5)` produces the numbers 0, 1, 2, 3, 4 — five numbers, starting at zero. The variable `i` holds each one in turn." },
          { t: "code", code: `for i in range(5):\n    print(i)`, caption: "Prints 0 1 2 3 4, one per line." },
          { t: "callout", tone: "tip", title: "Counting from one", text: "range(1, 11) gives 1 to 10. The first number is where you start; the second is where you stop, and the stop number itself is never included." },
        ],
        questions: ["py-4-1-a", "py-4-1-b", "py-4-1-c"],
      },
      {
        id: "4.2",
        title: "While Loops",
        minutes: 8,
        blurb: "Repeat for as long as something stays true.",
        blocks: [
          { t: "p", text: "A `for` loop runs a known number of times. A `while` loop keeps going until a condition stops being true — useful when you do not know how many turns it will take." },
          { t: "code", code: `count = 5\n\nwhile count > 0:\n    print(count)\n    count = count - 1\n\nprint("Lift off!")` },
          { t: "p", text: "Look closely at `count = count - 1`. Without it, `count` stays 5 forever, the condition stays true forever, and the program never stops." },
          { t: "callout", tone: "warn", title: "The infinite loop", text: "Every while loop needs something inside it that eventually makes the condition false. If your program freezes, this is almost always why. It happens to everyone." },
          { t: "code", code: `password = ""\n\nwhile password != "python":\n    password = input("What's the password? ")\n\nprint("You're in!")` },
        ],
        questions: ["py-4-2-a", "py-4-2-b", "py-4-2-c"],
      },
      {
        id: "4.3",
        title: "Loop Patterns",
        minutes: 8,
        blurb: "Build shapes and sequences with loops.",
        blocks: [
          { t: "p", text: "Loops get interesting when the thing you repeat *changes* each time round." },
          { t: "code", code: `for i in range(1, 5):\n    print("*" * i)`, caption: "Prints a growing triangle:\n*\n**\n***\n****" },
          { t: "p", text: "`\"*\" * i` repeats a string. On the first pass `i` is 1, so you get one star; on the fourth pass you get four." },
          { t: "p", text: "You can also put a loop inside a loop. The inner one finishes completely before the outer one takes its next step." },
          { t: "code", code: `for row in range(3):\n    for col in range(3):\n        print("#", end="")\n    print()`, caption: "Prints a 3x3 square of #." },
          { t: "callout", tone: "info", title: "end=\"\"", text: 'Normally print() moves to a new line. Adding end="" keeps everything on the same line, which is how you build a row before breaking.' },
        ],
        questions: ["py-4-3-a", "py-4-3-b", "py-4-3-c"],
      },
    ],
  },
  {
    id: "t5",
    title: "Lists",
    blurb: "Holding many things in one place.",
    lessons: [
      {
        id: "5.1",
        title: "What is a List?",
        minutes: 7,
        blurb: "One box that holds many values.",
        blocks: [
          { t: "p", text: "A variable holds one thing. A **list** holds as many as you like, in order, inside square brackets." },
          { t: "code", code: `foods = ["pizza", "mango", "dosa"]\nprint(foods)` },
          { t: "p", text: "Each item has a position, called its **index**. Python starts counting at 0, so the first item is `foods[0]`." },
          { t: "code", code: `foods = ["pizza", "mango", "dosa"]\nprint(foods[0])\nprint(foods[2])`, caption: "Prints pizza, then dosa." },
          { t: "callout", tone: "warn", title: "Counting from zero", text: "A list of 3 items has indexes 0, 1 and 2. Asking for foods[3] is an error — there is no fourth item. This trips up everybody at first." },
          { t: "p", text: "`len(foods)` tells you how many items there are." },
        ],
        questions: ["py-5-1-a", "py-5-1-b", "py-5-1-c"],
      },
      {
        id: "5.2",
        title: "Adding and Removing Items",
        minutes: 7,
        blurb: "Lists can grow and shrink.",
        blocks: [
          { t: "p", text: "`append()` adds an item to the end of a list." },
          { t: "code", code: `friends = ["Ana", "Ben"]\nfriends.append("Cleo")\nprint(friends)`, caption: "Prints: ['Ana', 'Ben', 'Cleo']" },
          { t: "p", text: "`remove()` takes an item out by name. `pop()` takes one out by position." },
          { t: "code", code: `animals = ["cat", "dog", "fox"]\nanimals.remove("dog")\nprint(animals)`, caption: "Prints: ['cat', 'fox']" },
          { t: "callout", tone: "tip", title: "The dot", text: "friends.append(...) reads as \"friends, append this\". The dot means you are asking that particular list to do something to itself." },
        ],
        questions: ["py-5-2-a", "py-5-2-b", "py-5-2-c"],
      },
      {
        id: "5.3",
        title: "Looping Through a List",
        minutes: 8,
        blurb: "Lists and loops are better together.",
        blocks: [
          { t: "p", text: "This is where Python starts to feel powerful. A `for` loop can walk straight through a list, one item at a time, without you counting anything." },
          { t: "code", code: `games = ["chess", "tag", "uno"]\n\nfor game in games:\n    print(game)` },
          { t: "p", text: "The variable `game` holds a different item on each pass. You can name it anything, but naming it for what it holds makes the code read like a sentence." },
          { t: "code", code: `numbers = [1, 2, 3, 4]\n\nfor n in numbers:\n    print(n * 2)`, caption: "Prints 2, 4, 6, 8." },
          { t: "callout", tone: "tip", title: "Singular and plural", text: "for game in games — the plural is the list, the singular is one item from it. Reading it out loud is the fastest way to check you have them the right way round." },
        ],
        questions: ["py-5-3-a", "py-5-3-b", "py-5-3-c"],
      },
    ],
  },
  {
    id: "t6",
    title: "Functions",
    blurb: "Writing instructions once and reusing them forever.",
    lessons: [
      {
        id: "6.1",
        title: "What is a Function?",
        minutes: 8,
        blurb: "A mini-program with a name.",
        blocks: [
          { t: "p", text: "You have used functions already — `print()`, `input()` and `len()` are all functions somebody else wrote. Now you write your own." },
          { t: "code", code: `def say_hello():\n    print("Hello there!")\n\nsay_hello()\nsay_hello()`, caption: "Prints the greeting twice." },
          { t: "p", text: "`def` means *define*. Writing the function does not run it — it only teaches Python what the name means. Calling it, with the brackets, is what makes it happen." },
          { t: "callout", tone: "tip", title: "Why bother?", text: "Two reasons. You write the steps once instead of ten times, and when you need to fix something you fix it in one place instead of hunting through the whole program." },
        ],
        questions: ["py-6-1-a", "py-6-1-b", "py-6-1-c"],
      },
      {
        id: "6.2",
        title: "Functions with Inputs",
        minutes: 9,
        blurb: "Parameters and return values.",
        blocks: [
          { t: "p", text: "A function gets much more useful when you can hand it something. The values you hand over are called **parameters**." },
          { t: "code", code: `def greet(name):\n    print("Hi, " + name + "!")\n\ngreet("Sam")\ngreet("Priya")` },
          { t: "p", text: "Some functions **return** a value instead of printing it. Returning hands the answer back so the rest of your program can use it." },
          { t: "code", code: `def add(a, b):\n    return a + b\n\ntotal = add(3, 4)\nprint(total)`, caption: "Prints 7." },
          { t: "callout", tone: "warn", title: "print is not return", text: "print shows something to the human. return hands a value back to your program. If a function only prints, you cannot store its answer in a variable and use it later." },
        ],
        questions: ["py-6-2-a", "py-6-2-b", "py-6-2-c", "py-6-2-d"],
      },
      {
        id: "6.3",
        title: "Mini Project: A Simple Calculator",
        minutes: 12,
        blurb: "Everything you have learned, in one program.",
        blocks: [
          { t: "p", text: "Time to put it together: variables, input, if statements and functions all in one place. The last exercise adds a loop too." },
          { t: "code", code: `def add(a, b):\n    return a + b\n\ndef subtract(a, b):\n    return a - b\n\nfirst = int(input("First number: "))\nsecond = int(input("Second number: "))\nsign = input("Type add or subtract: ")\n\nif sign == "add":\n    print(add(first, second))\nelse:\n    print(subtract(first, second))` },
          { t: "p", text: "Read it slowly. Two functions at the top, three inputs in the middle, one decision at the bottom. Notice the check is `sign == \"add\"` — typing Add with a capital would not match, which is why the question tells the user exactly what to type. Every piece is something you already know — the skill is putting them in the right order." },
          { t: "callout", tone: "tip", title: "Build it in pieces", text: "Do not write the whole thing and then run it. Write three lines, run them, check they work, then write three more. Finding one bug is easy; finding six at once is miserable." },
          { t: "p", text: "The exercises below build this up step by step, then ask you to add a way for the user to quit." },
        ],
        questions: ["py-6-3-a", "py-6-3-b", "py-6-3-c"],
      },
    ],
  }
);
