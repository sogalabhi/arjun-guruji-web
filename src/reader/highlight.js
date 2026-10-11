// Wraps matches in <mark> by walking text nodes, never by regex over markup,
// so tags are never corrupted (same approach as the app's reader search).

export function clearMarks(root) {
  if (!root) return;
  root.querySelectorAll("mark.reader-mark").forEach((m) => m.replaceWith(document.createTextNode(m.textContent)));
  root.normalize();
}

export function highlight(root, query) {
  const q = query.trim().toLowerCase();
  if (!root || !q) return null;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);

  let first = null;
  for (const node of nodes) {
    const text = node.nodeValue;
    const lower = text.toLowerCase();
    let at = lower.indexOf(q);
    if (at < 0) continue;
    const frag = document.createDocumentFragment();
    let from = 0;
    while (at >= 0) {
      if (at > from) frag.append(text.slice(from, at));
      const mark = document.createElement("mark");
      mark.className = "reader-mark";
      mark.textContent = text.slice(at, at + q.length);
      frag.append(mark);
      first ??= mark;
      from = at + q.length;
      at = lower.indexOf(q, from);
    }
    if (from < text.length) frag.append(text.slice(from));
    node.replaceWith(frag);
  }
  return first;
}
