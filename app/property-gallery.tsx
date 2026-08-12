"use client";

import { useEffect, useRef, useState } from "react";
import type { Property } from "./data";

function CloseIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>;
}

function ChevronIcon({ direction }: { direction: "previous" | "next" }) {
  return <svg className={direction === "previous" ? "is-previous" : ""} viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7" /></svg>;
}

function ExpandIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4H4v5M15 4h5v5M9 20H4v-5M15 20h5v-5" /></svg>;
}

export function PropertyGallery({ property }: { property: Property }) {
  const [activeImage, setActiveImage] = useState<number | null>(null);
  const touchStart = useRef<number | null>(null);
  const total = property.gallery.length;

  const close = () => setActiveImage(null);
  const previous = () => setActiveImage((current) => current === null ? 0 : (current - 1 + total) % total);
  const next = () => setActiveImage((current) => current === null ? 0 : (current + 1) % total);

  useEffect(() => {
    if (activeImage === null) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") setActiveImage((current) => current === null ? 0 : (current - 1 + total) % total);
      if (event.key === "ArrowRight") setActiveImage((current) => current === null ? 0 : (current + 1) % total);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeImage, total]);

  function finishSwipe(clientX: number) {
    if (touchStart.current === null) return;
    const distance = clientX - touchStart.current;
    touchStart.current = null;
    if (Math.abs(distance) < 45) return;
    if (distance > 0) previous();
    else next();
  }

  return (
    <section className="property-gallery" aria-label={`${property.title} photo gallery`}>
      <div className="gallery-mosaic">
        {property.gallery.map((image, index) => (
          <button className={`gallery-tile gallery-tile-${index + 1}`} type="button" onClick={() => setActiveImage(index)} key={image} aria-label={`Open photo ${index + 1} of ${total}`}>
            <img src={image} alt={`${property.title} — photo ${index + 1}`} loading="lazy" />
          </button>
        ))}
        <button className="gallery-open-all" type="button" onClick={() => setActiveImage(0)}><ExpandIcon /> View all {total} photos</button>
      </div>

      {activeImage !== null && (
        <div className="gallery-viewer" role="dialog" aria-modal="true" aria-label={`${property.title} image viewer`}>
          <div className="gallery-viewer-header">
            <div><span>{property.ref}</span><strong>{property.title}</strong></div>
            <span className="gallery-counter">{String(activeImage + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
            <button type="button" onClick={close} aria-label="Close image viewer"><CloseIcon /></button>
          </div>
          <div
            className="gallery-stage"
            onTouchStart={(event) => { touchStart.current = event.changedTouches[0].clientX; }}
            onTouchEnd={(event) => finishSwipe(event.changedTouches[0].clientX)}
          >
            <button className="gallery-direction gallery-previous" type="button" onClick={previous} aria-label="Previous photo"><ChevronIcon direction="previous" /></button>
            <figure><img src={property.gallery[activeImage]} alt={`${property.title} — photo ${activeImage + 1} of ${total}`} /></figure>
            <button className="gallery-direction gallery-next" type="button" onClick={next} aria-label="Next photo"><ChevronIcon direction="next" /></button>
          </div>
          <div className="gallery-thumbnails" aria-label="Choose a photo">
            {property.gallery.map((image, index) => (
              <button className={index === activeImage ? "is-active" : ""} type="button" onClick={() => setActiveImage(index)} aria-label={`Show photo ${index + 1}`} aria-current={index === activeImage ? "true" : undefined} key={image}>
                <img src={image} alt="" />
              </button>
            ))}
          </div>
          <p className="gallery-swipe-note">Swipe or use the arrows to explore</p>
        </div>
      )}
    </section>
  );
}
