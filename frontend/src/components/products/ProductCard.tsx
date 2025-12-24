import { useState } from "react";
import { Link } from "react-router-dom";
import { cloudinaryImageUrl } from "../../constants/cloudinary";
import type { Product } from "../../types/product";
import type { ProductVariant } from "../../types/productVariant";

type ProductCardProps = {
  product: Product;
  variants: ProductVariant[];
};

const CHECKED_KEYS = ["color", "variant"];

const ProductCard = ({ product, variants }: ProductCardProps) => {
  const [selections, setSelections] = useState<Record<string, string>>({});
  const queryString = new URLSearchParams(selections).toString();
  const productUrl = queryString 
    ? `/product/${product._id}?${queryString}`
    : `/product/${product._id}`;

  const handleOptionSelect = (
    e: React.MouseEvent,
    key: string,
    value: string
  ) => {
    e.preventDefault(); // Stop Link navigation
    setSelections((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // find default variant
  const defaultVariant = variants.find((v) => v.isDefault);

  // find selected variant, if any
  const selectedVariant = variants.find((v) => {
    if (Object.keys(selections).length === 0) return false;

    return Object.entries(selections).every(([optKey, optValue]) => {
      const variantKey = optKey as keyof ProductVariant;
      return v[variantKey] === optValue;
    });
  });

  // determine image to display
  // If an option is selected, show the image of selected variant
  // But if no option is selected, show image of the product
  // TODO: allow to show multiple images by carousel
  const displayImageId =
    selectedVariant?.images?.[0]?.publicId || product.images[0]?.publicId;
  const displayAlt =
    selectedVariant?.images?.[0]?.alt || product.images[0]?.alt || product.name;

  // determine price to display
  let displayPrice = defaultVariant?.discountPrice ?? defaultVariant?.price;
  if (selectedVariant) {
    displayPrice = selectedVariant.discountPrice ?? selectedVariant.price;
  }

  return (
    <Link to={productUrl} className="block">
      <div className="bg-white p-4 rounded-lg">
        <div className="w-full h-96 mb-3">
          <img
            src={cloudinaryImageUrl(displayImageId)}
            alt={displayAlt}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      </div>
      <h3 className="text-sm px-4 mb-2">{product.name}</h3>

      {/* OPTION SELECTORS */}
      {product.options && (
        <div className="px-4 mb-3 space-y-2">
          {Object.entries(product.options).map(([key, rawValues]) => {
            const values = rawValues as string[];
            
            if (
              !CHECKED_KEYS.includes(key) ||
              !values ||
              values.length === 0
            ) {
              return null;
            }

            return (
              <div key={key} className="text-xs">
                <span className="text-gray-500 mb-1 block capitalize">
                  {key}:
                </span>
                <div className="flex flex-wrap gap-2">
                  {values.map((value) => {
                    const isSelected = selections[key] === value;
                    return (
                      <button
                        key={value}
                        onClick={(e) => handleOptionSelect(e, key, value)}
                        className={`px-2 py-1 rounded border text-xs transition-colors ${
                          isSelected
                            ? "bg-black text-white border-black"
                            : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                        }`}
                      >
                        {value}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="text-gray-500 px-4 font-medium text-sm tracking-tighter">
        {displayPrice
          ? `IDR ${displayPrice.toLocaleString()}`
          : "Price Not Found"}
      </p>
    </Link>
  );
};

export default ProductCard;