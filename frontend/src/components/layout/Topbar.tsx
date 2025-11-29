import { AiFillTikTok } from "react-icons/ai";
import { FaWhatsapp } from "react-icons/fa";
import { SiShopee } from "react-icons/si";
import tokopediaLogo from "../../assets/tokped-white.png";

const Topbar = () => {
	return (
		<div className="bg-secondary text-black">
			<div className="container mx-auto grid grid-cols-1 md:grid-cols-3 py-3 px-3">
				{/* left: icons */}
				<div className="hidden md:flex items-center space-x-2">
					<a href="#" className="hover:text-gray-600">
						<SiShopee className="h-6 w-6" />
					</a>
					<a href="#" className="hover:text-gray-600">
						<FaWhatsapp color="white" className="h-6 w-6" />
					</a>
					<a href="#" className="hover:opacity-50">
						<img src={tokopediaLogo} className="h-6 w-6" />
					</a>
					<a href="#" className="hover:text-gray-600">
						<AiFillTikTok color="white" className="h-6 w-6" />
					</a>
				</div>
				{/* center: text */}
				<div className="text-m text-center ">
					<span>Empowering independence - one home at a time</span>
				</div>
				{/* right column left empty */}
			</div>
		</div>
	);
};

export default Topbar;
