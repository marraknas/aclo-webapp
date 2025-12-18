import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { registerUser } from "../redux/slices/authSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import type { RegisterPayload } from "../types/auth";
import { mergeCart } from "../redux/slices/cartSlice";
import { assets, cloudinaryImageUrl } from "../constants/cloudinary";
import Navbar from "../components/common/Navbar";

const Register = () => {
  const [formData, setFormData] = useState<RegisterPayload>({
    name: "",
    email: "",
    password: "",
  });

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, guestId, loading } = useAppSelector((state) => state.auth);
  const { cart } = useAppSelector((state) => state.cart);

  // get redirect parameter and check if it's checkout or something else
  const redirect = new URLSearchParams(location.search).get("redirect") || "/";
  const isCheckoutRedirect = redirect.includes("checkout");

  useEffect(() => {
    if (user) {
      if (cart?.products.length > 0 && guestId) {
        // merge guest products with user products
        dispatch(mergeCart({ guestId, user })).then(() => {
          navigate(isCheckoutRedirect ? "/checkout" : "/");
        });
      } else {
        navigate(isCheckoutRedirect ? "/checkout" : "/");
      }
    }
  }, [user, guestId, cart, navigate, isCheckoutRedirect, dispatch]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(registerUser(formData));
    // reset form after submit
    setFormData({ name: "", email: "", password: "" });
  };

  return (
    <>
      <Navbar />
      <div className="flex">
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md bg-white p-8 rounded-lg border shadow-sm"
          >
            <div className="flex justify-center mb-6">
              <h2 className="text-xl font-medium text-acloblue">
                Create Account
              </h2>
            </div>
            <h2 className="text-2xl font-bold text-center mb-6 text-ink">
              Hey there! 👋
            </h2>
            {/* <p className="text-center mb-6">
            Enter your email and password to register
          </p> */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="Enter your name"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="Enter your email address"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="Enter your password"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-acloblue text-white p-2 rounded-lg font-semibold mt-2 hover:opacity-80 transition"
            >
              {loading ? "Loading..." : "Sign Up"}
            </button>
            <p className="mt-6 text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                to={`/login?redirect=${encodeURIComponent(redirect)}`}
                className="text-acloblue hover:opacity-80"
              >
                Login{" "}
              </Link>
              •{" "}
              <Link to={`/`} className="text-acloblue hover:opacity-80">
                Return to Store
              </Link>
            </p>
          </form>
        </div>
        <div className="hidden md:block w-1/2 py-10">
          <div className="h-full flex flex-col justify-center items-center">
            <img
              src={cloudinaryImageUrl(assets.register.publicId)}
              alt={assets.register.alt}
              className="h-[750px] w-full object-cover"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
