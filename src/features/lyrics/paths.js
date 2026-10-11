export const lyricsCategoryPath = (category) => `/lyrics/${encodeURIComponent(category)}`;
export const lyricPath = (lyric) => `${lyricsCategoryPath(lyric.category)}/${encodeURIComponent(lyric.id)}`;
