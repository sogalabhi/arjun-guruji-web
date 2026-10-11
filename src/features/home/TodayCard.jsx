import { Fragment } from "react";
import { Link } from "react-router-dom";
import { getEvents } from "../../data/events";
import { eventPath, happeningNow, nextProgramme } from "../../data/eventSchedule";
import { dateKey, istDay } from "../../data/dates";
import { useNow } from "../../hooks/useNow";
import { usePanchang } from "../panchang/usePanchang";
import { usePanchangPreferences } from "../panchang/preferences";
import { useAsync } from "../../hooks/useAsync";
import Icon from "../../components/ui/Icon";
import { Skeleton } from "../../components/ui/States";
import { translateName, WEEKDAYS } from "../../data/panchangKannada";

const dateFormat = new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", weekday: "long", day: "numeric", month: "long" });
const shortDateFormat = new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", weekday: "short", day: "numeric", month: "short" });
const timeFormat = new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", hour: "numeric", minute: "2-digit" });

// Short enough for half the card: "Until 1:00 pm", "Today · 6:00 pm", "Thu 15 Oct · Weekly", "Sat 17 Oct – Sun 18 Oct".
function programmeWhen(event, now) {
  if (event.live) {
    if (event.dateOnly) return istDay(event.end) > istDay(now) ? `Until ${shortDateFormat.format(event.end)}` : "All day today";
    return istDay(event.end) > istDay(now) ? `Until ${shortDateFormat.format(event.end)}` : `Until ${timeFormat.format(event.end)}`;
  }
  const day = event.today ? "Today" : shortDateFormat.format(event.occurrence);
  const multiDay = !event.recurring && istDay(event.start) !== istDay(event.end);
  if (multiDay) return `${day} – ${shortDateFormat.format(event.end)}`;
  if (event.recurring) return `${day} · Weekly`;
  return event.dateOnly ? day : `${day} · ${timeFormat.format(event.start)}`;
}

const kn = (name, kind) => translateName(name, "kn", kind);

// Today's Panchanga in the traditional sankalpa order: Samvatsara, Ayana, Ritu,
// Masa, Paksha, Tithi (with its end time) and Vaara. Values are at sunrise.
function Almanac({ info, now }) {
  const ends = info.tithiEnd == null ? "" : istDay(info.tithiEnd) > istDay(now) ? `ನಾಳೆ ${timeFormat.format(info.tithiEnd)} ವರೆಗೆ` : `${timeFormat.format(info.tithiEnd)} ವರೆಗೆ`;
  const parts = [
    kn(info.samvatsara, "samvatsara"),
    kn(info.ayana),
    kn(info.ritu),
    `${info.isAdhika ? "ಅಧಿಕ " : ""}${kn(info.lunarMonth, "masa")}`,
    kn(info.paksha),
    <Fragment>
      <span className="font-semibold text-tile">{kn(info.tithiName, "tithi")}</span>
      {ends && <span className="text-white/85"> ({ends})</span>}
    </Fragment>,
    WEEKDAYS[info.weekday],
  ];
  return (
    <p lang="kn" aria-label="Today's Panchanga" className="font-kannada mt-1 text-[16px] leading-relaxed">
      {parts.map((part, index) => (
        <Fragment key={index}>{index > 0 && ", "}{part}</Fragment>
      ))}
    </p>
  );
}

const retryButton ="mt-2 min-h-tap rounded-lg border border-white/50 px-3 text-[16px] active:bg-white/10";
const moreLink = "mt-auto inline-flex min-h-tap items-center gap-1 pt-1 text-[16px] underline decoration-white/50 underline-offset-4";

// Today's date, then the Panchang and the programme side by side. A programme running
// right now takes the place of the next one.
export default function TodayCard() {
  const now = useNow();
  const { city } = usePanchangPreferences();
  const panchang = usePanchang(dateKey(now), city);
  const { data, error, loading, reload } = useAsync(getEvents, [Math.floor(now / 60000)]);
  const live = happeningNow(data ?? [], now);
  const event = live[0] ?? nextProgramme(data ?? [], now);

  return (
    <section className="rounded-2xl border border-white/20 bg-white/10 p-3 sm:p-5" aria-labelledby="today-heading">
      <div className="flex items-start gap-3">
        <Icon name="calendar" className="mt-1 shrink-0 text-tile" />
        <div className="min-w-0 flex-1">
          <h2 id="today-heading" className="text-lg font-semibold">Today</h2>
          <p className="text-[16px] text-white/80">{dateFormat.format(now)} · IST</p>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 border-t border-white/20 pt-3">
        <div className="flex min-w-0 flex-col pr-3">
          {panchang.error ? (
            <div role="alert"><p className="text-[16px]">Could not load Panchang.</p><button type="button" onClick={panchang.reload} className={retryButton}>Try again</button></div>
          ) : panchang.info ? (
            <>
              <p className="text-[16px] text-white/80">{city}</p>
              <Almanac info={panchang.info} now={now} />
            </>
          ) : (
            <div role="status" aria-label="Loading Panchang" className="space-y-2"><Skeleton className="h-5 w-24" /><Skeleton className="h-7 w-full" /></div>
          )}
          <Link to="/panchang" className={moreLink}>Panchang<Icon name="arrow" size={18} /></Link>
        </div>
        <div className="flex min-w-0 flex-col border-l border-white/20 pl-3">
          {error ? (
            <div role="alert"><p className="text-[16px]">Could not load the next programme.</p><button type="button" onClick={reload} className={retryButton}>Try again</button></div>
          ) : loading && !data ? (
            <div role="status" aria-label="Loading next programme" className="space-y-2"><Skeleton className="h-5 w-24" /><Skeleton className="h-7 w-full" /></div>
          ) : event ? (
            <Link to={eventPath(event)} className="flex flex-1 flex-col rounded-lg active:bg-white/5">
              {event.live ? (
                <p className="inline-flex items-center gap-2 text-[16px] font-semibold text-tile"><span className="h-2.5 w-2.5 shrink-0 animate-pulse rounded-full bg-tile" aria-hidden="true" />Happening now</p>
              ) : (
                <p className="text-[16px] text-tile">{event.today ? "Today's programme" : "Next programme"}</p>
              )}
              <h3 className="mt-1 line-clamp-3 font-kannada text-[17px] font-semibold leading-snug">{event.title}</h3>
              <p className="mt-1 text-[16px] text-white/85">{programmeWhen(event, now)}</p>
              <span className={moreLink}>Details<Icon name="arrow" size={18} /></span>
            </Link>
          ) : (
            <p className="text-[16px] text-white/85">No upcoming programmes announced yet.</p>
          )}
          {live.length > 1 && <Link to="/events" className="inline-flex min-h-tap items-center text-[16px] underline decoration-white/50 underline-offset-4">+{live.length - 1} more happening now</Link>}
        </div>
      </div>
    </section>
  );
}
