import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

import ProductGrid from "./ProductGrid";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  fetchProductDetails,
  fetchSimilarProducts,
} from "../../redux/slices/productsSlice";
import { addToCart } from "../../redux/slices/cartSlice";

type ProductDetailsProps = {
  productId?: string; // used when Home passes bestSeller productId
};

// TODO: when fetching product details, also need to auto fetch a default product variant

const ProductDetails = ({ productId }: ProductDetailsProps) => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { selectedProduct, loading, error, similarProducts } = useAppSelector(
    (state) => state.products
  );
  const { user, guestId } = useAppSelector((state) => state.auth);
  const [mainImage, setMainImage] = useState<string>("");
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});
  const [quantity, setQuantity] = useState<number>(1);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false); // for disabling add to cart button during processing

  const productFetchId = productId || id; // use productId for the best seller product, and id for other cases

  // when product changes, change main image
  useEffect(() => {
    if (selectedProduct?.images?.[0]?.url) {
      setMainImage(selectedProduct.images[0].url);
    }
    if (selectedProduct?.options) {
      const initialOptions: Record<string, string> = {};
      for (const [key, values] of Object.entries(selectedProduct.options)) {
        if (values.length > 0) {
          initialOptions[key] = values[0];
        }
      }
      setSelectedOptions(initialOptions);
    } else {
      setSelectedOptions({});
    }
  }, [selectedProduct]);

  useEffect(() => {
    if (productFetchId) {
      dispatch(fetchProductDetails({ id: productFetchId }));
      dispatch(fetchSimilarProducts({ id: productFetchId }));
    }
  }, [dispatch, productFetchId]);

  const handleQuantityChange = (action: string) => {
    if (action === "incr") setQuantity((prev) => prev + 1);
    if (action === "decr" && quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleOptionSelect = (key: string, value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleAddToCart = () => {
    if (!productFetchId) {
      toast.error("Invalid product ID.");
      return;
    }

    if (selectedProduct?.options) {
      const missing = Object.keys(selectedProduct.options).filter(
        (key) => !selectedOptions[key]
      );
      if (missing.length > 0) {
        toast.error("Please select all options before adding to cart.", {
          duration: 1000,
        });
        return;
      }
    }
    setIsButtonDisabled(true);
    dispatch(
      addToCart({
        productId: productFetchId,
        quantity,
        options: selectedOptions,
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

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!selectedProduct) {
    return null;
  }

  // check if the selected product has options
  const hasOptions =
    !!selectedProduct.options &&
    Object.keys(selectedProduct.options).length > 0;
  const effectivePrice = selectedProduct.discountPrice ?? selectedProduct.price;
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
                  src={image.url}
                  alt={image.altText || `Thumbnail ${index}`}
                  className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${
                    mainImage === image.url ? "border-black" : "border-gray-200"
                  }`}
                  onClick={() => setMainImage(image.url)}
                />
              ))}
            </div>
            {/* Main Image */}
            <div className="md:w-1/2">
              <div className="mb-4">
                <img
                  src={mainImage || selectedProduct.images[0]?.url}
                  alt={
                    selectedProduct.images[0]?.altText || selectedProduct.name
                  }
                  className="w-full h-auto object-cover rounded-lg"
                />
              </div>
            </div>
            {/* Mobile thumbnails */}
            <div className="md:hidden flex overscroll-x-scroll space-x-4 mb-4 ">
              {selectedProduct.images.map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  alt={image.altText || `Thumbnail ${index}`}
                  className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${
                    mainImage === image.url ? "border-black" : "border-gray-200"
                  }`}
                  onClick={() => setMainImage(image.url)}
                />
              ))}
            </div>
            {/* Right side */}
            <div className="md:w-1/2 md:ml-10">
              <h1 className="text-2xl md:text-3xl font-semibold mb-2">
                {selectedProduct.name}
              </h1>
              {selectedProduct.discountPrice && (
                <p className="text-lg text-gray-600 mb-1 line-through">
                  IDR {selectedProduct.price.toLocaleString()}
                </p>
              )}
              <p className="text-xl text-gray-500 mb-2">
                IDR {effectivePrice.toLocaleString()}
              </p>
              <p className="text-gray-600 mb-4">
                {selectedProduct.description}
              </p>
              {hasOptions &&
                Object.entries(selectedProduct.options!).map(
                  ([key, values]) => (
                    <div className="mb-4" key={key}>
                      <p className="text-gray-700 capitalize">{key}:</p>
                      <div className="flex gap-2 mt-2">
                        {values.map((value) => (
                          <button
                            key={value}
                            onClick={() => handleOptionSelect(key, value)}
                            className={`px-4 py-2 rounded border ${
                              selectedOptions[key] === value
                                ? "bg-black text-white"
                                : ""
                            }`}
                          >
                            {value}
                          </button>
                        ))}
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
                {isButtonDisabled ? "Adding..." : "ADD TO CART"}
              </button>
              <div className="mt-10 text-gray-700">
                <h3 className="text-xl font-bold mb-4">Characteristics:</h3>
                <table className="w-full text-left text-sm text-gray-600">
                  <tbody>
                    <tr>
                      <td className="py-1">Material</td>
                      <td className="py-1">{selectedProduct.material}</td>
                    </tr>
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
