import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { useEffect, useState } from "react";
import { cloudinaryImageUrl } from "../constants/cloudinary";
import { fetchOrderDetails } from "../redux/slices/orderSlice";
import LoadingOverlay from "../components/common/LoadingOverlay";
import Navbar from "../components/common/Navbar";

const OrderConfirmation = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { orderDetails, error } = useAppSelector((state) => state.orders);

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!orderId) {
        navigate("/");
        return;
      }
      setLoading(true);
      try {
        // Fetch if missing OR wrong checkout currently in redux
        if (!orderDetails?._id || orderDetails._id !== orderId) {
          await dispatch(fetchOrderDetails({ orderId })).unwrap();
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) navigate("/my-orders");
        return;
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [orderId, orderDetails?._id, dispatch, navigate]);

  // clear the cart when order is confirmed
  useEffect(() => {
    console.log(orderDetails);
    if (!orderId) return;
    if (loading) return;

    if (!orderDetails || orderDetails._id !== orderId) {
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId, orderDetails?._id, loading, dispatch, navigate]);

  const calculateEstimatedDelivery = (createdAt: string) => {
    const orderDate = new Date(createdAt);
    orderDate.setDate(orderDate.getDate() + 10);
    return orderDate.toLocaleDateString();
  };

  if (loading) return <LoadingOverlay show />;
  if (error) return <p>Error: {error}</p>;

  if (!orderDetails || orderDetails._id !== orderId) return null;

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 bg-white">
        <h1 className="text-3xl sm:text-4xl font-semibold text-center text-acloblue mb-4 uppercase tracking-tight">
          Thank You for Your Order!
        </h1>
        <div className="h-[2px] w-16 bg-acloblue/30 rounded-full mx-auto mb-8" />
        <div className="p-6 rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="flex justify-between mb-10">
            {/* Order Id and Date */}
            <div>
              <h2 className="text-xl font-semibold">
                Order ID: {orderDetails._id}
              </h2>
              <p className="text-gray-500">
                Order date:{" "}
                {new Date(orderDetails.createdAt).toLocaleDateString()}
              </p>
            </div>
            {/* Estimated Delivery */}
            <div>
              <p className="text-emerald-700 text-sm inline-flex items-center px-3 py-1 rounded-full bg-emerald-50">
                Estimated Delivery:{" "}
                {calculateEstimatedDelivery(orderDetails.createdAt)}
              </p>
            </div>
          </div>
          {/* Ordered Items */}
          <div className="mb-10">
            {orderDetails.orderItems.map((item) => (
              <div
                key={item.productId}
                className="flex items-center py-4 border-b border-gray-100 last:border-b-0"
              >
                <img
                  src={cloudinaryImageUrl(item.image)}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-md mr-4"
                />
                <div>
                  <h4 className="text-md font-semibold">{item.name}</h4>
                  {item.options && Object.keys(item.options).length > 0 && (
                    <p className="text-sm text-gray-500">
                      {Object.entries(item.options)
                        .map(([key, value]) => {
                          const label =
                            key.charAt(0).toUpperCase() + key.slice(1);
                          const displayValue = String(value);
                          return `${label}: ${displayValue}`;
                        })
                        .join(" | ")}
                    </p>
                  )}
                </div>
                <div className="ml-auto text-right">
                  <p className="text-md font-semibold text-acloblue">
                    IDR {Number(item.price).toLocaleString("en-US")}
                  </p>

                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mb-6 rounded-xl bg-acloblue/5 border border-acloblue/10 p-4 text-gray-700">
            Your order has been placed and is pending payment verification.
            We'll notify you once it's approved and when your tracking number is
            available.
          </div>
          {/* Payment and Delivery Info */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-2 text-acloblue">
                Payment
              </h4>
              <p className="text-gray-600">Bank Transfer</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-2 text-acloblue">
                Delivery
              </h4>
              <p className="text-gray-600">
                {orderDetails.shippingDetails.address}
              </p>
              <p className="text-gray-600">
                {orderDetails.shippingDetails.city},{" "}
                {orderDetails.shippingDetails.postalCode}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderConfirmation;
