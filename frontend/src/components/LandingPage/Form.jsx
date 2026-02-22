import React, { useState } from "react";
import publicApi from "../../api/publicApi";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  message: "",
};

const Form = () => {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: "", text: "" });

  const validate = (data) => {
    const nextErrors = {};

    if (!data.name.trim()) nextErrors.name = "Name is required";
    if (!data.email.trim()) nextErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
      nextErrors.email = "Email is invalid";
    }
    if (!data.phone.trim()) nextErrors.phone = "Phone is required";
    if (!data.message.trim()) nextErrors.message = "Message is required";

    return nextErrors;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      const nextErrors = validate(next);
      setErrors((current) => ({
        ...current,
        [name]: nextErrors[name],
      }));
      return next;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validate(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    setStatus({ type: "", text: "" });

    try {
      await publicApi.sendContactMessage(formData);
      setStatus({ type: "success", text: "Message sent successfully." });
      setFormData(initialForm);
      setErrors({});
    } catch (error) {
      setStatus({ type: "error", text: error.message || "Failed to send message." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="relative bg-white-intense pb-12">
      <div className="mx-6 md:mx-24 xl:mx-38">
        <div className="flex items-center gap-6 md:gap-10">
          <div className="h-px flex-1 bg-gradient-to-r from-green-dark/80 to-transparent" />
          <h2 className="font-nexa text-4xl font-bold text-green-dark md:text-5xl">Contact Us</h2>
          <div className="h-px flex-1 bg-gradient-to-l from-green-dark/80 to-transparent" />
        </div>

        <form noValidate onSubmit={handleSubmit} className="mx-auto mt-12 max-w-5xl">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              className={`h-14 rounded-full border-[3px] px-6 font-nexa text-lg text-green-dark placeholder:text-green-dark/30 focus:outline-none ${
                errors.name ? "border-red-500" : "border-green-dark/85"
              }`}
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className={`h-14 rounded-full border-[3px] px-6 font-nexa text-lg text-green-dark placeholder:text-green-dark/30 focus:outline-none ${
                errors.email ? "border-red-500" : "border-green-dark/85"
              }`}
            />
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              className={`h-14 rounded-full border-[3px] px-6 font-nexa text-lg text-green-dark placeholder:text-green-dark/30 focus:outline-none ${
                errors.phone ? "border-red-500" : "border-green-dark/85"
              }`}
            />
          </div>

          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Message here..."
            rows={6}
            className={`mt-6 w-full resize-none rounded-[28px] border-[3px] px-6 py-5 font-nexa text-lg text-green-dark placeholder:text-green-dark/30 focus:outline-none ${
              errors.message ? "border-red-500" : "border-green-dark/85"
            }`}
          />

          <div className="mt-8 flex justify-center">
            <button
              type="submit"
              disabled={submitting}
              className="h-12 md:h-14 min-w-[210px] rounded-full bg-green-medium px-10 font-nexa text-xl md:text-2xl font-bold text-white-intense transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? "Sending..." : "Send"}
            </button>
          </div>

          {status.text && (
            <p
              className={`mt-4 text-center font-nexa text-lg ${
                status.type === "success" ? "text-green-dark" : "text-red-600"
              }`}
            >
              {status.text}
            </p>
          )}
        </form>
      </div>
    </section>
  );
};

export default Form;
