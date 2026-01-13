import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";

interface TrackingModalProps {
  initialValue: string;
  onClose: () => void;
  action: "edit" | "add";
  onSaveTrackingLink: (value: string) => void;
  onCancel: () => void;
  loading: boolean;
}

const TrackingModal = ({
  initialValue,
  onClose,
  action,
  onSaveTrackingLink,
  onCancel,
  loading,
}: TrackingModalProps) => {
  const [draft, setDraft] = useState(initialValue);

  useEffect(() => {
    setDraft(initialValue);
  }, [initialValue]);

  const handleSave = () => {
    if (!draft.trim()) return; // optional: prevent empty save
    onSaveTrackingLink(draft.trim());
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black/30" />
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <button
          onClick={onClose}
          className="absolute right-4 top-5 inline-flex h-9 w-9 items-center justify-center rounded-full text-gray-500"
        >
          <IoMdClose className="h-8 w-8 hover:text-gray-600 cursor-pointer" />
        </button>
        <h4 className="text-lg text-acloblue font-semibold mb-4">
          {action === "add" ? "Add" : "Edit"} Tracking Link
        </h4>

        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          disabled={loading}
          className="w-full rounded-lg border p-2 text-sm outline-none mb-4"
          placeholder="Paste courier tracking link here..."
        />

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 rounded-lg border text-sm hover:bg-gray-50 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-acloblue text-white text-sm hover:bg-black/90 disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrackingModal;
