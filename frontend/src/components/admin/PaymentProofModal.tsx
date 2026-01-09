import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import type { PaymentProof } from "../../types/checkout";
import { cloudinaryImageUrl } from "../../constants/cloudinary";

interface PaymentProofModalProps {
  isOpen: boolean;
  onClose: () => void;
  PaymentProof: PaymentProof;
  onAccept: () => void;
  onReject: () => void;
  loading: boolean;
}

const PaymentProofModal = ({
  isOpen,
  onClose,
  PaymentProof,
  onAccept,
  onReject,
  loading
}: PaymentProofModalProps) => {
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
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
          Payment Proof
        </h2>
                <img
                  src={cloudinaryImageUrl(PaymentProof.publicId)}
                  alt={PaymentProof.publicId}
                  className="w-20 h-24 object-cover mr-4"
                  onClick={() => setPreviewOpen(true)}
                />
                
<div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Uploaded At
                </label>
                <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">
                  {PaymentProof.uploadedAt}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Note
                </label>
                <div className="bg-gray-50 px-4 py-3 rounded-lg min-h-[80px]">
                  {PaymentProof.note ? (
                    <p className="text-gray-900 whitespace-pre-wrap">{PaymentProof.note}</p>
                  ) : (
                    <p className="text-gray-400 italic">No note provided</p>
                  )}
                </div>
              </div>
            </div>



          <div className="flex gap-3 p-6">
            <button
              disabled={loading}
              onClick={onReject}
              className="flex-1 bg-red-500 text-white py-3 rounded hover:bg-red-600 disabled:bg-red-500/50 disabled:cursor-not-allowed transition"
            >
{loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-red-600 border-t-transparent"></div>
                  Processing...
                </span>
              ) : (
                "Reject"
              )}
            </button>
            <button
              type="submit"
              disabled={loading}
              onClick={onAccept}
              className="flex-1 bg-green-500 rounded hover:bg-green-600 text-white py-3 disabled:bg-green-500/50 disabled:cursor-not-allowed transition"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Processing...
                </span>
              ) : (
                "Accept"
              )}
            </button>
          </div>
          {previewOpen && PaymentProof && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
            onClick={() => setPreviewOpen(false)} // click backdrop to close
          >
            <div
              className="relative max-w-7xl max-h-[95vh] w-full h-full flex items-center justify-center"
            >
              <button
                onClick={() => setPreviewOpen(false)}
                className="absolute -top-10 right-0 text-white text-sm px-3 py-1 rounded bg-white/10 hover:bg-white/20"
              >
                Close
              </button>

              <img
                src={cloudinaryImageUrl(PaymentProof.publicId)}
                alt="Payment proof preview"
                className="w-full h-full object-contain rounded-lg"
                onClick={(e) => e.stopPropagation()} // prevent closing when clicking the image
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentProofModal;
