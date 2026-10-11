import { useEffect, useRef, useState } from "react";

export default function PhotoViewer({ photos, initial, title, onClose, restoreFocus }) {
  const [index, setIndex] = useState(initial);
  const dialog = useRef(null);
  useEffect(() => {
    const node = dialog.current;
    node.showModal();
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { node.close(); document.body.style.overflow = oldOverflow; restoreFocus?.focus(); };
  }, [restoreFocus]);
  return (
    <dialog ref={dialog} onCancel={(event) => { event.preventDefault(); onClose(); }} onKeyDown={(event) => { if (event.key === "ArrowRight") setIndex((i) => (i + 1) % photos.length); if (event.key === "ArrowLeft") setIndex((i) => (i - 1 + photos.length) % photos.length); }} aria-label={`${title} photos`} className="fixed inset-0 m-0 h-[100dvh] max-h-none w-screen max-w-none bg-navy p-[max(16px,env(safe-area-inset-top))] text-white backdrop:bg-black/90">
      <div className="flex h-full flex-col"><div className="flex shrink-0 items-center justify-between gap-3"><p aria-live="polite" className="text-[17px]">Photo {index + 1} of {photos.length}</p><button autoFocus type="button" onClick={onClose} className="min-h-tap rounded-xl bg-white/15 px-5 text-[17px]">Close</button></div><div className="my-4 flex min-h-0 flex-1 items-center justify-center"><img src={photos[index]} alt={`${title}, photo ${index + 1}`} className="max-h-full max-w-full object-contain" /></div>{photos.length > 1 && <div className="flex shrink-0 justify-center gap-4 pb-[env(safe-area-inset-bottom)]"><button onClick={() => setIndex((i) => (i - 1 + photos.length) % photos.length)} className="min-h-tap rounded-xl bg-white/15 px-5 text-[17px]">Previous</button><button onClick={() => setIndex((i) => (i + 1) % photos.length)} className="min-h-tap rounded-xl bg-white/15 px-5 text-[17px]">Next</button></div>}</div>
    </dialog>
  );
}
