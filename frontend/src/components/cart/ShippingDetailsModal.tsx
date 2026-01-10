import { useState, useEffect, type FormEvent } from "react";
import { IoMdClose } from "react-icons/io";
import type { ShippingDetails } from "../../types/checkout";
import type { ShippingAddress } from "../../types/user";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { addShippingAddress, updateShippingAddress } from "../../redux/slices/authSlice";

interface ShippingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (details: ShippingDetails) => void;
  userEmail?: string;
  isCalculating: boolean;
  initialMode?: "selection" | "form"; // to control initial view
}

const ShippingDetailsModal = ({
  isOpen,
  onClose,
  onSubmit,
  isCalculating,
  initialMode = "form",
}: ShippingDetailsModalProps) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  
  const [mode, setMode] = useState<"selection" | "form">("form");
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [isNewAddress, setIsNewAddress] = useState(false);
  const [setAsDefault, setSetAsDefault] = useState(false);
  const [selectedAddressInView, setSelectedAddressInView] = useState<string>("");
  
  const [shippingDetails, setShippingDetails] = useState<ShippingDetails>({
    name: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
  });

  // Set initial mode based on prop and user addresses
  useEffect(() => {
    if (user?.shippingAddresses && user.shippingAddresses.length > 0) {
      setMode(initialMode);
      
      const defaultAddress = user.shippingAddresses.find(addr => addr.isDefault);
      const addressToUse = defaultAddress || user.shippingAddresses[0];
      
      // Set selected address for radio button in selection view
      setSelectedAddressInView(addressToUse._id);
      
      if (initialMode === "form") {
        // Pre-fill default address for first-time flow
        setShippingDetails({
          name: addressToUse.name,
          address: addressToUse.address,
          city: addressToUse.city,
          postalCode: addressToUse.postalCode,
          phone: addressToUse.phone,
        });
      }
    } else {
      setMode("form");
      setIsNewAddress(true);
      setSetAsDefault(true);
    }
  }, [user, initialMode]);

  const handleSelectAddress = (address: ShippingAddress) => {
    onSubmit({
      name: address.name,
      address: address.address,
      city: address.city,
      postalCode: address.postalCode,
      phone: address.phone,
    });
    onClose();
  };

  const handleEditAddress = (address: ShippingAddress) => {
    setEditingAddressId(address._id);
    setIsNewAddress(false);
    setSetAsDefault(address.isDefault);
    setShippingDetails({
      name: address.name,
      address: address.address,
      city: address.city,
      postalCode: address.postalCode,
      phone: address.phone,
    });
    setMode("form");
  };

  const handleAddNewAddress = () => {
    setEditingAddressId(null);
    setIsNewAddress(true);
    // Auto-check default checkbox for user's first address
    const isFirstAddress = !user?.shippingAddresses || user.shippingAddresses.length === 0;
    setSetAsDefault(isFirstAddress);
    setShippingDetails({
      name: "",
      address: "",
      city: "",
      postalCode: "",
      phone: "",
    });
    setMode("form");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (user) {
      if (isNewAddress) {
        // Add new address
        const isFirstAddress = !user.shippingAddresses || user.shippingAddresses.length === 0;
        await dispatch(addShippingAddress({
          ...shippingDetails,
          isDefault: isFirstAddress || setAsDefault,
        }));
      } else if (editingAddressId) {
        // Update existing address
        await dispatch(updateShippingAddress({
          addressId: editingAddressId,
          updates: {
            ...shippingDetails,
            isDefault: setAsDefault,
          },
        }));
      }
    }
    
    onSubmit(shippingDetails);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-6"
      role="dialog"
    >
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-xl bg-white p-6 shadow-lg border max-h-[80vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
        >
          <IoMdClose className="h-6 w-6 hover:text-gray-600 cursor-pointer" />
        </button>

        {mode === "selection" ? (

          // Address Selection View - shows list of user's saved addresses
          <div>
            <h2 className="text-2xl uppercase mb-4">My Addresses</h2>
            
            <div className="space-y-4 mb-6">
              {user?.shippingAddresses?.map((address) => (
                <div
                  key={address._id}
                  className="border rounded-lg p-4 hover:border-gray-400 transition cursor-pointer"
                  onClick={() => {
                    setSelectedAddressInView(address._id);
                    handleSelectAddress(address);
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`w-5 h-5 rounded-full border-2 mt-1 flex items-center justify-center ${selectedAddressInView === address._id ? 'border-acloblue' : 'border-gray-300'}`}>
                        {selectedAddressInView === address._id && (
                          <div className="w-3 h-3 rounded-full bg-acloblue" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold">{address.name}</p>
                          <p className="text-gray-600">{address.phone}</p>
                        </div>
                        <p className="text-gray-600 text-sm">
                          {address.address}
                        </p>
                        <p className="text-gray-600 text-sm">
                          {address.city}, {address.postalCode}
                        </p>
                        {address.isDefault && (
                          <span className="inline-block mt-2 px-2 py-1 text-xs border border-acloblue text-acloblue rounded">
                            Default
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditAddress(address);
                      }}
                      className="text-acloblue hover:text-acloblue-dark text-sm font-medium"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleAddNewAddress}
              className="w-full flex-1 bg-black text-white py-3 rounded disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-gray-800 transition"
            >
              Add New Address
            </button>
          </div>
        ) : (

          // Form View - for adding/editing an address
          <div>
            <div className="flex items-center gap-2 mb-4">
              {user?.shippingAddresses && user.shippingAddresses.length > 0 && (
                <button
                  onClick={() => setMode("selection")}
                  className="text-gray-600 hover:text-gray-800"
                >
                  ←
                </button>
              )}
              <h2 className="text-2xl uppercase">
                {isNewAddress ? "Add New Address" : "Edit Address"}
              </h2>
            </div>

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

              {/* Set as Default Checkbox */}
              <div className="mb-6">
                <label className="flex items-center gap-2 text-gray-700 cursor-pointer relative group">
                  <input
                    type="checkbox"
                    checked={setAsDefault}
                    onChange={(e) => setSetAsDefault(e.target.checked)}
                    disabled={
                      !isNewAddress && 
                      editingAddressId !== null && 
                      user?.shippingAddresses?.find(addr => addr._id === editingAddressId)?.isDefault === true
                    }
                    className="w-4 h-4 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                  />
                  <span className="text-sm">Set this address as default</span>
                  {!isNewAddress && editingAddressId !== null && user?.shippingAddresses?.find(addr => addr._id === editingAddressId)?.isDefault === true && (
                    <span className="absolute left-0 top-8 hidden group-hover:block bg-gray-800 text-white text-xs py-1 px-2 rounded shadow-lg whitespace-nowrap z-10">
                      Default address cannot be unselected. Select another address as default instead.
                    </span>
                  )}
                </label>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
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
        )}
      </div>
    </div>
  );
};

export default ShippingDetailsModal;
