import Page from "../../layout/Page";
import Icon from "../../components/ui/Icon";
import { contactInfo as info } from "./contactInfo";

function ExternalLink({ href, className = "", children }) {
  return <a href={href} target="_blank" rel="noopener noreferrer" className={className}>{children}</a>;
}

export default function ContactPage() {
  return (
    <Page title="Contact" variant="gradient" maxWidth="max-w-2xl">
      <div className="mb-6 flex items-center gap-4 py-2">
        <img src="/images/trust-logo.png" alt="" width="88" height="88" className="h-20 w-20 shrink-0 rounded-full bg-white object-contain p-1" />
        <div><h2 className="text-xl font-semibold">SNSDS Trust</h2><p className="mt-1 text-[16px] text-white/80">Stay connected with Guruji.</p></div>
      </div>
      <section aria-labelledby="contact-actions">
        <h2 id="contact-actions" className="mb-3 text-lg font-semibold">Call, connect, or visit</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <a href={info.phoneUrl} className="flex min-h-[76px] items-center gap-3 rounded-2xl bg-tile p-4 text-navy shadow-md active:opacity-90"><Icon name="phone" className="shrink-0" /><span><span className="block text-[18px] font-semibold">Call us</span><span className="block text-[16px]">{info.phone}</span></span></a>
          <ExternalLink href={info.whatsapp} className="flex min-h-[76px] items-center gap-3 rounded-2xl bg-tile p-4 text-navy shadow-md active:opacity-90"><Icon name="chat" className="shrink-0" /><span><span className="block text-[18px] font-semibold">WhatsApp</span><span className="block text-[16px]">Follow our channel</span></span></ExternalLink>
          <a href="#locations" className="flex min-h-[76px] items-center gap-3 rounded-2xl bg-tile p-4 text-navy shadow-md active:opacity-90"><Icon name="pin" className="shrink-0" /><span><span className="block text-[18px] font-semibold">Directions</span><span className="block text-[16px]">Choose a location</span></span></a>
        </div>
      </section>
      <section id="locations" aria-labelledby="locations-heading" className="mt-7 scroll-mt-24">
        <h2 id="locations-heading" className="mb-3 text-lg font-semibold">Visit us</h2>
        <div className="space-y-3">
          {info.locations.map((place) => (
            <article key={place.title} className="rounded-2xl border border-white/20 bg-white/10 p-4 sm:p-5">
              <h3 className="flex items-start gap-2 text-[18px] font-semibold"><Icon name="pin" size={22} className="mt-0.5 shrink-0 text-tile" />{place.title}</h3>
              <address className="mt-3 font-kannada text-[17px] not-italic leading-relaxed text-white/90">{place.address}</address>
              {place.directions && <p lang="kn" className="mt-3 font-kannada text-[17px] leading-relaxed text-white/90">{place.directions}</p>}
              <ExternalLink href={place.mapUrl} className="mt-4 inline-flex min-h-tap items-center gap-2 rounded-xl bg-tile px-4 py-2 text-[16px] font-semibold text-navy active:opacity-90">Open in Maps<Icon name="external" size={18} /></ExternalLink>
            </article>
          ))}
        </div>
        <div className="mt-3 rounded-2xl border border-white/20 bg-white/10 p-4 sm:p-5">
          <h3 className="flex items-center gap-2 text-[18px] font-semibold"><Icon name="bus" size={22} className="text-tile" />Bus to the Ashrama</h3>
          <p lang="kn" className="mt-3 font-kannada text-[17px] leading-relaxed text-white/90">ಸಾರಿಗೆ ಸೌಕರ್ಯ ಮಾಹಿತಿ: ಮೈಸೂರು ಬಸ್ ನಿಲ್ದಾಣದಿಂದ ಬನ್ನೂರು ಕಡೆಗೆ ತೆರಳುವ ಬಸ್ ನಂಬರ್: 308, 328, 405. ಇಳಿಯುವ ಸ್ಥಳ: ಬಿದರಹುಂಡಿ ಗೇಟ್.</p>
        </div>
      </section>
      <section aria-labelledby="social-heading" className="mt-7">
        <h2 id="social-heading" className="mb-3 text-lg font-semibold">Online</h2>
        <div className="overflow-hidden rounded-2xl border border-white/20 bg-white/10">
          {info.social.map((link) => (
            <ExternalLink key={link.title} href={link.url} className="flex min-h-[60px] items-center gap-3 border-b border-white/15 px-4 py-3 last:border-0 active:bg-white/10"><Icon name={link.icon} size={22} className="shrink-0 text-tile" /><span className="flex-1 text-[17px]">{link.title}</span><Icon name="external" size={18} className="shrink-0 text-white/70" /></ExternalLink>
          ))}
          <a href={`mailto:${info.email}`} className="flex min-h-[60px] items-start gap-3 border-t border-white/15 px-4 py-3 active:bg-white/10"><Icon name="mail" size={22} className="mt-1 shrink-0 text-tile" /><span className="min-w-0 flex-1"><span className="block text-[17px]">Email us</span><span className="block break-words text-[16px] text-white/80">{info.email}</span></span></a>
        </div>
      </section>
    </Page>
  );
}
