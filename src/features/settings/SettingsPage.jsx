import Page from "../../layout/Page";
import { FONT_STEPS, stepIndex, useReaderSettings } from "../../reader/settings";
import "../../reader/reader.css";

// Reader settings, same options as the app's Settings → Appearance.
const THEME_OPTIONS = [
  { value: "light", label: "Light" },
  { value: "sepia", label: "Sepia" },
  { value: "dark", label: "Dark" },
];
const FONT_OPTIONS = [
  { value: "sans-serif", label: "Modern" },
  { value: "serif", label: "Classic" },
];

export default function SettingsPage() {
  const { settings, update } = useReaderSettings();
  const k = stepIndex(settings.fontSize);

  return (
    <Page title="Settings">
      <section className="rounded-2xl bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold">Reading</h2>

        <p className="mt-4 text-[15px] text-muted">Background</p>
        <Choice options={THEME_OPTIONS} value={settings.theme} onChange={(theme) => update({ theme })} />

        <p className="mt-5 text-[15px] text-muted">Font</p>
        <Choice options={FONT_OPTIONS} value={settings.fontStyle} onChange={(fontStyle) => update({ fontStyle })} />

        <div className="mt-5 flex items-center justify-between">
          <p className="text-[15px] text-muted">Text size</p>
          <p className="text-[15px]">
            {k + 1} of {FONT_STEPS.length}
          </p>
        </div>
        <div className="mt-2 flex items-center gap-3">
          <SizeButton label="Smaller text" disabled={k === 0} onClick={() => update({ fontSize: FONT_STEPS[k - 1] })}>
            A−
          </SizeButton>
          <input
            type="range"
            min={0}
            max={FONT_STEPS.length - 1}
            step={1}
            value={k}
            onChange={(e) => update({ fontSize: FONT_STEPS[Number(e.target.value)] })}
            aria-label="Text size"
            className="h-11 flex-1 accent-accent"
          />
          <SizeButton label="Larger text" disabled={k === FONT_STEPS.length - 1} onClick={() => update({ fontSize: FONT_STEPS[k + 1] })}>
            A+
          </SizeButton>
        </div>

        <div className="reader mt-5 min-h-0 rounded-xl border border-line p-4" data-theme={settings.theme}>
          <p
            className="text-center"
            style={{
              fontSize: settings.fontSize,
              lineHeight: 1.6,
              fontFamily: settings.fontStyle === "serif" ? "'Noto Serif Kannada', serif" : "'Noto Sans Kannada', sans-serif",
            }}
          >
            ಶ್ರೀ ಗುರುಭ್ಯೋ ನಮಃ
            <br />
            <span className="font-sans text-[0.8em]">Live preview of reading text.</span>
          </p>
        </div>
      </section>
    </Page>
  );
}

function Choice({ options, value, onChange }) {
  return (
    <div className="mt-2 grid gap-2" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }} role="radiogroup">
      {options.map((o) => {
        const selected = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(o.value)}
            className={`min-h-[48px] rounded-xl border text-[16px] ${selected ? "border-navy bg-navy text-white" : "border-line bg-paper"}`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function SizeButton({ label, disabled, onClick, children }) {
  return (
    <button type="button" aria-label={label} disabled={disabled} onClick={onClick} className="min-h-tap min-w-tap rounded-xl border border-line text-[17px] disabled:opacity-35">
      {children}
    </button>
  );
}
