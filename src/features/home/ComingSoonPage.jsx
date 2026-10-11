import { Link } from "react-router-dom";
import Page from "../../layout/Page";
import Icon from "../../components/ui/Icon";

export default function ComingSoonPage() {
  return (
    <Page title="Bhajans" variant="gradient" maxWidth="max-w-2xl">
      <div className="mx-auto max-w-md py-12 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/10 text-tile"><Icon name="music" size={36} /></div>
        <h2 className="mt-5 text-2xl font-semibold">Coming soon</h2>
        <p className="mt-3 text-[17px] leading-relaxed text-white/85">Bhajans will be available here soon. You can read the lyrics while we prepare the audio player.</p>
        <Link to="/lyrics" className="mt-6 inline-flex min-h-tap items-center gap-2 rounded-xl bg-tile px-5 py-3 text-[17px] font-semibold text-navy">Read lyrics<Icon name="arrow" size={18} /></Link>
        <Link to="/" className="mt-3 flex min-h-tap items-center justify-center rounded-lg text-[16px] underline underline-offset-4">Back to Home</Link>
      </div>
    </Page>
  );
}
