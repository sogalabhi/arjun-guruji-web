// Title search that accepts Kannada script or Kannada typed in English letters
// ("sreedhara", "shridhar" and "ಶ್ರೀಧರ" all find ಶ್ರೀಧರ ಅಷ್ಟೋತ್ತರ).
// Pure functions with no imports, so node --test can load it. Kept to plain
// tables and ordered regex rules so the same logic can be ported to Dart.

// Kannada letters to rough English letters. "R" marks vocalic r (ಋ, ೃ), which
// people type as either "ru" or "ri"; titleWords() expands it both ways.
const VOWELS = {
  "ಅ": "a", "ಆ": "aa", "ಇ": "i", "ಈ": "ii", "ಉ": "u", "ಊ": "uu", "ಋ": "R",
  "ಎ": "e", "ಏ": "e", "ಐ": "ai", "ಒ": "o", "ಓ": "o", "ಔ": "au",
};
const CONSONANTS = {
  "ಕ": "k", "ಖ": "kh", "ಗ": "g", "ಘ": "gh", "ಙ": "n",
  "ಚ": "ch", "ಛ": "chh", "ಜ": "j", "ಝ": "jh", "ಞ": "n",
  "ಟ": "t", "ಠ": "th", "ಡ": "d", "ಢ": "dh", "ಣ": "n",
  "ತ": "t", "ಥ": "th", "ದ": "d", "ಧ": "dh", "ನ": "n",
  "ಪ": "p", "ಫ": "ph", "ಬ": "b", "ಭ": "bh", "ಮ": "m",
  "ಯ": "y", "ರ": "r", "ಱ": "r", "ಲ": "l", "ವ": "v",
  "ಶ": "sh", "ಷ": "sh", "ಸ": "s", "ಹ": "h", "ಳ": "l", "ೞ": "l",
};
const VOWEL_SIGNS = {
  "ಾ": "aa", "ಿ": "i", "ೀ": "ii", "ು": "u", "ೂ": "uu", "ೃ": "R",
  "ೆ": "e", "ೇ": "e", "ೈ": "ai", "ೊ": "o", "ೋ": "o", "ೌ": "au",
};
const VIRAMA = "್";
const ANUSVARA = "ಂ";
const VISARGA = "ಃ";

// Kannada script to English letters; other characters pass through lowercased.
export function toLatin(text) {
  const chars = [...text];
  let out = "";
  for (let i = 0; i < chars.length; i++) {
    const c = chars[i];
    const next = chars[i + 1];
    if (CONSONANTS[c]) {
      out += CONSONANTS[c];
      if (next === VIRAMA) i++;
      else if (VOWEL_SIGNS[next]) out += VOWEL_SIGNS[chars[++i]];
      else out += "a";
    } else if (VOWELS[c]) {
      out += VOWELS[c];
    } else if (c === ANUSVARA) {
      // ಮಂಗಳ is "mangala" but ಅರ್ಜುನಂ is "arjunam" and ಸಂಪೂರ್ಣ is "sampoorna".
      out += /^[kgcjtdn]/.test(CONSONANTS[next] ?? "") ? "n" : "m";
    } else if (c === VISARGA) {
      out += "h";
    } else {
      out += c.toLowerCase();
    }
  }
  return out;
}

// Spellings that sound alike, reduced to one form. Applied in order, to one
// word of English letters at a time.
const RULES = [
  [/ksh|x/g, "ks"],
  [/jn|gn|gy|dny/g, "gn"], // ಜ್ಞಾನ: jnana, gnana, gyana
  [/sh/g, "s"],
  [/ch/g, "c"],
  [/w/g, "v"],
  [/z/g, "j"],
  [/f/g, "p"],
  [/q/g, "k"],
  [/([kgcjtdpb])h/g, "$1"], // bh, th, dh... ಭ/ಬ and ತ/ಥ are typed either way
  [/ee/g, "i"],
  [/ii/g, "i"],
  [/oo/g, "u"],
  [/uu/g, "u"],
  [/aa/g, "a"],
  [/ayi/g, "ai"], // ಸಾಯಿ: sai, sayi
  [/m(?=[kgcjtdn])/g, "n"], // omkara, onkara
  [/(.)\1+/g, "$1"], // datta, data
  [/(.)a$/, "$1"], // ರಾಮ is "rama", but people also type "ram"
];

function phoneticWord(word) {
  return RULES.reduce((w, [pattern, replacement]) => w.replace(pattern, replacement), word);
}

// Digits and punctuation separate words and are otherwise ignored.
function latinWords(text) {
  return toLatin(text.toLowerCase()).split(/[^a-zR]+/).filter(Boolean);
}

// Text (Kannada or English letters) to its phonetic words.
export function phoneticWords(text) {
  return latinWords(text).map((w) => phoneticWord(w.replace(/R/g, "ru")));
}

const titleCache = new Map();

// A title's phonetic words, once with ಋ as "ru" and, if it has one, once as "ri".
function titleWords(title) {
  let forms = titleCache.get(title);
  if (!forms) {
    const latin = latinWords(title);
    const readings = latin.some((w) => w.includes("R")) ? ["ru", "ri"] : ["ru"];
    forms = readings.map((r) => latin.map((w) => phoneticWord(w.replace(/R/g, r))));
    titleCache.set(title, forms);
  }
  return forms;
}

// How well one query word fits a title: 3 for a whole word, 2 for the start of
// a word, 1 for inside the title (so "guru charitre" finds ಗುರುಚರಿತ್ರೆ), 0 for no match.
function wordScore(queryWord, words, joined) {
  let best = 0;
  for (const w of words) {
    if (w === queryWord) return 3;
    if (w.startsWith(queryWord)) best = 2;
  }
  if (!best && queryWord.length >= 3 && joined.includes(queryWord)) best = 1;
  return best;
}

// 0 when the title does not match; higher numbers are better matches.
export function searchScore(title, query) {
  const q = query.trim().toLowerCase();
  if (!q) return 1;
  const raw = title.toLowerCase();
  if (raw.includes(q)) return raw.startsWith(q) ? 100 : 90;

  const queryWords = phoneticWords(q);
  if (!queryWords.length) return 0;
  let best = 0;
  for (const words of titleWords(title)) {
    const joined = words.join("");
    let score = 0;
    for (const qw of queryWords) {
      const s = wordScore(qw, words, joined);
      if (!s) {
        score = 0;
        break;
      }
      score += s;
    }
    if (score && joined.includes(queryWords.join(""))) score += 1; // words in the same order
    best = Math.max(best, score);
  }
  return best;
}

export const matches = (title, query) => searchScore(title, query) > 0;

// Readable English-letter form for URLs: ಶ್ರೀ ಮಹಾಗಣಪತಿ ಹೋಮ → "shri-mahaganapati-homa".
export function toSlug(text) {
  return toLatin(text.toLowerCase())
    .replace(/R/g, "ru")
    .replace(/aa/g, "a")
    .replace(/ii/g, "i")
    .replace(/uu/g, "u")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Items whose title matches, best matches first, otherwise in their original order.
export function searchTitles(items, query, getTitle = (item) => item.title) {
  if (!query.trim()) return items;
  return items
    .map((item, index) => ({ item, index, score: searchScore(getTitle(item), query) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map((r) => r.item);
}
