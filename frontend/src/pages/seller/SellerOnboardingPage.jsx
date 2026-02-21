import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../contexts/AuthContext";
import sellerApi from "../../api/sellerApi";

const initialForm = {
  description: "",
  street: "",
  city: "",
  zip: "",
  country: "",
  accountHolder: "",
  iban: "",
  bankName: "",
};

export default function SellerOnboardingPage() {
  const navigate = useNavigate();
  const { refreshAuth } = useContext(AuthContext);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  function onChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function onSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const payload = {
        description: form.description,
        address: {
          street: form.street,
          city: form.city,
          zip: form.zip,
          country: form.country,
        },
        bankAccount: {
          accountHolder: form.accountHolder,
          iban: form.iban.toUpperCase(),
          bankName: form.bankName,
        },
      };

      await sellerApi.switchToSeller(payload);
      await refreshAuth();
      setSuccess("Seller profile created. Redirecting to dashboard...");
      setTimeout(() => navigate("/seller"), 700);
    } catch (err) {
      setError(err?.message || "Failed to create seller profile");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen font-nexa bg-gradient-to-br from-green-light to-white-intense px-4 py-10">
      <div className="mx-auto max-w-4xl rounded-3xl bg-white-intense shadow p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-green-dark">Become a Seller</h1>
        <p className="mt-2 text-gray-600">
          Complete this form once to activate your seller role and access the dashboard.
        </p>

        {error && <div className="mt-4 rounded-lg bg-red-100 text-red-700 p-3">{error}</div>}
        {success && <div className="mt-4 rounded-lg bg-green-100 text-green-700 p-3">{success}</div>}

        <form onSubmit={onSubmit} className="mt-6 space-y-5">
          <section>
            <h2 className="text-lg font-bold text-green-dark">Business Description</h2>
            <textarea
              name="description"
              value={form.description}
              onChange={onChange}
              required
              minLength={50}
              rows={5}
              placeholder="Describe your business, products and sourcing approach (minimum 50 characters)."
              className="mt-2 w-full rounded-xl border border-green-light px-3 py-2"
            />
          </section>

          <section>
            <h2 className="text-lg font-bold text-green-dark">Address</h2>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                name="street"
                value={form.street}
                onChange={onChange}
                required
                placeholder="Street"
                className="rounded-xl border border-green-light px-3 py-2"
              />
              <input
                name="city"
                value={form.city}
                onChange={onChange}
                required
                placeholder="City"
                className="rounded-xl border border-green-light px-3 py-2"
              />
              <input
                name="zip"
                value={form.zip}
                onChange={onChange}
                required
                pattern="[0-9]{5}"
                placeholder="Zip (5 digits)"
                className="rounded-xl border border-green-light px-3 py-2"
              />
              <input
                name="country"
                value={form.country}
                onChange={onChange}
                required
                placeholder="Country"
                className="rounded-xl border border-green-light px-3 py-2"
              />
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-green-dark">Bank Account</h2>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                name="accountHolder"
                value={form.accountHolder}
                onChange={onChange}
                required
                placeholder="Account holder"
                className="rounded-xl border border-green-light px-3 py-2"
              />
              <input
                name="bankName"
                value={form.bankName}
                onChange={onChange}
                required
                placeholder="Bank name"
                className="rounded-xl border border-green-light px-3 py-2"
              />
              <input
                name="iban"
                value={form.iban}
                onChange={onChange}
                required
                placeholder="IBAN (e.g. FR142004...)"
                className="sm:col-span-2 rounded-xl border border-green-light px-3 py-2"
              />
            </div>
          </section>

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-green-dark text-white-intense px-6 py-3 font-bold disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Activate Seller Role"}
          </button>
        </form>
      </div>
    </div>
  );
}
