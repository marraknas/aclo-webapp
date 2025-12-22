import type { ProductCategory, ProductImage } from "./product";

export interface ProductVariant {
	_id: string;
	productId: string; // ref Product
	sku: string;
	price: number;
	discountPrice?: number;
	countInStock: number;
	category: ProductCategory;
	// option picks for this variant
	color?: string;
	variant?: string;
	isDefault?: boolean;
	// stabiliser intentionally not here (add-on)
	images: ProductImage[];
	createdAt?: string;
	updatedAt?: string;
}

export interface CreateProductVariantPayload {
	productId: string;
	sku: string;
	price: number;
	discountPrice?: number;
	countInStock?: number;
	category: ProductCategory;
	color?: string;
	variant?: string;
	images: ProductImage[];
}

export interface UpdateProductVariantPayload {
	id: string;
	variantData: Partial<CreateProductVariantPayload>;
}
