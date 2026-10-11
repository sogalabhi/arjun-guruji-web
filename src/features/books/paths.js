export const bookPath = (id) => `/books/${encodeURIComponent(id)}`;
export const chapterPath = (id, n) => `${bookPath(id)}/${n}`;
export const lastChapterKey = (id) => `book-last-chapter:${id}`;
