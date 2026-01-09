import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useEffect } from "react";
import {
  fetchAllOrders,
  updateOrderStatus,
  generateShippingLabel,
} from "../../redux/slices/adminOrderSlice";
import type { Order } from "../../types/order";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { getStatusBadge } from "../../constants/orderStatus";

const OrderManagement = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { user } = useAppSelector((state) => state.auth);
  const { orders, loading, error, generatingLabelForOrder } = useAppSelector(
    (state) => state.adminOrders
  );

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
    } else {
      dispatch(fetchAllOrders());
    }
  }, [dispatch, user, navigate]);

  const handleStatusChange = (orderId: string, status: Order["status"]) => {
    dispatch(updateOrderStatus({ id: orderId, status }));
  };

  const handleGenerateLabel = (orderId: string) => {
    dispatch(generateShippingLabel(orderId));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return (
    <div className="max-w-8xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-8">Order Management</h2>
      <h3 className="text-xl font-bold mb-6">Pending Orders</h3>
      <h3 className="text-xl font-bold mb-6">All Orders</h3>
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="min-w-full text-left text-gray-500">
          <thead className="bg-gray-100 text-xs uppercase text-gray-700">
            <tr>
              <th className="py-3 px-4">Order ID</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Total Price (IDR)</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b hover:bg-gray-50 cursor-pointer"
                >
                  <td className="py-4 px-4 font-medium text-gray-900 whitespace-nowrap">
                    {order._id}
                  </td>
                  <td className="p-4">
                    {typeof order.user === "string"
                      ? order.user
                      : order.user.name}
                  </td>
                  <td className="p-4">{order.totalPrice.toLocaleString()}</td>
                  <td className="p-4">
                    <div className="flex flex-col items-start mt-4 sm:mt-0">
                      {(() => {
                        const badge = getStatusBadge(order.status);
                        return (
                          <span
                            className={`${badge.className} inline-flex items-center rounded-full px-2 py-1 text-xs sm:text-sm font-medium`}
                          >
                            {badge.label}
                          </span>
                        );
                      })()}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleGenerateLabel(order._id)}
                        disabled={generatingLabelForOrder === order._id}
                        className={`px-4 py-2 rounded flex items-center ${
                          generatingLabelForOrder === order._id
                            ? "bg-blue-500/50 cursor-not-allowed"
                            : "bg-blue-500 hover:bg-blue-600 text-white"
                        }`}
                      >
                        {generatingLabelForOrder === order._id ? (
                          <>
                            <AiOutlineLoading3Quarters className="animate-spin mr-2 h-4 w-4" />
                            Generating...
                          </>
                        ) : (
                          "Generate Label"
                        )}
                      </button>
                      <button
                        onClick={() =>
                          handleStatusChange(order._id, "delivered")
                        }
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                      >
                        Add Tracking ID
                      </button>
                      {/* generate label for pending & processing, add tracking ID is for processing auto convert to shipping, edit tracking ID for shipping, see payment proof for all, see payment proof for pending - modal shows reject/approve, mark as delivered for shipping, canclled is from user side, admin side shows accept/reject cancellation. user needs to beb warned that cancellation can be rejected.  */}
                      {/* pending: see payment proof - accept/reject, generate label, Details
                      rejected: mark as pending, details
                      processing: generate label, add tracking id, details
                      shipping: edit tracking id, mark as delivered, details
                      delivered: details
                      cancelled: view cancellation request - accept/reject, details */}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  No Orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderManagement;
