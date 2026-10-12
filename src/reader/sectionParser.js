// Reader section parsing with consistent chapter boundaries.

const HR_SPLIT = /<hr\s*\/?>/gi;
const OPENING_HEADING = /^<(h3|h4)[^>]*>([\s\S]*?)<\/\1>/i;
const OPENING_P = /^<p[^>]*>([\s\S]*?)<\/p>/i;
const FIRST_LINE = /<p[^>]*>([\s\S]*?)(?:<br\s*\/?>|<\/p>)/i;
const BR_TAG = /<br/i;
const SEPARATORS = /[|।॥]+/g;
const SPACES = /\s+/g;
const EDGE_DASHES = /^[-–\s]+|[-–\s]+$/g;
const TYPED_NUMBER = /^\s*([0-9೦-೯]+)\s*[.)]\s*/;

export function htmlToText(html) {
  const t = document.createElement("template");
  t.innerHTML = html;
  return t.content.textContent ?? "";
}

function cleanTitle(html) {
  return htmlToText(html).replace(SEPARATORS, " ").replace(SPACES, " ").trim().replace(EDGE_DASHES, "");
}

export function kannadaToAsciiDigits(s) {
  // Kannada digits ೦-೯ are U+0CE6..U+0CEF.
  return s.replace(/[೦-೯]/g, (d) => String(d.charCodeAt(0) - 0x0ce6));
}

function parseTyped(title) {
  const m = TYPED_NUMBER.exec(title);
  if (!m) return null;
  const n = parseInt(kannadaToAsciiDigits(m[1]), 10);
  return Number.isNaN(n) ? null : n;
}

function draft(piece) {
  let title;
  let headingHtml = null;
  let bodyHtml = piece;
  const h = OPENING_HEADING.exec(piece);
  const p = OPENING_P.exec(piece);
  if (h) {
    title = cleanTitle(h[2]);
    headingHtml = h[2];
    bodyHtml = piece.slice(h[0].length);
  } else if (p && !BR_TAG.test(p[1]) && piece.length > p[0].length + 20) {
    title = cleanTitle(p[1]);
    headingHtml = p[1];
    bodyHtml = piece.slice(p[0].length);
  } else {
    const first = FIRST_LINE.exec(piece);
    title = cleanTitle(first?.[1] ?? "");
  }
  return { title, headingHtml, bodyHtml, typed: parseTyped(title) };
}

/**
 * Splits a book at each <hr>. A section is named by its opening <h3>/<h4>,
 * else a one-line opening <p>, else the first line of its first <p>. When
 * most names start with a typed number, those numbers become the labels.
 * Returns [{ number, label, title, headingHtml, bodyHtml, length }].
 */
export function parseSections(html, { split = true } = {}) {
  // split=false: the text is already one section (a book chapter), so an
  // <hr> inside it (e.g. before a closing note) stays part of that section.
  const pieces = (split ? (html ?? "").split(HR_SPLIT) : [html ?? ""])
    .map((s) => s.trim())
    .filter(Boolean);
  const drafts = pieces.map(draft);
  const printed = drafts.filter((d) => d.typed != null).length * 2 > drafts.length;

  return drafts.map((d, i) => {
    const number = i + 1;
    const typed = printed ? d.typed : null;
    let { title, headingHtml } = d;
    if (typed != null) {
      title = title.replace(TYPED_NUMBER, "");
      if (headingHtml != null && TYPED_NUMBER.test(headingHtml)) headingHtml = headingHtml.replace(TYPED_NUMBER, "");
    }
    return {
      number,
      label: printed ? typed : number,
      title: title || `Section ${typed ?? number}`,
      headingHtml,
      bodyHtml: d.bodyHtml,
      length: pieces[i].length,
    };
  });
}

export function lastLabel(sections) {
  return sections.reduce((m, s) => Math.max(m, s.label ?? 0), 0);
}

export function indexOfLabel(sections, label) {
  const i = sections.findIndex((s) => s.label === label);
  return i < 0 ? null : i;
}

// The section's number, or where an unnumbered piece sits.
export function placeOf(sections, index) {
  const own = sections[index].label;
  if (own != null) return String(own);
  for (let i = index - 1; i >= 0; i--) {
    if (sections[i].label != null) return `After ${sections[i].label}`;
  }
  const next = sections.slice(index).find((s) => s.label != null);
  return `Before ${next?.label ?? 1}`;
}
