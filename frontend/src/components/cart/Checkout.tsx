import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import MidtransPayButton from "./MidtransPayButton";
import ShippingCalculatorModal from "./ShippingCalculatorModal";
import ShippingDetailsModal from "./ShippingDetailsModal";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { 
  createCheckout, 
  calculateShippingCost,
  setSelectedShipping,
  clearShipping
} from "../../redux/slices/checkoutSlice";
import { API_URL, getAuthHeader } from "../../constants/api";
import axios from "axios";
import type { Checkout, ShippingDetails } from "../../types/checkout";
import { cloudinaryImageUrl } from "../../constants/cloudinary";

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { cart, loading, error } = useAppSelector((state) => state.cart);
  const { user } = useAppSelector((state) => state.auth);
  const { 
    shippingOptions, 
    selectedShipping, 
    shippingLoading, 
  } = useAppSelector((state) => state.checkout);

  const [checkoutId, setCheckoutId] = useState<string | null>(null);
  const [showShippingModal, setShowShippingModal] = useState(false);
  const [showShippingDetailsModal, setShowShippingDetailsModal] = useState(true);
  const [shippingDetails, setShippingDetails] = useState<ShippingDetails>({
    name: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
  });

  // Ensure cart is loaded before proceeding
  useEffect(() => {
    if (!cart || !cart.products || cart.products.length === 0) {
      navigate("/");
    }
  }, [cart, navigate]);

  // Clear shipping when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearShipping());
    };
  }, [dispatch]);

  const handleShippingDetailsSubmit = async (shippingDetails: ShippingDetails) => {
    setShippingDetails(shippingDetails);

    if (!cart || !cart.products || cart.products.length === 0) {
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
      setShowShippingDetailsModal(false);
    } catch (error: any) {
      alert(error.message || "Failed to update. Please try again.");
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
          paymentMethod: "Midtrans",
          totalPrice: totalWithShipping,
          shippingCost: selectedShipping.price,
          shippingMethod: selectedShipping.courierServiceName,
          shippingCourier: selectedShipping.courierCode,
          shippingDuration: selectedShipping.duration,
        })
      ).unwrap();

      if (createdCheckout._id) {
        setCheckoutId(createdCheckout._id);
      }
    } catch (error) {
      console.error("Failed to create checkout: ", error);
    }
  };

  // const handlePaymentSuccess = async (details: Record<string, unknown>) => {
  //   if (!checkoutId) {
  //     console.error("No checkoutId available for payment update.");
  //     return;
  //   }
  //   try {
  //     await axios.put(
  //       `${API_URL}/api/checkout/${checkoutId}/pay`,
  //       {
  //         paymentStatus: "paid",
  //         paymentDetails: details,
  //       },
  //       {
  //         headers: getAuthHeader(),
  //       }
  //     );
  //     await handleFinalizeCheckout(checkoutId); // finalize checkout if payment is successful
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const handleFinalizeCheckout = async (checkoutId: string) => {
    try {
      await axios.post(
        `${API_URL}/api/checkout/${checkoutId}/finalize`,
        {},
        { headers: getAuthHeader() }
      );
      navigate("/order-confirmation");
    } catch (error: any) {
      const msg = error?.response?.data?.message || "Finalize failed";
      alert(msg);
      console.error("Error in handleFinalizeCheckout:", error);
    }
  };

  if (loading) return <p>Loading cart...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!cart || !cart.products || cart.products.length === 0) {
    return <p>Your cart is empty</p>;
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-6 tracking-tighter">
      <ShippingDetailsModal
        isOpen={showShippingDetailsModal}
        onClose={() => navigate("/")}
        onSubmit={handleShippingDetailsSubmit}
        userEmail={user?.email}
        isCalculating={shippingLoading}
      />

      {/* Order Summary Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl uppercase">Order Summary</h2>
          <button
            type="button"
            onClick={() => setShowShippingDetailsModal(true)}
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
              <p className="text-gray-500 text-sm">
                N/A
              </p>
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
          {!checkoutId ? (
            <button
              type="button"
              onClick={handleCreateCheckout}
              disabled={!selectedShipping}
              className="w-full bg-black text-white py-3 rounded disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-gray-800 transition"
            >
              Continue to Payment
            </button>
          ) : (
            <div>
              <MidtransPayButton
                checkoutId={checkoutId}
                amount={cart.totalPrice + (selectedShipping?.price || 0)}
                onSuccess={() => {
                  handleFinalizeCheckout(checkoutId);
                }}
                onError={(err) => {
                  alert("Payment failed. Try again later.");
                  console.log(err);
                }}
              />
              <p className="text-sm text-gray-500 mt-2">
                After payment, we will confirm your transaction and create
                your order.
              </p>
            </div>
          )}
        </div>
      </div>

      <ShippingCalculatorModal
        isOpen={showShippingModal}
        onClose={() => setShowShippingModal(false)}
        shippingOptions={shippingOptions}
        selectedShipping={selectedShipping}
        onSelectShipping={(option) => {
          dispatch(setSelectedShipping(option));
        }}
      />
    </div>
  );
};

export default Checkout;
