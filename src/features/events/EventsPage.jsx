import { useState } from "react";
import { Link } from "react-router-dom";
import Page from "../../layout/Page";
import { getEvents, invalidateEvents } from "../../data/events";
import { groupEvents } from "../../data/eventSchedule";
import { useAsync } from "../../hooks/useAsync";
import { useNow } from "../../hooks/useNow";
import { EmptyState, ErrorState, SkeletonList } from "../../components/ui/States";
import EventCard from "./EventCard";

export default function EventsPage() {
  const now = useNow();
  const { data, error, loading, reload } = useAsync(getEvents, [Math.floor(now / 60000)]);
  const [query, setQuery] = useState("");
  const filtered = (data ?? []).filter((event) => [event.title, event.venue, event.city].join(" ").toLowerCase().includes(query.trim().toLowerCase()));
  const groups = groupEvents(filtered, now);
  const refresh = () => { invalidateEvents(); reload(); };
  return (
    <Page title="Events" variant="gradient" maxWidth="max-w-2xl">
      <nav aria-label="Event tools" className="mb-5 flex flex-wrap gap-3"><Link to="/events/calendar" className="inline-flex min-h-tap items-center rounded-xl bg-tile px-4 text-[17px] font-semibold text-navy">Calendar</Link><Link to="/panchang" className="inline-flex min-h-tap items-center rounded-xl border border-white/40 px-4 text-[17px]">Panchang</Link><button onClick={refresh} disabled={loading} className="min-h-tap rounded-xl border border-white/40 px-4 text-[16px] disabled:opacity-50">{loading && data ? "Refreshing…" : "Refresh"}</button></nav>
      <label className="block text-[16px]">Search events<input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Programme, venue or city" className="mt-2 min-h-tap w-full rounded-xl bg-white px-3 text-[16px] text-ink" /></label>
      <div className="mt-5">
        {error ? <ErrorState onRetry={refresh} /> : !data ? <SkeletonList /> : !filtered.length ? <EmptyState title={query ? "No matching events" : "No events announced"} message={query ? "Try another programme, venue or city." : "Please check again soon."} /> : <>
          {[["happening", "Happening now"], ["weekly", "Weekly programmes"], ["upcoming", "Upcoming"]].map(([key, title]) => <section key={key} className="mb-7" aria-label={title}><h2 className="mb-3 text-xl font-semibold">{title}</h2>{groups[key].length ? <div className="space-y-3">{groups[key].map((event) => <EventCard key={event.id} event={event} now={now} />)}</div> : <p className="text-[16px] text-white/80">{key === "happening" ? "No programmes happening today." : key === "weekly" ? "No weekly programmes announced." : "No upcoming events announced."}</p>}</section>)}
          <details className="rounded-2xl border border-white/20 bg-white/5 p-4"><summary className="min-h-tap cursor-pointer text-xl font-semibold">Past events &amp; photos ({groups.past.length})</summary><div className="mt-3 space-y-3">{groups.past.length ? groups.past.map((event) => <EventCard key={event.id} event={event} now={now} />) : <p className="text-[16px] text-white/80">No past events yet.</p>}</div></details>
        </>}
      </div>
    </Page>
  );
}
