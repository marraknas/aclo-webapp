// IGNORE ERRORS/WARNINGS IN THIS FILE BECAUSE WE WON'T BE USING PAYPAL
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";

type PayPalButtonProps = {
	amount: number;
	onSuccess: (details: Record<string, unknown>) => void;
	onError?: (error: unknown) => void;
};

const PayPalButton = ({ amount, onSuccess, onError }: PayPalButtonProps) => {
	return (
		<PayPalScriptProvider
			options={{
				clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
			}}
		>
			<PayPalButtons
				style={{ layout: "vertical" }}
				createOrder={(data, actions) => {
					return actions.order.create({
						purchase_units: [{ amount: { value: amount.toString() } }],
					});
				}}
				onApprove={(data, actions) => {
					return actions.order?.capture().then(onSuccess);
				}}
				onError={onError}
			/>
		</PayPalScriptProvider>
	);
};

export default PayPalButton;
