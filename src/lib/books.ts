export type Category =
  | "Story Books"
  | "Programming"
  | "AI & Machine Learning"
  | "Data Science"
  | "Database"
  | "Networking"
  | "Web Development"
  | "Operating Systems";

export const CATEGORIES: Category[] = [
  "Story Books",
  "Programming",
  "AI & Machine Learning",
  "Data Science",
  "Database",
  "Networking",
  "Web Development",
  "Operating Systems",
];

export interface Book {
  id: string;
  title: string;
  author: string;
  category: Category;
  block: string;
  rack: string;
  shelf: string;
  available: boolean;
  copies: number;
  description: string;
  keywords: string[];
}

type Raw = [string, string, Category, boolean, string, string[]];

const RAW: Raw[] = [
  // ---- Story Books ----
  [
    "The Alchemist",
    "Paulo Coelho",
    "Story Books",
    true,
    "A shepherd boy travels from Spain to the Egyptian desert chasing a recurring dream of treasure, and learns to listen to his heart.",
    ["fiction", "philosophy", "journey", "novel"],
  ],
  [
    "Harry Potter and the Philosopher's Stone",
    "J.K. Rowling",
    "Story Books",
    false,
    "An orphan discovers he is a wizard and begins his first year at Hogwarts School of Witchcraft and Wizardry.",
    ["fantasy", "magic", "hogwarts", "wizard", "novel"],
  ],
  [
    "Harry Potter and the Chamber of Secrets",
    "J.K. Rowling",
    "Story Books",
    true,
    "Harry's second year at Hogwarts is disturbed by a mysterious voice and petrified students.",
    ["fantasy", "magic", "hogwarts", "wizard"],
  ],
  [
    "Harry Potter and the Prisoner of Azkaban",
    "J.K. Rowling",
    "Story Books",
    true,
    "An escaped prisoner, a time-turner and the truth about Harry's parents collide in his third year.",
    ["fantasy", "magic", "hogwarts"],
  ],
  [
    "The Hobbit",
    "J.R.R. Tolkien",
    "Story Books",
    true,
    "Bilbo Baggins joins thirteen dwarves on a quest to reclaim a stolen treasure from the dragon Smaug.",
    ["fantasy", "adventure", "middle earth"],
  ],
  [
    "The Little Prince",
    "Antoine de Saint-Exupéry",
    "Story Books",
    true,
    "A pilot stranded in the desert meets a small prince from another planet in this gentle modern fable.",
    ["fable", "classic", "children"],
  ],
  [
    "Pride and Prejudice",
    "Jane Austen",
    "Story Books",
    true,
    "Elizabeth Bennet navigates manners, family pressure and her feelings for the proud Mr Darcy.",
    ["classic", "romance", "english literature"],
  ],
  [
    "The Great Gatsby",
    "F. Scott Fitzgerald",
    "Story Books",
    true,
    "Jay Gatsby's dazzling parties hide a single obsession in this portrait of the Jazz Age.",
    ["classic", "american literature"],
  ],
  [
    "To Kill a Mockingbird",
    "Harper Lee",
    "Story Books",
    true,
    "Scout Finch watches her father defend an innocent man in the segregated American South.",
    ["classic", "justice", "coming of age"],
  ],
  [
    "The Kite Runner",
    "Khaled Hosseini",
    "Story Books",
    false,
    "A story of friendship and betrayal between two boys in Kabul, and one man's search for redemption.",
    ["fiction", "friendship", "afghanistan"],
  ],
  [
    "Life of Pi",
    "Yann Martel",
    "Story Books",
    true,
    "A boy survives 227 days adrift in the Pacific with a Bengal tiger for company.",
    ["fiction", "survival", "adventure"],
  ],
  [
    "The Book Thief",
    "Markus Zusak",
    "Story Books",
    true,
    "Narrated by Death, a girl in Nazi Germany steals books and shares them in a bomb shelter.",
    ["historical fiction", "war"],
  ],
  [
    "The Fault in Our Stars",
    "John Green",
    "Story Books",
    true,
    "Two teenagers meet at a cancer support group and fall in love with life and each other.",
    ["young adult", "romance"],
  ],
  [
    "Alice's Adventures in Wonderland",
    "Lewis Carroll",
    "Story Books",
    true,
    "Alice falls down a rabbit hole into a nonsensical world of talking creatures and riddles.",
    ["classic", "children", "fantasy"],
  ],
  [
    "The Jungle Book",
    "Rudyard Kipling",
    "Story Books",
    true,
    "Mowgli grows up among wolves, bears and panthers in the Indian jungle.",
    ["classic", "children", "animals"],
  ],
  [
    "Around the World in Eighty Days",
    "Jules Verne",
    "Story Books",
    true,
    "Phileas Fogg wagers his fortune that he can circle the globe in eighty days.",
    ["classic", "adventure", "travel"],
  ],
  [
    "Little Women",
    "Louisa May Alcott",
    "Story Books",
    true,
    "The four March sisters grow from girlhood to womanhood in Civil War era New England.",
    ["classic", "family"],
  ],
  [
    "The Old Man and the Sea",
    "Ernest Hemingway",
    "Story Books",
    true,
    "An aging Cuban fisherman battles a giant marlin far out in the Gulf Stream.",
    ["classic", "novella"],
  ],
  [
    "Wings of Fire",
    "A.P.J. Abdul Kalam",
    "Story Books",
    true,
    "The autobiography of India's missile man and former president, from Rameswaram to ISRO.",
    ["autobiography", "inspiration", "india"],
  ],
  [
    "The Palace of Illusions",
    "Chitra Banerjee Divakaruni",
    "Story Books",
    true,
    "The Mahabharata retold through the eyes of Panchaali.",
    ["mythology", "india", "retelling"],
  ],
  // ---- Programming ----
  [
    "Java: The Complete Reference",
    "Herbert Schildt",
    "Programming",
    true,
    "The definitive Java tutorial and reference covering the language, JVM, collections and modern APIs.",
    ["java", "oop", "jvm", "core java"],
  ],
  [
    "Head First Java",
    "Kathy Sierra",
    "Programming",
    true,
    "A visual, brain-friendly introduction to Java objects, threads and collections.",
    ["java", "beginner", "oop"],
  ],
  [
    "Python Crash Course",
    "Eric Matthes",
    "Programming",
    true,
    "A hands-on, project-based introduction to Python programming.",
    ["python", "beginner", "projects"],
  ],
  [
    "Automate the Boring Stuff with Python",
    "Al Sweigart",
    "Programming",
    true,
    "Practical Python scripting for files, spreadsheets, email and the web.",
    ["python", "automation", "scripting"],
  ],
  [
    "The C Programming Language",
    "Brian Kernighan and Dennis Ritchie",
    "Programming",
    true,
    "The classic K&R text on C, pointers, arrays and the standard library.",
    ["c", "pointers", "classic"],
  ],
  [
    "Data Structures and Algorithms in Java",
    "Robert Lafore",
    "Programming",
    true,
    "Stacks, queues, trees, graphs and sorting explained with Java workshop applets.",
    ["dsa", "java", "algorithms", "data structures"],
  ],
  [
    "Introduction to Algorithms",
    "Thomas H. Cormen",
    "Programming",
    false,
    "CLRS: rigorous coverage of algorithm design, analysis, graphs and dynamic programming.",
    ["algorithms", "clrs", "complexity", "dsa"],
  ],
  [
    "Clean Code",
    "Robert C. Martin",
    "Programming",
    true,
    "A handbook of agile software craftsmanship: naming, functions, tests and refactoring.",
    ["clean code", "refactoring", "best practices"],
  ],
  [
    "Effective Java",
    "Joshua Bloch",
    "Programming",
    true,
    "Seventy-eight best practices for writing robust, idiomatic Java.",
    ["java", "best practices"],
  ],
  [
    "C++ Primer",
    "Stanley B. Lippman",
    "Programming",
    true,
    "A thorough tutorial on modern C++, templates and the standard library.",
    ["c++", "templates", "stl"],
  ],
  [
    "Programming in ANSI C",
    "E. Balagurusamy",
    "Programming",
    true,
    "A widely used Indian university text on C programming with solved examples.",
    ["c", "university", "beginner"],
  ],
  [
    "The Pragmatic Programmer",
    "Andrew Hunt and David Thomas",
    "Programming",
    true,
    "Timeless advice on craftsmanship, tooling and pragmatic software design.",
    ["career", "craft", "best practices"],
  ],
  [
    "Cracking the Coding Interview",
    "Gayle Laakmann McDowell",
    "Programming",
    false,
    "189 programming questions and solutions for technical interviews.",
    ["interview", "dsa", "placement"],
  ],
  [
    "Let Us C",
    "Yashavant Kanetkar",
    "Programming",
    true,
    "A friendly, example-driven introduction to the C language.",
    ["c", "beginner"],
  ],
  // ---- AI & Machine Learning ----
  [
    "Artificial Intelligence: A Modern Approach",
    "Stuart Russell and Peter Norvig",
    "AI & Machine Learning",
    true,
    "The standard AI text: search, logic, planning, probabilistic reasoning and learning.",
    ["ai", "search", "agents", "logic"],
  ],
  [
    "Hands-On Machine Learning",
    "Aurélien Géron",
    "AI & Machine Learning",
    true,
    "Practical ML with Scikit-Learn, Keras and TensorFlow, end to end.",
    ["machine learning", "tensorflow", "keras", "sklearn"],
  ],
  [
    "Deep Learning",
    "Ian Goodfellow",
    "AI & Machine Learning",
    false,
    "The foundational textbook on deep neural networks, optimisation and representation learning.",
    ["deep learning", "neural networks"],
  ],
  [
    "Pattern Recognition and Machine Learning",
    "Christopher M. Bishop",
    "AI & Machine Learning",
    true,
    "A probabilistic treatment of pattern recognition and statistical learning.",
    ["machine learning", "probability", "bayesian"],
  ],
  [
    "Machine Learning",
    "Tom M. Mitchell",
    "AI & Machine Learning",
    true,
    "A classic introduction to concept learning, decision trees and neural networks.",
    ["machine learning", "decision trees"],
  ],
  [
    "Natural Language Processing with Python",
    "Steven Bird",
    "AI & Machine Learning",
    true,
    "Analysing text with the Natural Language Toolkit.",
    ["nlp", "python", "text mining"],
  ],
  [
    "Reinforcement Learning: An Introduction",
    "Richard S. Sutton and Andrew G. Barto",
    "AI & Machine Learning",
    true,
    "Agents, rewards, value functions and policy methods explained from first principles.",
    ["reinforcement learning", "agents"],
  ],
  // ---- Data Science ----
  [
    "Python for Data Analysis",
    "Wes McKinney",
    "Data Science",
    true,
    "Data wrangling with pandas, NumPy and Jupyter by the creator of pandas.",
    ["pandas", "numpy", "python", "analysis"],
  ],
  [
    "Data Science from Scratch",
    "Joel Grus",
    "Data Science",
    true,
    "Build data science tools from first principles in pure Python.",
    ["data science", "python", "statistics"],
  ],
  [
    "Storytelling with Data",
    "Cole Nussbaumer Knaflic",
    "Data Science",
    true,
    "How to design charts and narratives that communicate insight clearly.",
    ["visualisation", "charts", "communication"],
  ],
  [
    "Practical Statistics for Data Scientists",
    "Peter Bruce",
    "Data Science",
    true,
    "Fifty essential statistical concepts explained for practitioners.",
    ["statistics", "sampling", "regression"],
  ],
  [
    "Big Data: Principles and Best Practices",
    "Nathan Marz",
    "Data Science",
    false,
    "Designing scalable realtime data systems with the lambda architecture.",
    ["big data", "hadoop", "streaming"],
  ],
  // ---- Database ----
  [
    "Database System Concepts",
    "Abraham Silberschatz",
    "Database",
    true,
    "Relational design, SQL, transactions, indexing and recovery in depth.",
    ["dbms", "sql", "transactions", "normalization"],
  ],
  [
    "Fundamentals of Database Systems",
    "Elmasri and Navathe",
    "Database",
    true,
    "ER modelling, relational algebra, normalisation and distributed databases.",
    ["dbms", "er model", "sql"],
  ],
  [
    "SQL in 10 Minutes a Lesson",
    "Ben Forta",
    "Database",
    true,
    "Short, focused lessons that cover practical SQL querying quickly.",
    ["sql", "queries", "beginner"],
  ],
  [
    "MongoDB: The Definitive Guide",
    "Kristina Chodorow",
    "Database",
    true,
    "Document modelling, aggregation and scaling with MongoDB.",
    ["nosql", "mongodb", "documents"],
  ],
  // ---- Networking ----
  [
    "Computer Networking: A Top-Down Approach",
    "Kurose and Ross",
    "Networking",
    true,
    "Networking taught from the application layer down to the physical link.",
    ["networks", "tcp", "http", "layers"],
  ],
  [
    "Computer Networks",
    "Andrew S. Tanenbaum",
    "Networking",
    true,
    "A comprehensive survey of network architectures, protocols and security.",
    ["networks", "protocols", "osi"],
  ],
  [
    "TCP/IP Illustrated",
    "W. Richard Stevens",
    "Networking",
    false,
    "Packet-level exploration of the TCP/IP protocol suite.",
    ["tcp", "ip", "packets"],
  ],
  [
    "Cryptography and Network Security",
    "William Stallings",
    "Networking",
    true,
    "Ciphers, key exchange, authentication and secure network protocols.",
    ["security", "cryptography", "ssl"],
  ],
  // ---- Web Development ----
  [
    "HTML and CSS: Design and Build Websites",
    "Jon Duckett",
    "Web Development",
    true,
    "A beautifully illustrated introduction to HTML structure and CSS styling.",
    ["html", "css", "frontend", "web"],
  ],
  [
    "JavaScript and JQuery",
    "Jon Duckett",
    "Web Development",
    true,
    "Interactive front-end development with JavaScript and jQuery.",
    ["javascript", "jquery", "frontend"],
  ],
  [
    "Eloquent JavaScript",
    "Marijn Haverbeke",
    "Web Development",
    true,
    "A modern introduction to JavaScript, the DOM and Node.js.",
    ["javascript", "dom", "node"],
  ],
  [
    "Learning React",
    "Alex Banks and Eve Porcello",
    "Web Development",
    true,
    "Modern React patterns with hooks, components and data fetching.",
    ["react", "hooks", "frontend", "spa"],
  ],
  [
    "Node.js Design Patterns",
    "Mario Casciaro",
    "Web Development",
    false,
    "Server-side JavaScript architecture, streams and scaling patterns.",
    ["node", "backend", "streams"],
  ],
  // ---- Operating Systems ----
  [
    "Operating System Concepts",
    "Abraham Silberschatz",
    "Operating Systems",
    true,
    "Processes, scheduling, memory management, file systems and deadlocks.",
    ["os", "scheduling", "deadlock", "memory"],
  ],
  [
    "Modern Operating Systems",
    "Andrew S. Tanenbaum",
    "Operating Systems",
    true,
    "A thorough treatment of OS design across Unix, Windows and distributed systems.",
    ["os", "processes", "unix"],
  ],
  [
    "Operating Systems: Three Easy Pieces",
    "Remzi Arpaci-Dusseau",
    "Operating Systems",
    true,
    "Virtualisation, concurrency and persistence explained with clarity.",
    ["os", "concurrency", "virtualisation"],
  ],
  [
    "The Linux Command Line",
    "William Shotts",
    "Operating Systems",
    true,
    "A complete introduction to the shell, files, processes and scripting.",
    ["linux", "shell", "bash", "unix"],
  ],
];

