export interface ProductImage {
	url: string;
	altText?: string;
}

export interface ProductDimensions {
	length?: number;
	width?: number;
	height?: number;
}

export interface Product {
	_id: string;
	name: string;
	description: string;
	price: number;
	discountPrice?: number;
	countInStock: number;
	sku: string;
	category: "Learning Tower" | "Stool" | "Utensils" | "Accessories";
	options?: Record<string, string[]>;
	material?: string;
	images: ProductImage[];
	isFeatured: boolean;
	isPublished: boolean;
	rating: number;
	numReviews: number;
	user: string;
	metaTitle?: string;
	metaDescription?: string;
	metaKeywords?: string;
	dimensions?: ProductDimensions;
	weight?: number;
	createdAt?: string;
	updatedAt?: string;
}

export interface CreateProductPayload {
	name: string;
	description: string;
	price: number;
	discountPrice?: number;
	countInStock: number;
	sku: string;
	category: "Learning Tower" | "Stool" | "Utensils" | "Accessories";
	options?: Record<string, string[]>;
	material?: string;
	images: ProductImage[];
	isFeatured: boolean;
	isPublished: boolean;
	dimensions?: ProductDimensions;
	weight?: number;
}

export interface UpdateProductPayload {
	id: string;
	productData: Partial<Product>;
}
