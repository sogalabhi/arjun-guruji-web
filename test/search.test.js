import assert from "node:assert/strict";
import test from "node:test";
import { matches, phoneticWords, searchScore, searchTitles, toLatin, toSlug } from "../src/data/search.js";

// Real titles from the Books, Lyrics and Astottara collections.
const TITLES = [
  "ಲಘು ಗುರುಚರಿತ್ರೆ",
  "ಅರ್ಜುನಾಮೃತಧಾರೆ",
  "ಅವಧೂತ ಮಹಿಮೆ",
  "ದಿನಕ್ಕೊಂದು ಶ್ಲೋಕ",
  "ಭಕ್ತಿಕುಸುಮಾಂಜಲಿ",
  "ಅರ್ಜುನಂ ಭಜೇ",
  "ರಾಮ ಬಂದ ಶ್ಯಾಮ ಬಂದ",
  "ಗೀತಾನಿಕೇತನ ಆಶ್ರಮದ ಪ್ರಾರ್ಥನೆ",
  "ಜಯದೇವ (ಶೃಂಗೇರಿ ಮಹಾಸನ್ನಿಧಾನಂ)",
  "ಜಯದೇವ (ಶ್ರೀಧರ)",
  "ಗುರುಪಾದುಕಾ ಸ್ತೋತ್ರಂ",
  "ಜ್ಞಾನಪೂರ್ಣ ಜಗನ್ ಜ್ಯೋತಿ",
  "ಮಂಗಳಂ ಗುರು ಶ್ರೀ",
  "ಹನುಮಾನ್ ಚಾಲೀಸಾ",
  "ಹೇ ಸಾಯಿರಾಮ್",
  "ಕದಂಬಗಿರಿಯ",
  "ಲಲಿತ ಸಹಸ್ರನಾಮ",
  "ಮಂಗಳಂ ಓಂಕಾರ ಮಂಗಳಂ",
  "ರಾಮಾ ರಾಮಾ ಎನ್ನಿರೋ",
  "ಶಕ್ತಿಸಹಿತ ಗಣಪತಿಂ",
  "3. ಶ್ರೀಧರ ಅಷ್ಟೋತ್ತರ",
  "6. ಸಾಯಿಬಾಬಾ ಅಷ್ಟೋತ್ತರ",
  "Bhaja gurunatham",
];

const find = (query) => TITLES.filter((t) => matches(t, query));

test("Kannada is written out in English letters", () => {
  assert.equal(toLatin("ಲಘು ಗುರುಚರಿತ್ರೆ"), "laghu gurucharitre");
  assert.equal(toLatin("ಅಮೃತ"), "amRta");
  assert.equal(toLatin("ಅರ್ಜುನಂ ಭಜೇ"), "arjunam bhaje");
  assert.equal(toLatin("ಮಂಗಳಂ"), "mangalam");
  assert.equal(toLatin("ಸಂಪೂರ್ಣ"), "sampuurna");
});

test("different spellings of the same sound give the same words", () => {
  for (const group of [
    ["sreedhara", "shridhar", "sridhara", "ಶ್ರೀಧರ"],
    ["jnana", "gnana", "ಜ್ಞಾನ"],
    ["sai", "sayi", "ಸಾಯಿ"],
    ["ganapathi", "ganapati"],
    ["avadhoota", "avaduta", "ಅವಧೂತ"],
    ["dinakkondu", "dinakondu"],
  ]) {
    const [first, ...rest] = group.map((w) => phoneticWords(w).join(" "));
    for (const other of rest) assert.equal(other, first, group.join(", "));
  }
});