const BLOCK_BY_CATEGORY: Record<Category, string> = {
  "Story Books": "Block C",
  Programming: "Block A",
  "AI & Machine Learning": "Block A",
  "Data Science": "Block B",
  Database: "Block B",
  Networking: "Block B",
  "Web Development": "Block A",
  "Operating Systems": "Block B",
};

export const BOOKS: Book[] = RAW.map(([title, author, category, available, description, keywords], i) => {
  const rackNum = ((i * 3) % 8) + 1;
  const shelfNum = (i % 4) + 1;
  return {
    id: `B${String(i + 1).padStart(3, "0")}`,
    title,
    author,
    category,
    block: BLOCK_BY_CATEGORY[category],
    rack: `R${String(rackNum).padStart(2, "0")}`,
    shelf: `S${String(shelfNum).padStart(2, "0")}`,
    available,
    copies: available ? ((i % 3) + 1) : 0,
    description,
    keywords,
  };
});

export const BLOCKS = ["Block A", "Block B", "Block C"];
export const RACKS = ["R01", "R02", "R03", "R04", "R05", "R06", "R07", "R08"];

export const getBook = (id: string) => BOOKS.find((b) => b.id === id);

/* ------------------------- smart search ------------------------- */

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();

function levenshtein(a: string, b: string) {
  const m = a.length;
  const n = b.length;
  let prev = new Array<number>(n + 1);
  let cur = new Array<number>(n + 1);
  for (let j = 0; j <= n; j++) prev[j] = j;
  for (let i = 1; i <= m; i++) {
    cur[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = a.charAt(i - 1) === b.charAt(j - 1) ? 0 : 1;
      cur[j] = Math.min((prev[j] ?? 0) + 1, (cur[j - 1] ?? 0) + 1, (prev[j - 1] ?? 0) + cost);
    }
    const swap = prev;
    prev = cur;
    cur = swap;
  }
  return prev[n] ?? 0;
}


