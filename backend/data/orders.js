const orders = [
	{
		shippingDetails: {
			name: "Admin User",
			address: "123 Admin Street",
			city: "Jakarta",
			postalCode: "10310",
			phone: "123456789012",
		},
		paymentMethod: "Paypal",
		totalPrice: 54000,
		isPaid: true,
		paidAt: Date.now(),
		isDelivered: false,
		paymentStatus: "paid",
		paymentDetails: {
			id: "3XP78188P9000202F",
			intent: "CAPTURE",
			status: "COMPLETED",
			purchase_units: [
				{
					reference_id: "default",
					amount: {
						currency_code: "IDR",
						value: "54000.00",
					},
					payee: {
						email_address: "sb-mylfb47938538@business.example.com",
						merchant_id: "ZFQARFS88PU9U",
					},
					soft_descriptor: "PAYPAL *TEST STORE",
					shipping: {
						name: {
							full_name: "Doe John",
						},
						address: {
							address_line_1: "123 Thomson Rd.",
							admin_area_2: "Singapore",
							postal_code: "308123",
							country_code: "SG",
						},
					},
					payments: {
						captures: [
							{
								id: "11V752081H102630P",
								status: "COMPLETED",
								amount: {
									currency_code: "IDR",
									value: "54000.00",
								},
								final_capture: true,
								seller_protection: {
									status: "ELIGIBLE",
									dispute_categories: [
										"ITEM_NOT_RECEIVED",
										"UNAUTHORIZED_TRANSACTION",
									],
								},
								create_time: "2025-12-18T17:54:43Z",
								update_time: "2025-12-18T17:54:43Z",
							},
						],
					},
				},
			],
			payer: {
				name: {
					given_name: "John",
					surname: "Doe",
				},
				email_address: "sb-rnko4747939789@personal.example.com",
				payer_id: "8WPYS2LYDGTC6",
				address: {
					country_code: "SG",
				},
			},
			create_time: "2025-12-18T17:54:35Z",
			update_time: "2025-12-18T17:54:43Z",
			links: [
				{
					href: "https://api.sandbox.paypal.com/v2/checkout/orders/3XP78188P9000202F",
					rel: "self",
					method: "GET",
				},
			],
		},
		status: "Processing",
	},
];

module.exports = orders;
