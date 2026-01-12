const orders = [
    {
        orderItems: [],

        shippingDetails: {
            name: "Admin User",
            address: "Admin Street 123",
            city: "Jakarta",
            postalCode: "11234",
            phone: "1234567890",
        },

        shippingCost: 22500,
        shippingMethod: "Same Day",
        shippingCourier: "anteraja",
        shippingDuration: "8 - 12 hours",

        paymentMethod: "BankTransfer",
        paymentProof: {
            publicId: "aclo/dev/payments/baskdpzqrt7gpqzzr5wm",
            uploadedAt: new Date(),
            status: "pending",
        },
        noteToSeller: "",

        totalPrice: 621500,
        isPaid: false,

        status: "pending",
    },
];

module.exports = orders;
