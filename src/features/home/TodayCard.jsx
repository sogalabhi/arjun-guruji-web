import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getEvents } from "../../data/events";
import { nextProgramme } from "../../data/eventSchedule";
import { useAsync } from "../../hooks/useAsync";
import Icon from "../../components/ui/Icon";
import { Skeleton } from "../../components/ui/States";

const dateFormat = new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", weekday: "long", day: "numeric", month: "long" });
const programmeDateFormat = new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", weekday: "short", day: "numeric", month: "short", year: "numeric" });
const timeFormat = new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", hour: "numeric", minute: "2-digit" });

export default function TodayCard() {
  const [now, setNow] = useState(Date.now);
  const { data, error, loading, reload } = useAsync(getEvents, [Math.floor(now / 60000)]);
  useEffect(() => {
    const update = () => setNow(Date.now());
    const interval = window.setInterval(update, 60 * 1000);
    const onVisible = () => { if (!document.hidden) update(); };
    document.addEventListener("visibilitychange", onVisible);
    return () => { window.clearInterval(interval); document.removeEventListener("visibilitychange", onVisible); };
  }, []);
  const event = nextProgramme(data ?? [], now);
  const when = event && `${programmeDateFormat.format(event.occurrence)}${event.recurring ? " · Weekly" : event.dateOnly ? "" : ` · ${timeFormat.format(event.start)} IST`}`;
  const venue = event && [!/^https?:\/\//i.test(event.venue) && event.venue.toLowerCase() !== "tbd" ? event.venue : "", event.city].filter(Boolean).join(" · ");

  return (
    <section className="rounded-2xl border border-white/20 bg-white/10 p-4 sm:p-5" aria-labelledby="today-heading">
      <div className="flex items-start gap-3">
        <Icon name="calendar" className="mt-1 shrink-0 text-tile" />
        <div className="min-w-0 flex-1">
          <h2 id="today-heading" className="text-lg font-semibold">Today</h2>
          <p className="text-[16px] text-white/80">{dateFormat.format(now)} · IST</p>
        </div>
      </div>
      <div className="mt-4 border-t border-white/20 pt-4">
        {error ? (
          <div role="alert">
            <p className="text-[16px]">Could not load the next programme.</p>
            <button type="button" onClick={reload} className="mt-2 min-h-tap rounded-lg border border-white/50 px-4 text-[16px] active:bg-white/10">Try again</button>
          </div>
        ) : loading && !data ? (
          <div role="status" aria-label="Loading next programme" className="space-y-2"><Skeleton className="h-5 w-28" /><Skeleton className="h-7 w-3/4" /></div>
        ) : event ? (
          <Link to="/contact" className="block rounded-lg active:bg-white/5">
            <p className="text-[16px] text-tile">{event.today ? "Today's programme" : "Next programme"}</p>
            <h3 className="mt-1 font-kannada text-[19px] font-semibold leading-relaxed">{event.title}</h3>
            <p className="mt-1 text-[16px] text-white/85">{when}</p>
            {venue && <p className="mt-1 text-[16px] text-white/80">{venue}</p>}
            <span className="mt-2 inline-flex items-center gap-2 text-[16px] underline decoration-white/50 underline-offset-4">{event.recurring ? "Confirm time and details" : "Contact for details"}<Icon name="arrow" size={18} /></span>
          </Link>
        ) : (
          <p className="text-[16px] text-white/85">No upcoming programmes announced. Please check again soon.</p>
        )}
      </div>
    </section>
  );
}
