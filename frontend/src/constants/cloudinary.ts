const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

export const assets = {
	hero: {
		type: "image",
		publicId: "landing_hero_bg_z65ix8",
		alt: "Toddler cooking using ACLO learning tower",
	},
	intro: {
		type: "image",
		publicId: "intro_ukqtou",
		alt: "Two children preparing fruit snacks at the counter with ACLO learning tower.",
	},

	independenceCarousel: [
		{
			publicId: "landing_independence_carousel_01_acfvtx",
			alt: "Toddler shaping dough using ACLO learning tower at the counter.",
		},
		{
			publicId: "landing_independence_carousel_02_kp6n9m",
			alt: "Parent helping a toddler to wash hand at the sink with a learning tower.",
		},
		{
			publicId: "landing_independence_carousel_03_m9xdow",
			alt: "Child reading a book while sitting on ACLO learning tower.",
		},
		{
			publicId: "landing_independence_carousel_04_yopkfe",
			alt: "Toddler reaching up using ACLO learning tower.",
		},
		{
			publicId: "landing_independence_carousel_05_ckc0bu",
			alt: "Toddler drinking from a cup while standing on a learning tower.",
		},
		{
			publicId: "landing_independence_carousel_06_1_pfvtbg",
			alt: "Toddler brushing teeth at the counter on ACLO learning tower.",
		},
	] as const,

	littleHelpers: {
		type: "image",
		publicId: "landing_built-for-little-helpers_v10sst",
		alt: "Child pouring milk into a cup at the counter beside a snack tray.",
	},

	logos: {
		horizontal: {
			type: "image",
			publicId: "ACLO_LOGO_HORIZONTAL-06_1_mdrbx8",
			alt: "ACLO logo",
		},
		vertical: {
			type: "image",
			publicId: "ACLO_LOGO_VERTICAL-04_1_twkhki",
			alt: "ACLO logo",
		},
	},
} as const;

export function cloudinaryImageUrl(publicId: string) {
	return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto/${publicId}`;
}
