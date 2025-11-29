import { useState } from "react";

const Cartdrawer = () => {
	const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

	const toggleCartDrawer = () => {
		setDrawerOpen(!drawerOpen);
	};
	return <div>Cartdrawer</div>;
};

export default Cartdrawer;
