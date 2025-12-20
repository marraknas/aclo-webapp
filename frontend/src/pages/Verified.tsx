import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

const Verified = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const redirect = new URLSearchParams(location.search).get("redirect") || "/";

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        navigate(`/login?redirect=${encodeURIComponent(redirect)}`);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [navigate, redirect]);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-16 xl:px-24 2xl:px-32 py-14 sm:py-16">
        <div className="mx-auto w-full max-w-md rounded-xl bg-white border shadow-sm p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
            <CheckCircleIcon className="h-7 w-7 text-green-600" />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-ink">Email verified</h1>

          <p className="mt-3 text-sm text-gray-600 leading-relaxed">
            Your email has been successfully verified. You can now log in to
            your account.
          </p>

          <div className="mt-7">
            <Link
              to={`/login?redirect=${encodeURIComponent(redirect)}`}
              className="inline-flex w-full items-center justify-center rounded-lg bg-acloblue px-4 py-2.5 text-white font-semibold hover:opacity-90 transition"
            >
              Back to login
            </Link>
          </div>
        </div>
      </main>
    </>
  );
};

export default Verified;
