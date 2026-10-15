/* ---------------------------------------------------------------------------
   Intro to Python for Kids — practice questions.

   Kinds:
     mcq   { prompt, code?, options[], answer (index), explain }
     fill  { prompt, code (with ___), accept[], explain }
     code  { prompt, starter, stdin?, checks[], hint, solution, explain? }

   Every `code` question is graded by actually running the student's Python in
   the browser and checking what it printed — see lib/checks.js.
   --------------------------------------------------------------------------- */

export const pythonQuestions = [
  /* ---------------------------------------------------- 1.1 What is Programming */
  {
    id: "py-1-1-a", lesson: "1.1", kind: "mcq",
    prompt: "What is a program?",
    options: [
      "A list of instructions a computer follows in order",
      "A machine that thinks for itself",
      "A type of computer screen",
      "A website you visit",
    ],
    answer: 0,
    explain: "A program is instructions, followed in order. The computer supplies the speed; you supply the thinking.",
  },
  {
    id: "py-1-1-b", lesson: "1.1", kind: "mcq",
    prompt: "You write instructions for making toast, but you put \"spread the butter\" before \"toast the bread\". What happens?",
    options: [
      "The computer works out what you meant and fixes it",
      "The computer does exactly what you wrote, and you get buttered untoasted bread",
      "The computer refuses to run anything",
      "Nothing — order never matters",
    ],
    answer: 1,
    explain: "Computers never guess. Doing exactly what you wrote, even when it makes no sense, is the whole personality of a computer.",
  },
  {
    id: "py-1-1-c", lesson: "1.1", kind: "mcq",
    prompt: "Which of these runs on a program?",
    options: ["A microwave", "A pencil", "A window", "A chair"],
    answer: 0,
    explain: "A microwave counts down, beeps and stops — instructions somebody wrote. Phones, traffic lights and washing machines all qualify too.",
  },

  /* ------------------------------------------------------- 1.2 print() */
  {
    id: "py-1-2-a", lesson: "1.2", kind: "mcq",
    prompt: "What does print() do?",
    options: [
      "Sends a page to a printer",
      "Shows text on the screen",
      "Saves your program",
      "Deletes a variable",
    ],
    answer: 1,
    explain: "The name is a leftover from when computers really did print to paper. Today it just means \"show this on the screen\".",
  },
  {
    id: "py-1-2-b", lesson: "1.2", kind: "fill",
    prompt: "Fill in the blank so this prints the word Python.",
    code: 'print(___)',
    accept: ['"Python"', "'Python'"],
    explain: "Text needs quotes on both sides. Single or double quotes both work in Python — just be consistent.",
  },
  {
    id: "py-1-2-c", lesson: "1.2", kind: "mcq",
    prompt: "This line has a bug. What is missing?",
    code: 'print("Hello)',
    options: [
      "The closing quote after Hello",
      "A semicolon at the end",
      "The word say before print",
      "Nothing — it works fine",
    ],
    answer: 0,
    explain: "Python is still looking for the quote that ends the text, so it never finds the closing bracket either. One missing character, one confusing error.",
  },
  {
    id: "py-1-2-d", lesson: "1.2", kind: "code",
    prompt: "Use print() to show exactly this line:\n\nI love code",
    starter: "",
    checks: [
      { type: "source", contains: "print", hint: "You need the print() command." },
      { type: "stdout", equals: "I love code" },
    ],
    hint: 'Put the words inside quotes, and the quotes inside the brackets: print("...")',
    solution: 'print("I love code")',
  },

  /* --------------------------------------------------- 1.3 First Program */
  {
    id: "py-1-3-a", lesson: "1.3", kind: "mcq",
    prompt: "What does this program print, and in what order?",
    code: 'print("Second")\nprint("First")',
    options: [
      "First, then Second — Python sorts them",
      "Second, then First — Python runs top to bottom",
      "Only First",
      "Nothing, because the order is wrong",
    ],
    answer: 1,
    explain: "Python reads your file like a page: top line first. It has no opinion about what the words say.",
  },
  {
    id: "py-1-3-b", lesson: "1.3", kind: "mcq",
    prompt: "What does a line starting with # do?",
    options: [
      "Prints the line in bold",
      "Nothing — it's a note for humans and Python ignores it",
      "Causes an error",
      "Repeats the line above",
    ],
    answer: 1,
    explain: "Comments are for the next person who reads your code, which is usually you in a month's time.",
  },
  {
    id: "py-1-3-c", lesson: "1.3", kind: "code",
    prompt: "Write a program that prints these three lines, in this order:\n\nAda\n10\ngreen",
    starter: "",
    checks: [{ type: "stdout", equals: "Ada\n10\ngreen" }],
    hint: "Three separate print() lines, one under the other.",
    solution: 'print("Ada")\nprint("10")\nprint("green")',
  },

  /* ------------------------------------------------------ 2.1 Variables */
  {
    id: "py-2-1-a", lesson: "2.1", kind: "mcq",
    prompt: "What is a variable?",
    options: [
      "A named box that stores a value",
      "A word Python already knows",
      "A kind of loop",
      "A message printed on screen",
    ],
    answer: 0,
    explain: "Name the box, put something in it, ask for it later by name.",
  },
  {
    id: "py-2-1-b", lesson: "2.1", kind: "mcq",
    prompt: "What does this print?",
    code: "score = 0\nscore = 5\nprint(score)",
    options: ["0", "5", "0 and then 5", "An error"],
    answer: 1,
    explain: "The second line replaces what was in the box. The 0 is gone — a box holds one thing at a time.",
  },
  {
    id: "py-2-1-c", lesson: "2.1", kind: "code",
    prompt: "Make a variable called pet, put the word cat in it, then print the variable.\n\nPrint the variable — not the word directly.",
    starter: "",
    checks: [
      { type: "source", matches: "pet\\s*=", hint: "Create a variable named pet first." },
      { type: "source", matches: "print\\s*\\(\\s*pet\\s*\\)", hint: "Print the variable pet, not the text \"cat\"." },
      { type: "stdout", equals: "cat" },
    ],
    hint: 'First line: pet = "cat". Second line: print(pet) — no quotes, because you want what is in the box.',
    solution: 'pet = "cat"\nprint(pet)',
  },

  /* -------------------------------------------- 2.2 Numbers and Strings */
  {
    id: "py-2-2-a", lesson: "2.2", kind: "mcq",
    prompt: "What does this print?",
    code: 'print("2" + "3")',
    options: ["5", "23", "2 3", "An error"],
    answer: 1,
    explain: 'The quotes make them text, and adding text joins it end to end. Without quotes, print(2 + 3) gives 5.',
  },
  {
    id: "py-2-2-b", lesson: "2.2", kind: "mcq",
    prompt: "Which of these is a string?",
    options: ["42", '"42"', "4 + 2", "42.0"],
    answer: 1,
    explain: "Quotes are what make a string. Everything else here is a number Python can do maths with.",
  },
  {
    id: "py-2-2-c", lesson: "2.2", kind: "fill",
    prompt: "Fill the blank so this prints Ada Lovelace with a space in the middle.",
    code: 'first = "Ada"\nlast = "Lovelace"\nprint(first + ___ + last)',
    accept: ['" "', "' '"],
    explain: "Python joins strings exactly as given, so if you want a space you have to supply one yourself.",
  },
  {
    id: "py-2-2-d", lesson: "2.2", kind: "code",
    prompt: "Make two number variables, a = 7 and b = 5, then print their total.",
    starter: "",
    checks: [
      { type: "source", matches: "a\\s*=\\s*7", hint: "Set a to 7." },
      { type: "source", matches: "b\\s*=\\s*5", hint: "Set b to 5." },
      { type: "stdout", equals: "12" },
    ],
    hint: "No quotes around the numbers — you want maths, not text.",
    solution: "a = 7\nb = 5\nprint(a + b)",
  },

  /* ---------------------------------------------------------- 2.3 input */
  {
    id: "py-2-3-a", lesson: "2.3", kind: "mcq",
    prompt: "Somebody types 7 when your program calls input(). What do you get back?",
    options: [
      "The number 7",
      'The text "7"',
      "Nothing until you press enter twice",
      "An error",
    ],
    answer: 1,
    explain: "input() always hands back text. Wrap it in int() when you need to do maths with the answer.",
  },
  {
    id: "py-2-3-b", lesson: "2.3", kind: "mcq",
    prompt: "Why does this program crash?",
    code: 'age = input("Age? ")\nprint(age + 1)',
    options: [
      "input() is spelled wrong",
      "age holds text, and you can't add a number to text",
      "print can only take one thing",
      "The question mark isn't allowed",
    ],
    answer: 1,
    explain: 'Fix it with age = int(input("Age? ")) so age holds a real number.',
  },
  {
    id: "py-2-3-c", lesson: "2.3", kind: "code",
    prompt: 'Ask the user their name, then greet them.\n\nWhen we test it, the user types Sam — your program should print Hi Sam!',
    starter: "",
    stdin: ["Sam"],
    checks: [
      { type: "source", contains: "input", hint: "Use input() to ask the question." },
      { type: "stdout", contains: "Hi Sam!" },
    ],
    hint: 'name = input("What is your name? ") then print("Hi " + name + "!")',
    solution: 'name = input("What is your name? ")\nprint("Hi " + name + "!")',
  },

  /* ------------------------------------------------------ 3.1 If Statements */
  {
    id: "py-3-1-a", lesson: "3.1", kind: "mcq",
    prompt: "What does this print?",
    code: 'temperature = 30\n\nif temperature > 25:\n    print("It\'s hot")\nprint("Have a good day")',
    options: [
      "Only: Have a good day",
      "Only: It's hot",
      "Both lines",
      "Nothing",
    ],
    answer: 2,
    explain: "30 is greater than 25 so the indented line runs, and the last line is not indented so it always runs.",
  },
  {
    id: "py-3-1-b", lesson: "3.1", kind: "mcq",
    prompt: "What is missing from this line?",
    code: "if number > 10\n    print(\"Big!\")",
    options: [
      "A colon at the end of the if line",
      "Brackets around number > 10",
      "The word then",
      "A semicolon",
    ],
    answer: 0,
    explain: "Python wants `if number > 10:` — the colon announces that an indented block is coming.",
  },
  {
    id: "py-3-1-c", lesson: "3.1", kind: "code",
    prompt: "The variable number is already set to 15.\n\nAdd an if statement that prints Big number! when number is greater than 10.",
    starter: "number = 15\n\n",
    checks: [
      { type: "source", contains: "if", hint: "You need an if statement." },
      { type: "stdout", equals: "Big number!" },
    ],
    hint: "if number > 10: then an indented print on the next line.",
    solution: 'number = 15\n\nif number > 10:\n    print("Big number!")',
  },

  /* ------------------------------------------------------- 3.2 Comparing */
  {
    id: "py-3-2-a", lesson: "3.2", kind: "mcq",
    prompt: "What is the difference between = and == ?",
    options: [
      "They are the same thing",
      "= puts a value in a variable; == asks whether two things are equal",
      "= is for numbers; == is for words",
      "== is old Python and shouldn't be used",
    ],
    answer: 1,
    explain: "Mixing these two up is the most common beginner bug there is — in every language, not just Python.",
  },
  {
    id: "py-3-2-b", lesson: "3.2", kind: "mcq",
    prompt: "What does this print?",
    code: "print(3 > 7)",
    options: ["True", "False", "3", "An error"],
    answer: 1,
    explain: "3 is not bigger than 7, so the answer is False. Comparisons always produce True or False.",
  },
  {
    id: "py-3-2-c", lesson: "3.2", kind: "fill",
    prompt: "Fill the blank so this prints Same! when the two numbers match.",
    code: "a = 4\nb = 4\n\nif a ___ b:\n    print(\"Same!\")",
    accept: ["==", "== "],
    explain: "Two equals signs asks a question. One equals sign would try to put b into a, which is not allowed inside an if.",
  },

  /* ------------------------------------------------------ 3.3 else / elif */
  {
    id: "py-3-3-a", lesson: "3.3", kind: "mcq",
    prompt: "What does this print?",
    code: 'size = 50\n\nif size < 10:\n    print("small")\nelif size < 100:\n    print("medium")\nelse:\n    print("large")',
    options: ["small", "medium", "large", "All three"],
    answer: 1,
    explain: "50 is not under 10, but it is under 100, so the elif wins. Python stops at the first true branch.",
  },
  {
    id: "py-3-3-b", lesson: "3.3", kind: "mcq",
    prompt: "What does else do?",
    options: [
      "Runs when the if condition was false",
      "Runs always, after the if",
      "Checks a second condition",
      "Ends the program",
    ],
    answer: 0,
    explain: "else is the backup plan. If you need to check another condition first, that's what elif is for.",
  },
  {
    id: "py-3-3-c", lesson: "3.3", kind: "code",
    prompt: "age is already set to 8.\n\nPrint Yes! if age is 10 or more, and Not yet! if it isn't.",
    starter: "age = 8\n\n",
    checks: [
      { type: "source", contains: "else", hint: "You need an else for the second case." },
      { type: "stdout", equals: "Not yet!" },
    ],
    hint: "if age >= 10: print one thing. else: print the other.",
    solution: 'age = 8\n\nif age >= 10:\n    print("Yes!")\nelse:\n    print("Not yet!")',
  },
];

