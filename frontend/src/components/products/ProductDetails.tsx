import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import ProductGrid from "./ProductGrid";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  fetchProductDetails,
  fetchSimilarProducts,
  fetchProductVariant,
  // fetchProductVariants,
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

  // ui states
  const [mainImage, setMainImage] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false); // for disabling add to cart button during processing

  // fetch product & variant
  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetails({ id: id }));
      // dispatch(fetchProductVariants({productIds: [id]}))
      dispatch(fetchSimilarProducts({ id: id }))
        .unwrap()
        .then((returnedSimilarProducts) => {
          if (returnedSimilarProducts.length > 0) {
            const productIds = returnedSimilarProducts.map((p) => p._id);
            dispatch(fetchSimilarProductVariants({ productIds }));
          }
        })
        .catch((err) => console.error("Failed to load similar products:", err));
    }
  }, [dispatch, id]);
  useEffect(() => {
    if (id) {
      const color = searchParams.get("color") || undefined;
      const variant = searchParams.get("variant") || undefined;
      // if no parameters defined, default variant is fetched.
      dispatch(
        fetchProductVariant({
          productId: id,
          color,
          variant,
        })
      );
    }
  }, [dispatch, id, searchParams]);

  // when product changes, change main image
  useEffect(() => {
    // if (selectedProduct?.images?.[0]?.publicId) {
    //   setMainImage(selectedProduct.images[0].publicId);
    // }
    // if (selectedProduct?.options) {
    //   const initialOptions: Record<string, string> = {};
    //   for (const [key, values] of Object.entries(selectedProduct.options)) {
    //     if (values.length > 0) {
    //       initialOptions[key] = values[0];
    //     }
    //   }
    //   setSelectedOptions(initialOptions);
    // } else {
    //   setSelectedOptions({});
    // }
    // Fallback to product image if no variant image
    if (selectedProduct?.images?.[0]?.publicId) {
      setMainImage(selectedProduct.images[0].publicId);
    }
  }, [selectedProduct]);

  const handleQuantityChange = (action: string) => {
    if (action === "incr") setQuantity((prev) => prev + 1);
    if (action === "decr" && quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleOptionSelect = (key: string, value: string) => {
    // setSelectedOptions((prev) => ({
    //   ...prev,
    //   [key]: value,
    // }));
    const newParams = new URLSearchParams(searchParams);
    newParams.set(key, value);
    setSearchParams(newParams);
  };

  const handleAddToCart = () => {
    if (!id) {
      toast.error("Invalid product ID.");
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
    console.log(finalOptions);
    dispatch(
      addToCart({
        productId: id,
        productVariantId: selectedVariant!._id,
        quantity,
        options: finalOptions,
        guestId,
        userId: user?._id,
      })
    )
      .unwrap()
      .then(() => {
        toast.success("Product added to cart!", {
          duration: 1000,
        });
      })
      .catch(() => {
        toast.error("Failed to add to cart.", { duration: 1000 });
      })
      .finally(() => {
        setIsButtonDisabled(false);
      });
  };

  if (loading) return <p>Loading...</p>;

  if (error) return <p>Error: {error}</p>;

  if (!selectedProduct) return null;

  // check if the selected product has options
  const hasOptions =
    !!selectedProduct.options &&
    Object.keys(selectedProduct.options).length > 0;
  const displayPrice = selectedVariant?.discountPrice || selectedVariant?.price;

  return (
    <div className="p-6">
      {selectedProduct && (
        <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg">
          <div className="flex flex-col md:flex-row">
            {/* Left thumbnails */}
            <div className="hidden md:flex flex-col space-y-4 mr-6">
              {selectedProduct.images.map((image, index) => (
                <img
                  key={index}
                  src={cloudinaryImageUrl(mainImage)}
                  alt={image.alt || `Thumbnail ${index}`}
                  className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${
                    mainImage === image.publicId
                      ? "border-black"
                      : "border-gray-200"
                  }`}
                  onClick={() => setMainImage(image.publicId)}
                />
              ))}
            </div>
            {/* Main Image */}
            <div className="md:w-1/2">
              <div className="mb-4">
                <img
                  src={
                    cloudinaryImageUrl(mainImage) ||
                    selectedProduct.images[0]?.publicId
                  }
                  alt={selectedProduct.images[0]?.alt || selectedProduct.name}
                  className="w-full h-auto object-cover rounded-lg"
                />
              </div>
            </div>
            {/* Mobile thumbnails */}
            <div className="md:hidden flex overscroll-x-scroll space-x-4 mb-4 ">
              {selectedProduct.images.map((image, index) => (
                <img
                  key={index}
                  src={cloudinaryImageUrl(mainImage)}
                  alt={image.alt || `Thumbnail ${index}`}
                  className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${
                    mainImage === image.publicId
                      ? "border-black"
                      : "border-gray-200"
                  }`}
                  onClick={() => setMainImage(image.publicId)}
                />
              ))}
            </div>
            {/* Right side - Details */}
            <div className="md:w-1/2 md:ml-10">
              <h1 className="text-2xl md:text-3xl font-semibold mb-2">
                {selectedProduct.name}
              </h1>
              {/* Price Display */}
              <div className="mb-4">
                {selectedVariant?.discountPrice ? (
                  <>
                    <span className="text-lg text-gray-500 line-through mr-2">
                      IDR {selectedVariant.price.toLocaleString()}
                    </span>
                    <span className="text-xl font-medium text-red-600">
                      IDR {selectedVariant.discountPrice.toLocaleString()}
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
              <p className="text-gray-600 mb-4">
                {selectedProduct.description}
              </p>
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
                                  ? "bg-black text-white border-black shadow-md"
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
                    className="px-2.5 py-1 bg-gray-200 rounded text-lg"
                  >
                    -
                  </button>
                  <span className="text-lg">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange("incr")}
                    className="px-2 py-1 bg-gray-200 rounded text-lg"
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={isButtonDisabled}
                className={`bg-black text-white py-2 px-6 rounded w-full mb-4 ${
                  isButtonDisabled
                    ? "cursor-not-allowed opacity-50"
                    : "hover:bg-gray-800"
                }`}
              >
                {isButtonDisabled ? "Processing..." : "ADD TO CART"}
              </button>
              <div className="mt-10 text-gray-700">
                <h3 className="text-xl font-bold mb-4">Characteristics:</h3>
                <table className="w-full text-left text-sm text-gray-600">
                  <tbody>
                    {selectedProduct.weight && (
                      <tr>
                        <td className="py-1">Weight</td>
                        <td className="py-1">{selectedProduct.weight} kg</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
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
  );
};

export default ProductDetails;
