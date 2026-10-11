import { Link } from "react-router-dom";
import { cancelled, dateOnlyEvent, eventPath, nextWeeklyOccurrence, publicUrl } from "../../data/eventSchedule";
import { dateKey, formatDate, formatTime, istDay } from "../../data/dates";
import Icon from "../../components/ui/Icon";

export default function EventCard({ event, now = Date.now(), selectedDate }) {
  const recurring = event.type === "recurring";
  const past = istDay(event.end) < istDay(now);
  const occurrence = selectedDate ?? dateKey(recurring ? (past ? event.end : nextWeeklyOccurrence(event, now) ?? event.start) : event.start);
  const [year, month, day] = occurrence.split("-");
  const monthName = new Intl.DateTimeFormat("en", { month: "short", timeZone: "UTC" }).format(new Date(`${year}-${month}-01T00:00:00Z`));
  const venue = [publicUrl(event.venue) ? "" : event.venue, event.city].filter(Boolean).join(" · ");
  return (
    <Link to={eventPath(event)} className="flex min-h-tap items-start gap-3 rounded-2xl border border-white/20 bg-white/10 p-4 active:bg-white/15">
      <div className="flex w-14 shrink-0 flex-col items-center rounded-xl bg-tile px-1 py-2 text-navy" aria-hidden="true"><span className="text-[16px]">{monthName}</span><span className="text-2xl font-bold">{Number(day)}</span><span className="text-sm">{year}</span></div>
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex flex-wrap gap-2 text-[16px] text-tile">{recurring && <span>Weekly</span>}{event.featured && <span>Special</span>}{cancelled(event) && <span>Cancelled</span>}{["completed", "past"].includes(event.status) && <span>Completed</span>}</div>
        <h3 className="break-words font-kannada text-[19px] font-semibold leading-relaxed">{event.title}</h3>
        <p className="mt-1 text-[16px] text-white/85">{recurring ? `${past ? "Ended" : "Every"} ${past ? formatDate(event.end) : event.day.charAt(0).toUpperCase() + event.day.slice(1)}` : `${formatDate(event.start)}${istDay(event.start) !== istDay(event.end) ? ` – ${formatDate(event.end)}` : ""}${dateOnlyEvent(event) ? "" : ` · ${formatTime(event.start)} IST`}`}</p>
        {recurring && !past && !selectedDate && <p className="mt-1 text-[16px] text-white/85">Next: {formatDate(Date.parse(`${occurrence}T12:00:00Z`))}</p>}
        {venue && <p className="mt-1 break-words text-[16px] text-white/80">{venue}</p>}
        <span className="mt-3 inline-flex items-center gap-1 text-[16px] underline underline-offset-4">View details<Icon name="arrow" size={18} /></span>
      </div>
    </Link>
  );
}