pythonQuestions.push(
  /* ------------------------------------------------------- 4.1 For Loops */
  {
    id: "py-4-1-a", lesson: "4.1", kind: "mcq",
    prompt: "What does this print?",
    code: "for i in range(3):\n    print(i)",
    options: ["1 2 3", "0 1 2", "0 1 2 3", "3 3 3"],
    answer: 1,
    explain: "range(3) gives three numbers starting at zero: 0, 1, 2. The stop number is never included.",
  },
  {
    id: "py-4-1-b", lesson: "4.1", kind: "mcq",
    prompt: "Which range gives you the numbers 1 to 10?",
    options: ["range(10)", "range(1, 10)", "range(1, 11)", "range(0, 10)"],
    answer: 2,
    explain: "The second number is where it stops, and the stop itself is left out — so you need 11 to reach 10.",
  },
  {
    id: "py-4-1-c", lesson: "4.1", kind: "code",
    prompt: "Use a for loop to print Hi! five times, one per line.",
    starter: "",
    checks: [
      { type: "source", contains: "for", hint: "Use a for loop rather than five print lines." },
      { type: "stdout", equals: "Hi!\nHi!\nHi!\nHi!\nHi!" },
    ],
    hint: "for i in range(5): then an indented print.",
    solution: 'for i in range(5):\n    print("Hi!")',
  },

  /* ----------------------------------------------------- 4.2 While Loops */
  {
    id: "py-4-2-a", lesson: "4.2", kind: "mcq",
    prompt: "Why does this loop never stop?",
    code: 'count = 5\n\nwhile count > 0:\n    print(count)',
    options: [
      "while loops always run forever",
      "count never changes, so the condition stays true",
      "print() is not allowed inside a while loop",
      "It needs a range()",
    ],
    answer: 1,
    explain: "Add count = count - 1 inside the loop. Every while loop needs something that eventually makes its condition false.",
  },
  {
    id: "py-4-2-b", lesson: "4.2", kind: "mcq",
    prompt: "What is the last number this prints?",
    code: "count = 3\n\nwhile count > 0:\n    print(count)\n    count = count - 1",
    options: ["0", "1", "3", "It never stops"],
    answer: 1,
    explain: "It prints 3, 2, 1. When count reaches 0 the condition count > 0 is false, so the loop ends before printing 0.",
  },
  {
    id: "py-4-2-c", lesson: "4.2", kind: "code",
    prompt: "Use a while loop to count down from 5 to 1, one number per line.",
    starter: "",
    checks: [
      { type: "source", contains: "while", hint: "This one wants a while loop." },
      { type: "stdout", equals: "5\n4\n3\n2\n1" },
    ],
    hint: "Start count at 5, loop while count > 0, print it, then subtract one.",
    solution: "count = 5\n\nwhile count > 0:\n    print(count)\n    count = count - 1",
  },

  /* --------------------------------------------------- 4.3 Loop Patterns */
  {
    id: "py-4-3-a", lesson: "4.3", kind: "mcq",
    prompt: "What does this print?",
    code: 'print("*" * 3)',
    options: ["*3", "***", "* * *", "An error — you can't multiply text"],
    answer: 1,
    explain: "Multiplying a string repeats it. It is a shortcut Python gives you that most languages do not.",
  },
  {
    id: "py-4-3-b", lesson: "4.3", kind: "mcq",
    prompt: 'What does end="" do inside print()?',
    options: [
      "Ends the program",
      "Stops print from moving to a new line",
      "Prints an empty line",
      "Clears the screen",
    ],
    answer: 1,
    explain: 'Normally print() adds a line break. end="" keeps the next thing on the same line, which is how you build a row before breaking.',
  },
  {
    id: "py-4-3-c", lesson: "4.3", kind: "code",
    prompt: "Print a growing triangle of stars, four rows tall:\n\n*\n**\n***\n****",
    starter: "",
    checks: [
      { type: "source", matches: "\\b(for|while)\\b", hint: "Use a loop — do not write four print lines." },
      { type: "stdout", equals: "*\n**\n***\n****" },
    ],
    hint: 'Loop i from 1 to 4 and print "*" * i each time.',
    solution: 'for i in range(1, 5):\n    print("*" * i)',
  },

  /* -------------------------------------------------------- 5.1 Lists */
  {
    id: "py-5-1-a", lesson: "5.1", kind: "mcq",
    prompt: "What is the index of the first item in a list?",
    options: ["0", "1", "-1", "It depends on the list"],
    answer: 0,
    explain: "Python counts from zero, so a list of three items has indexes 0, 1 and 2.",
  },
  {
    id: "py-5-1-b", lesson: "5.1", kind: "mcq",
    prompt: "What does this print?",
    code: 'foods = ["pizza", "mango", "dosa"]\nprint(foods[1])',
    options: ["pizza", "mango", "dosa", "An error"],
    answer: 1,
    explain: "Index 0 is pizza, so index 1 is mango. Counting from zero takes a while to feel natural.",
  },
  {
    id: "py-5-1-c", lesson: "5.1", kind: "code",
    prompt: 'Make a list called foods holding "pizza", "mango" and "dosa", then print just the first item.',
    starter: "",
    checks: [
      { type: "source", matches: "foods\\s*=\\s*\\[", hint: "Create a list named foods with square brackets." },
      { type: "source", matches: "foods\\s*\\[", hint: "Use an index, like foods[0], to get one item out." },
      { type: "stdout", equals: "pizza" },
    ],
    hint: "foods[0] is the first item.",
    solution: 'foods = ["pizza", "mango", "dosa"]\nprint(foods[0])',
  },

  /* ------------------------------------------------- 5.2 Adding/Removing */
  {
    id: "py-5-2-a", lesson: "5.2", kind: "mcq",
    prompt: "What does append() do?",
    options: [
      "Adds an item to the end of a list",
      "Adds an item to the start of a list",
      "Removes the last item",
      "Sorts the list",
    ],
    answer: 0,
    explain: "append means \"add to the end\". To remove something by name, use remove().",
  },
  {
    id: "py-5-2-b", lesson: "5.2", kind: "mcq",
    prompt: "What does this print?",
    code: 'animals = ["cat", "dog", "fox"]\nanimals.remove("dog")\nprint(animals)',
    options: [
      "['cat', 'dog', 'fox']",
      "['cat', 'fox']",
      "['dog']",
      "An error",
    ],
    answer: 1,
    explain: "remove() takes out the item you name and the list closes up behind it.",
  },
  {
    id: "py-5-2-c", lesson: "5.2", kind: "code",
    prompt: 'friends already holds "Ana" and "Ben".\n\nAdd "Cleo" to the end, then print the whole list.',
    starter: 'friends = ["Ana", "Ben"]\n\n',
    checks: [
      { type: "source", contains: "append", hint: "Use friends.append(...)" },
      { type: "stdout", equals: "['Ana', 'Ben', 'Cleo']" },
    ],
    hint: 'friends.append("Cleo") then print(friends)',
    solution: 'friends = ["Ana", "Ben"]\n\nfriends.append("Cleo")\nprint(friends)',
  },

  /* -------------------------------------------------- 5.3 Looping a List */
  {
    id: "py-5-3-a", lesson: "5.3", kind: "mcq",
    prompt: "What does this print?",
    code: 'games = ["chess", "tag"]\n\nfor game in games:\n    print(game)',
    options: [
      "games twice",
      "chess and then tag, on separate lines",
      "game twice",
      "['chess', 'tag']",
    ],
    answer: 1,
    explain: "The loop variable holds a different item each time round — first chess, then tag.",
  },
  {
    id: "py-5-3-b", lesson: "5.3", kind: "fill",
    prompt: "Fill the blank so the loop prints each colour.",
    code: 'colours = ["red", "blue"]\n\nfor ___ in colours:\n    print(colour)',
    accept: ["colour", "colour "],
    explain: "The loop variable is the name you use inside the loop, so the two have to match.",
  },
  {
    id: "py-5-3-c", lesson: "5.3", kind: "code",
    prompt: "numbers is already set.\n\nLoop through it and print each number doubled, one per line.",
    starter: "numbers = [1, 2, 3, 4]\n\n",
    checks: [
      { type: "source", contains: "for", hint: "Use a for loop over the list." },
      { type: "stdout", equals: "2\n4\n6\n8" },
    ],
    hint: "for n in numbers: then print(n * 2)",
    solution: "numbers = [1, 2, 3, 4]\n\nfor n in numbers:\n    print(n * 2)",
  },

  /* ----------------------------------------------------- 6.1 Functions */
  {
    id: "py-6-1-a", lesson: "6.1", kind: "mcq",
    prompt: "What does def do?",
    options: [
      "Runs a function straight away",
      "Defines a function so you can call it later",
      "Deletes a function",
      "Declares a variable",
    ],
    answer: 1,
    explain: "def teaches Python what the name means. Nothing happens until you call it with brackets.",
  },
  {
    id: "py-6-1-b", lesson: "6.1", kind: "mcq",
    prompt: "How many times does Hello there! get printed?",
    code: 'def say_hello():\n    print("Hello there!")\n\nsay_hello()\nsay_hello()',
    options: ["Zero", "Once", "Twice", "Three times"],
    answer: 2,
    explain: "Defining it prints nothing. Each call runs the body once, and there are two calls.",
  },
  {
    id: "py-6-1-c", lesson: "6.1", kind: "code",
    prompt: "Write a function called say_hello that prints Hello there!\n\nThen call it once.",
    starter: "",
    checks: [
      { type: "source", matches: "def\\s+say_hello", hint: "Start with def say_hello():" },
      { type: "source", matches: "say_hello\\s*\\(\\s*\\)", hint: "Remember to call the function after defining it." },
      { type: "stdout", equals: "Hello there!" },
    ],
    hint: "Define it, leave a blank line, then write say_hello() with no indentation.",
    solution: 'def say_hello():\n    print("Hello there!")\n\nsay_hello()',
  },

  /* ---------------------------------------------- 6.2 Parameters/Return */
  {
    id: "py-6-2-a", lesson: "6.2", kind: "mcq",
    prompt: "What is the difference between print and return?",
    options: [
      "They do the same thing",
      "print shows something to the person; return hands a value back to your program",
      "return is faster",
      "print only works inside functions",
    ],
    answer: 1,
    explain: "If a function only prints, you cannot store its answer in a variable and use it later. Return is what makes that possible.",
  },
  {
    id: "py-6-2-b", lesson: "6.2", kind: "mcq",
    prompt: "What does this print?",
    code: "def add(a, b):\n    return a + b\n\ntotal = add(3, 4)\nprint(total)",
    options: ["3 4", "7", "a + b", "Nothing"],
    answer: 1,
    explain: "3 goes into a, 4 goes into b, the function returns 7, and that gets stored in total.",
  },
  {
    id: "py-6-2-c", lesson: "6.2", kind: "fill",
    prompt: "Fill the blank so greet can be called as greet(\"Sam\").",
    code: 'def greet(___):\n    print("Hi, " + name + "!")',
    accept: ["name", "name "],
    explain: "The parameter name in the brackets is the name you use inside the function — they have to match.",
  },
  {
    id: "py-6-2-d", lesson: "6.2", kind: "code",
    prompt: "Write a function add(a, b) that RETURNS the sum.\n\nThen print the result of add(3, 4).",
    starter: "",
    checks: [
      { type: "source", matches: "def\\s+add\\s*\\(", hint: "Define a function called add with two parameters." },
      { type: "source", contains: "return", hint: "It must return the answer, not print it." },
      { type: "stdout", equals: "7" },
    ],
    hint: "Inside the function write return a + b. Then outside it, print(add(3, 4)).",
    solution: "def add(a, b):\n    return a + b\n\nprint(add(3, 4))",
  },

  /* --------------------------------------------------- 6.3 Mini Project */
  {
    id: "py-6-3-a", lesson: "6.3", kind: "mcq",
    prompt: "You have written 40 lines and nothing works. What is the best next move?",
    options: [
      "Delete it all and start again",
      "Run small pieces one at a time to find which part breaks",
      "Add more code until something works",
      "Ask someone else to write it",
    ],
    answer: 1,
    explain: "Finding one bug is easy; finding six at once is miserable. Writing and testing in small pieces is the habit that separates people who finish from people who give up.",
  },
  {
    id: "py-6-3-b", lesson: "6.3", kind: "code",
    prompt: "Build the calculator.\n\nWrite a function add(a, b) that returns a sum, then ask for two numbers and print their total.\n\nOur test types 6 and then 4, so you should print 10.",
    starter: "",
    stdin: ["6", "4"],
    checks: [
      { type: "source", matches: "def\\s+add\\s*\\(", hint: "Start with a function called add." },
      { type: "source", contains: "int(", hint: "input() gives text — wrap it in int() to do maths." },
      { type: "stdout", contains: "10" },
    ],
    hint: 'first = int(input("First number: ")) — do the same for second, then print(add(first, second)).',
    solution: 'def add(a, b):\n    return a + b\n\nfirst = int(input("First number: "))\nsecond = int(input("Second number: "))\nprint(add(first, second))',
  },
  {
    id: "py-6-3-c", lesson: "6.3", kind: "code",
    prompt: 'Add a quit feature.\n\nKeep asking for a word until the user types quit, then print Goodbye!\n\nOur test types hello, then maybe, then quit.',
    starter: "",
    stdin: ["hello", "maybe", "quit"],
    checks: [
      { type: "source", contains: "while", hint: "You don't know how many words they'll type, so use a while loop." },
      { type: "stdout", contains: "Goodbye!" },
    ],
    hint: 'word = "" then while word != "quit": word = input("Say something: ") — and print Goodbye! after the loop.',
    solution: 'word = ""\n\nwhile word != "quit":\n    word = input("Say something: ")\n\nprint("Goodbye!")',
  }
);
