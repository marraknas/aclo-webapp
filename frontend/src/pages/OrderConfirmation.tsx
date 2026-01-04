import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { useEffect, useRef } from "react";
import { clearCart } from "../redux/slices/cartSlice";
import { cloudinaryImageUrl } from "../constants/cloudinary";
import { fetchOrderDetails } from "../redux/slices/orderSlice";

const OrderConfirmation = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { orderDetails, loading, error } = useAppSelector(
    (state) => state.orders
  );

  const clearedCartRef = useRef(false);

  useEffect(() => {
    if (!orderId) {
      navigate("/");
      return;
    }

    // Fetch if missing OR wrong checkout currently in redux
    if (!orderDetails?._id || orderDetails._id !== orderId) {
      dispatch(fetchOrderDetails({ orderId }));
    }
  }, [orderId, orderDetails?._id, dispatch, navigate]);

  // clear the cart when order is confirmed
  useEffect(() => {
    console.log(orderDetails);
    if (!orderId) return;
    if (loading) return;

    if (!orderDetails || orderDetails._id !== orderId) {
      navigate("/my-orders");
      return;
    }

    if (!clearedCartRef.current) {
      dispatch(clearCart());
      clearedCartRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId, orderDetails?._id, loading, dispatch, navigate]);

  const calculateEstimatedDelivery = (createdAt: string) => {
    const orderDate = new Date(createdAt);
    orderDate.setDate(orderDate.getDate() + 10);
    return orderDate.toLocaleDateString();
  };

  if (loading) return <p>Loading order...</p>;
  if (error) return <p>Error: {error}</p>;

  if (!orderDetails || orderDetails._id !== orderId) return null;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <h1 className="text-4xl font-bold text-center text-emerald-700 mb-8">
        Thank You for Your Order!
      </h1>
      <div className="p-6 rounded-lg border">
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
            <p className="text-emerald-700 text-sm">
              Estimated Delivery:{" "}
              {calculateEstimatedDelivery(orderDetails.createdAt)}
            </p>
          </div>
        </div>
        {/* Ordered Items */}
        <div className="mb-10">
          {orderDetails.orderItems.map((item) => (
            <div key={item.productId} className="flex items-center mb-4">
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
                <p className="text-md">IDR {item.price.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              </div>
            </div>
          ))}
        </div>
        {/* Payment and Delivery Info */}
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-semibold mb-2">Payment</h4>
            <p className="text-gray-600">Bank Transfer</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-2">Delivery</h4>
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
  );
};

export default OrderConfirmation;
