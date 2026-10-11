import { setConsent } from "./analytics";
import { useConsent } from "./useConsent";

// Lets the visitor change their analytics choice later (Settings and Privacy).
export default function UsageChoice() {
  const consent = useConsent();
  const options = [
    { value: "granted", label: "Allow" },
    { value: "denied", label: "Don't allow" },
  ];
  return (
    <div className="mt-3">
      <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Usage statistics">
        {options.map((o) => {
          const selected = consent === o.value;
          return (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => setConsent(o.value)}
              className={`min-h-tap rounded-xl border px-3 text-[16px] font-semibold ${selected ? "border-navy bg-navy text-white" : "border-black/25 bg-white text-ink active:bg-black/5"}`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-[15px] text-muted">
        {consent === "granted" ? "Visits are being counted." : consent === "denied" ? "Visits are not counted." : "You haven't chosen yet."}
      </p>
    </div>
  );
}
