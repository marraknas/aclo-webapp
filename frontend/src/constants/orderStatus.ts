import type { Order } from "../types/order";

const STATUS_STYLES: Record<
  Order["status"],
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className: "bg-amber-100 text-amber-800 ring-1 ring-amber-200",
  },
  rejected: {
    label: "Rejected",
    className: "bg-rose-100 text-rose-800 ring-1 ring-rose-200",
  },
  processing: {
    label: "Processing",
    className: "bg-blue-100 text-blue-800 ring-1 ring-blue-200",
  },
  shipping: {
    label: "Shipping",
    className: "bg-indigo-100 text-indigo-800 ring-1 ring-indigo-200",
  },
  delivered: {
    label: "Delivered",
    className: "bg-green-100 text-green-800 ring-1 ring-green-200",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-gray-100 text-gray-700 ring-1 ring-gray-200",
  },
};

export const getStatusBadge = (status: Order["status"]) => {
  return STATUS_STYLES[status ?? "pending"];
};
