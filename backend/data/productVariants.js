const productVariants = [
    {
        // Quill mittens,
        sku: "QL-MT",
        price: 54000,
        discountPrice: 39000,
        countInStock: 199, // we seeded 1 order of quill mittens
        category: "Utensils",
        isDefault: true,
        images: [
            {
                publicId: "QUILL_MITTENS_ouvpoz",
                alt: "Quill Mittens",
            },
        ],
    },
    {
        // Stork - Natural
        sku: "ST-NA",
        price: 2368000,
        discountPrice: 1319000,
        countInStock: 200,
        category: "Learning Tower",
        color: "Natural",
        isDefault: true,
        images: [
            {
                publicId: "STORK-NATURAL_qwjemt",
                alt: "Stork",
            },
        ],
    },
    {
        // Stork - Cerulean
        sku: "ST-CE",
        price: 2368000,
        discountPrice: 1319000,
        countInStock: 200,
        category: "Learning Tower",
        color: "Cerulean",
        images: [
            {
                publicId: "STORK-CERULEAN_fslcwa",
                alt: "Stork",
            },
        ],
    },
    {
        // Stork - Silver
        sku: "ST-SI",
        price: 2368000,
        discountPrice: 1319000,
        countInStock: 200,
        category: "Learning Tower",
        color: "Silver",
        images: [
            {
                publicId: "STORK-SILVER_vlde0z",
                alt: "Stork",
            },
        ],
    },
    {
        // Stork - Snow
        sku: "ST-SN",
        price: 2368000,
        discountPrice: 1319000,
        countInStock: 200,
        category: "Learning Tower",
        color: "Snow",
        images: [
            {
                publicId: "STORK-SNOW_dmlzs9",
                alt: "Stork",
            },
        ],
    },
    {
        // Quill Utensils - No oven mitt
        sku: "QL-NM",
        price: 179000,
        discountPrice: 103000,
        countInStock: 200,
        category: "Utensils",
        ovenMitt: "No oven mitt",
        isDefault: true,
        images: [
            {
                publicId: "QUILL-NO-MITTS_s8xe2b",
                alt: "Quill",
            },
        ],
    },
    {
        // Quill Utensils - With oven mitt
        sku: "QL-WM",
        price: 224000,
        discountPrice: 109000,
        countInStock: 200,
        category: "Utensils",
        ovenMitt: "Oven mitt",
        images: [
            {
                publicId: "QUILL-WITH-MITTS.jpg_eu7dml",
                alt: "Quill",
            },
        ],
    },
    {
        // Talon - Stork
        sku: "TA-ST",
        price: 119000,
        discountPrice: 69000,
        countInStock: 200,
        category: "Accessories",
        variant: "Stork",
        isDefault: true,
        images: [
            {
                publicId: "TALON_srzloj",
                alt: "Talon",
            },
        ],
    },
    {
        // Talon - Falcon
        sku: "TA-FL",
        price: 129000,
        discountPrice: 79000,
        countInStock: 200,
        category: "Accessories",
        variant: "Falcon",
        images: [
            {
                publicId: "TALON_srzloj",
                alt: "Talon",
            },
        ],
    },
    {
        // Sparrow - Natural
        sku: "SP-NA",
        price: 1099000,
        discountPrice: 599000,
        countInStock: 200,
        category: "Learning Tower",
        color: "Natural",
        isDefault: true,
        images: [
            {
                publicId: "SPARROW-NATURAL_j7tfe1",
                alt: "Sparrow",
            },
        ],
    },
    {
        // Sparrow - Snow
        sku: "SP-SN",
        price: 1099000,
        discountPrice: 599000,
        countInStock: 200,
        category: "Learning Tower",
        color: "Snow",
        images: [
            {
                publicId: "SPARROW-SNOW_psikau",
                alt: "Sparrow",
            },
        ],
    },
    {
        // Beak
        sku: "BE",
        price: 129000,
        discountPrice: 79000,
        countInStock: 200,
        category: "Utensils",
        isDefault: true,
        images: [
            {
                publicId: "BEAK_oyabro",
                alt: "Beak",
            },
        ],
    },
    {
        // Falcon - Natural
        sku: "FL-NA",
        price: 3028000,
        discountPrice: 1429000,
        countInStock: 200,
        category: "Learning Tower",
        color: "Natural",
        isDefault: true,
        images: [
            {
                publicId: "FALCON-NATURAL_dhaxxh",
                alt: "Falcon",
            },
        ],
    },
    {
        // Falcon - Sunshine
        sku: "FL-SU",
        price: 3028000,
        discountPrice: 1429000,
        countInStock: 200,
        category: "Learning Tower",
        color: "Sunshine",
        images: [
            {
                publicId: "FALCON-SUNSHINE_l6owdd",
                alt: "Falcon",
            },
        ],
    },
    {
        // Falcon - Silver
        sku: "FL-SI",
        price: 3028000,
        discountPrice: 1429000,
        countInStock: 200,
        category: "Learning Tower",
        color: "Silver",
        images: [
            {
                publicId: "FALCON-SILVER_qgb1pj",
                alt: "Falcon",
            },
        ],
    },
];

module.exports = productVariants;
