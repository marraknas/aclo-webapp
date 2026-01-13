import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import MidtransPayButton from "./MidtransPayButton";
import ShippingOptionsModal from "./ShippingOptionsModal";
import ShippingDetailsModal from "./ShippingDetailsModal";
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
import Navbar from "../common/Navbar";

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
    useState(true);
  const [shippingDetails, setShippingDetails] = useState<ShippingDetails>({
    name: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
  });

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
    };
  }, [dispatch]);

  const handleShippingDetailsSubmit = async (
    shippingDetails: ShippingDetails
  ) => {
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
      <Navbar />
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
            <h2 className="text-2xl uppercase text-acloblue">Order Summary</h2>
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
          <div className="mt-2 rounded-2xl border border-gray-100 overflow-hidden bg-white">
            <div className="divide-y divide-gray-100">
              {cart.products.map((product, index) => (
                <div
                  key={index}
                  className="flex items-start justify-between gap-4 px-5 py-4"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={cloudinaryImageUrl(product.image)}
                      alt={product.name}
                      className="w-20 h-24 object-cover rounded-xl border border-gray-100"
                    />
                    <div>
                      <h3 className="text-[15px] font-medium text-gray-900">
                        {product.name}
                      </h3>

                      {product.options &&
                        Object.keys(product.options).length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {Object.entries(product.options).map(
                              ([key, value]) => (
                                <span
                                  key={key}
                                  className="text-xs px-2.5 py-1 rounded-full bg-acloblue/10 text-acloblue"
                                >
                                  {key.charAt(0).toUpperCase() + key.slice(1)}:{" "}
                                  {String(value)}
                                </span>
                              )
                            )}
                          </div>
                        )}
                    </div>
                  </div>

                  <p className="text-xl text-acloblue font-semibold">
                    IDR {Number(product.price).toLocaleString("id-ID")}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-5">
            <div className="flex justify-between items-center">
              <p className="text-gray-700">Subtotal</p>
              <p className="text-lg font-medium text-gray-900">
                IDR {Number(cart.totalPrice).toLocaleString("id-ID")}
              </p>
            </div>

            <div className="mt-3 flex justify-between items-start">
              <p className="text-gray-700">Shipping</p>
              <div className="text-right">
                {selectedShipping ? (
                  <>
                    <p className="text-lg font-medium text-gray-900">
                      IDR{" "}
                      {Number(selectedShipping.price).toLocaleString("id-ID")}
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowShippingModal(true)}
                      className="mt-1 text-sm text-acloblue hover:underline"
                    >
                      View options
                    </button>
                  </>
                ) : (
                  <span className="inline-flex items-center text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-500">
                    Select shipping
                  </span>
                )}
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-gray-100 flex justify-between items-center">
              <p className="text-lg font-semibold text-gray-900">Total</p>
              <p className="text-2xl font-semibold text-acloblue">
                IDR{" "}
                {Number(
                  cart.totalPrice + (selectedShipping?.price || 0)
                ).toLocaleString("id-ID")}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="button"
              onClick={async () => {
                const id = await handleCreateCheckout(); // return checkout
                if (id) navigate(`/payment/${id}`);
              }}
              disabled={!selectedShipping}
              className="w-full bg-acloblue text-white py-3 rounded disabled:bg-gray-400 disabled:cursor-not-allowed hover:opacity-80 transition cursor-pointer"
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
