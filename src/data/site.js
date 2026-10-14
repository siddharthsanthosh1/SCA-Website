/* Single source of truth for org-wide copy, links and navigation. */

export const org = {
  name: "Student Code Alliance",
  short: "SCA",
  tagline: "Mobilizing youth code education to create socially-impactful software",
  email: "hello@studentcodealliance.org",
  curriculumEmail: "codeconnect.international.org@gmail.com",
  instagram: "https://www.instagram.com/studentcodealliance/",
  facebook: "https://m.facebook.com/profile.php?id=61554551519137",
};

export const forms = {
  student:
    "https://docs.google.com/forms/d/e/1FAIpQLSd68Ch5HVExsyO9omYglTgC5GYRO00zc-YLZimWDIBDkW6exw/viewform",
  studentShort: "https://forms.gle/2dNXmhhbdcTrc9f56",
  volunteer: "https://forms.gle/CJ5XNJkHof5qLxTJA",
  branchLeader: "https://forms.gle/iLas4uAbBqrywqcQA",
};

export const nav = [
  { label: "About", to: "/about" },
  { label: "Branches", to: "/branches" },
  { label: "Curriculum", to: "/curriculum" },
  { label: "Start a Branch", to: "/starting-a-branch" },
  { label: "Volunteer", to: "/volunteer" },
  { label: "Hackathon", to: "/hackathon" },
  { label: "FAQ", to: "/faq" },
];

export const stats = [
  { value: 4800, suffix: "+", label: "Scholars reached" },
  { value: 60, suffix: "+", label: "Branches" },
  { value: 300, suffix: "", label: "Tutors" },
  { value: 5, suffix: "+", label: "Countries" },
];

export const languages = [
  "Scratch",
  "Python",
  "Java",
  "C++",
  "Web Development",
  "VisualBasic",
];

export const testimonials = [
  {
    quote:
      "Both tutors were so patient, took the time to explain and make her understand and helped in all ways to learn to do programming.",
    author: "Parent",
  },
  {
    quote:
      "Appreciate the efforts made by high schoolers. They were amazing.",
    author: "Parent",
  },
];

/* `note` is what they gave us; `about` is what the company does (shown in the sponsor dialog). */
export const sponsors = [
  {
    name: "Jukebox",
    note: "Custom stickers for our branches and outreach events.",
    logo: "/sponsors/jukebox.svg",
    url: "https://www.jukeboxprint.com",
    site: "jukeboxprint.com",
    kicker: "Custom printing",
    about:
      "Jukebox is an online print shop founded in 2009. It makes custom stickers, business cards, labels, packaging and books in its own production facilities, and ships to customers across North America.",
  },
  {
    name: "Deep AI",
    note: "$300 sponsorship toward our Social Hackathon.",
    logo: "/sponsors/deepai.svg",
    url: "https://deepai.org",
    site: "deepai.org",
    kicker: "Creative AI",
    about:
      "DeepAI is a creative AI platform that lets anyone generate images, video and music, edit photos and chat with an AI right in the browser, no account needed. It also backs AI-for-good projects, including wildlife conservation work.",
  },
];

export const pathways = [
  {
    title: "Students & families",
    body: "Sign your child up for a free ten-week course at any branch. Every class is virtual, once a week, and taught by trained student tutors.",
    cta: { label: "Sign up for a class", href: forms.student, external: true },
  },
  {
    title: "Tutors & volunteers",
    body: "Teach, run social media, write for the blog, or help coordinate hackathons. All volunteer roles earn service hours.",
    cta: { label: "Apply to volunteer", to: "/volunteer" },
  },
  {
    title: "Branch leaders",
    body: "Bring Student Code Alliance to your area. Branch managers recruit tutors, schedule classes, and publicise their programs.",
    cta: { label: "Start a branch", to: "/starting-a-branch" },
  },
];

/* Past Devpost hackathons, newest first. `flier` lives in /public/hackathons. */
export const pastHackathons = [
  {
    name: "Sustain-a-thon",
    tagline: "Create an app, device, or game to spread awareness about climate issues.",
    dates: "Nov 24, 2025 – Jan 1, 2026",
    stats: ["138 participants", "$300 in cash prizes"],
    flier: null,
    url: "https://sustain-a-thon-sca.devpost.com/",
  },
  {
    name: "Mindfulness Hacks",
    tagline: "Fostering minds, one line at a time.",
    dates: "Nov 25, 2024 – Jan 15, 2025",
    stats: ["338 participants", "$250 in prizes"],
    flier: "/hackathons/mindfulness-hacks.png",
    url: "https://mindfulness-hacks-sca.devpost.com/",
  },
];
