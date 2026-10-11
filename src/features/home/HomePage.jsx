import { Link } from "react-router-dom";
import Page from "../../layout/Page";
import Icon from "../../components/ui/Icon";
import TodayCard from "./TodayCard";
import Equalizer from "../audio/Equalizer";
import { usePlayer } from "../../audio/context";

const tiles = [
  { title: "Audio", icon: "music", to: "/audio" },
  { title: "Books", icon: "book", to: "/books" },
  { title: "Astottara", icon: "prayer", to: "/astottara" },
  { title: "Lyrics", icon: "lyrics", to: "/lyrics" },
  { title: "Events", icon: "calendar", to: "/events" },
  { title: "Contact", icon: "phone", to: "/contact" },
];

export default function HomePage() {
  const { status } = usePlayer();
  const settings = <Link to="/settings" className="inline-flex min-h-tap items-center gap-1.5 rounded-lg px-2 text-[16px] active:bg-white/15"><Icon name="settings" size={20} /><span>Settings</span></Link>;
  return (
    <Page title="Arjun Guruji" back={false} actions={settings} variant="gradient" maxWidth="max-w-2xl">
      <div className="mb-4 flex items-center gap-4 py-2 sm:gap-6">
        <img src="/images/guruji.webp" alt="Sri Arjuna Avadhoota Guruji" width="112" height="112" className="h-20 w-20 shrink-0 rounded-full border-2 border-white/30 object-cover sm:h-28 sm:w-28" />
        <div>
          <h2 className="text-xl font-semibold leading-snug sm:text-2xl">Sri Arjuna<br />Avadhoota Guruji</h2>
          <p className="mt-2 text-[16px] text-white/80">SNSDS Trust · Mysuru</p>
        </div>
      </div>
      <TodayCard />
      <nav aria-label="Explore" className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {tiles.map((tile) => (
          <Link key={tile.to} to={tile.to} className="flex min-h-[104px] flex-col items-center justify-center gap-1.5 rounded-2xl bg-tile px-3 py-3 text-center text-navy shadow-md transition-transform active:scale-[0.98] motion-reduce:transform-none">
            <Icon name={tile.icon} size={30} />
            <span className="text-[18px] font-semibold">{tile.title}</span>
            {tile.to === "/audio" && status === "playing" && (
              <span className="flex items-center gap-1.5 text-[16px] font-semibold"><Equalizer />Now playing</span>
            )}
          </Link>
        ))}
      </nav>
    </Page>
  );
}
