import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { useEffect } from "react";
import { clearCart } from "../redux/slices/cartSlice";
import { cloudinaryImageUrl } from "../constants/cloudinary";

const CheckoutStatusPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { checkout } = useAppSelector((state) => state.checkout);

  // clear the cart when order is confirmed
  useEffect(() => {
    if (checkout && checkout._id) {
      dispatch(clearCart());
    } else {
      // no checkout in state, redirect user
      navigate("/my-orders");
    }
  }, [checkout, dispatch, navigate]);

  const calculateEstimatedDelivery = (createdAt: string) => {
    const orderDate = new Date(createdAt);
    orderDate.setDate(orderDate.getDate() + 10);
    return orderDate.toLocaleDateString();
  };
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <h1 className="text-4xl font-bold text-center text-emerald-700 mb-8">
        Thank You for Your Order!
      </h1>
      {checkout && (
        <div className="p-6 rounded-lg border">
          <div className="flex justify-between mb-10">
            {/* Order Id and Date */}
            <div>
              <h2 className="text-xl font-semibold">
                Order ID: {checkout._id}
              </h2>
              <p className="text-gray-500">
                Order date: {new Date(checkout.createdAt).toLocaleDateString()}
              </p>
            </div>
            {/* Estimated Delivery */}
            <div>
              <p className="text-emerald-700 text-sm">
                Estimated Delivery:{" "}
                {calculateEstimatedDelivery(checkout.createdAt)}
              </p>
            </div>
          </div>
          {/* Ordered Items */}
          <div className="mb-10">
            {checkout.checkoutItems.map((item) => (
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
              <p className="text-gray-600">Midtrans</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-2">Delivery</h4>
              <p className="text-gray-600">
                {checkout.shippingDetails.address}
              </p>
              <p className="text-gray-600">
                {checkout.shippingDetails.city},{" "}
                {checkout.shippingDetails.postalCode}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutStatusPage;
