import { useState } from "react";
import { dateKey, dateMillis } from "../../data/dates";
import { MONTHS, WEEKDAYS, translateName } from "../../data/panchangKannada";
import { panchangDuration, panchangTime } from "../../data/panchangFormatting";
import { ErrorState, SkeletonList } from "../../components/ui/States";
import { usePanchang } from "./usePanchang";

function FieldCard({ title, fields }) {
  return <section className="rounded-2xl border border-white/20 bg-white/10 p-4 sm:p-5"><h3 className="text-xl font-semibold text-tile">{title}</h3><dl className="mt-3 divide-y divide-white/20">{fields.map(([label, value]) => <div key={label} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 py-3"><dt className="text-[16px] text-white/80">{label}</dt><dd className="max-w-full text-[17px] font-semibold [overflow-wrap:anywhere]">{value}</dd></div>)}</dl></section>;
}

export default function PanchangDetails({ date, city }) {
  const [language, setLanguage] = useState("kn");
  const [extended, setExtended] = useState(true);
  const { info, error, reload } = usePanchang(date, city, true);
  if (error) return <ErrorState message={error.message} onRetry={reload} />;
  if (!info?.details) return <SkeletonList rows={8} />;
  const d = info.details;
  const text = (kn, en) => language === "kn" ? kn : en;
  const name = (value, kind) => translateName(value, language, kind);
  const time = (value) => panchangTime(value, date, extended, language);
  const period = (start, end) => `${time(start)} – ${time(end)}`;
  const until = (value, end, kind) => <><span className="block">{name(value, kind)}</span><span className="mt-1 block text-[15px] font-normal text-white/85">{end == null ? text("ಅಂತ್ಯ ಸಮಯ ಲಭ್ಯವಿಲ್ಲ", "End time unavailable") : `${time(end)} ${text("ವರೆಗೆ", "until")}`}</span></>;
  const weekday = language === "kn" ? WEEKDAYS[d.weekday] : ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][d.weekday];
  const month = language === "kn" ? MONTHS[d.month - 1] : new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", month: "long" }).format(dateMillis(date));
  const moonTime = (event, civilEvent) => <><span className="block">{time(event)}</span>{civilEvent == null && <span className="mt-1 block text-[15px] font-normal text-white/85">{text("ಆಯ್ದ ದಿನದಲ್ಲಿ ಈ ಘಟನೆ ಇಲ್ಲ", "No event on the selected civil day")}</span>}</>;
  const cards = [
    [text("ದಿನ ಮತ್ತು ಸಂವತ್ಸರ", "Date and calendar"), [
      [text("ದಿನಾಂಕ", "Date"), `${d.day} ${month} ${d.year}`], [text("ತಿಂಗಳು", "Gregorian month"), month],
      [text("ವಾರ", "Weekday"), weekday], [text("ಬಣ್ಣ", "Weekday colour"), name(d.colour)],
      [text("ಗತಶಾಲಿವಾಹನ ಶಕ", "Elapsed Shalivahana / Shaka year"), d.shaka], [text("ಗತಕಲಿ", "Elapsed Kali year"), d.kali],
      [text("ಸಂವತ್ಸರ", "Samvatsara"), name(d.samvatsara)],
      [text("ಆಯನ (ವೈದಿಕ)", "Ayana (Vedic / sidereal)"), name(d.ayana)], [text("ಆಯನ (ದೃಕ್)", "Ayana (Drik / tropical)"), name(d.drikAyana)],
      [text("ಋತು (ಚಾಂದ್ರಮಾನ)", "Ritu (lunar)"), name(d.ritu)], [text("ಋತು (ದೃಕ್)", "Ritu (solar / Drik)"), name(d.drikRitu)],
    ]],
    [text("ಸೂರ್ಯೋದಯದ ಪಂಚಾಂಗ", "Panchanga at sunrise"), [
      [text("ಪಕ್ಷ", "Paksha"), name(info.paksha)],
      [text("ಹಿಂದೂ ತಿಂಗಳು (ಅಮಾಂತ)", "Lunar month (Amanta)"), `${d.isAdhika ? text("ಅಧಿಕ ", "Adhika ") : ""}${name(info.lunarMonth)}`],
      [text("ತಿಥಿ", "Tithi"), until(info.tithiName, d.tithiEnd, "tithi")], [text("ನಕ್ಷತ್ರ", "Nakshatra"), until(d.nakshatraName, d.nakshatraEnd, "nakshatra")],
      [text("ಯೋಗ", "Yoga"), until(d.yogaName, d.yogaEnd)],
      [text("ಕರಣ", "Karana"), until(d.karanas[0]?.name ?? "—", d.karanas[0]?.endsWithinDay ? d.karanas[0].end : null)],
      [text("ಚಂದ್ರ ರಾಶಿ", "Moon Rashi"), name(d.moonRashi)], [text("ಸೂರ್ಯ ರಾಶಿ", "Sun Rashi"), name(d.sunRashi)],
    ]],
    [text("ಸೂರ್ಯ ಮತ್ತು ಚಂದ್ರ", "Sun and Moon"), [
      [text("ಸೂರ್ಯೋದಯ", "Sunrise"), time(info.sunrise)], [text("ಸೂರ್ಯಾಸ್ತ", "Sunset"), time(info.sunset)],
      [text("ಹಗಲಿನ ಅವಧಿ", "Day duration"), panchangDuration(d.dayDuration, language)], [text("ರಾತ್ರಿಯ ಅವಧಿ", "Night duration"), panchangDuration(d.nightDuration, language)],
      [text("ಮರುದಿನದ ಸೂರ್ಯೋದಯ", "Next sunrise"), time(d.nextSunrise)],
      [text("ಚಂದ್ರೋದಯ", "Moonrise"), moonTime(d.moonrise, d.civilMoonrise)], [text("ಚಂದ್ರಾಸ್ತ", "Moonset"), moonTime(d.moonset, d.civilMoonset)],
    ]],
    [text("ಕಾಲ ಮತ್ತು ಮುಹೂರ್ತ", "Kaala and Muhurta"), [
      [text("ರಾಹು ಕಾಲ", "Rahu Kaala"), period(info.rahuStart, info.rahuEnd)], [text("ಯಮಗಂಡ", "Yamaganda"), period(info.yamagandaStart, info.yamagandaEnd)],
      [text("ಗುಳಿಕ ಕಾಲ", "Gulika Kaala"), period(info.gulikaStart, info.gulikaEnd)],
      [text("ಅಭಿಜಿತ್ ಮುಹೂರ್ತ", "Abhijit Muhurta"), d.abhijit ? period(d.abhijit.start, d.abhijit.end) : text("ಬುಧವಾರ ಅನ್ವಯಿಸುವುದಿಲ್ಲ", "Not observed on Wednesdays")],
      [text("ದುರ್ಮುಹೂರ್ತ", "Dur Muhurta"), <ul key="dur-muhurtas" className="space-y-2">{d.durMuhurtas.map((window, index) => <li key={index}>{period(window.start, window.end)}</li>)}</ul>],
    ]],
  ];
  const transitions = [[text("ತಿಥಿ ಬದಲಾವಣೆಗಳು", "Tithi transitions"), d.tithis, "tithi"], [text("ನಕ್ಷತ್ರ ಬದಲಾವಣೆಗಳು", "Nakshatra transitions"), d.nakshatras, "nakshatra"], [text("ಯೋಗ ಬದಲಾವಣೆಗಳು", "Yoga transitions"), d.yogas, "yoga"], [text("ಎಲ್ಲ ಕರಣಗಳು", "All Karanas"), d.karanas, "karana"]];
  return <div lang={language} className="space-y-5">
    <div className="flex flex-wrap items-end gap-3">
      <label className="min-w-0 flex-1 text-[16px]">{text("ಭಾಷೆ", "Language")}<select aria-label="Language" value={language} onChange={(event) => setLanguage(event.target.value)} className="mt-2 block min-h-tap w-full rounded-xl bg-white px-3 py-2 text-ink"><option value="kn">ಕನ್ನಡ</option><option value="en">English</option></select></label>
      <label className="min-w-0 flex-1 text-[16px]">{text("ಸಮಯದ ರೂಪ", "Time format")}<select aria-label="Time format" value={extended ? "extended" : "clock"} onChange={(event) => setExtended(event.target.value === "extended")} className="mt-2 block min-h-tap w-full rounded-xl bg-white px-3 py-2 text-ink"><option value="extended">{text("ಪಂಚಾಂಗ (24+)", "Panchanga (24+)")}</option><option value="clock">{text("ಗಡಿಯಾರ (24 ಗಂಟೆ)", "Clock (24 hours)")}</option></select></label>
    </div>
    <div className="rounded-2xl bg-tile p-4 text-navy sm:p-5">
      <h2 className="text-2xl font-semibold">{name(info.paksha)} {name(info.tithiName)}</h2>
      <p className="mt-2 text-[16px]">{city} · {text("ಅಮಾಂತ ಪಂಚಾಂಗ · ಭಾರತೀಯ ಸಮಯ (IST)", "Amanta Panchanga · All times in IST")}</p>
      <p className="mt-2 text-[15px]">{text("ಸೂರ್ಯೋದಯದ ಅಂಶಗಳು; ಕೆಳಗೆ ದಿನದ ಎಲ್ಲಾ ಬದಲಾವಣೆಗಳು.", "Values at sunrise; all changes during the Panchanga day are listed below.")}</p>
    </div>
    <div className="grid items-start gap-4 md:grid-cols-2">{cards.map(([title, fields]) => <FieldCard key={title} title={title} fields={fields} />)}</div>
    <div>
      <h2 className="text-xl font-semibold">{text("ಸೂರ್ಯೋದಯದಿಂದ ಮುಂದಿನ ಸೂರ್ಯೋದಯದವರೆಗೆ", "From sunrise to next sunrise")}</h2>
      <div className="mt-4 grid items-start gap-4 md:grid-cols-2">{transitions.map(([title, values, kind]) => <section key={title} className="rounded-2xl border border-white/20 bg-white/10 p-4 sm:p-5"><h3 className="text-xl font-semibold text-tile">{title}</h3><ol className="mt-3 divide-y divide-white/20">{values.map((value, index) => <li key={index} className="py-3 text-[16px]"><p className="font-semibold">{kind === "tithi" ? `${name(value.index < 15 ? "Shukla" : "Krishna")} ` : ""}{name(value.name, kind)}</p><p className="mt-2 text-white/85">{period(value.start, value.end)}</p>{!value.endsWithinDay && <p className="mt-1 text-[15px] text-white/75">{text("ಮುಂದಿನ ಸೂರ್ಯೋದಯದವರೆಗೆ ಮುಂದುವರಿಯುತ್ತದೆ", "Continues through next sunrise")}</p>}</li>)}</ol></section>)}</div>
    </div>
    <details className="rounded-2xl border border-white/20 bg-white/10 p-4 sm:p-5"><summary className="min-h-tap cursor-pointer py-2 text-[17px] font-semibold">{text("ಸಮಯ ಮತ್ತು ಪಂಚಾಂಗ ಪದ್ಧತಿ", "About these timings")}</summary><div className="mt-3 space-y-3 text-[16px] leading-relaxed text-white/85">
      <p>{text("ಎಲ್ಲ ಸಮಯಗಳು IST. 30:29:03 ಎಂದರೆ ಮರುದಿನ ಬೆಳಿಗ್ಗೆ 06:29:03. ಗಡಿಯಾರ ರೂಪವನ್ನು ಆರಿಸಿದರೂ ಮರುದಿನದ ಸೂಚನೆ ಉಳಿಯುತ್ತದೆ.", "All times use IST. 30:29:03 means 06:29:03 the following morning. Clock format retains the next-day label.")}</p>
      <p>{text("ಚಂದ್ರೋದಯ ಮತ್ತು ಚಂದ್ರಾಸ್ತವು ಆಯ್ದ ದಿನದ ಸೂರ್ಯೋದಯದ ನಂತರದ ಮೊದಲ ಘಟನೆಗಳು. ಸೂರ್ಯೋದಯಕ್ಕೂ ಮುನ್ನದ ಘಟನೆ ಹಿಂದಿನ ಪಂಚಾಂಗ ದಿನಕ್ಕೆ ಸೇರಿದೆ.", "Moonrise and moonset are the first events after the selected sunrise. An event before sunrise belongs to the preceding Panchanga day.")}</p>
      <p>{text("ಚಾಂದ್ರಮಾನ ಋತು ಮತ್ತು ಶಕ/ಕಲಿ ವರ್ಷಗಳು ಅಮಾಂತ ತಿಂಗಳನ್ನು ಅನುಸರಿಸುತ್ತವೆ. ವೈದಿಕ ಆಯನವು ನಿರಯಣ ಸೂರ್ಯನನ್ನು, ದೃಕ್ ಆಯನ ಮತ್ತು ಋತು ಸಾಯನ ಸೂರ್ಯನನ್ನು ಅನುಸರಿಸುತ್ತವೆ. ವಾರದ ಬಣ್ಣವು ಸಾಂಪ್ರದಾಯಿಕ ಸೂಚನೆ.", "Lunar seasons and elapsed Shaka/Kali years follow Amanta months. Vedic Ayana uses the sidereal Sun; Drik Ayana and seasons use the tropical Sun. Weekday colours are a traditional association.")}</p>
      <p>{text("ಸ್ಥಳ", "Location")}: {d.latitude}° N, {d.longitude}° E · {text("ಲೆಕ್ಕಾಚಾರದ ಎತ್ತರ", "Calculation elevation")}: {d.elevation} m. {text("ಸ್ಥಳ ಮತ್ತು ಪಂಚಾಂಗ ಪದ್ಧತಿಯಿಂದ ಪ್ರಕಟಿತ ಸಮಯಗಳಲ್ಲಿ ಸ್ವಲ್ಪ ವ್ಯತ್ಯಾಸ ಇರಬಹುದು.", "Location and calendar conventions can cause small differences from published almanacs.")}</p>
      <p>{text("ಆಯ್ದ ದಿನ", "Selected civil day")}: {dateKey(dateMillis(date))}. {text("ಕರಣಗಳ ಅಂತಿಮ ಸಾಲು ಮುಂದಿನ ಸೂರ್ಯೋದಯದಲ್ಲಿ ಮುಗಿಯುವ ಪ್ರದರ್ಶನ ಅವಧಿ; ಅದು ಕರಣದ ನಿಜವಾದ ಅಂತ್ಯವಲ್ಲ.", "The final transition row is clipped at next sunrise; that boundary is not the element’s actual end time.")}</p>
    </div></details>
  </div>;
}
