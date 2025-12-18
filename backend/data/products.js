const products = [
	{
		name: "Quill Mittens",
		description: "Mini Oven Mitt for Little Helpers",
		price: 54000,
		discountPrice: 39000,
		countInStock: 200,
		sku: "UTQLMT1",
		category: "Utensils",
		material: "Polyester, cotton, and heat-Insulating needled cotton",
		images: [
			{
				url: "https://picsum.photos/seed/quillMittens1/500/500",
				altText: "Picture of Quill Mittens only",
			},
			{
				url: "https://picsum.photos/seed/quillMittens2/500/500",
				altText: "Picture of Quill Mittens and Kid",
			},
		],
		dimensions: {
			length: 22,
			width: 9,
			height: 8,
		},
		weight: 30,
		rating: 4.7,
		numReviews: 13,
	},
	{
		name: "Stork",
		description: "The Ultra-Slim & Foldable Learning Tower",
		price: 2368000,
		discountPrice: 1469000,
		countInStock: 200,
		sku: "LTSTORK1",
		category: "Learning Tower",
		options: {
			color: ["Natural", "Cerulean", "Silver", "Snow"],
			stabiliser: ["Stabiliser", "No stabiliser"],
		},
		material: "Birch plywood",
		images: [
			{
				url: "https://picsum.photos/seed/stork1/500/500",
				altText: "Picture of Stork only",
			},
			{
				url: "https://picsum.photos/seed/stork2/500/500",
				altText: "Picture of Stork and Kid",
			},
		],
		dimensions: {
			length: 46,
			width: 12,
			height: 102,
		},
		weight: 7500,
		rating: 4.81,
		numReviews: 32,
	},
	{
		name: "Quill",
		description: "Premium Kid-size Mini Kitchen Utensils",
		price: 224000,
		discountPrice: 119000,
		countInStock: 200,
		sku: "UTQUIL1",
		category: "Utensils",
		material: "Wood dan stainless steel",
		images: [
			{
				url: "https://picsum.photos/seed/quill1/500/500",
				altText: "Picture of Quill only",
			},
			{
				url: "https://picsum.photos/seed/quill2/500/500",
				altText: "Picture of Quill and Kid",
			},
		],
		dimensions: {
			length: 22,
			width: 9,
			height: 8,
		},
		weight: 30,
		rating: 4.1,
		numReviews: 7,
	},
	{
		name: "Talon",
		description: "Stabiliser for Learning Tower",
		price: 119000,
		discountPrice: 69000,
		countInStock: 200,
		sku: "ACTALN1",
		category: "Accessories",
		options: { variant: ["Stork", "Falcon"] },
		material: "Birch plywood",
		images: [
			{
				url: "https://picsum.photos/seed/talon1/500/500",
				altText: "Picture of Talon Stork only",
			},
			{
				url: "https://picsum.photos/seed/talon2/500/500",
				altText: "Picture of Talon Stork and Kid",
			},
		],
		dimensions: {
			length: 22,
			width: 9,
			height: 8,
		},
		weight: 30,
		rating: 5.0,
		numReviews: 1,
	},
	{
		name: "Sparrow",
		description: "The Smallest & Compact Learning Tower",
		price: 1099000,
		discountPrice: 669000,
		countInStock: 250,
		sku: "STSPAR1",
		category: "Stool",
		options: { color: ["Natural", "Snow"] },
		material: "Birch plywood",
		images: [
			{
				url: "https://picsum.photos/seed/sparrow1/500/500",
				altText: "Picture of Sparrow only",
			},
			{
				url: "https://picsum.photos/seed/sparrow2/500/500",
				altText: "Picture of Sparrow and Kid",
			},
		],
		dimensions: {
			length: 33,
			width: 8,
			height: 58,
		},
		weight: 4000,
		rating: 4.5,
		numReviews: 9,
	},
	{
		name: "Beak",
		description: "Wooden Cutting Board & Knife for Kids",
		price: 129000,
		discountPrice: 84000,
		countInStock: 340,
		sku: "UTBEAK1",
		category: "Utensils",
		images: [
			{
				url: "https://picsum.photos/seed/beak1/500/500",
				altText: "Picture of Beak only",
			},
			{
				url: "https://picsum.photos/seed/beak2/500/500",
				altText: "Picture of Beak and Kid",
			},
		],
		dimensions: {
			length: 19,
			width: 10,
			height: 3,
		},
		weight: 200,
		rating: 4.6,
		numReviews: 21,
	},
	{
		name: "Falcon",
		description: "The Strong & Stylish Learning Tower",
		price: 3028000,
		discountPrice: 1579000,
		countInStock: 250,
		sku: "LTFLCN1",
		category: "Learning Tower",
		options: {
			color: ["Natural", "Sunshine", "Silver"],
			stabiliser: ["Stabiliser", "No stabiliser"],
		},
		material: "Birch plywood",
		images: [
			{
				url: "https://picsum.photos/seed/falcon1/500/500",
				altText: "Picture of Falcon only",
			},
			{
				url: "https://picsum.photos/seed/falcon2/500/500",
				altText: "Picture of Falcon and Kid",
			},
		],
		dimensions: {
			length: 51,
			width: 16,
			height: 100,
		},
		weight: 7500,
		rating: 4.95,
		numReviews: 43,
	},
];

module.exports = products;
