import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../../assets/Logo-white 2.png";
import background from "../../../assets/Photo_bg.png";
import hook from "../../../assets/Hook _poster.png";
import formimg from "../../../assets/Photobg.png";
import publicApi from "../../../api/publicApi";

export default function Login() {
   const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      await publicApi.register({ firstName, lastName, email, password, phone, passwordConfirmation });
      setSuccess("Compte créé ! Vérifiez votre email pour l'activation.");
      setFirstName("");
      setLastName("");
      setPhone("");
      setEmail("");
      setPassword("");
      setPasswordConfirmation("");
    } catch (err) {
      setError(err?.message || "Erreur lors de l'inscription");
      console.log(err);
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
        {/* Wrapper: stack on mobile, 2 columns on lg */}
        <div className="w-full px-6 py-5 lg:px-10 lg:py-10 max-w-6xl flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16">
          {/* Left side (title + form) */}
          <div className="w-full lg:w-1/2">
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-nexa text-center font-bold text-white mb-4">
              Welcome to
            </h1>

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
                <h1
                  style={{ color: "#336D38" }}
                  className="text-center text-2xl sm:text-3xl font-nexa font-bold"
                >
                  Sign Up
                </h1>
                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}
                {success && <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-sm">{success}</div>}
                <div className=" grid grid-cols-1 sm:grid-cols-2 sm:gap-6">
                  <div className="mt-4 md:mt-6">
                    <label
                      htmlFor="first-name"
                      className="font-nexa text-gray-600 text-sm md:text-base"
                    >
                      First name
                    </label>
                    <input
                        type="text"
                        value={firstName} 
                        onChange={(e) => setFirstName(e.target.value)}
                        disabled={loading}
                        placeholder="First name"
                        id="first-name"
                        className="bg-white font-nexa w-full px-2 py-1 md:px-3 md:py-2 border rounded-full focus:outline-none focus:ring-2 border-green-900 text-sm md:text-base"
                    />
                  </div>

                  <div className="mt-4 md:mt-6">
                    <label
                      htmlFor="last-name"
                      className="font-nexa text-gray-600 text-sm md:text-base"
                    >
                      Last name
                    </label>
                    <input
                      type="text"
                      placeholder="Last name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        disabled={loading}
                      id="last-name"
                      className="bg-white text-sm md:text-base font-nexa w-full px-2 py-1 md:px-3 md:py-2 border rounded-full focus:outline-none focus:ring-2 border-green-900"
                    />
                  </div>
                </div>

                <div className="mt-4 md:mt-6">
                  <label
                    htmlFor="phone-number"
                    className="font-nexa text-sm md:text-base text-gray-600"
                  >
                    Phone number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={loading}
                    placeholder="+212 xxxxxxx"
                    id="phone-number"
                    className="bg-white text-sm md:text-base font-nexa w-full px-2 py-1 md:px-3 md:py-2 border rounded-full focus:outline-none focus:ring-2 border-green-900"
                  />
                </div>

                <div className="mt-4 md:mt-6">
                  <label htmlFor="email" className="font-nexa text-sm md:text-base text-gray-600">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Email"

                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    id="email"
                    className="bg-white text-sm md:text-base font-nexa w-full px-2 py-1 md:px-3 md:py-2 border rounded-full focus:outline-none focus:ring-2 border-green-900"
                  />
                </div>

                <div className=" grid grid-cols-1 sm:grid-cols-2  sm:gap-6">
                  <div className="mt-4 md:mt-6">
                    <label
                      htmlFor="password"
                      className="font-nexa text-sm md:text-base text-gray-600"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      placeholder="Password"
                      id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                      className="bg-white text-sm md:text-base font-nexa w-full px-2 py-1 md:px-3 md:py-2 border rounded-full focus:outline-none focus:ring-2 border-green-900"
                    />
                  </div>

                  <div className="mt-4 md:mt-6">
                    <label
                      htmlFor="confirm-password"
                      className="font-nexa text-sm md:text-base text-gray-600"
                    >
                      Confirm Password
                    </label>
                    <input
                      type="password"
                          value={passwordConfirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                            disabled={loading}
                      placeholder="Confirm Password"
                      id="confirm-password"
                      className="bg-white text-sm md:text-base font-nexa w-full px-2 py-1 md:px-3 md:py-2 border rounded-full focus:outline-none focus:ring-2 border-green-900"
                    />
                  </div>
                </div>

                <div className="mt-4 md:mt-6 flex flex-col items-center justify-center">
                  <button
                    type="submit"  disabled={loading}
                    style={{ backgroundColor: "#598E5C" }}
                    className="w-full sm:w-56 font-nexa text-white font-bold mb-2 py-2 px-4 rounded-full hover:bg-green-600 hover:opacity-80 transition duration-300"
                  >
                    {loading ? "Création en cours..." : "Créer un compte"}
                  </button>

                  <Link
                    to="/login"
                    style={{ backgroundColor: "white", color: "#598E5C" }}
                    className="block font-nexa text-center w-full sm:w-56 font-bold py-2 px-4 rounded-full hover:opacity-80 transition duration-300"
                  >
                    Sign In
                  </Link>
                </div>
              </form>
            </div>
          </div>

          {/* Right side (poster) - hidden on small screens, shown on lg */}
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
