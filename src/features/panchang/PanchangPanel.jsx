import { dateKey, formatPeriod, formatTime } from "../../data/dates";
import { ErrorState, SkeletonList } from "../../components/ui/States";
import { usePanchang } from "./usePanchang";

export default function PanchangPanel({ date, city }) {
  const { info, error, reload } = usePanchang(date, city);
  if (error) return <ErrorState message={error.message} onRetry={reload} />;
  if (!info) return <SkeletonList rows={4} />;
  const fields = [
    ["Lunar month", info.lunarMonth], ["Sunrise", formatTime(info.sunrise)], ["Sunset", formatTime(info.sunset)],
    ["Rahu Kaala", formatPeriod(info.rahuStart, info.rahuEnd)], ["Yamaganda", formatPeriod(info.yamagandaStart, info.yamagandaEnd)], ["Gulika Kaala", formatPeriod(info.gulikaStart, info.gulikaEnd)],
  ];
  return (
    <div className="rounded-2xl border border-white/20 bg-white/10 p-4 sm:p-5">
      <h3 className="text-[16px] text-white/80">Tithi at sunrise</h3>
      <p className="mt-1 text-xl font-semibold text-tile">{info.paksha} {info.tithiName}</p>
      <p className="mt-2 text-[16px] text-white/80">{city} · All times in IST</p>
      <dl className="mt-4 divide-y divide-white/20">
        {fields.map(([label, value]) => <div key={label} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-3"><dt className="text-[16px] text-white/80">{label}</dt><dd className="text-[17px] font-semibold">{value}</dd></div>)}
      </dl>
      {info.segments.length > 0 && <div className="mt-3 border-t border-white/20 pt-4"><h3 className="text-lg font-semibold">Tithi during the day</h3><ul className="mt-3 space-y-3">{info.segments.map((segment, index) => <li key={index} className="text-[16px]"><span className="block font-semibold">{segment.paksha} {segment.tithiName}</span><span className="text-white/85">{formatPeriod(segment.start, segment.end)}{dateKey(segment.end) !== date ? " (next day)" : ""}</span></li>)}</ul></div>}
    </div>
  );
}
