import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useEffect, useState } from "react";
import {
  fetchAllOrders,
  updateOrderStatus,
  generateShippingLabel,
} from "../../redux/slices/adminOrderSlice";
import type { Order } from "../../types/order";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { getStatusBadge } from "../../constants/orderStatus";
import PaymentProofModal from "./PaymentProofModal";
import type { PaymentProof } from "../../types/checkout";

const OrderManagement = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { user } = useAppSelector((state) => state.auth);
  const { orders, loading, error, generatingLabelForOrder } = useAppSelector(
    (state) => state.adminOrders
  );
  const [paymentProofOpen, setPaymentProofOpen] = useState<boolean>(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedPaymentProof, setSelectedPaymentProof] = useState<PaymentProof | null>(null);

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

  const handleOpenPaymentProof = (order: Order) => {
    if (!order.paymentProof) return; // guard clause

    setSelectedPaymentProof(order.paymentProof);
    setSelectedOrderId(order._id);
    setPaymentProofOpen(true);
  }

  const renderActionbuttons = (order: Order) => {
    // create a common button style
    const baseBtn = "px-4 py-2 rounded flex items-center text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
    const actionBtn = {
      primary: "bg-blue-500 hover:bg-blue-600 text-white",
      success: "bg-green-500 hover:bg-green-600 text-white",
      // danger: "bg-red-500 hover:bg-red-600 text-white",
      warning: "bg-yellow-400 hover:bg-yellow-500 text-gray-900",
      // info: "bg-purple-500 hover:bg-purple-600 text-white",
      neutral: "bg-gray-200 hover:bg-gray-300 text-gray-800",
    }
    switch (order.status) {
      case "pending": 
        return (
          <>
            <button 
              onClick={() => handleOpenPaymentProof(order)} 
              className={`${baseBtn} ${actionBtn.warning}`}>
              Payment Proof
            </button>
            <button
              onClick={() => handleGenerateLabel(order._id)}
              disabled={generatingLabelForOrder === order._id}
              className={`${baseBtn} ${actionBtn.primary}`}
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
            <button className={`${baseBtn} ${actionBtn.neutral}`}>
              Details
            </button>
          </>
        )
      case "rejected":
        return (
          <>
            <button className={`${baseBtn} ${actionBtn.warning}`}>
              Mark as Pending
            </button>
            <button className={`${baseBtn} ${actionBtn.neutral}`}>
              Details
            </button>
          </>
        )
      case "processing":
        return (
          <>
            <button
              onClick={() => handleGenerateLabel(order._id)}
              disabled={generatingLabelForOrder === order._id}
              className={`${baseBtn} ${actionBtn.primary}`}
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
            <button className={`${baseBtn} ${actionBtn.success}`}>
              Add Tracking ID
            </button>
            <button className={`${baseBtn} ${actionBtn.neutral}`}>
              Details
            </button>
          </>
        )
      case "shipping":
        return (
          <>
            <button className={`${baseBtn} ${actionBtn.primary}`}>Edit Tracking ID</button>
            <button className={`${baseBtn} ${actionBtn.success}`}>Mark as Delivered</button>
            <button className={`${baseBtn} ${actionBtn.neutral}`}>Details</button>
          </>
        )
      case "cancelled":
        return (
          <>
            <button className={`${baseBtn} ${actionBtn.warning}`}>View Cancellation Request</button>
            <button className={`${baseBtn} ${actionBtn.neutral}`}>Details</button>
          </>
        )
    }
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return (
    <div className="max-w-8xl mx-auto p-6">
      {selectedPaymentProof && (
        <PaymentProofModal 
          isOpen={paymentProofOpen} 
          onClose={() => {
            setPaymentProofOpen(false);
            setSelectedPaymentProof(null);
            setSelectedOrderId(null);
          }} 
          PaymentProof={selectedPaymentProof} 
          onAccept={() => handleStatusChange(selectedOrderId, "processing")}
          onReject={() => handleStatusChange(selectedOrderId, "rejected")}
          loading={loading} />
      )}  
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
                    <div className="flex flex-wrap gap-2">
                      {renderActionbuttons(order)}
                      {/* generate label for pending & processing, 
                      add tracking ID is for processing auto convert to shipping, 
                      edit tracking ID for shipping, 
                      see payment proof for pending - modal shows reject/approve, add payment proof inside the order details, 
                      mark as delivered for shipping, 
                      canclled is from user side, 
                      admin side shows accept/reject cancellation. 
                      user needs to be warned that cancellation can be rejected. */}
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
