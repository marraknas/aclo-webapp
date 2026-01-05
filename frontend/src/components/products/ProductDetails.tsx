import { useEffect, useMemo, useState, useRef } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import Navbar from "../common/Navbar";
import ProductDescription from "./ProductDescription";

import ProductGrid from "./ProductGrid";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  fetchProductDetails,
  fetchSimilarProducts,
  fetchProductVariant,
  fetchSimilarProductVariants,
} from "../../redux/slices/productsSlice";
import { addToCart } from "../../redux/slices/cartSlice";
import { cloudinaryImageUrl } from "../../constants/cloudinary";

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useAppDispatch();

  const {
    selectedProduct,
    selectedVariant,
    loading,
    error,
    similarProducts,
    similarProductVariants,
  } = useAppSelector((state) => state.products);

  const { user, guestId } = useAppSelector((state) => state.auth);

  const [mainImage, setMainImage] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);

  const hasUserSelectedOption = useMemo(() => {
    if (!selectedProduct?.options) return false;

    return Object.keys(selectedProduct.options).some((key) => {
      const v = searchParams.get(key);
      return v !== null && v !== "";
    });
  }, [selectedProduct, searchParams]);

  const displayedImages = useMemo(() => {
    const productImgs = selectedProduct?.images?.length
      ? selectedProduct.images
      : [];
    const variantImgs = selectedVariant?.images?.length
      ? selectedVariant.images
      : [];

    if (!hasUserSelectedOption) return productImgs;

    const variantIds = new Set(variantImgs.map((img: any) => img.publicId));
    const merged = [
      ...variantImgs,
      ...productImgs.filter((img: any) => !variantIds.has(img.publicId)),
    ];

    return merged.length ? merged : productImgs;
  }, [selectedProduct, selectedVariant, hasUserSelectedOption]);

  useEffect(() => {
    if (!id) return;

    dispatch(fetchProductDetails({ id }));

    dispatch(fetchSimilarProducts({ id }))
      .unwrap()
      .then((returnedSimilarProducts) => {
        if (returnedSimilarProducts?.length > 0) {
          const productIds = returnedSimilarProducts.map((p: any) => p._id);
          dispatch(fetchSimilarProductVariants({ productIds }));
        }
      })
      .catch((err) => console.error("Failed to load similar products:", err));
  }, [dispatch, id]);

  useEffect(() => {
    if (!id) return;

    const color = searchParams.get("color") || undefined;
    const variant = searchParams.get("variant") || undefined;

    dispatch(
      fetchProductVariant({
        productId: id,
        color,
        variant,
      })
    );
  }, [dispatch, id, searchParams]);

  const lastVariantIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!displayedImages.length) return;

    const variantId = selectedVariant?._id ?? null;
    const variantFirst = selectedVariant?.images?.[0]?.publicId;

    if (variantId && variantId !== lastVariantIdRef.current && variantFirst) {
      setMainImage(variantFirst);
      lastVariantIdRef.current = variantId;
      return;
    }

    const exists = displayedImages.some(
      (img: any) => img.publicId === mainImage
    );
    if (!mainImage || !exists) {
      setMainImage(displayedImages[0].publicId);
    }
  }, [displayedImages, mainImage, selectedVariant?._id]);

  const handleQuantityChange = (action: "incr" | "decr") => {
    if (action === "incr") setQuantity((prev) => prev + 1);
    if (action === "decr") setQuantity((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleOptionSelect = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set(key, value);
    setSearchParams(newParams);
  };

  const handleAddToCart = () => {
    if (!id) {
      toast.error("Invalid product ID.");
      return;
    }

    if (!selectedVariant?._id) {
      toast.error("Please select a valid variant before adding to cart.", {
        duration: 1500,
      });
      return;
    }

    if (selectedProduct?.options) {
      const requiredKeys = Object.keys(selectedProduct.options);
      const missing = requiredKeys.filter((key) => !searchParams.get(key));
      if (missing.length > 0) {
        toast.error(
          `Please select ${missing.join(", ")} before adding to cart.`,
          {
            duration: 1500,
          }
        );
        return;
      }
    }

    setIsButtonDisabled(true);

    const finalOptions: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      finalOptions[key] = value;
    });

    dispatch(
      addToCart({
        productId: id,
        productVariantId: selectedVariant._id,
        quantity,
        options: finalOptions,
        guestId,
        userId: user?._id,
      })
    )
      .unwrap()
      .then(() => {
        toast.success("Product added to cart!", { duration: 1000 });
      })
      .catch(() => {
        toast.error("Failed to add to cart.", { duration: 1000 });
      })
      .finally(() => {
        setIsButtonDisabled(false);
      });
  };

  const getCurrentIndex = () => {
    if (!displayedImages.length) return 0;
    const idx = displayedImages.findIndex(
      (img: any) => img.publicId === mainImage
    );
    return idx >= 0 ? idx : 0;
  };

  const goPrev = () => {
    if (!displayedImages.length) return;
    const curr = getCurrentIndex();
    const nextIndex =
      (curr - 1 + displayedImages.length) % displayedImages.length;
    setMainImage(displayedImages[nextIndex].publicId);
  };

  const goNext = () => {
    if (!displayedImages.length) return;
    const curr = getCurrentIndex();
    const nextIndex = (curr + 1) % displayedImages.length;
    setMainImage(displayedImages[nextIndex].publicId);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!selectedProduct) return null;

  const hasOptions =
    !!selectedProduct.options &&
    Object.keys(selectedProduct.options).length > 0;

  const displayPrice = selectedVariant?.discountPrice || selectedVariant?.price;

  return (
    <>
      <Navbar />
      <div className="p-6">
        {selectedProduct && (
          <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg">
            <div className="flex flex-col md:flex-row">
              {/* Images */}
              <div className="md:w-1/2">
                {/* Main image */}
                <div className="mb-4 relative">
                  <img
                    src={mainImage ? cloudinaryImageUrl(mainImage) : ""}
                    alt={selectedProduct.name}
                    className="w-full h-auto object-cover"
                  />

                  {/* Left arrow */}
                  {displayedImages.length > 1 && (
                    <button
                      type="button"
                      onClick={goPrev}
                      aria-label="Previous image"
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full w-10 h-10 flex items-center justify-center shadow"
                    >
                      ‹
                    </button>
                  )}

                  {/* Right arrow */}
                  {displayedImages.length > 1 && (
                    <button
                      type="button"
                      onClick={goNext}
                      aria-label="Next image"
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full w-10 h-10 flex items-center justify-center shadow"
                    >
                      ›
                    </button>
                  )}
                </div>

                {/* Thumbnails */}
                <div className="flex overflow-x-auto gap-4">
                  {displayedImages.map((image: any, index: number) => (
                    <img
                      key={image.publicId ?? index}
                      src={cloudinaryImageUrl(image.publicId)}
                      alt={image.alt || `Thumbnail ${index}`}
                      className={`w-20 h-20 object-cover cursor-pointer border shrink-0 ${
                        mainImage === image.publicId
                          ? "border-black"
                          : "border-gray-200"
                      }`}
                      onClick={() => setMainImage(image.publicId)}
                    />
                  ))}
                </div>
              </div>

              {/* Right side - Details */}
              <div className="md:w-1/2 md:ml-10">
                <h1 className="text-2xl md:text-3xl font-semibold mb-2 text-acloblue">
                  {selectedProduct.name}
                </h1>
                {/* Price Display */}
                <div className="mb-4">
                  {selectedVariant?.discountPrice ? (
                    <>
                      <span className="text-xl font-medium text-acloblue mr-6">
                        IDR {selectedVariant.discountPrice.toLocaleString()}
                      </span>
                      <span className="text-lg text-gray-500 line-through">
                        IDR {selectedVariant.price.toLocaleString()}
                      </span>
                    </>
                  ) : (
                    <span className="text-xl text-gray-800">
                      IDR{" "}
                      {displayPrice
                        ? displayPrice.toLocaleString()
                        : "Price Not Available"}
                    </span>
                  )}
                </div>

                {hasOptions &&
                  Object.entries(selectedProduct.options!).map(
                    ([key, values]) => (
                      <div className="mb-4" key={key}>
                        <p className="text-sm font-medium text-gray-900 capitalize mb-2">
                          {key}:{" "}
                          <span className="text-gray-500 font-normal">
                            {searchParams.get(key)}
                          </span>
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {values.map((value: string) => {
                            // Check if this specific value is currently in the URL params
                            const isSelected = searchParams.get(key) === value;

                            return (
                              <button
                                key={value}
                                onClick={() => handleOptionSelect(key, value)}
                                className={`px-4 py-2 rounded-md border text-sm transition-all duration-200 ${
                                  isSelected
                                    ? "bg-acloblue text-white border-acloblue shadow-md"
                                    : "bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:bg-gray-50"
                                }`}
                              >
                                {value}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )
                  )}
                <div className="mb-6">
                  <p className="text-gray-700">Quantity:</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <button
                      onClick={() => handleQuantityChange("decr")}
                      className="px-2.5 py-1 bg-gray-200 rounded text-lg hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span className="text-lg">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange("incr")}
                      className="px-2 py-1 bg-gray-200 rounded text-lg hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={handleAddToCart}
                  disabled={isButtonDisabled}
                  className={`bg-acloblue text-white py-2 px-6 rounded w-full mb-4 ${
                    isButtonDisabled
                      ? "cursor-not-allowed opacity-50"
                      : "hover:bg-acloblue hover:opacity-50"
                  }`}
                >
                  {isButtonDisabled ? "Processing..." : "ADD TO CART"}
                </button>
                <ProductDescription md={selectedProduct.description} />
              </div>
            </div>

            {/* Similar products */}
            <div className="mt-20">
              <h2 className="text-2xl text-center font-medium mb-4">
                You May Also Like
              </h2>
              <ProductGrid
                products={similarProducts}
                productVariants={similarProductVariants}
                loading={loading}
                error={error}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductDetails;
