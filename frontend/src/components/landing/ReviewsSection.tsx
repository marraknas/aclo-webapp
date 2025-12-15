import React, {
  useMemo,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { Link } from "react-router-dom";
import { assets, cloudinaryImageUrl } from "../../constants/cloudinary";
import { StarIcon } from "@heroicons/react/24/solid";
import type { ReviewSlide } from "../../types/carousels";

const ANIM_MS = 500;
const FAILSAFE_MS = ANIM_MS + 200;

const ReviewsSection: React.FC = () => {
  const baseSlides: ReviewSlide[] = useMemo(
    () => [
      {
        publicId: assets.reviews.stork.publicId,
        alt: assets.reviews.stork.alt,
        productLabel: "STORK Learning Tower",
        stars: 5,
        quote:
          "Abis beli sparrow nya, dan ternyata emang bagus! Udah lama research tentang learning tower, ketemu ACLO. Langsung beli lg stork nya. Beneran tipis tp ga keripik, berasa kuat. Warna snow nya juga bagus & netral.",
        author: "— S*****a",
        ctaTo: "/collections/all",
        ctaText: "Shop Now",
      },
      {
        publicId: assets.reviews.beak.publicId,
        alt: assets.reviews.beak.alt,
        productLabel: "BEAK — Wooden Cutting Board & Knife",
        stars: 5,
        quote:
          "Kualitas bagus, dan barang halus banget. Terasa premium nya, Jd langsung pengen learning tower nya juga kalo sehalus ini. Respon dan pengiriman jg cepet, mantap.",
        author: "— M***i",
        ctaTo: "/collections/all",
        ctaText: "Shop Now",
      },
      {
        publicId: assets.reviews.quill.publicId,
        alt: assets.reviews.quill.alt,
        productLabel: "QUILL — Premium Kid-sized Mini Kitchen Utensils",
        stars: 5,
        quote:
          "Akhirnya nemu juga set peralatan masak kaya gini yg beneran stainless steel & tahan panas. Ga mahal pulaa. Bahan super bagus dan premium!",
        author: "— s******",
        ctaTo: "/collections/all",
        ctaText: "Shop Now",
      },
      {
        publicId: assets.reviews.falcon.publicId,
        alt: assets.reviews.falcon.alt,
        productLabel: "FALCON Learning Tower",
        stars: 5,
        quote:
          "Barang kokoh, seller fast response. Packaging bagus. So far puas dengan barangnyaa, dipakai untuk sikat gigi dan main lempar bola sama anak saya usia 1 thn 😁",
        author: "— kalyanakalyana",
        ctaTo: "/collections/all",
        ctaText: "Shop Now",
      },
      {
        publicId: assets.reviews.sparrow.publicId,
        alt: assets.reviews.sparrow.alt,
        productLabel: "SPARROW Learning Tower",
        stars: 5,
        quote:
          "Kualitas barang premium. Sudah dipake berasa aman & kuat. Padahal sempet ragu beli yang krn perlu dirakit sendiri. Tp ternyata dirakitnya mudah sekali. Ada buku panduan yg jelas & dikasih kunci L nya juga. Admin juga ramah sekali",
        author: "— s*****a",
        ctaTo: "/collections/all",
        ctaText: "Shop Now",
      },
    ],
    []
  );

  const realCount = baseSlides.length;

  // clones: [last, ...real, first]
  const slides = useMemo(() => {
    if (!realCount) return [];
    return [baseSlides[realCount - 1], ...baseSlides, baseSlides[0]];
  }, [baseSlides, realCount]);

  // Start on first REAL slide
  const [index, setIndex] = useState(1);
  const [isAnimating, setIsAnimating] = useState(true);

  // Locking with failsafe
  const [locked, setLocked] = useState(false);
  const unlockTimerRef = useRef<number | null>(null);

  const lockForAnim = useCallback(() => {
    setLocked(true);

    if (unlockTimerRef.current) window.clearTimeout(unlockTimerRef.current);
    unlockTimerRef.current = window.setTimeout(() => {
      setLocked(false);
      unlockTimerRef.current = null;
    }, FAILSAFE_MS);
  }, []);

  const unlock = useCallback(() => {
    setLocked(false);
    if (unlockTimerRef.current) {
      window.clearTimeout(unlockTimerRef.current);
      unlockTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (unlockTimerRef.current) window.clearTimeout(unlockTimerRef.current);
    };
  }, []);

  // Drag state
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const startXRef = useRef(0);
  const pointerIdRef = useRef<number | null>(null);

  // Measure viewport width (px)
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [viewportW, setViewportW] = useState(0);

  useEffect(() => {
    if (!viewportRef.current) return;
    const el = viewportRef.current;

    const update = () => setViewportW(el.getBoundingClientRect().width);
    update();

    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const prev = useCallback(() => {
    if (locked) return;
    lockForAnim();
    setIsAnimating(true);
    setIndex((i) => i - 1);
  }, [locked, lockForAnim]);

  const next = useCallback(() => {
    if (locked) return;
    lockForAnim();
    setIsAnimating(true);
    setIndex((i) => i + 1);
  }, [locked, lockForAnim]);

  const onTransitionEnd = useCallback(
    (e: React.TransitionEvent<HTMLDivElement>) => {
      if (e.propertyName !== "transform") return;

      // We finished the visible transition
      unlock();

      // landed on clone? jump instantly to real
      if (index === 0) {
        setIsAnimating(false);
        setIndex(realCount);
        requestAnimationFrame(() =>
          requestAnimationFrame(() => setIsAnimating(true))
        );
      } else if (index === realCount + 1) {
        setIsAnimating(false);
        setIndex(1);
        requestAnimationFrame(() =>
          requestAnimationFrame(() => setIsAnimating(true))
        );
      }
    },
    [index, realCount, unlock]
  );

  // --- swipe / drag handlers ---
  const onPointerDown = (e: React.PointerEvent) => {
    if (locked) return;
    if (!viewportW) return;

    pointerIdRef.current = e.pointerId;
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);

    setIsDragging(true);
    setIsAnimating(false); // follow finger
    setDragOffset(0);
    startXRef.current = e.clientX;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    if (pointerIdRef.current !== e.pointerId) return;

    const delta = e.clientX - startXRef.current;
    setDragOffset(delta);
  };

  const endDrag = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      if (pointerIdRef.current !== e.pointerId) return;

      const target = e.currentTarget as HTMLDivElement;

      if (target.hasPointerCapture(e.pointerId)) {
        target.releasePointerCapture(e.pointerId);
      }

      const delta = dragOffset;

      setIsDragging(false);
      setDragOffset(0);

      const threshold = Math.max(40, viewportW * 0.12);

      setIsAnimating(true);

      // Only lock if we're actually going to change slide
      if (delta <= -threshold) {
        if (!locked) lockForAnim();
        setIndex((i) => i + 1);
      } else if (delta >= threshold) {
        if (!locked) lockForAnim();
        setIndex((i) => i - 1);
      } else {
        // snap back only — no lock (prevents "stuck" if transitionend is missed)
        unlock();
      }

      pointerIdRef.current = null;
    },
    [isDragging, dragOffset, viewportW, locked, lockForAnim, unlock]
  );

  const translateX = -index * viewportW + (isDragging ? dragOffset : 0);

  return (
    <section className="w-full bg-background">
      <div className="px-4 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-5xl py-12 sm:py-16">
          <div className="relative overflow-hidden rounded-2xl bg-[#EFE7DD]">
            <div
              ref={viewportRef}
              className="overflow-hidden"
              style={{ touchAction: "pan-y" }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
            >
              <div
                className={`flex ${
                  isDragging ? "cursor-grabbing" : "cursor-grab"
                }`}
                style={{
                  transform: `translate3d(${translateX}px, 0, 0)`,
                  transition: isAnimating
                    ? `transform ${ANIM_MS}ms ease-out`
                    : "none",
                }}
                onTransitionEnd={onTransitionEnd}
              >
                {slides.map((s, i) => {
                  const url = cloudinaryImageUrl(s.publicId);
                  return (
                    <div key={`${s.publicId}-${i}`} className="w-full shrink-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 p-5 sm:p-6 md:p-7 items-center">
                        <div className="flex justify-center">
                          <img
                            src={url}
                            alt={s.alt}
                            className="w-55 sm:w-62.5 md:w-67.5 aspect-3/4 object-cover rounded-[26px]"
                            loading="lazy"
                            draggable={false}
                          />
                        </div>

                        <div className="text-center px-6 sm:px-10 md:px-12">
                          <div className="text-acloblue font-semibold text-lg sm:text-xl">
                            {s.productLabel}
                          </div>

                          <div className="mt-2 flex justify-center gap-1 text-acloblue">
                            {Array.from({ length: s.stars }).map((_, si) => (
                              <StarIcon key={si} className="h-5 w-5" />
                            ))}
                          </div>

                          <p className="mt-4 text-ink/80 leading-relaxed text-sm sm:text-base">
                            “{s.quote}”
                          </p>

                          <p className="mt-4 text-ink/60 text-sm sm:text-base">
                            {s.author}
                          </p>

                          <div className="mt-5 flex justify-center">
                            <Link
                              to={s.ctaTo}
                              className="inline-flex items-center justify-center bg-acloblue text-white font-light rounded-full text-sm sm:text-base px-6 py-2.5"
                            >
                              {s.ctaText ?? "Shop Now"}
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              onClick={prev}
              aria-label="Previous review"
              disabled={locked}
              className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-acloblue/80 text-white grid place-items-center hover:bg-acloblue disabled:opacity-40"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next review"
              disabled={locked}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-acloblue/80 text-white grid place-items-center hover:bg-acloblue disabled:opacity-40"
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
