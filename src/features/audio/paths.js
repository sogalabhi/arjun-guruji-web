// Audio URLs and small helpers shared by the Audio screens.

export const audioCategoryPath = (categoryId) => `/audio/${encodeURIComponent(categoryId)}`;
export const audioTrackPath = (track) => `${audioCategoryPath(track.categoryId)}/${encodeURIComponent(track.id)}`;

// view-transition-name must be a valid CSS identifier.
export const transitionName = (prefix, id) => `${prefix}-${String(id).replace(/[^a-zA-Z0-9_-]/g, "_")}`;

export const tracksLabel = (count) => `${count} ${count === 1 ? "track" : "tracks"}`;

// True for an ordinary left click (not "open in new tab" and similar).
export const isPlainClick = (event) =>
  !event.defaultPrevented && event.button === 0 && !(event.metaKey || event.ctrlKey || event.shiftKey || event.altKey);
