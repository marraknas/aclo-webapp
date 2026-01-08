import { useMemo, useState } from "react";
import { cloudinaryImageUrl } from "../../constants/cloudinary";

type FeatureImage = {
  publicId: string;
  alt?: string;
};

export function DesignFeaturesCarousel({
  images,
  initialIndex = 0,
}: {
  images: FeatureImage[];
  initialIndex?: number;
}) {
  const safeImages = useMemo(() => images.filter(Boolean), [images]);
  const [activeId, setActiveId] = useState<string>(
    safeImages[initialIndex]?.publicId ?? safeImages[0]?.publicId ?? ""
  );

  const getCurrentIndex = () => {
    if (!safeImages.length) return 0;
    const idx = safeImages.findIndex((img) => img.publicId === activeId);
    return idx >= 0 ? idx : 0;
  };

  const goPrev = () => {
    if (!safeImages.length) return;
    const curr = getCurrentIndex();
    const nextIndex = (curr - 1 + safeImages.length) % safeImages.length;
    setActiveId(safeImages[nextIndex].publicId);
  };

  const goNext = () => {
    if (!safeImages.length) return;
    const curr = getCurrentIndex();
    const nextIndex = (curr + 1) % safeImages.length;
    setActiveId(safeImages[nextIndex].publicId);
  };

  if (!safeImages.length) return null;

  return (
    <div className="w-full">
      <div className="mb-4 relative rounded-2xl overflow-hidden bg-white shadow-sm border border-black/5">
        <img
          src={cloudinaryImageUrl(activeId)}
          className="w-full h-auto object-cover"
          loading="lazy"
        />

        {safeImages.length > 1 && (
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous image"
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800
                       rounded-full w-10 h-10 flex items-center justify-center shadow"
          >
            ‹
          </button>
        )}

        {safeImages.length > 1 && (
          <button
            type="button"
            onClick={goNext}
            aria-label="Next image"
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800
                       rounded-full w-10 h-10 flex items-center justify-center shadow"
          >
            ›
          </button>
        )}
      </div>
    </div>
  );
}
