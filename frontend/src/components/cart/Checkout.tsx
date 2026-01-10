import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
// import MidtransPayButton from "./MidtransPayButton";
import ShippingOptionsModal from "./ShippingOptionsModal";
import ShippingDetailsModal from "./ShippingDetailsModal";
import LoadingOverlay from "../common/LoadingOverlay";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  createCheckout,
  calculateShippingCost,
  setSelectedShipping,
  clearShipping,
} from "../../redux/slices/checkoutSlice";
import type { Checkout, ShippingDetails } from "../../types/checkout";
import { cloudinaryImageUrl } from "../../constants/cloudinary";
import { fetchCartById } from "../../redux/slices/cartSlice";

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { cart, loading, error } = useAppSelector((state) => state.cart);
  const { cartId } = useParams<{ cartId: string }>();
  const { user } = useAppSelector((state) => state.auth);
  const { shippingOptions, selectedShipping, shippingLoading } = useAppSelector(
    (state) => state.checkout
  );

  const [showShippingModal, setShowShippingModal] = useState(false);
  const [showShippingDetailsModal, setShowShippingDetailsModal] =
    useState(false);
  const [modalMode, setModalMode] = useState<"selection" | "form">("form");
  const [shippingDetails, setShippingDetails] = useState<ShippingDetails>({
    name: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
  });

  // Track last calculated shipping to prevent duplicate API calls
  const lastCalculatedRef = useRef<{
    postalCode: string;
    cartId: string;
  } | null>(null);

  // Only calculate shipping if postal code or cart changed
  const shouldCalculateShipping = (postalCode: string, currentCartId: string): boolean => {
    if (!lastCalculatedRef.current) return true;
    
    return (
      lastCalculatedRef.current.postalCode !== postalCode ||
      lastCalculatedRef.current.cartId !== currentCartId
    );
  };

  // Auto-fill shipping details + calculate shipping if user has saved addresses
  useEffect(() => {
    if (user?.shippingAddresses && user.shippingAddresses.length > 0 && cart?.products) {
      const firstAddress = user.shippingAddresses[0];
      
      const details: ShippingDetails = {
        name: firstAddress.name,
        address: firstAddress.address,
        city: firstAddress.city,
        postalCode: firstAddress.postalCode,
        phone: firstAddress.phone,
      };
      
      setShippingDetails(details);
      
      if (shouldCalculateShipping(firstAddress.postalCode, cart._id)) {
        dispatch(
          calculateShippingCost({
            destinationPostalCode: firstAddress.postalCode,
            cartItems: cart.products.map((p) => ({
              productId: p.productId,
              price: p.price,
              quantity: p.quantity,
            })),
          })
        ).unwrap()
          .then(() => {
            lastCalculatedRef.current = {
              postalCode: firstAddress.postalCode,
              cartId: cart._id,
            };
          })
          .catch((error: any) => {
            dispatch(clearShipping());
            toast.error(
              error?.message || "Something went wrong. Please check your address and try again.",
              { duration: 3000 }
            );
          });
      }
    } else {
      // No saved addresses, show modal to add new address
      setModalMode("form");
      setShowShippingDetailsModal(true);
    }
  }, [user, cart?.products, dispatch]);

  useEffect(() => {
    if (!cartId) {
      navigate("/");
      return;
    }

    if (!cart?._id || cart._id !== cartId) {
      dispatch(fetchCartById({ cartId }));
      return;
    }

    if (!loading && (!cart.products || cart.products.length === 0)) {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartId, cart?._id, cart?.products?.length, loading, dispatch, navigate]);

  // Clear shipping when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearShipping());
      lastCalculatedRef.current = null;
    };
  }, [dispatch]);

  const handleShippingDetailsSubmit = async (
    shippingDetails: ShippingDetails
  ) => {
    setShippingDetails(shippingDetails);

    if (!cart || !cart.products || cart.products.length === 0) {
      return;
    }

    if (!shouldCalculateShipping(shippingDetails.postalCode, cart._id)) {
      setShowShippingDetailsModal(false);
      return;
    }

    try {
      await dispatch(
        calculateShippingCost({
          destinationPostalCode: shippingDetails.postalCode,
          cartItems: cart.products.map((p) => ({
            productId: p.productId,
            price: p.price,
            quantity: p.quantity,
          })),
        })
      ).unwrap();
      
      lastCalculatedRef.current = {
        postalCode: shippingDetails.postalCode,
        cartId: cart._id,
      };
      
      setShowShippingDetailsModal(false);
    } catch (error: any) {
      dispatch(clearShipping());
      toast.error(
        error?.message || "Something went wrong. Please check your address and try again.",
        { duration: 3000 }
      );
      console.error("Error in handleShippingDetails:", error);
    }
  };

  const handleCreateCheckout = async () => {
    if (!cart || !cart.products || cart.products.length === 0) {
      return;
    }

    if (!selectedShipping) {
      alert("Please select a shipping method");
      return;
    }

    try {
      const totalWithShipping = cart.totalPrice + selectedShipping.price;

      const createdCheckout: Checkout = await dispatch(
        createCheckout({
          checkoutItems: cart.products.map((p) => ({
            ...p,
            options: p.options ?? {},
          })),
          shippingDetails,
          paymentMethod: "BankTransfer",
          totalPrice: totalWithShipping,
          shippingCost: selectedShipping.price,
          shippingMethod: selectedShipping.courierServiceName,
          shippingCourier: selectedShipping.courierCode,
          shippingDuration: selectedShipping.duration,
        })
      ).unwrap();

      return createdCheckout._id ?? null;
    } catch (error) {
      console.error("Failed to create checkout: ", error);
    }
  };

  if (loading) return <p>Loading cart...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!cart || !cart.products || cart.products.length === 0) {
    return <p>Your cart is empty</p>;
  }

  return (
    <>
      {shippingLoading && <LoadingOverlay show/> }
      
      <div className="max-w-4xl mx-auto py-10 px-6 tracking-tighter">
        <ShippingDetailsModal
          isOpen={showShippingDetailsModal}
          onClose={() => {
            setShowShippingDetailsModal(false);
            if (!user?.shippingAddresses || user.shippingAddresses.length === 0) {
              navigate("/");
            }
          }}
          onSubmit={handleShippingDetailsSubmit}
          userEmail={user?.email}
          isCalculating={shippingLoading}
          initialMode={modalMode}
        />

      {/* Order Summary Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl uppercase">Order Summary</h2>
          <button
            type="button"
            onClick={() => {
              setModalMode("selection");
              setShowShippingDetailsModal(true);
            }}
            className="text-sm text-acloblue hover:underline"
          >
            Edit Shipping Details
          </button>
        </div>

        {/* Shipping Details Display */}
        {shippingDetails.name && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Shipping To:
            </h3>
            <p className="text-sm text-gray-800">{shippingDetails.name}</p>
            <p className="text-sm text-gray-600">{shippingDetails.address}</p>
            <p className="text-sm text-gray-600">
              {shippingDetails.city}, {shippingDetails.postalCode}
            </p>
            <p className="text-sm text-gray-600">{shippingDetails.phone}</p>
          </div>
        )}

        {/* Products List */}
        <div className="border-t border-gray-300 py-4 mb-4">
          {cart.products.map((product, index) => (
            <div
              key={index}
              className="flex items-start justify-between py-2 border-b border-gray-300"
            >
              <div className="flex items-start">
                <img
                  src={cloudinaryImageUrl(product.image)}
                  alt={product.name}
                  className="w-20 h-24 object-cover mr-4"
                />
                <div>
                  <h3 className="text-md">{product.name}</h3>
                  {product.options &&
                    Object.keys(product.options).length > 0 && (
                      <p className="text-gray-500 text-sm">
                        {Object.entries(product.options)
                          .map(([key, value]) => {
                            const displayValue = String(value);
                            const label =
                              key.charAt(0).toUpperCase() + key.slice(1);
                            return `${label}: ${displayValue}`;
                          })
                          .join(" | ")}
                      </p>
                    )}
                </div>
              </div>
              <p className="text-xl">IDR {product.price?.toLocaleString()}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center text-lg mb-4">
          <p>Subtotal</p>
          <p>IDR {cart.totalPrice?.toLocaleString()}</p>
        </div>
        <div className="flex justify-between items-center text-lg mb-4">
          <p>Shipping</p>
          <div className="text-right">
            {selectedShipping ? (
              <div>
                <p className="text-xl">
                  IDR {selectedShipping.price.toLocaleString()}
                </p>
                <button
                  type="button"
                  onClick={() => setShowShippingModal(true)}
                  className="text-sm text-acloblue hover:underline mt-1"
                >
                  View Shipping Options
                </button>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">N/A</p>
            )}
          </div>
        </div>
        <div className="flex justify-between items-center text-xl font-semibold mt-4 border-t border-gray-300 pt-4">
          <p>Total</p>
          <p>
            IDR{" "}
            {(
              cart.totalPrice + (selectedShipping?.price || 0)
            ).toLocaleString()}
          </p>
        </div>
        <div className="mt-6">
          <button
            type="button"
            onClick={async () => {
              const id = await handleCreateCheckout(); // return checkout
              if (id) navigate(`/payment/${id}`);
            }}
            disabled={!selectedShipping}
            className="w-full bg-black text-white py-3 rounded disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-gray-800 transition cursor-pointer"
          >
            Continue to Payment
          </button>
        </div>
      </div>

      <ShippingOptionsModal
        isOpen={showShippingModal}
        onClose={() => setShowShippingModal(false)}
        shippingOptions={shippingOptions}
        selectedShipping={selectedShipping}
        onSelectShipping={(option) => {
          dispatch(setSelectedShipping(option));
        }}
      />
    </div>
    </>
  );
};

export default Checkout;
