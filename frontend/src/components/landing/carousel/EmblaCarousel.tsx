import React from "react";
import type { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import ClassNames from "embla-carousel-class-names";
import {
  NextButton,
  PrevButton,
  usePrevNextButtons,
} from "./EmblaCarouselArrowButtons";
import "./embla.css";
import { cloudinaryImageUrl } from "../../../constants/cloudinary";

type Slide = {
  publicId: string;
  alt: string;
};

type PropType = {
  slides: Slide[];
  options?: EmblaOptionsType;
};

const EmblaCarousel: React.FC<PropType> = ({ slides, options }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [ClassNames()]);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  return (
    <div className="embla embla--with-arrows">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {slides.map((slide) => {
            const url = cloudinaryImageUrl(slide.publicId);
            return (
              <div className="embla__slide" key={slide.publicId}>
                <div className="embla__slide__inner">
                  <img
                    className="embla__slide__img"
                    src={url}
                    alt={slide.alt}
                    onError={() => console.log("IMAGE FAILED:", url)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <PrevButton
        onClick={onPrevButtonClick}
        disabled={prevBtnDisabled}
        className="embla__arrow embla__arrow--prev"
      />
      <NextButton
        onClick={onNextButtonClick}
        disabled={nextBtnDisabled}
        className="embla__arrow embla__arrow--next"
      />
    </div>
  );
};

export default EmblaCarousel;