test("English letters find Kannada titles", () => {
  assert.deepEqual(find("guru charitre"), ["ಲಘು ಗುರುಚರಿತ್ರೆ"]);
  assert.deepEqual(find("gurucharitre"), ["ಲಘು ಗುರುಚರಿತ್ರೆ"]);
  assert.deepEqual(find("arjunamrita"), ["ಅರ್ಜುನಾಮೃತಧಾರೆ"]);
  assert.deepEqual(find("arjunamrutha"), ["ಅರ್ಜುನಾಮೃತಧಾರೆ"]);
  assert.deepEqual(find("dinakondu sloka"), ["ದಿನಕ್ಕೊಂದು ಶ್ಲೋಕ"]);
  assert.deepEqual(find("bhakti kusumanjali"), ["ಭಕ್ತಿಕುಸುಮಾಂಜಲಿ"]);
  assert.deepEqual(find("shringeri"), ["ಜಯದೇವ (ಶೃಂಗೇರಿ ಮಹಾಸನ್ನಿಧಾನಂ)"]);
  assert.deepEqual(find("kadambagiri"), ["ಕದಂಬಗಿರಿಯ"]);
  assert.deepEqual(find("hanuman chalisa"), ["ಹನುಮಾನ್ ಚಾಲೀಸಾ"]);
  assert.deepEqual(find("omkara"), ["ಮಂಗಳಂ ಓಂಕಾರ ಮಂಗಳಂ"]);
  assert.deepEqual(find("jnana"), ["ಜ್ಞಾನಪೂರ್ಣ ಜಗನ್ ಜ್ಯೋತಿ"]);
  assert.deepEqual(find("sri dhara"), ["ಜಯದೇವ (ಶ್ರೀಧರ)", "3. ಶ್ರೀಧರ ಅಷ್ಟೋತ್ತರ"]);
  assert.deepEqual(find("sai"), ["ಹೇ ಸಾಯಿರಾಮ್", "6. ಸಾಯಿಬಾಬಾ ಅಷ್ಟೋತ್ತರ"]);
});

test("each typed word may match anywhere, with or without the final a", () => {
  assert.deepEqual(find("ram banda"), ["ರಾಮ ಬಂದ ಶ್ಯಾಮ ಬಂದ"]);
  assert.deepEqual(find("banda rama"), ["ರಾಮ ಬಂದ ಶ್ಯಾಮ ಬಂದ"]);
  assert.deepEqual(find("mangalam"), ["ಮಂಗಳಂ ಗುರು ಶ್ರೀ", "ಮಂಗಳಂ ಓಂಕಾರ ಮಂಗಳಂ"]);
  assert.deepEqual(find("mangalam guru"), ["ಮಂಗಳಂ ಗುರು ಶ್ರೀ"]);
});

test("Kannada queries work as before and also find titles in English letters", () => {
  assert.deepEqual(find("ಗುರು"), ["ಲಘು ಗುರುಚರಿತ್ರೆ", "ಗುರುಪಾದುಕಾ ಸ್ತೋತ್ರಂ", "ಮಂಗಳಂ ಗುರು ಶ್ರೀ", "Bhaja gurunatham"]);
  assert.deepEqual(find("Bhaja"), ["ಅರ್ಜುನಂ ಭಜೇ", "Bhaja gurunatham"]);
  assert.ok(matches("anything", "   "));
  assert.ok(!matches("ಗುರುಪಾದುಕಾ ಸ್ತೋತ್ರಂ", "!!"));
});

test("whole words rank above words inside other words", () => {
  const ranked = searchTitles(TITLES.map((title) => ({ title })), "rama").map((x) => x.title);
  assert.deepEqual(ranked.slice(0, 2), ["ರಾಮ ಬಂದ ಶ್ಯಾಮ ಬಂದ", "ರಾಮಾ ರಾಮಾ ಎನ್ನಿರೋ"]);
  assert.ok(ranked.includes("ಗೀತಾನಿಕೇತನ ಆಶ್ರಮದ ಪ್ರಾರ್ಥನೆ")); // ಆಶ್ರಮ: still found, just lower
  assert.ok(searchScore("ರಾಮ ಬಂದ", "rama") > searchScore("ಹೇ ಸಾಯಿರಾಮ್", "rama"));
});

test("short queries only match the start of words", () => {
  assert.ok(matches("ರಾಮ ಬಂದ", "ra"));
  assert.ok(!matches("ಪರಮಹಂಸ", "ra"));
});

test("an empty query keeps every item in order", () => {
  const items = [{ title: "b" }, { title: "a" }];
  assert.equal(searchTitles(items, ""), items);
});

test("titles become readable English-letter slugs", () => {
  assert.equal(toSlug("ಶ್ರೀ ಮಹಾಗಣಪತಿ ಹೋಮ"), "shri-mahaganapati-homa");
  assert.equal(toSlug("ಅರ್ಜುನಾಮೃತಧಾರೆ"), "arjunamrutadhare");
  assert.equal(toSlug(" Sai Baba Arti! "), "sai-baba-arti");
});
