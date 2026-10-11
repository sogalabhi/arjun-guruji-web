import { useEffect } from "react";
import AppBar from "./AppBar";

// Standard screen: app bar + content column that clears the notch and home indicator.
// variant="gradient" matches the app's GradientBackground list screens.
// variant="overlay" is white text with no background of its own, for screens that draw one (the audio player).
// fit: in portrait the screen is exactly one viewport tall and <main> is a flex column,
// so the page itself doesn't scroll (.page-fit in index.css).
export default function Page({ title, docTitle, back = true, backTo = "/", actions, variant = "plain", maxWidth = "max-w-5xl", fit = false, className = "", children }) {
  useEffect(() => {
    const name = docTitle ?? title;
    document.title = name && name !== "Arjun Guruji" ? `${name} · Arjun Guruji` : "Arjun Guruji";
  }, [title, docTitle]);

  return (
    <div className={`flex min-h-[100dvh] flex-col ${fit ? "page-fit" : ""} ${variant === "gradient" ? "page-gradient bg-app-bar text-white" : variant === "overlay" ? "page-gradient text-white" : ""}`}>
      <AppBar title={title} back={back} backTo={backTo} actions={actions} />
      <main
        className={`mx-auto w-full ${maxWidth} flex-1 pl-[max(16px,env(safe-area-inset-left))] pr-[max(16px,env(safe-area-inset-right))] page-pad-b pt-4 ${className}`}
      >
        {children}
      </main>
    </div>
  );
}
