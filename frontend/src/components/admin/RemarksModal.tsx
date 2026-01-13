import { useState } from "react";

interface RemarksModalProps {
  orderId: string;
    onClose: () => void;
    onSave: (orderId: string, adminRemarks: string) => Promise<void>;
}

const RemarksModal = ({orderId, onClose, onSave}: RemarksModalProps) => {
  const [draft, setDraft] = useState<string>("");
  const [saving, setSaving] = useState(false); 
  const [error, setError] = useState("");

  const handleSave = async () => { 
    try { 
      setSaving(true); 
      setError(""); await 
      onSave(orderId, draft); 
      onClose(); // close after successful save 
    } catch (e: any) { 
      setError(e?.message ?? "Failed to save remarks."); 
    } finally { 
      setSaving(false); 
    } 
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg p-6 w-[500px]">
        <h3 className="text-lg font-semibold mb-4">Add Remarks</h3>
        <textarea value={draft} onChange={(e) => setDraft(e.target.value)}
          rows={5}
          className="w-full rounded-lg border p-3 text-sm outline-none"
          placeholder="Write internal admin remarks here..."
        />
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        <div className="flex justify-end gap-2 mt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border text-sm hover:bg-gray-50" >
            Cancel
          </button>
          <button type="button" onClick={handleSave} disabled={saving} className="px-4 py-2 rounded-lg bg-black text-white text-sm hover:bg-black/90 disabled:opacity-60" >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default RemarksModal