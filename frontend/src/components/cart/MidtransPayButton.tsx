declare global {
  interface Window {
    snap?: {
      pay: (token: string, opts?: Record<string, any>) => void;
    };
  }
}

const MIDTRANS_CLIENT_KEY = import.meta.env.VITE_MIDTRANS_CLIENT_KEY as string;
const MIDTRANS_SNAP_URL = import.meta.env.VITE_MIDTRANS_SNAP_URL as string;

type MidtransPayButtonProps = {
  checkoutId: string;
  amount: number;
  onSuccess: () => void; // change this to redirect probably
  onError?: (err: unknown) => void;
};

function loadSnapScript() {
  return new Promise<void>((resolve, reject) => {
    if (window.snap) return resolve();
    if (!MIDTRANS_CLIENT_KEY)
      return reject(new Error("Missing VITE_MIDTRANS_CLIENT_KEY"));

    const script = document.createElement("script");
    script.src = MIDTRANS_SNAP_URL;
    script.async = true;
    script.setAttribute("data-client-key", MIDTRANS_CLIENT_KEY);

    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("Failed to load Midtrans Snap script"));
    document.body.appendChild(script);
  });
}

const MidtransPayButton = ({
  checkoutId,
  amount,
  onSuccess,
  onError,
}: MidtransPayButtonProps) => {};

export default MidtransPayButton;
