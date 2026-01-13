import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useEffect, useState } from "react";
import {
  fetchAllOrders,
  updateOrderStatus,
  generateShippingLabel,
  fetchAdminOrderDetails,
  updateAdminRemarks,
  updateTrackingLink,
} from "../../redux/slices/adminOrderSlice";
import type { CancelRequest, Order, OrderStatus } from "../../types/order";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { getStatusBadge } from "../../constants/orderStatus";
import ActionModal from "./ActionModal";
import type { PaymentProof } from "../../types/checkout";
import { FaEye } from "react-icons/fa6";
import OrderDetailsModal from "./OrderDetailsModal";
import TrackingModal from "./TrackingModal";
import ActionConfirmationModal from "./ActionConfirmationModal";
import RemarksModal from "./RemarksModal";

const OrderManagement = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { user } = useAppSelector((state) => state.auth);
  const {
    orders,
    loading,
    orderDetailsLoading,
    trackingLinkLoading,
    error,
    generatingLabelForOrder,
    orderDetails,
  } = useAppSelector((state) => state.adminOrders);
  const [paymentProofOpen, setPaymentProofOpen] = useState<boolean>(false);
  const [cancelRequestOpen, setCancelRequestOpen] = useState<boolean>(false);
  const [orderDetailsOpen, setOrderDetailsOpen] = useState<boolean>(false);
  const [trackingModalOpen, setTrackingModalOpen] = useState<boolean>(false);
  const [remarksModalOpen, setRemarksModalOpen] = useState<boolean>(false);
  const [actionConfirmationModalOpen, setActionConfirmationModalOpen] = useState<boolean>(false);
  const [trackingAction, setTrackingAction] = useState<"add" | "edit">("add");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedPaymentProof, setSelectedPaymentProof] =
    useState<PaymentProof | null>(null);
  const [selectedCancelRequest, setSelectedCancelRequest] =
    useState<CancelRequest | null>(null);
  const [selectedOrderTrackingLink, setSelectedOrderTrackingLink] =
    useState<string>("");
  const [pendingAction, setPendingAction] = useState<{
    orderId: string, 
    targetStatus: OrderStatus, 
    title: string, 
    message: string,
    onAfterConfirm?: () => void;
  } | null>(null);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
    } else {
      dispatch(fetchAllOrders());
    }
  }, [dispatch, user, navigate]);

  const handleStatusChange = (orderId: string, status: OrderStatus) => {
    dispatch(updateOrderStatus({ id: orderId, status }));
  };

  const handleGenerateLabel = (orderId: string) => {
    dispatch(generateShippingLabel(orderId));
  };

  const handleOpenOrderDetails = async (orderId: string) => {
    setSelectedOrderId(orderId);
    setOrderDetailsOpen(true);
    dispatch(fetchAdminOrderDetails({ id: orderId }));
  };

  const handleCloseOrderDetails = () => {
    setOrderDetailsOpen(false);
    setSelectedOrderId(null);
  };

  const handleOpenPaymentProof = (order: Order) => {
    if (!order.paymentProof) return; // guard clause

    setSelectedPaymentProof(order.paymentProof);
    setSelectedOrderId(order._id);
    setPaymentProofOpen(true);
  };

  const handleClosePaymentProof = () => {
    setPaymentProofOpen(false);
    setSelectedPaymentProof(null);
    setSelectedOrderId(null);
  };

  const handleOpenCancelRequest = (order: Order) => {
    if (!order.cancelRequest) return; // guard clause

    setSelectedCancelRequest(order.cancelRequest);
    setSelectedOrderId(order._id);
    setCancelRequestOpen(true);
  };

  const handleCloseCancelRequest = () => {
    setCancelRequestOpen(false);
    setSelectedCancelRequest(null);
    setSelectedOrderId(null);
  };

  const handleOpenAddTracking = (order: Order) => {
    setTrackingAction("add");
    setSelectedOrderId(order._id);
    setSelectedOrderTrackingLink(""); // add starts blank
    setTrackingModalOpen(true);
  };

  const handleOpenEditTracking = (order: Order) => {
    setTrackingAction("edit");
    setSelectedOrderId(order._id);
    setSelectedOrderTrackingLink(order.trackingLink ?? ""); // edit prefilled
    setTrackingModalOpen(true);
  };

  const handleCloseTrackingModal = () => {
    setTrackingModalOpen(false);
    setSelectedOrderTrackingLink("");
    setSelectedOrderId(null);
  };

  const handleOpenRemarksModal = (order: Order) => {
    setRemarksModalOpen(true);
    setSelectedOrderId(order._id);
  }

  const handleCloseRemarksModal = () => {
    setSelectedOrderId(null);
    setRemarksModalOpen(false);
  }

  const handleOpenActionConfirmationModal = (orderId: string, targetStatus: OrderStatus, title: string, message: string, onAfterConfirm?: () => void) => {
    setPendingAction({orderId, targetStatus, title, message, onAfterConfirm});
    setActionConfirmationModalOpen(true);
  }

  const handleCloseActionConfirmation = () => {
    setActionConfirmationModalOpen(false);
    setPendingAction(null);
  }

  const handleConfirmActionConfirmation = () => {
    if (pendingAction) {
      handleStatusChange(pendingAction.orderId, pendingAction.targetStatus);
      if (pendingAction.onAfterConfirm) {
        pendingAction.onAfterConfirm();
      }
      handleCloseActionConfirmation();
    }
  }

  const renderActionButtons = (order: Order) => {
    // create a common button style
    const baseBtn =
      "px-4 py-2 rounded-md flex items-center text-sm font-medium cursor-pointer transition disabled:opacity-50 disabled:cursor-not-allowed";
    const actionBtn = {
      // primary: "bg-indigo-600 text-white hover:bg-indigo-500",
      primary: "bg-sky-600 text-white hover:bg-sky-500",
      success: "bg-emerald-600 text-white hover:bg-emerald-500",
      milestone: "bg-teal-600 text-white hover:bg-teal-500",
      warning: "bg-amber-500 text-white hover:bg-amber-400",
      dangerOutline:
        "bg-white text-rose-700 border-2 border-rose-600 ring-1 ring-rose-200 hover:bg-rose-50 hover:border-rose-700 hover:ring-rose-300",
      infoOutline:
        "bg-white text-blue-700 border-2 border-blue-600 ring-1 ring-blue-200 hover:bg-blue-50 hover:border-blue-700 hover:ring-blue-300",
      neutralOutline:
        "bg-white text-slate-700 border-2 border-slate-600 ring-1 ring-slate-200 hover:bg-slate-100 hover:border-slate-700 hover:ring-slate-300",
      neutral: "bg-slate-200 text-slate-700 hover:bg-slate-300",
    };

    switch (order.status) {
      case "pending":
        return (
          <>
            <button
              onClick={() => handleOpenPaymentProof(order)}
              className={`${baseBtn} ${actionBtn.warning}`}
            >
              Payment Proof
            </button>
          </>
        );
      case "rejected":
        return (
          <>
            <button
              onClick={() => {
                handleOpenActionConfirmationModal(
                  order._id,
                  "pending",
                  "Mark as Pending",
                  `Are you sure you want to mark this order as **Pending**?`
                )
              }}
              className={`${baseBtn} ${actionBtn.neutralOutline}`}
            >
              Mark as Pending
            </button>
          </>
        );
      case "processing":
        return (
          <>
            <button
              onClick={() => handleGenerateLabel(order._id)}
              disabled={generatingLabelForOrder === order._id}
              className={`${baseBtn} ${actionBtn.infoOutline}`}
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
              onClick={() => handleOpenAddTracking(order)}
              className={`${baseBtn} ${actionBtn.milestone}`}
            >
              Add Tracking Link
            </button>
          </>
        );
      case "shipping":
        return (
          <>
            <button
              onClick={() => {
                handleOpenActionConfirmationModal(
                  order._id,
                  "delivered",
                  "Mark as Delivered",
                  `Are you sure you want to mark this order as **Delivered**?\n
                  The user will be notified that the order has arrived.`
                )
              }}
              className={`${baseBtn} ${actionBtn.success}`}
            >
              Mark as Delivered
            </button>
            <button
              onClick={() => handleOpenEditTracking(order)}
              className={`${baseBtn} ${actionBtn.primary}`}
            >
              Edit Tracking Link
            </button>
          </>
        );
      case "delivered":
        return (
          <>
            <button
              // onClick={() => {
              //   handleOpenActionConfirmationModal(
              //     order._id,
              //     "returned",
              //     "Mark as Returned",
              //     `Are you sure you want to mark this order as **Returned**?`
              //   )
              // }}
              onClick={() => {
                handleOpenRemarksModal(order);
              }}
              className={`${baseBtn} ${actionBtn.neutralOutline}`}
            >
              Mark as Returned
            </button>
            <button
              // onClick={() => {
              //   handleOpenActionConfirmationModal(
              //     order._id,
              //     "refunded",
              //     "Mark as Refunded",
              //     `Are you sure you want to mark this order as **Refunded**?`,
              //   )
              // }}
              onClick={() => {
                handleOpenRemarksModal(order);
              }}
              className={`${baseBtn} ${actionBtn.dangerOutline}`}
            >
              Mark as Refunded
            </button>
            <button
              // onClick={() => {
              //   handleOpenActionConfirmationModal(
              //     order._id,
              //     "exchanged",
              //     "Mark as Exchanged",
              //     `Are you sure you want to mark this order as **Exchanged**?`
              //   )
              // }}
              onClick={() => {
                handleOpenRemarksModal(order);
              }}
              className={`${baseBtn} ${actionBtn.infoOutline}`}
            >
              Mark as Exchanged
            </button>
          </>
        );
      case "cancelling":
        return (
          <>
            <button
              onClick={() => handleOpenCancelRequest(order)}
              className={`${baseBtn} ${actionBtn.warning}`}
            >
              Cancellation Request
            </button>
          </>
        );
      default:
        return null;
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return (
    <div className="max-w-8xl mx-auto p-6">
      {selectedPaymentProof && paymentProofOpen && selectedOrderId && (
        <ActionModal
          onClose={handleClosePaymentProof}
          type="paymentProof"
          data={selectedPaymentProof}
          onAccept={() => handleOpenActionConfirmationModal(
            selectedOrderId,
            "processing",
            "Accept Payment Proof",
            `Are you sure you want to accept this payment proof?\n
                  This will mark the order as **Processing**.`,
            handleClosePaymentProof
          )}
          onReject={() => handleOpenActionConfirmationModal(
            selectedOrderId,
            "rejected",
            "Reject Payment Proof",
            `Are you sure you want to reject this payment proof?\n
                  This will mark the order as **Rejected**.`,
            handleClosePaymentProof
          )}
          loading={loading}
        />
      )}
      {selectedCancelRequest && cancelRequestOpen && selectedOrderId && (
        <ActionModal
          onClose={handleCloseCancelRequest}
          type="cancelRequest"
          data={selectedCancelRequest}
          onAccept={() => handleOpenActionConfirmationModal(
            selectedOrderId,
            "cancelled",
            "Accept Cancel Request",
            `Are you sure you want to accept this cancel request?\n
                  This will mark the order as **Cancelled**.`,
            handleCloseCancelRequest
          )}
          onReject={() => handleOpenActionConfirmationModal(
            selectedOrderId,
            "pending",
            "Reject Cancel Request",
            `Are you sure you want to reject this cancel request?\n
                  This will revert the order status to **Pending**.`,
            handleCloseCancelRequest
          )}
          loading={loading}
        />
      )}
      {orderDetails && orderDetailsOpen && (
        <OrderDetailsModal
          onClose={handleCloseOrderDetails}
          orderDetails={orderDetails}
          loading={orderDetailsLoading}
          onSaveAdminRemarks={async (orderId, adminRemarks) => {
            await dispatch(
              updateAdminRemarks({ id: orderId, adminRemarks })
            ).unwrap();
          }}
        />
      )}
      {/* TODO: USE THE CONFIRMATION MODAL AFTER ADD TRACKING LINK HAS BEEN DEBUGGED */}
      {trackingModalOpen && selectedOrderId && (
        <TrackingModal
          action={trackingAction}
          initialValue={selectedOrderTrackingLink}
          onClose={handleCloseTrackingModal}
          onCancel={handleCloseTrackingModal}
          loading={trackingLinkLoading}
          onSaveTrackingLink={async (trackingLink) => {
            await dispatch(
              updateTrackingLink({ id: selectedOrderId, trackingLink })
            ).unwrap();
            handleCloseTrackingModal();
          }}
        />
      )}
      {remarksModalOpen && selectedOrderId && (
        <RemarksModal 
          orderId={selectedOrderId}
          onClose={handleCloseRemarksModal}
          onSave={async (orderId, adminRemarks) => {
            await dispatch(updateAdminRemarks({id: orderId, adminRemarks: adminRemarks})).unwrap();
            handleCloseRemarksModal();
          }}
        />
      )}
      {actionConfirmationModalOpen && pendingAction && (
        <ActionConfirmationModal
          onClose={handleCloseActionConfirmation}
          onConfirm={handleConfirmActionConfirmation}
          title={pendingAction.title}
          message={pendingAction.message}
          loading={loading}
        />
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
              <th className="py-3 px-4">Created At</th>
              <th className="py-3 px-4">Total Price (IDR)</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order._id} className="border-b">
                  <td className="py-4 px-4 font-medium text-gray-900 whitespace-nowrap">
                    {order._id}
                  </td>
                  <td className="p-4">
                    {typeof order.user === "string"
                      ? order.user
                      : order.user.name}
                  </td>
                  <td className="p-4">
                    {new Date(order.updatedAt).toLocaleString()}
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
                      {renderActionButtons(order)}
                      {/* Details button */}
                      <button
                        type="button"
                        onClick={() => handleOpenOrderDetails(order._id)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded hover:bg-gray-100 cursor-pointer ml-auto"
                        title="View details"
                      >
                        <FaEye className="h-6 w-6" />
                      </button>
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
