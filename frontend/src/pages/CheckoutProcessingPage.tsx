// import axios from "axios";
// import { useEffect, useRef, useState } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import { API_URL, getAuthHeader } from "../constants/api";

// type CheckoutStatus = {
//   _id: string;
//   isPaid: boolean;
//   isFinalized?: boolean;
//   paymentStatus?: string; // "paid" | "pending" | "failed" | etc
// };

// function sleep(ms: number) {
//   return new Promise((r) => setTimeout(r, ms));
// }

// const CheckoutProcessingPage = () => {
//   const navigate = useNavigate();
//   const [params] = useSearchParams();
//   const checkoutId = params.get("checkoutId") ?? params.get("order_id");

//   const [message, setMessage] = useState("We are processing your order...");
//   const [detail, setDetail] = useState<string | null>(null);

//   // prevent double finalize in React strict mode / rerenders
//   const didFinalizeRef = useRef(false);
//   const cancelledRef = useRef(false);

//   useEffect(() => {
//     cancelledRef.current = false;

//     if (!checkoutId) {
//       setMessage("Missing checkoutId.");
//       setDetail("Please go back to checkout and try again.");
//       return;
//     }

//     async function run() {
//       try {
//         setMessage("Checking payment status...");

//         // Poll up to ~60 seconds (adjust as you like)
//         const maxAttempts = 15;
//         const intervalMs = 2000;

//         let status: CheckoutStatus | null = null;

//         for (let attempt = 1; attempt <= maxAttempts; attempt++) {
//           if (cancelledRef.current) return;

//           // 1) Check checkout status from your backend
//           const { data } = await axios.get<CheckoutStatus>(
//             `${API_URL}/api/checkout/${checkoutId}`,
//             { headers: getAuthHeader() }
//           );

//           status = data;

//           // Already finalized? Just go to confirmation
//           if (status.isFinalized) {
//             navigate("/order-confirmation", { replace: true });
//             return;
//           }

//           // Paid? break and finalize
//           if (status.isPaid || status.paymentStatus === "paid") {
//             break;
//           }

//           // Failed/expired/cancelled? route to pending/checkout
//           if (
//             status.paymentStatus &&
//             ["failed", "expire", "cancel", "deny"].includes(
//               status.paymentStatus
//             )
//           ) {
//             setMessage("Payment failed or expired.");
//             setDetail("Please return to checkout and try again.");
//             return;
//           }

//           // Still pending
//           setMessage("Waiting for payment confirmation...");
//           setDetail(`Attempt ${attempt}/${maxAttempts}`);
//           await sleep(intervalMs);
//         }

//         if (cancelledRef.current) return;

//         // If still not paid after polling
//         if (!status || (!status.isPaid && status.paymentStatus !== "paid")) {
//           setMessage("Payment is still not confirmed.");
//           setDetail(
//             "If you used QR/VA, please complete the payment and refresh later."
//           );
//           // You can navigate to /payment-pending instead if you build it
//           return;
//         }

//         // 2) Finalize order exactly once
//         if (didFinalizeRef.current) return;
//         didFinalizeRef.current = true;

//         setMessage("Finalizing your order...");

//         await axios.post(
//           `${API_URL}/api/checkout/${checkoutId}/finalize`,
//           {},
//           { headers: getAuthHeader() }
//         );

//         // 3) Done
//         navigate("/order-confirmation", { replace: true });
//       } catch (err: any) {
//         // If finalize returns "Already Finalized", treat as success
//         const msg = err?.response?.data?.message as string | undefined;

//         if (msg?.toLowerCase().includes("already finalized")) {
//           navigate("/order-confirmation", { replace: true });
//           return;
//         }

//         if (msg?.toLowerCase().includes("not paid")) {
//           setMessage("Payment not confirmed yet.");
//           setDetail(
//             "Please wait a bit and refresh this page, or complete the payment if you haven’t."
//           );
//           return;
//         }

//         setMessage("Something went wrong while processing your order.");
//         setDetail(msg ?? "Please return to checkout and try again.");
//       }
//     }

//     run();

//     return () => {
//       cancelledRef.current = true;
//     };
//   }, [checkoutId, navigate]);

//   return (
//     <div className="max-w-xl mx-auto py-16 px-6">
//       <h1 className="text-2xl font-semibold mb-3">{message}</h1>
//       {detail && <p className="text-gray-600 mb-6">{detail}</p>}

//       <div className="flex gap-3">
//         <button
//           className="px-4 py-2 rounded bg-black text-white"
//           onClick={() => window.location.reload()}
//         >
//           Refresh
//         </button>
//         <button
//           className="px-4 py-2 rounded border"
//           onClick={() => navigate("/checkout")}
//         >
//           Back to Checkout
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CheckoutProcessingPage;
