import { useState } from "react";

interface InputModalProps {
  initialValue: string;
  onSave: (value: string) => void;
  onCancel: () => void;
  saving?: boolean;
}

const InputModal = ({
  initialValue,
  onSave,
  onCancel,
  saving = false,
}: InputModalProps) => {
  const [draft, setDraft] = useState(initialValue);

  const handleSave = () => {
    if (!draft.trim()) return; // optional: prevent empty save
    onSave(draft.trim());
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h4 className="text-lg text-acloblue font-semibold mb-4">Tracking Link</h4>

        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          disabled={saving}
          className="w-full rounded-lg border p-2 text-sm outline-none mb-4"
          placeholder="Paste courier tracking link here..."
        />

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="px-4 py-2 rounded-lg border text-sm hover:bg-gray-50 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 rounded-lg bg-acloblue text-white text-sm hover:bg-black/90 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputModal;
