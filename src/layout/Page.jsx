import { useEffect } from "react";
import AppBar from "./AppBar";

// Standard screen: app bar + content column that clears the notch and home indicator.
// variant="gradient" matches the app's GradientBackground list screens.
export default function Page({ title, docTitle, back = true, backTo = "/", actions, variant = "plain", maxWidth = "max-w-5xl", className = "", children }) {
  useEffect(() => {
    const name = docTitle ?? title;
    document.title = name && name !== "Arjun Guruji" ? `${name} · Arjun Guruji` : "Arjun Guruji";
  }, [title, docTitle]);

  return (
    <div className={`flex min-h-[100dvh] flex-col ${variant === "gradient" ? "page-gradient bg-app-bar text-white" : ""}`}>
      <AppBar title={title} back={back} backTo={backTo} actions={actions} />
      <main
        className={`mx-auto w-full ${maxWidth} flex-1 pl-[max(16px,env(safe-area-inset-left))] pr-[max(16px,env(safe-area-inset-right))] pb-[calc(24px+env(safe-area-inset-bottom))] pt-4 ${className}`}
      >
        {children}
      </main>
    </div>
  );
}