export function scoreBook(book: Book, query: string): number {
  const q = norm(query);
  if (!q) return 1;
  const terms = q.split(" ");
  let score = 0;
  const title = norm(book.title);
  const author = norm(book.author);
  const cat = norm(book.category);
  const keys = book.keywords.map(norm).join(" ");
  const desc = norm(book.description);

  for (const t of terms) {
    let best = 0;
    if (title.startsWith(t)) best = 60;
    else if (title.includes(t)) best = 45;
    if (author.includes(t)) best = Math.max(best, 40);
    if (cat.includes(t)) best = Math.max(best, 30);
    if (keys.includes(t)) best = Math.max(best, 25);
    if (desc.includes(t)) best = Math.max(best, 10);
    if (best === 0 && t.length > 3) {
      // fuzzy word match for typos
      const words = new Set([...title.split(" "), ...author.split(" "), ...keys.split(" ")]);
      for (const w of words) {
        if (w.length < 3) continue;
        const d = levenshtein(t, w);
        if (d <= (t.length > 5 ? 2 : 1)) {
          best = Math.max(best, 18 - d * 2);
        }
      }
    }
    score += best;
  }
  return score;
}

export function searchBooks(query: string, category?: Category | "All") {
  let pool = BOOKS;
  if (category && category !== "All") pool = pool.filter((b) => b.category === category);
  if (!norm(query)) return pool;
  return pool
    .map((b) => ({ b, s: scoreBook(b, query) }))
    .filter((x) => x.s > 0)
    .sort((x, y) => y.s - x.s)
    .map((x) => x.b);
}

