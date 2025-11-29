import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserLayout from "./components/layout/UserLayout";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<UserLayout />}>
					{/* User Layout */}
				</Route>
				<Route>{/* Admin Layout */}</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
