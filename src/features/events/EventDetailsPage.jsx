import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import DOMPurify from "dompurify";
import Page from "../../layout/Page";
import { getEvent } from "../../data/events";
import { cancelled, dateOnlyEvent, isVideoUrl, nextWeeklyOccurrence, publicUrl } from "../../data/eventSchedule";
import { formatDate, formatTime, istDay } from "../../data/dates";
import { useAsync } from "../../hooks/useAsync";
import { useNow } from "../../hooks/useNow";
import { EmptyState, ErrorState, SkeletonList } from "../../components/ui/States";
import PhotoViewer from "./PhotoViewer";

export default function EventDetailsPage() {
  const { id } = useParams();
  const { data: event, loading, error, reload } = useAsync(() => getEvent(id), [id]);
  const now = useNow();
  const [photo, setPhoto] = useState(null);
  const photos = event ? [...new Set([event.imageUrl, ...event.gallery].filter((url) => url && !isVideoUrl(url)))] : [];
  const videos = event ? event.gallery.filter(isVideoUrl) : [];
  const next = event?.type === "recurring" ? nextWeeklyOccurrence(event, now) : null;
  const venue = event && [publicUrl(event.venue) ? "" : event.venue, event.place, event.city].filter(Boolean).join(" · ");
  const map = event && (event.mapUrl || (venue ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue)}` : ""));
  return (
    <Page title="Event details" docTitle={event?.title} backTo="/events" variant="gradient" maxWidth="max-w-2xl">
      {error ? <ErrorState onRetry={reload} /> : loading ? <SkeletonList /> : !event ? <><EmptyState title="Event not found" message="This event may have been removed." /><Link to="/events" className="flex min-h-tap items-center justify-center rounded-xl bg-tile px-4 text-[17px] text-navy">Browse events</Link></> : <>
        {cancelled(event) && <p role="status" className="mb-4 rounded-xl border border-tile p-3 text-lg font-semibold text-tile">This programme has been cancelled.</p>}
        <h2 className="break-words font-kannada text-2xl font-semibold leading-relaxed">{event.title}</h2>
        <p className="mt-3 text-[17px] text-tile">{event.type === "recurring" ? `Weekly · ${event.day.charAt(0).toUpperCase() + event.day.slice(1)}` : `${formatDate(event.start, true)}${istDay(event.start) !== istDay(event.end) ? ` – ${formatDate(event.end, true)}` : ""}`}</p>
        {event.type === "recurring" ? <><p className="mt-2 text-[16px]">{next == null ? `Schedule ended ${formatDate(event.end)}.` : `Next: ${formatDate(next, true)}`}</p><p className="mt-2 text-[16px] text-white/80">Schedule: {formatDate(event.start)} – {formatDate(event.end)}</p></> : !dateOnlyEvent(event) && <p className="mt-2 text-[17px]">{formatTime(event.start)}{event.end !== event.start ? ` – ${formatTime(event.end)}` : ""} IST</p>}
        {venue && <p className="mt-3 break-words text-[17px]">{venue}</p>}
        {map && <a href={map} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex min-h-tap items-center rounded-xl bg-tile px-4 text-[17px] font-semibold text-navy">Open map</a>}
        {event.guest && <p className="mt-4 text-[17px]">Guest: {event.guest}</p>}
        {event.tags.length > 0 && <ul className="mt-4 flex flex-wrap gap-2" aria-label="Event tags">{event.tags.map((tag, index) => <li key={index} className="rounded-full border border-white/30 px-3 py-1 text-[16px]">{tag}</li>)}</ul>}
        {event.description && <section className="mt-6"><h3 className="mb-3 text-xl font-semibold">About the programme</h3><div className="event-description break-words whitespace-pre-line font-kannada text-[18px] leading-relaxed [&_a]:underline [&_li]:ml-5 [&_ol]:list-decimal [&_ul]:list-disc" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(event.description, { ALLOWED_TAGS: ["p", "br", "strong", "b", "em", "i", "ul", "ol", "li", "a"], ALLOWED_ATTR: ["href"] }) }} /></section>}
        {event.activities.length > 0 && <section className="mt-6"><h3 className="text-xl font-semibold">Programme schedule</h3><p className="mt-1 text-[16px] text-white/80">All times in IST</p><ol className="mt-3 divide-y divide-white/20 rounded-2xl border border-white/20 px-4">{event.activities.map((item, index) => <li key={index} className="py-4">{item.time && <p className="text-[17px] font-semibold text-tile">{item.time}</p>}<p className="mt-1 font-kannada text-[18px]">{item.activity}</p>{item.venue && <p className="mt-1 break-words text-[16px] text-white/80">{item.venue}</p>}</li>)}</ol></section>}
        {event.type === "recurring" && !event.activities.length && <p className="mt-4 text-[16px] text-white/80">Please contact the trust to confirm the time.</p>}
        {photos.length > 0 && <section className="mt-6"><h3 className="text-xl font-semibold">Photos</h3><div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">{photos.map((url, index) => <button type="button" key={url} onClick={(click) => setPhoto({ index, trigger: click.currentTarget })} aria-label={`Open photo ${index + 1}`} className="overflow-hidden rounded-xl border border-white/20"><img src={url} alt={`${event.title}, photo ${index + 1}`} loading="lazy" className="aspect-square w-full object-cover" /></button>)}</div></section>}
        {videos.length > 0 && <section className="mt-6"><h3 className="text-xl font-semibold">Videos</h3><ul className="mt-3 space-y-2">{videos.map((url, index) => <li key={url}><a href={url} target="_blank" rel="noopener noreferrer" className="flex min-h-tap items-center rounded-xl border border-white/30 px-4 text-[17px] underline">Watch video {index + 1} ↗</a></li>)}</ul></section>}
        <p className="mt-6 text-[16px] text-white/80">{event.interestedCount} interested</p><Link to="/contact" className="mt-4 inline-flex min-h-tap items-center rounded-xl border border-white/40 px-4 text-[17px]">Contact the trust</Link>
        {photo != null && <PhotoViewer key={id} photos={photos} initial={photo.index} title={event.title} restoreFocus={photo.trigger} onClose={() => setPhoto(null)} />}
      </>}
    </Page>
  );
}
