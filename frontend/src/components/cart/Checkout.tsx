import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import PayPalButton from "./PayPalButton";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { createCheckout } from "../../redux/slices/checkoutSlice";
import { API_URL, getAuthHeader } from "../../constants/api";
import axios from "axios";
import type { Checkout, ShippingDetails } from "../../types/checkout";
import { cloudinaryImageUrl } from "../../constants/cloudinary";

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { cart, loading, error } = useAppSelector((state) => state.cart);
  const { user } = useAppSelector((state) => state.auth);

  const [checkoutId, setCheckoutId] = useState<string | null>(null);
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

  const handleCreateCheckout = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!cart || !cart.products || cart.products.length === 0) {
      return;
    }
    try {
      const createdCheckout: Checkout = await dispatch(
        createCheckout({
          checkoutItems: cart.products,
          shippingDetails,
          paymentMethod: "Paypal",
          totalPrice: cart.totalPrice,
        })
      ).unwrap();

      if (createdCheckout._id) {
        setCheckoutId(createdCheckout._id);
      }
    } catch (error) {
      console.error("Failed to create checkout: ", error);
    }

    // paypal developer's account needed for this at https://developer.paypal.com/home/
    // setCheckoutId("dummy-checkout-id");
  };
  const handlePaymentSuccess = async (details: Record<string, unknown>) => {
    if (!checkoutId) {
      console.error("No checkoutId available for payment update.");
      return;
    }
    try {
      await axios.put(
        `${API_URL}/api/checkout/${checkoutId}/pay`,
        {
          paymentStatus: "paid",
          paymentDetails: details,
        },
        {
          headers: getAuthHeader(),
        }
      );
      await handleFinalizeCheckout(checkoutId); // finalize checkout if payment is successful
    } catch (error) {
      console.error(error);
    }
  };

  const handleFinalizeCheckout = async (checkoutId: string) => {
    try {
      await axios.post(
        `${API_URL}/api/checkout/${checkoutId}/finalize`,
        {},
        { headers: getAuthHeader() }
      );
      navigate("/order-confirmation");
    } catch (error) {
      console.error("Error in handleFinalizeCheckout:", error);
    }
  };

  if (loading) return <p>Loading cart...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!cart || !cart.products || cart.products.length === 0) {
    return <p>Your cart is empty</p>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6 tracking-tighter">
      {/* Left Section */}
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-2xl uppercase mb-6">Checkout</h2>
        <form onSubmit={handleCreateCheckout}>
          <h3 className="text-lg mb-4">Contact Details</h3>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={user ? user.email : ""}
              className="w-full p-2 border rounded"
              disabled
            />
          </div>
          <h3 className="text-lg mb-4">Delivery</h3>
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              value={shippingDetails.name}
              onChange={(e) =>
                setShippingDetails({
                  ...shippingDetails,
                  name: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Address</label>
            <input
              type="text"
              value={shippingDetails.address}
              onChange={(e) =>
                setShippingDetails({
                  ...shippingDetails,
                  address: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">City</label>
              <input
                type="text"
                value={shippingDetails.city}
                onChange={(e) =>
                  setShippingDetails({
                    ...shippingDetails,
                    city: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Postal Code</label>
              <input
                type="text"
                value={shippingDetails.postalCode}
                onChange={(e) =>
                  setShippingDetails({
                    ...shippingDetails,
                    postalCode: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Phone</label>
            <input
              type="tel"
              value={shippingDetails.phone}
              onChange={(e) =>
                setShippingDetails({
                  ...shippingDetails,
                  phone: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mt-6">
            {!checkoutId ? (
              <button
                type="submit"
                className="w-full bg-black text-white py-3 rounded"
              >
                Continue to Payment
              </button>
            ) : (
              <div>
                <h3 className="text-lg mb-4">Pay with Paypal</h3>
                {/* Paypal button component */}
                <PayPalButton
                  amount={cart.totalPrice}
                  onSuccess={handlePaymentSuccess}
                  onError={(err) => {
                    alert("Payment failed. Try again later.");
                    console.log(err);
                  }}
                />
              </div>
            )}
          </div>
        </form>
      </div>
      {/* Right section */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg mb-4">Order Summary</h3>
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
        <div className="flex justify-between items-center text-lg">
          <p>Shipping</p>
          <p>Free</p>
        </div>
        <div className="flex justify-between items-center text-lg mt-4 border-t border-gray-300 pt-4">
          <p>Total</p>
          <p>IDR {cart.totalPrice?.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
