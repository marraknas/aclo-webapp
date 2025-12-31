import { useState, type FormEvent } from "react";
import { IoMdClose } from "react-icons/io";
import type { ShippingDetails } from "../../types/checkout";

interface ShippingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (details: ShippingDetails) => void;
  userEmail?: string;
  isCalculating: boolean;
}

const ShippingDetailsModal = ({
  isOpen,
  onClose,
  onSubmit,
  isCalculating,
}: ShippingDetailsModalProps) => {
  const [shippingDetails, setShippingDetails] = useState<ShippingDetails>({
    name: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(shippingDetails);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-6"
      role="dialog"
    >
      <div className="absolute inset-0 bg-black/30" />
      <div className="relative w-full max-w-2xl rounded-xl bg-white p-6 shadow-lg border max-h-[80vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full text-gray-500"
        >
          <IoMdClose className="h-6 w-6 hover:text-gray-600 cursor-pointer" />
        </button>

        <h2 className="text-2xl uppercase">
          Shipping Details
        </h2>

        <p className="text-sm text-gray-600 mb-4">
          Please enter your shipping details before proceeding to order.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Name *</label>
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
            <label className="block text-gray-700">Address *</label>
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
              <label className="block text-gray-700">City *</label>
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
              <label className="block text-gray-700">Postal Code *</label>
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
                minLength={5}
                maxLength={5}
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700">Phone *</label>
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

          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCalculating}
              className="flex-1 bg-black text-white py-3 rounded disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-gray-800 transition"
            >
              {isCalculating ? "Loading..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShippingDetailsModal;
