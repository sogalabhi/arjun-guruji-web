import { Link, useSearchParams } from "react-router-dom";
import Page from "../../layout/Page";
import Icon from "../../components/ui/Icon";
import { dateKey, dateMillis, formatDate, monthCells, shiftMonth, validDate, MIN_DATE, MAX_DATE } from "../../data/dates";
import { getEvents } from "../../data/events";
import { eventsOnDate } from "../../data/eventSchedule";
import { useAsync } from "../../hooks/useAsync";
import { useNow } from "../../hooks/useNow";
import { ErrorState, SkeletonList } from "../../components/ui/States";
import { usePanchangPreferences } from "../panchang/preferences";
import CityPicker from "../panchang/CityPicker";
import PanchangPanel from "../panchang/PanchangPanel";
import EventCard from "./EventCard";

export default function CalendarPage() {
  const [params, setParams] = useSearchParams();
  const now = useNow();
  const today = dateKey(now);
  const rawDate = params.get("date");
  const date = validDate(rawDate) ? rawDate : today;
  const { city: savedCity, setCity } = usePanchangPreferences();
  const city = params.get("city") || savedCity;
  const { data, error, reload } = useAsync(getEvents, [Math.floor(now / 60000)]);
  const selectDate = (value) => { if (validDate(value)) setParams({ date: value, city }); };
  const selectCity = (value) => { setCity(value); setParams({ date, city: value }); };
  const events = eventsOnDate(data ?? [], date);
  const month = new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", month: "long", year: "numeric" }).format(dateMillis(date));
  return (
    <Page title="Calendar" backTo="/events" variant="gradient" maxWidth="max-w-2xl">
      <div className="flex items-center justify-between gap-2"><button type="button" aria-label="Previous month" onClick={() => selectDate(shiftMonth(date, -1))} disabled={date.slice(0, 7) === MIN_DATE.slice(0, 7)} className="min-h-tap min-w-tap rounded-xl border border-white/30 px-3 text-2xl disabled:opacity-40">‹</button><h2 className="text-center text-xl font-semibold">{month}</h2><button type="button" aria-label="Next month" onClick={() => selectDate(shiftMonth(date, 1))} disabled={date.slice(0, 7) === MAX_DATE.slice(0, 7)} className="min-h-tap min-w-tap rounded-xl border border-white/30 px-3 text-2xl disabled:opacity-40">›</button></div>
      <div className="mt-4 flex flex-wrap items-end gap-3"><label className="min-w-0 flex-1 text-[16px]">Go to date<input type="date" value={date} min={MIN_DATE} max={MAX_DATE} onChange={(event) => selectDate(event.target.value)} className="mt-2 block min-h-tap w-full min-w-0 rounded-xl bg-white px-3 py-2 text-[16px] text-ink" /></label><button onClick={() => selectDate(today)} className="min-h-tap rounded-xl bg-tile px-4 text-[16px] font-semibold text-navy">Today</button></div>
      {rawDate && !validDate(rawDate) && <p role="status" className="mt-3 text-[16px]">That date is invalid. Showing today.</p>}
      <div className="-mx-4 mt-5 sm:mx-0"><div className="grid grid-cols-7 text-center text-[16px] text-white/80">{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => <span key={day} className="py-2">{day}</span>)}</div><div className="grid grid-cols-7 border-y border-white/20">{monthCells(date).map((key, index) => {
        const count = key && data ? eventsOnDate(data, key).length : 0;
        return key ? <button key={key} type="button" aria-label={`${formatDate(dateMillis(key), true)}${data ? `, ${count} programme${count === 1 ? "" : "s"}` : ""}`} aria-pressed={key === date} aria-current={key === today ? "date" : undefined} onClick={() => selectDate(key)} className={`flex min-h-[68px] flex-col items-center justify-center border border-white/10 text-[18px] ${key === date ? "bg-tile font-semibold text-navy" : key === today ? "bg-white/15" : "active:bg-white/10"}`}><span>{Number(key.slice(-2))}</span>{count > 0 && <span className="text-[16px]">{count} •</span>}</button> : <span key={`empty-${index}`} aria-hidden="true" />;
      })}</div></div>
      <p className="mt-3 text-[16px] text-white/80">Numbers below dates show the number of programmes.</p>
      <section className="mt-6" aria-labelledby="selected-day"><h2 id="selected-day" className="text-xl font-semibold">{formatDate(dateMillis(date), true)}</h2><div className="mt-4">{error ? <ErrorState onRetry={reload} /> : !data ? <SkeletonList rows={2} /> : events.length ? <div className="space-y-3">{events.map((event) => <EventCard key={event.id} event={event} selectedDate={date} now={now} />)}</div> : <p className="text-[17px] text-white/85">No programmes scheduled for this day.</p>}</div></section>
      <section className="mt-7" aria-label="Panchang for selected day"><h2 className="mb-3 text-xl font-semibold">Panchang</h2><CityPicker city={city} onChange={selectCity} /><div className="mt-4"><PanchangPanel date={date} city={city} /></div><Link to={`/panchang?${new URLSearchParams({ date, city })}`} className="mt-3 inline-flex min-h-tap items-center gap-2 text-[16px] underline underline-offset-4">Full Panchang for this day<Icon name="arrow" size={18} /></Link></section>
    </Page>
  );
}
