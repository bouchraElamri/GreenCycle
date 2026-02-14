import React from "react";
import logo from "../../../assets/Logo-white 2.png";
import background from "../../../assets/Photo_bg.png";
import hook from "../../../assets/Hook _poster.png";
import formimg from "../../../assets/Photobg.png";
import publicApi from "../../../api/publicApi";
import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthContext from "../../../contexts/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {  refreshAuth } = useContext(AuthContext);


  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);


    try {
      const response = await publicApi.login({ email, password });
      // Save token in the canonical key used across the app
      localStorage.setItem("authToken", response.token);
      // Store user info for UI convenience (components may use this)
      localStorage.setItem("user", JSON.stringify(response.user));
      await refreshAuth();
      // Redirect to area according to role
      const role = response.user?.role || "client";
      if (role === "admin") {
        navigate("/admin/");
            } else {
        navigate("/client/");
      }
    } catch (err) {
      setError(err?.message || "Erreur lors de la connexion");
    } finally {
      setLoading(false);
    }
  }


    return (
    <div
      className="min-h-screen w-full"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <main
        className="min-h-screen w-full px-4 sm:px-6 lg:px-10 py-10 flex items-center justify-center"
        style={{
          background:
            "linear-gradient(90deg,rgba(33, 80, 37, 1) 0%, rgba(196, 230, 201, 0.75) 100%)",
        }}
      >
        {/* Same wrapper design */}
        <div className="w-full px-6 py-5 lg:px-10 lg:py-10 max-w-6xl flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16">
          {/* Left side (title + form) */}
          <div className="w-full lg:w-1/2">

            <img
              src={logo}
              alt="GreenCycle Logo"
              className="h-auto mx-auto w-48 sm:w-56 lg:w-72"
            />

            <div
              className="mt-6 shadow-md overflow-hidden mx-auto w-full max-w-xl"
              style={{
                borderRadius: "40px",
                backgroundImage: `url(${formimg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
                
              <form
                className="py-8 px-5 sm:px-10"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.75)" }}
                onSubmit={handleSubmit}
              >
                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}
                <h1
                  style={{ color: "#336D38" }}
                  className="text-center text-2xl sm:text-3xl font-nexa font-bold"
                >
                  Log In
                </h1>

                <div className="">
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    id="email"
                    className="bg-white text-sm md:text-base mt-4 md:mt-6 font-nexa w-full px-2 py-1 md:px-3 md:py-2 border rounded-full focus:outline-none focus:ring-2 border-green-900"
                  />

                  <input
                    type="password"
                    placeholder="Password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="bg-white text-sm md:text-base mt-4 md:mt-6 font-nexa w-full px-2 py-1 md:px-3 md:py-2 border rounded-full focus:outline-none focus:ring-2 border-green-900"
                  />
                </div>

                <div className="mt-2">
                  <Link
                    to="/forgotPasswordPage"
                    className="block text-sm md:text-base font-nexa text-gray-950 hover:text-lime-900"
                  >
                    <small>Forgot Password?</small>
                  </Link>
                </div>

                <div className="mt-8 flex flex-col items-center justify-center">
                  <button
                    type="submit"
                    disabled={loading}
                    style={{ backgroundColor: "#598E5C" }}
                    className="w-full sm:w-56 font-nexa text-white font-bold mb-2 py-2 px-4 rounded-full hover:bg-green-600 hover:opacity-80 transition duration-300"
                  >
                     {loading ? "Connexion en cours..." : "Se connecter"}
                  </button>

                  <Link
                    to="/register"
                    style={{ backgroundColor: "white", color: "#598E5C" }}
                    className="block font-nexa text-center w-full sm:w-56 font-bold py-2 px-4 rounded-full hover:opacity-80 transition duration-300"
                  >
                    Sign Up
                  </Link>
                </div>
              </form>
            </div>
          </div>

          {/* Right side poster - same behavior */}
          <div
            className="hidden lg:flex lg:w-1/2 items-center justify-center bg-white shadow-slate-500 shadow-md overflow-hidden"
            style={{ borderRadius: "40px" }}
          >
            <img
              src={hook}
              alt="Hook Poster"
              className="w-full h-[740px] object-cover"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
