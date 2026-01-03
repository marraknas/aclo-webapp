import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserLayout from "./components/layout/UserLayout";
import Home from "./pages/Home";
import { Toaster } from "sonner";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import CollectionPage from "./pages/CollectionPage";
import ProductDetails from "./components/products/ProductDetails";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Checkout from "./components/cart/Checkout";
import Payment from "./components/cart/Payment";
import CheckoutStatusPage from "./pages/CheckoutStatusPage";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import AdminLayout from "./components/admin/AdminLayout";
import AdminHomePage from "./pages/AdminHomePage";
import UserManagement from "./components/admin/UserManagement";
import ProductManagement from "./components/admin/ProductManagement";
import EditProductPage from "./components/admin/EditProductPage";
import OrderManagement from "./components/admin/OrderManagement";
import ForgotPassword from "./pages/ForgotPassword";

import { Provider } from "react-redux";
import { store } from "./redux/store";
import ProtectedRoute from "./components/common/ProtectedRoute";
import ResetPassword from "./pages/ResetPassword";
import Verified from "./pages/Verified";
import Story from "./pages/Story";
import Contact from "./pages/Contact";
// import CheckoutProcessingPage from "./pages/CheckoutProcessingPage";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<UserLayout />}>
            {/* User Layout */}
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="profile" element={<Profile />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verified" element={<Verified />} />

            <Route path="story" element={<Story />} />
            <Route path="contact" element={<Contact />} />
            {/* anything after a colon is a dynamic route */}
            <Route
              path="collections/:collection"
              element={<CollectionPage />}
            />
            <Route path="product/:id" element={<ProductDetails />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="payment" element={<Payment />} />
            <Route path="order-confirmation" element={<CheckoutStatusPage />} />
            {/* <Route path="checkout-processing" element={<CheckoutProcessingPage />} /> */}
            <Route path="order/:id" element={<OrderDetailsPage />} />
            <Route path="my-orders" element={<MyOrdersPage />} />
          </Route>
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            {/* Admin Layout */}
            <Route index element={<AdminHomePage />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="products" element={<ProductManagement />} />
            <Route
              path="products/:id/edit/:variantId"
              element={<EditProductPage />}
            />
            <Route path="orders" element={<OrderManagement />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
