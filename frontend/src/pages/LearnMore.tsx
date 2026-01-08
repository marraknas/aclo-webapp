import React from "react";
import Navbar from "../components/common/Navbar";
import { cloudinaryImageUrl, assets } from "../constants/cloudinary";
import { DesignFeaturesCarousel } from "../components/common/DesignFeaturesCarousel";

const LearnMore: React.FC = () => {
  return (
    <>
      <Navbar />
      <div className="bg-background pb-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* TITLE */}
          <h1 className="text-acloblue font-semibold leading-tight text-2xl sm:text-3xl md:text-3xl text-center pt-5 pb-4">
            Why choose ACLO’s learning tower?
          </h1>

          {/* SECTION 1 */}
          <h3 className="text-acloblue text-xl sm:text-2xl md:text-2xl text-center pt-5 pb-4">
            How to choose a learning tower?
          </h3>

          <div className="flex flex-col items-center text-justify md:text-center">
            <p className="text-sm xl:text-sm leading-relaxed">
              While there are many kinds of learning towers — from bulky regular
              wooden frames to light but fully plastic designs —{" "}
              <span className="italic">
                not all of them fit real everyday family life.
              </span>{" "}
              Traditional towers are often heavy and hard to store, and plastic
              ones can feel less sturdy or out of place in your home.
            </p>

            <p className="mt-4 md:mt-2 text-sm xl:text-sm leading-relaxed">
              <span className="font-semibold text-acloblue">
                ACLO’s wooden foldable learning tower
              </span>{" "}
              combines the best of both worlds:{" "}
              <span className="font-semibold text-acloblue underline underline-offset-2 decoration-acloblue">
                strong and stable
              </span>
              , yet{" "}
              <span className="font-semibold text-acloblue underline underline-offset-2 decoration-acloblue">
                lightweight
              </span>
              ,{" "}
              <span className="font-semibold text-acloblue underline underline-offset-2 decoration-acloblue">
                space-saving
              </span>
              , and{" "}
              <span className="font-semibold text-acloblue underline underline-offset-2 decoration-acloblue">
                made from natural materials
              </span>
              . Below, see how it compares to other types of learning towers.
            </p>

            <img
              src={cloudinaryImageUrl(assets.learnMore.learnMore_1.publicId)}
              alt="Learning tower comparison"
              className="mt-8 w-full max-w-2xl h-auto object-cover"
              loading="lazy"
            />
          </div>

          {/* SECTION 2 */}
          <h3 className="text-acloblue text-xl sm:text-2xl md:text-2xl text-center pt-10 pb-4">
            Why is ACLO the best wooden learning tower?
          </h3>

          <div className="flex flex-col items-center text-justify md:text-center">
            <p className="text-sm xl:text-sm leading-relaxed">
              Among all the wooden foldable learning towers,{" "}
              <span className="font-semibold text-acloblue">
                ACLO stands out
              </span>{" "}
              for real everyday use. Our tower{" "}
              <span className="font-semibold text-acloblue">
                folds down to just 14 cm
              </span>
              , making it truly{" "}
              <span className="font-semibold text-acloblue">space-saving</span>,
              while still staying{" "}
              <span className="font-semibold text-acloblue">
                lightweight at 8 kg
              </span>{" "}
              so Mom and Dad can easily move it between rooms. The{" "}
              <span className="font-semibold text-acloblue">Smart Lock</span>{" "}
              guardrail keeps little ones safely enclosed at the top, and its{" "}
              <span className="font-semibold text-acloblue">
                100 kg max load capacity
              </span>{" "}
              means it’s strong enough to last through years of daily routines.
            </p>

            <p className="mt-4 md:mt-2 text-sm xl:text-sm leading-relaxed">
              A slim, sturdy, foldable wooden learning tower — designed to be
              the most practical choice for modern families.
            </p>

            <img
              src={cloudinaryImageUrl(assets.learnMore.learnMore_2.publicId)}
              alt="Why ACLO is best wooden foldable learning tower"
              className="mt-8 w-full max-w-2xl h-auto object-cover"
              loading="lazy"
            />
          </div>

          {/* SECTION 3 */}
          <h3 className="text-acloblue text-xl sm:text-2xl md:text-2xl text-center pt-10 pb-4">
            Design Features You’ll Love
          </h3>

          <div className="w-full flex flex-col items-center max-w-2xl mx-auto">
            <DesignFeaturesCarousel
              images={[
                {
                  publicId: assets.learnMore.learnMore_3.publicId,
                  alt: "Stork design features",
                },
                {
                  publicId: assets.learnMore.learnMore_4.publicId,
                  alt: "Falcon design features",
                },
                {
                  publicId: assets.learnMore.learnMore_5.publicId,
                  alt: "Sparrow design features",
                },
                {
                  publicId: assets.learnMore.learnMore_6.publicId,
                  alt: "Two adjustable heights",
                },
                {
                  publicId: assets.learnMore.learnMore_7.publicId,
                  alt: "Ultimate child safety features",
                },
              ]}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default LearnMore;
