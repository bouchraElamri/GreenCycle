import { useEffect, useMemo, useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { confirmPendingOrders, getPendingOrders } from "../../../api/clientApi";

const formatMoney = (value) => Number(value || 0).toFixed(2);
const MOROCCAN_CITIES = [
  "Agadir",
  "Al Hoceima",
  "Asilah",
  "Azrou",
  "Beni Mellal",
  "Benslimane",
  "Berkane",
  "Berrechid",
  "Casablanca",
  "Chefchaouen",
  "Dakhla",
  "El Jadida",
  "Errachidia",
  "Essaouira",
  "Fes",
  "Fnideq",
  "Guelmim",
  "Ifrane",
  "Kenitra",
  "Khenifra",
  "Khouribga",
  "Laayoune",
  "Larache",
  "Marrakech",
  "Meknes",
  "Mohammedia",
  "Nador",
  "Ouarzazate",
  "Oujda",
  "Rabat",
  "Safi",
  "Sale",
  "Settat",
  "Tangier",
  "Taza",
  "Temara",
  "Tetouan",
];

export default function PuchasePage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    zipCode: "",
    holderName: "",
    cardNumber: "",
    expirationDate: "",
    cvv: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadPendingOrders() {
      try {
        setLoading(true);
        setError("");
        const data = await getPendingOrders();
        if (isMounted) {
          setItems(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err?.message || "Failed to load order summary");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadPendingOrders();
    return () => {
      isMounted = false;
    };
  }, []);

  const summary = useMemo(() => {
    const productCount = items.length;
    const itemCount = items.reduce((sum, item) => sum + Number(item?.quantity || 0), 0);
    const totalPrice = items.reduce(
      (sum, item) => sum + Number(item?.quantity || 0) * Number(item?.product?.price || 0),
      0
    );

    return { productCount, itemCount, totalPrice };
  }, [items]);

  const validateFields = (values) => {
    const errors = {};
    const now = new Date();

    if (!values.address.trim()) errors.address = "Address is required";
    if (!values.city.trim()) errors.city = "City is required";
    if (!/^\d{5}$/.test(values.zipCode)) errors.zipCode = "Zip code must be 5 digits";
    if (!values.holderName.trim()) errors.holderName = "Card holder name is required";
    if (!/^\d{16}$/.test(values.cardNumber))
      errors.cardNumber = "Card number must be exactly 16 digits";

    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(values.expirationDate)) {
      errors.expirationDate = "Expiration date must be MM/YY";
    } else {
      const [mm, yy] = values.expirationDate.split("/");
      const expMonth = Number(mm);
      const expYear = 2000 + Number(yy);
      const endOfExpMonth = new Date(expYear, expMonth, 0, 23, 59, 59, 999);
      if (endOfExpMonth < now) {
        errors.expirationDate = "Card is expired";
      }
    }

    if (!/^\d{3}$/.test(values.cvv)) errors.cvv = "CVV must be exactly 3 digits";

    return errors;
  };

  const handleChange = (field) => (event) => {
    let value = event.target.value;

    if (field === "zipCode") value = value.replace(/\D/g, "").slice(0, 5);
    if (field === "cardNumber") value = value.replace(/\D/g, "").slice(0, 16);
    if (field === "cvv") value = value.replace(/\D/g, "").slice(0, 3);
    if (field === "expirationDate") {
      value = value.replace(/[^\d]/g, "").slice(0, 4);
      if (value.length >= 3) value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }

    setFormData((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const submitConfirmOrder = async (event) => {
    event.preventDefault();
    const errors = validateFields(formData);
    setFieldErrors(errors);
    setSubmitError("");
    setSubmitSuccess("");
    if (Object.keys(errors).length > 0) return;

    try {
      setSubmitting(true);
      setSubmitError("");

      await confirmPendingOrders({
        deliveryAddress: {
          street: formData.address,
          city: formData.city,
          zip: formData.zipCode,
          country: "Morocco",
        },
        bankAccount: {
          holderName: formData.holderName,
          cardNumber: formData.cardNumber,
          expirationDate: formData.expirationDate,
          cvv: formData.cvv,
        },
      });

      setSubmitSuccess("Order confirmed successfully. Confirmation emails were sent.");
      setItems([]);
      setFormData({
        address: "",
        city: "",
        zipCode: "",
        holderName: "",
        cardNumber: "",
        expirationDate: "",
        cvv: "",
      });
    } catch (err) {
      setSubmitError(err?.message || "Failed to confirm order");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <section className="relative overflow-hidden bg-gradient-to-b from-white-intense via-white-broken to-white-intense mt-20 md:mt-24 pb-2 md:pb-4">
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="flex w-full justify-center">
            <div className="relative w-full max-w-5xl overflow-hidden rounded-[2.25rem] border border-white-broken bg-white/80 px-5 py-5 shadow-[0_20px_44px_rgba(0,0,0,0.14)] backdrop-blur md:px-8 md:py-6">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-green-light/25 via-white-intense to-green-light/10" />

            <div className="relative grid gap-5 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:items-start">
              <div>
                <h1 className="font-nexa text-3xl font-bold text-green-dark md:text-4xl">Purchase it...</h1>
                <p className="mt-2 text-sm text-green-dark/70">Enter your shipping and payment details.</p>

                <form
                  className="mt-5 space-y-3"
                  onSubmit={submitConfirmOrder}
                >
                  <div className="space-y-3">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-green-dark/70">
                        Address
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your address..."
                        value={formData.address}
                        onChange={handleChange("address")}
                        className="h-10 w-full rounded-full border border-green-dark/30 bg-white/90 px-4 text-sm text-green-dark placeholder:text-green-dark/30 focus:outline-none focus:ring-2 focus:ring-green-medium"
                      />
                      {fieldErrors.address ? (
                        <p className="mt-1 text-xs text-red-600">{fieldErrors.address}</p>
                      ) : null}
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-green-dark/70">
                          City
                        </label>
                        <select
                          value={formData.city}
                          onChange={handleChange("city")}
                          className="h-10 w-full rounded-full border border-green-dark/30 bg-white/90 px-4 text-sm text-green-dark focus:outline-none focus:ring-2 focus:ring-green-medium"
                        >
                          <option value="">Select your city</option>
                          {MOROCCAN_CITIES.map((city) => (
                            <option key={city} value={city}>
                              {city}
                            </option>
                          ))}
                        </select>
                        {fieldErrors.city ? (
                          <p className="mt-1 text-xs text-red-600">{fieldErrors.city}</p>
                        ) : null}
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-green-dark/70">
                          Zip code
                        </label>
                        <input
                          type="text"
                          placeholder="Ex: 20000"
                          value={formData.zipCode}
                          onChange={handleChange("zipCode")}
                          className="h-10 w-full rounded-full border border-green-dark/30 bg-white/90 px-4 text-sm text-green-dark placeholder:text-green-dark/30 focus:outline-none focus:ring-2 focus:ring-green-medium"
                        />
                        {fieldErrors.zipCode ? (
                          <p className="mt-1 text-xs text-red-600">{fieldErrors.zipCode}</p>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,0.55fr)]">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-green-dark/70">Card holder name</label>
                      <input
                        type="text"
                        placeholder="Full name on card"
                        value={formData.holderName}
                        onChange={handleChange("holderName")}
                        className="h-10 w-full rounded-full border border-green-dark/30 bg-white/90 px-4 text-sm text-green-dark placeholder:text-green-dark/30 focus:outline-none focus:ring-2 focus:ring-green-medium"
                      />
                      {fieldErrors.holderName ? (
                        <p className="mt-1 text-xs text-red-600">{fieldErrors.holderName}</p>
                      ) : null}
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-green-dark/70">Card number</label>
                      <input
                        type="text"
                        placeholder="XXXX XXXX XXXX XXXX"
                        value={formData.cardNumber}
                        onChange={handleChange("cardNumber")}
                        className="h-10 w-full rounded-full border border-green-dark/30 bg-white/90 px-4 text-sm text-green-dark placeholder:text-green-dark/30 focus:outline-none focus:ring-2 focus:ring-green-medium"
                      />
                      {fieldErrors.cardNumber ? (
                        <p className="mt-1 text-xs text-red-600">{fieldErrors.cardNumber}</p>
                      ) : null}
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-green-dark/70">Expiration Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={formData.expirationDate}
                        onChange={handleChange("expirationDate")}
                        className="h-10 w-full rounded-full border border-green-dark/30 bg-white/90 px-4 text-sm text-green-dark placeholder:text-green-dark/30 focus:outline-none focus:ring-2 focus:ring-green-medium"
                      />
                      {fieldErrors.expirationDate ? (
                        <p className="mt-1 text-xs text-red-600">{fieldErrors.expirationDate}</p>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div className="max-w-[240px]">
                      <label className="mb-2 block text-sm font-medium text-green-dark/70">CVV</label>
                      <input
                        type="text"
                        placeholder="XXX"
                        value={formData.cvv}
                        onChange={handleChange("cvv")}
                        className="h-10 w-full rounded-full border border-green-dark/30 bg-white/90 px-4 text-sm text-green-dark placeholder:text-green-dark/30 focus:outline-none focus:ring-2 focus:ring-green-medium"
                      />
                      {fieldErrors.cvv ? (
                        <p className="mt-1 text-xs text-red-600">{fieldErrors.cvv}</p>
                      ) : null}
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="h-10 w-44 rounded-full bg-green-medium text-sm font-semibold text-white-intense shadow-[0_12px_24px_rgba(65,120,71,0.35)] transition hover:bg-green-dark"
                    >
                      {submitting ? "Confirming..." : "Confirm Payment"}
                    </button>
                  </div>
                  {submitError ? (
                    <p className="text-xs text-red-600">{submitError}</p>
                  ) : null}
                  {submitSuccess ? (
                    <p className="text-xs text-green-dark">{submitSuccess}</p>
                  ) : null}
                </form>
              </div>

              <aside className="rounded-[1.75rem] bg-white/60 px-4 py-5 shadow-[0_16px_32px_rgba(0,0,0,0.08)] sm:px-5 sm:py-6">
                <h2 className="font-nexa text-xl font-bold text-green-dark">Order Summary</h2>

                <div className="mt-5 space-y-4 text-sm text-green-dark/70">
                  <div className="grid grid-cols-[1fr_auto] items-center gap-x-2">
                    <span>Number of products chosen</span>
                    <span className="text-base font-semibold text-green-dark">{summary.productCount}</span>
                  </div>
                  <div className="grid grid-cols-[1fr_auto] items-center gap-x-2">
                    <span>Number of items</span>
                    <span className="text-base font-semibold text-green-dark">{summary.itemCount}</span>
                  </div>
                  <div className="grid grid-cols-[1fr_auto] items-center gap-x-2">
                    <span>Total price</span>
                    <span className="text-base font-semibold text-green-dark">
                      {formatMoney(summary.totalPrice)} DH
                    </span>
                  </div>
                </div>

                {loading && (
                  <p className="mt-6 text-xs text-green-dark/60">Loading summary...</p>
                )}
                {error && (
                  <p className="mt-6 text-xs text-red-600">{error}</p>
                )}
              </aside>
            </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
