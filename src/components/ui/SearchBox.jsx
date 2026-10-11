// Search field used on list screens (the app has one on Books, Astottara and Lyrics).
// Matching lives in data/search.js: Kannada script or Kannada typed in English letters.
export default function SearchBox({ value, onChange, placeholder = "Search", autoFocus = false }) {
  return (
    <div className="relative">
      <svg className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/70" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20l-3.5-3.5" />
      </svg>
      <input
        type="search"
        enterKeyHint="search"
        autoFocus={autoFocus}
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="min-h-[48px] w-full rounded-xl border border-white/25 bg-white/10 pl-10 pr-3 font-kannada text-[17px] text-white placeholder:text-white/60 focus:border-white/60 focus:outline-none"
      />
    </div>
  );
}
