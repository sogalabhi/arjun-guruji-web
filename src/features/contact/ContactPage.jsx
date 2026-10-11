import Page from "../../layout/Page";
import Icon from "../../components/ui/Icon";
import { contactInfo as info } from "./contactInfo";

function ExternalLink({ href, className = "", children, ...rest }) {
  return <a href={href} target="_blank" rel="noopener noreferrer" className={className} {...rest}>{children}</a>;
}

// Large round icon buttons; each has an aria-label naming the action.
const actionButton = "flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-lg transition-transform active:scale-95";

function PhoneLogo() {
  return <svg width="44" height="44" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="12" fill="#010036" /><path fill="#FFD146" d="M9.2 6.5 10.5 9c.2.4.1.8-.2 1.1l-.9.8a8 8 0 0 0 3.7 3.7l.8-.9c.3-.3.7-.4 1.1-.2l2.5 1.3c.4.2.6.6.5 1l-.3 1.5c-.1.5-.5.8-1 .8C10.6 18 6 13.4 6 7.3c0-.5.3-.9.8-1l1.5-.3c.4-.1.8.1.9.5Z" /></svg>;
}

function WhatsAppLogo() {
  return <svg width="48" height="48" viewBox="0 0 32 32" aria-hidden="true"><path fill="#25D366" d="M16 2.7A13.2 13.2 0 0 0 4.6 22.6L2.7 29.3l6.9-1.8A13.2 13.2 0 1 0 16 2.7Z" /><path fill="#fff" d="M12.3 9.4c-.3-.6-.6-.6-.8-.6h-.7c-.3 0-.7.1-1 .5-.4.4-1.3 1.3-1.3 3.1s1.3 3.6 1.5 3.9c.2.2 2.6 4.1 6.4 5.6 3.2 1.2 3.8 1 4.5.9.7-.1 2.2-.9 2.5-1.8.3-.9.3-1.6.2-1.8-.1-.2-.3-.3-.7-.5l-2.5-1.2c-.3-.1-.6-.2-.8.2-.2.4-.9 1.2-1.1 1.4-.2.2-.4.3-.8.1-.4-.2-1.6-.6-3-1.9-1.1-1-1.9-2.2-2.1-2.6-.2-.4 0-.6.2-.8l.6-.7c.2-.2.2-.4.4-.7.1-.3 0-.5 0-.7l-1.4-3.3Z" /></svg>;
}

function MapsLogo() {
  return <svg width="40" height="48" viewBox="0 0 20 24" aria-hidden="true"><path fill="#EA4335" d="M10 0a8 8 0 0 0-6.9 12L10 24l6.9-12A8 8 0 0 0 10 0Z" /><path fill="#4285F4" d="M16.9 12A8 8 0 0 0 15.7 4.4L10 10.2V24l6.9-12Z" /><path fill="#FBBC04" d="M3.1 12 10 24V10.2L4.3 4.4A8 8 0 0 0 3.1 12Z" /><path fill="#34A853" d="M10 24 7 18.8l3-8.6 3 8.6L10 24Z" opacity=".9" /><circle cx="10" cy="8" r="3" fill="#fff" /></svg>;
}

export default function ContactPage() {
  return (
    <Page title="Contact" variant="gradient" maxWidth="max-w-2xl">
      <div className="mb-6 flex items-center gap-4 py-2">
        <img src="/images/trust-logo.png" alt="" width="88" height="88" className="h-20 w-20 shrink-0 rounded-full bg-white object-contain p-1" />
        <div><h2 className="text-xl font-semibold">SNSDS Trust</h2><p className="mt-1 text-[16px] text-white/80">Stay connected with Guruji.</p></div>
      </div>
      <section aria-labelledby="contact-actions">
        <h2 id="contact-actions" className="text-lg font-semibold">Tap to contact</h2>
        <p className="mt-1 text-[16px] text-white/80">Call · WhatsApp · Directions to Gurunivasa</p>
        <div className="mt-4 flex items-start justify-around gap-3">
          <a href={info.phoneUrl} aria-label={`Call ${info.phone}`} className={actionButton}><PhoneLogo /></a>
          <ExternalLink href={info.whatsapp} aria-label="WhatsApp channel" className={actionButton}><WhatsAppLogo /></ExternalLink>
          <ExternalLink href={info.locations[0].mapUrl} aria-label={`Directions to ${info.locations[0].title} in Google Maps`} className={actionButton}><MapsLogo /></ExternalLink>
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
