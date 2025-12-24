const products = [
	{
		name: "Mini Oven Mitt for Kids (QUILL)",
		description:
			"✨ Mini Oven Mitt for Little Helpers (complement to the QUILL kid-size kitchen utensils)Sarung tangan ini dirancang khusus untuk tangan kecil anak. Aman, ringan, dan tahan panas — sempurna untuk anak yang suka membantu di dapur atau bermain peran memasak di rumah.\nSpesifikasi\nDimensi: 17.5 x 11 x 1 cm\nMaterial: Polyester, kapas, dan heat-Insulating needled cotton",
		images: [
			{
				publicId: "QUILL_MITTENS_ouvpoz",
				alt: "Quill Mittens",
			},
		],
		rating: 4.7,
		numReviews: 13,
		dimensions: {
			length: 22,
			width: 9,
			height: 8,
		},
		weight: 30,
	},
	{
		name: "STORK - Ultra-Slim & Foldable Learning Tower",
		description:
			"✨ STORK - The Ultra-Slim & Foldable Learning Tower ✨ Satu-satunya learning tower Montessori di Indonesia, yang dapat dilipat sampai ketebalan 10cm saja! Cocok untuk moms yang ingin menciptakan lingkungan Montessori di rumah dan mengutamakan ruang, keamanan, dan kesederhanaan.",
		options: {
			color: ["Natural", "Cerulean", "Silver", "Snow"],
			stabiliser: ["Stabiliser", "No stabiliser"],
		},
		images: [
			{
				publicId: "STORK-1_zlt3i8",
				alt: "Stork",
			},
		],
		rating: 4.81,
		numReviews: 32,
		dimensions: {
			length: 46,
			width: 12,
			height: 102,
		},
		weight: 7500,
	},
	{
		name: "QUILL - Premium Kid-size Mini Kitchen Utensils",
		description:
			"✨ QUILL - Premium Kid-size Mini Kitchen Utensils ✨Peralatan masak sungguhan untuk little chef di rumah! Dirancang dengan ukuran mini, aman, dan ergonomis — pas di tangan anak namun tetap bisa dipakai orang dewasa. Cocok untuk mendukung kemandirian, rasa percaya diri, dan rasa ingin tahu anak sejak dini.\nSpesifikasi\nTahan panas: hingga 150°C",
		options: {
			ovenMitt: ["Oven mitt, No oven mitt"],
		},
		images: [
			{
				publicId: "QUILL_xvxmet",
				alt: "Quill",
			},
		],
		rating: 4.1,
		numReviews: 7,
		dimensions: {
			length: 22,
			width: 9,
			height: 8,
		},
		weight: 30,
	},
	{
		name: "TALON - Stabiliser for Learning Tower",
		description:
			"✨ TALON - Stabiliser for Learning Tower ✨ Kaki tambahan yang meningkatkan stabilitas & keamanan learning tower. Cocok untuk STORK & FALCON. Instalasi mudah & tahan lama.\nSpesifikasi\n Bahan: Birch Plywood\n Dimensi Stabiliser (lebar x tinggi x tebal):\nSTORK: 8.5 x 6.5 x 1.8 cm\nFALCON: 11.5 x 8.5 x 1.8 cm\nBerat: 500 gram",
		options: { variant: ["Stork", "Falcon"] },
		images: [
			{
				publicId: "TALON_srzloj",
				alt: "Talon",
			},
		],
		rating: 5.0,
		numReviews: 1,
		dimensions: {
			length: 22,
			width: 9,
			height: 8,
		},
		weight: 30,
	},
	{
		name: "SPARROW - Mini Foldable Learning Tower",
		description:
			"✨ SPARROW - The Smallest & Compact Learning Tower ✨ Learning tower Montessori mini yang compact dan mudah dibawa-bawa. Cocok untuk moms yang ingin menciptakan lingkungan Montessori di rumah dan mengutamakan fungsi, mobilitas, dan kenyamanan.\nSpesifikasi 🎨\nDimensi terbuka (tinggi x lebar x dalam): 56 x 40 x 38 cm\nKetebalan ketika dilipat: 12.5 cm\nBerat: 3 kg\nMaterial: Birch plywood\nKapasitas Maksimal: 50 kg. Dikirim dalam kondisi BELUM dirakit.",
		options: { color: ["Natural", "Snow"] },
		images: [
			{
				publicId: "SPARROW-1_ykme2r",
				alt: "Sparrow",
			},
		],
		rating: 4.5,
		numReviews: 9,
		dimensions: {
			length: 33,
			width: 8,
			height: 58,
		},
		weight: 4000,
	},
	{
		name: "BEAK - Wooden Cutting Board & Knife for Kids",
		description:
			"✨ BEAK - Wooden Cutting Board & Knife for Kids ✨ Talenan & pisau kayu ACLO dirancang khusus untuk anak-anak belajar memotong makanan dengan aman. Cocok untuk tangan kecil, ukuran ideal untuk penggunaan anak. Bahan tahan lama dan ramah lingkungan, mendukung kepercayaan diri anak.\nSpesifikasi\nDimensi talenan (panjang x lebar x tebal): 15.5 x 9.5 x 1.2 cm\nDimensi pisau (panjang x tinggi x tebal): 12.5 x 2.5 x 1.2 cm",
		images: [
			{
				publicId: "BEAK_oyabro",
				alt: "Beak",
			},
		],
		dimensions: {
			length: 19,
			width: 10,
			height: 3,
		},
		weight: 200,
	},
	{
		name: "FALCON - Strong & Foldable Learning Tower",
		description:
			"✨ FALCON - The Strong & Stylish Learning Tower ✨ Learning tower Montessori yang kuat namun hemat ruang. Ideal untuk ibu yang ingin rumah seperti lingkungan Montessori dan prioritas keamanan. Cocok untuk anak-anak.\nSpesifikasi 💡\nDimensi terbuka (tinggi x lebar x dalam): 90 x 44 x 44 cm\nKetebalan ketika dilipat: 14 cm (tanpa pijakan kaki); 22 cm (dengan pijakan kaki)\nBerat: 6 kg\nMaterial: Birch plywood\nKapasitas Maksimal: 100 kg.",
		options: {
			color: ["Natural", "Sunshine", "Silver"],
			stabiliser: ["Stabiliser", "No stabiliser"],
		},
		images: [
			{
				publicId: "FALCON-1_gjqzmy",
				alt: "Falcon",
			},
		],
		rating: 4.95,
		numReviews: 43,
		dimensions: {
			length: 51,
			width: 16,
			height: 100,
		},
		weight: 7500,
	},
];

module.exports = products;
