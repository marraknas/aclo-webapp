import {
	HiOutlineUser,
	HiOutlineShoppingBag,
	HiBars3BottomRight,
} from "react-icons/hi2";
import { Link } from "react-router-dom";
import Searchbar from "./Searchbar";
import Cartdrawer from "../layout/Cartdrawer";

const Navbar = () => {
	return (
		<>
			<nav className="container mx-auto flex justify-between py-4 px-6">
				{/* Left - logo */}
				<div>
					<Link to="/" className="text-2xl font-medium hover:cursor-pointer">
						Aclo
					</Link>
				</div>
				{/* Center - navigation */}
				<div className="hidden md:flex items-center space-x-6">
					<Link
						to="#"
						className="text-black hover:text-gray-600 font-medium uppercase"
					>
						Learning Tower
					</Link>
					<Link
						to="#"
						className="text-black hover:text-gray-600 font-medium uppercase"
					>
						Stool
					</Link>
					<Link
						to="#"
						className="text-black hover:text-gray-600 font-medium uppercase"
					>
						Utensils
					</Link>
				</div>
				{/* Right - Icons */}
				<div className="flex items-center space-x-4">
					<Link
						to="/profile"
						className="hover:text-gray-600 hover:cursor-pointer"
					>
						<HiOutlineUser className="h-6 w-6" />
					</Link>
					<button className="relative hover:text-gray-600 hover:cursor-pointer">
						<HiOutlineShoppingBag className="h-6 w-6" />
						<span className="absolute -top-1 bg-red-600 text-white text-xs rounded-full px-1 py-0.5">
							4
						</span>
					</button>
					{/* Search */}
					<Searchbar />
					<button className="md:hidden">
						<HiBars3BottomRight className="h-6 w-6 hover:text-gray-600" />
					</button>
				</div>
			</nav>
			<Cartdrawer />
		</>
	);
};

export default Navbar;
