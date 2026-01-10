import type { ShippingOption } from "../../types/checkout";
import { IoMdClose } from "react-icons/io";
import jneLogo from "../../assets/jne-logo.png";
import grabLogo from "../../assets/grab-logo.png";

interface ShippingOptionsModalProps {
    isOpen: boolean;
    onClose: () => void;
    shippingOptions: ShippingOption[];
    selectedShipping: ShippingOption | null;
    onSelectShipping: (option: ShippingOption) => void;
}

const ShippingOptionsModal = ({
    isOpen,
    onClose,
    shippingOptions,
    selectedShipping,
    onSelectShipping,
}: ShippingOptionsModalProps) => {
    if (!isOpen) return null;

    const handleSelect = (option: ShippingOption) => {
        onSelectShipping(option);
        onClose();
    };

    return (
        <div
        className="fixed inset-0 z-50 flex items-center justify-center px-6"
        role="dialog"
        aria-modal="true"
        >
        <div
            className="absolute inset-0 bg-black/40"
            onClick={onClose}
        />
        <div className="relative w-full max-w-2xl rounded-xl bg-white p-6 shadow-lg border max-h-[80vh] overflow-y-auto">
            <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition"
            >
            <IoMdClose className="h-6 w-6 hover:text-gray-600 cursor-pointer" />
            </button>

            <h3 className="text-xl font-semibold text-gray-900 mb-4 tracking-tight">
            Select Shipping Method
            </h3>

            <p className="text-sm text-gray-600 mb-6">
            Choose your preferred shipping courier and service
            </p>

            <div className="space-y-3">
            {shippingOptions.map((option, index) => (
                <div
                key={index}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedShipping?.courierServiceCode === option.courierServiceCode
                    ? "border-black bg-gray-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onClick={() => handleSelect(option)}
                >
                <div className="flex justify-between items-start">
                    <div className="flex gap-4 flex-1">
                        <div className="flex-shrink-0">
                            {option.courierCode.toLowerCase() === 'jne' && (
                            <img
                                src={jneLogo}
                                alt="JNE logo"
                                className="w-8 h-8 object-contain"
                            />
                            )}
                            {option.courierCode.toLowerCase() === 'grab' && (
                            <img
                                src={grabLogo}
                                alt="Grab logo"
                                className="w-8 h-8 object-contain"
                            />
                            )}
                        </div>

                    <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900">
                        {option.courierName}
                        </h4>
                        <span className="text-sm text-gray-600">
                        - {option.courierServiceName}
                        </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                        {option.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-700">
                        <strong>Duration:</strong> {option.duration}
                        </span>
                    </div>
                    </div>
                    </div>

                    <div className="text-right ml-4">
                    <p className="text-xl font-semibold text-gray-900">
                        IDR {option.price.toLocaleString()}
                    </p>
                    </div>
                </div>
                </div>
            ))}
            </div>

            {shippingOptions.length === 0 && (
            <p className="text-center text-gray-500 py-8">
                No shipping options available
            </p>
            )}
        </div>
        </div>
    );
};

export default ShippingOptionsModal;
