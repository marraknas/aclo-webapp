import { useEffect, useState, type ChangeEvent, type MouseEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { COLOR_MAP, COLOR_OPTIONS } from "../../constants/colors";
import { CATEGORIES } from "../../constants/categories";

type FilterState = {
	category: string;
	color: string;
	material: string[];
	minPrice: number;
	maxPrice: number;
	[key: string]: any;
};

const FilterSidebar = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const navigate = useNavigate();
	const [filters, setFilters] = useState<FilterState>({
		category: "",
		color: "",
		material: [],
		minPrice: 0,
		maxPrice: 1000000,
	});
	// filter constants can be stored in DB
	const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
	const materials = ["Birch plywood", "Oak plywood"];

	useEffect(() => {
		const params = Object.fromEntries([...searchParams]);
		// you get this {category: "Learning Tower", maxPrice: 10000} and you access like this params.category
		setFilters({
			category: params.category || "",
			color: params.color || "",
			material: params.material ? params.material.split(",") : [],
			minPrice: params.minPrice ? Number(params.minPrice) : 0,
			maxPrice: params.maxPrice ? Number(params.maxPrice) : 1000000,
		});
		// setPriceRange([minPrice, maxPrice]);
		setPriceRange([0, Number(params.maxPrice) || 1000000]);
	}, [searchParams]);
	const handleFilterChange = (
		e: ChangeEvent<HTMLInputElement> | MouseEvent<HTMLButtonElement>
	) => {
		const target = e.target as HTMLInputElement;
		const { name, value, checked, type } = target;
		const newFilters: FilterState = { ...filters };

		if (type === "checkbox") {
			if (checked) {
				newFilters[name] = [...(newFilters[name] || []), value];
			} else {
				newFilters[name] = newFilters[name].filter(
					(item: string) => item !== value
				);
			}
		} else {
			newFilters[name] = value;
		}
		setFilters(newFilters);
		console.log(newFilters);
		updateURLParams(newFilters);
	};

	const updateURLParams = (newFilters: FilterState) => {
		const params = new URLSearchParams();
		Object.keys(newFilters).forEach((key) => {
			if (Array.isArray(newFilters[key]) && newFilters[key].length > 0) {
				params.append(key, newFilters[key].join(","));
			} else if (newFilters[key]) {
				params.set(key, newFilters[key]);
			}
		});
		setSearchParams(params);
		navigate(`?${params.toString()}`);
	};

	const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
		const newPrice = Number(e.target.value);
		setPriceRange([0, newPrice]);
		const newFilters = { ...filters, minPrice: 0, maxPrice: newPrice };
		setFilters(newFilters);
		updateURLParams(newFilters);
	};

	return (
		<div className="p-4">
			<h3 className="text-xl font-medium text-gray-800 mb-4">Filter</h3>
			{/* Category filter */}
			<div className="mb-6">
				<label className="block text-gray-600 font-medium mb-2">Category</label>
				{CATEGORIES.map((category) => (
					<div key={category} className="flex items-center mb-1">
						<input
							type="radio"
							name="category"
							value={category}
							onChange={handleFilterChange}
							checked={filters.category === category}
							className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300 cursor-pointer"
						/>
						<span className="text-gray-700">{category}</span>
					</div>
				))}
			</div>
			{/* Color filter */}
			<div className="mb-6">
				<label className="block text-gray-600 font-medium mb-2">Color</label>
				<div className="flex flex-wrap gap-2">
					{COLOR_OPTIONS.map((color) => (
						<button
							key={color}
							name="color"
							value={color}
							onClick={handleFilterChange}
							className={`w-6 h-6 rounded-full border border-gray-300 cursor-pointer transition hover:scale-105 ${
								filters.color === color ? "ring-2 ring-blue-500" : ""
							}`}
							style={{ backgroundColor: COLOR_MAP[color] }}
						/>
					))}
				</div>
			</div>
			{/* Material filter */}
			<div className="mb-6">
				<label className="block text-gray-600 font medium mb-2">Material</label>
				{materials.map((material) => (
					<div key={material} className="flex items-center mb-1">
						<input
							type="checkbox"
							name="material"
							value={material}
							onChange={handleFilterChange}
							checked={filters.material.includes(material)}
							className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300"
						/>
						<span className="text-gray-700">{material}</span>
					</div>
				))}
			</div>

			{/* Price Range filter */}
			<div className="mb-8">
				<label className="block text-gray-600 font-medium mb-2">
					Price Range
				</label>
				<input
					type="range"
					name="priceRange"
					min={0}
					max={1000000}
					value={priceRange[1]}
					onChange={handlePriceChange}
					className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
				/>
				<div className="flex justify-between text-gray-600 mt-2">
					<span>0</span>
					<span>{priceRange[1]}</span>
				</div>
			</div>
		</div>
	);
};

export default FilterSidebar;
