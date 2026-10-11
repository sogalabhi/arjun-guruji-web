import Page from "../../layout/Page";
import UsageChoice from "../../analytics/UsageChoice";

// What the website stores and counts, in plain words.
export default function PrivacyPage() {
  return (
    <Page title="Privacy" maxWidth="max-w-2xl">
      <div className="space-y-4 text-[17px] leading-relaxed">
        <section className="rounded-2xl bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold">Usage statistics</h2>
          <p className="mt-2">
            If you allow it, we use Google Analytics (part of Firebase) to count visits: which pages are opened, what is searched,
            and general details such as city, device and browser. This helps us see what devotees use and improve the site.
          </p>
          <p className="mt-2">
            It sets cookies in your browser. We don&apos;t collect your name, phone number or email, we don&apos;t use the data for
            advertising, and we don&apos;t sell it. Nothing is counted unless you choose Allow.
          </p>
          <UsageChoice />
        </section>

        <section className="rounded-2xl bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold">Stored on your device</h2>
          <p className="mt-2">
            Your reading settings, Panchang city, reading position and this choice are saved only in your browser. They are not sent to us.
          </p>
        </section>

        <section className="rounded-2xl bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold">Contact</h2>
          <p className="mt-2">
            Questions about privacy:{" "}
            <a href="mailto:abhijithsogal@gmail.com" className="font-semibold text-navy underline">abhijithsogal@gmail.com</a>
          </p>
        </section>
      </div>
    </Page>
  );
}
