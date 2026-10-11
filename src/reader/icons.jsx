// Stroke icons shared by the reader. 24px grid, 2px stroke, round caps.
const base = { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true };

export const ChevronLeft = () => <svg {...base}><path d="M15 18l-6-6 6-6" /></svg>;
export const ChevronRight = () => <svg {...base}><path d="M9 18l6-6-6-6" /></svg>;
export const ChevronDown = () => <svg {...base}><path d="M6 9l6 6 6-6" /></svg>;
export const ChevronUp = () => <svg {...base} width={16} height={16}><path d="M6 15l6-6 6 6" /></svg>;
export const ListIcon = () => <svg {...base}><path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01" /></svg>;
export const SearchIcon = () => <svg {...base}><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>;
export const CloseIcon = () => <svg {...base}><path d="M18 6L6 18M6 6l12 12" /></svg>;
export const SunIcon = () => <svg {...base}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>;
export const BookIcon = () => <svg {...base}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5v14z" /><path d="M20 17v4H6.5A2.5 2.5 0 0 1 4 18.5" /></svg>;
export const MoonIcon = () => <svg {...base}><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>;
