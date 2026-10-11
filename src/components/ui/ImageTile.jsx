import { Link } from "react-router-dom";

// Cover tile like the app's ImageGridItem: image, dark fade at the bottom, title.
export default function ImageTile({ to, imageUrl, title, badge }) {
  return (
    <Link to={to} className="group relative block aspect-[0.7] overflow-hidden rounded-xl bg-white/10 shadow-md active:scale-[0.98] transition-transform">
      {imageUrl ? (
        <img src={imageUrl} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-tile to-accent" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
      {badge && <span className="absolute right-2 top-2 rounded-md bg-black/60 px-2 py-0.5 text-[13px] text-white">{badge}</span>}
      <span className="absolute inset-x-2 bottom-2 line-clamp-2 font-kannada text-[16px] font-bold leading-snug text-white">{title}</span>
    </Link>
  );
}

export function TileGrid({ children }) {
  return <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{children}</div>;
}

export function TileGridSkeleton({ count = 6 }) {
  return (
    <TileGrid>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="aspect-[0.7] animate-pulse rounded-xl bg-white/15" />
      ))}
    </TileGrid>
  );
}
