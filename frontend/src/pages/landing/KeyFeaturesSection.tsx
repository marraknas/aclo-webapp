import { Link } from "react-router-dom";

import slimFoldable from "../../assets/icons/icon-slim-foldable.svg";
import lightweightPortable from "../../assets/icons/icon-lightweight-portable.svg";
import montessoriApproved from "../../assets/icons/icon-montessori-approved.svg";
import strong from "../../assets/icons/icon-strong.svg";
import durableSafe from "../../assets/icons/icon-durable-safe.svg";
import adjustableHeights from "../../assets/icons/icon-adjustable-heights.svg";

type Feature = {
  icon: string;
  label: string;
};

const FEATURES: Feature[] = [
  { icon: slimFoldable, label: "Slim & Foldable" },
  { icon: lightweightPortable, label: "Lightweight & Portable" },
  { icon: montessoriApproved, label: "Approved by\nMontessori Educators" },
  { icon: strong, label: "Strong" },
  { icon: durableSafe, label: "Durable & Safe" },
  { icon: adjustableHeights, label: "Adjustable Heights" },
];

const KeyFeaturesSection = () => {
  return (
    <section className="w-full bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 pt-6 sm:pt-8">
        <h2 className="text-acloblue font-semibold text-center text-2xl sm:text-3xl md:text-3xl mb-10">
          Key features
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-10 gap-x-6 md:gap-x-12 place-items-center">
          {FEATURES.map((f) => (
            <div
              key={f.label}
              className="flex flex-col items-center text-center"
            >
              <img
                src={f.icon}
                alt={f.label.replace("\n", " ")}
                className="h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20 object-contain"
                loading="lazy"
              />
              <p className="mt-4 text-ink text-sm sm:text-base whitespace-pre-line">
                {f.label}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            to="/learn-more"
            className="inline-flex items-center justify-center
                    bg-acloblue text-background font-light rounded-xl
                    text-sm sm:text-base md:text-lg
                    px-4 py-1 sm:px-7 md:px-6"
          >
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
};

export default KeyFeaturesSection;