/** "Did you mean ...?" suggestion for typos. */
export function suggestTerm(query: string): string | null {
  const q = norm(query);
  if (!q || q.length < 3) return null;
  const vocab = new Set<string>();
  for (const b of BOOKS) {
    for (const w of [...norm(b.title).split(" "), ...norm(b.author).split(" "), ...b.keywords.map(norm)]) {
      if (w.length > 3) vocab.add(w);
    }
  }
  const term = q.split(" ")[0] ?? "";
  if (vocab.has(term)) return null;
  let best: { w: string; d: number } | null = null;
  for (const w of vocab) {
    const d = levenshtein(term, w);
    if (d > 0 && d <= 2 && (!best || d < best.d)) best = { w, d };
  }
  if (!best) return null;
  return best.w.charAt(0).toUpperCase() + best.w.slice(1);
}

export function similarBooks(book: Book, count = 3, onlyAvailable = true) {
  const pool = BOOKS.filter(
    (b) => b.id !== book.id && b.category === book.category && (!onlyAvailable || b.available),
  );
  const scored = pool
    .map((b) => ({
      b,
      s:
        (b.author === book.author ? 10 : 0) +
        b.keywords.filter((k) => book.keywords.includes(k)).length,
    }))
    .sort((x, y) => y.s - x.s);
  return scored.slice(0, count).map((x) => x.b);
}

/** Deterministic cover palette index per book. */
export function coverTone(id: string) {
  const n = id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return n % 6;
}
