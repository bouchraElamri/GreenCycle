import { useContext, useEffect, useMemo, useState } from "react";
import sellerApi from "../../../api/sellerApi";
import AuthContext from "../../../contexts/AuthContext";

export default function ProfileEdit() {
  const { refreshAuth } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [sellerProfile, setSellerProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const [pictureLoading, setPictureLoading] = useState(false);
  const [sellerInfoLoading, setSellerInfoLoading] = useState(false);

  const [newEmail, setNewEmail] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [sellerDescription, setSellerDescription] = useState("");
  const [sellerStreet, setSellerStreet] = useState("");
  const [sellerCity, setSellerCity] = useState("");
  const [sellerZip, setSellerZip] = useState("");
  const [sellerCountry, setSellerCountry] = useState("");
  const [sellerAccountHolder, setSellerAccountHolder] = useState("");
  const [sellerIban, setSellerIban] = useState("");
  const [sellerBankName, setSellerBankName] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      setLoading(true);
      setError("");
      try {
        const [currentUserData, sellerProfileData] = await Promise.all([
          sellerApi.getCurrentUser(),
          sellerApi.getSellerProfile().catch(() => null),
        ]);

        if (!mounted) return;
        const currentUser = currentUserData?.user || null;
        setUser(currentUser);
        setFirstName(currentUser?.firstName || "");
        setLastName(currentUser?.lastName || "");
        setPhone(currentUser?.phone || "");
        const profile = sellerProfileData?.data || sellerProfileData || null;
        setSellerProfile(profile);

        setSellerDescription(profile?.description || "");
        setSellerStreet(profile?.address?.street || "");
        setSellerCity(profile?.address?.city || "");
        setSellerZip(profile?.address?.zip || "");
        setSellerCountry(profile?.address?.country || "");
        setSellerAccountHolder(profile?.bankAccount?.accountHolder || "");
        setSellerIban(profile?.bankAccount?.iban || "");
        setSellerBankName(profile?.bankAccount?.bankName || "");
      } catch (err) {
        if (mounted) setError(err?.message || "Failed to load profile");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadProfile();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const apiOrigin = useMemo(() => {
    return (process.env.REACT_APP_API_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "");
  }, []);

  const currentProfileImage = useMemo(() => {
    if (previewUrl) return previewUrl;
    const rawPath = user?.profileImage;
    if (!rawPath) return "";

    const normalized = String(rawPath).replace(/\\/g, "/");
    if (normalized.startsWith("http")) return normalized;

    const uploadsIndex = normalized.indexOf("/uploads/");
    if (uploadsIndex >= 0) {
      return `${apiOrigin}${normalized.slice(uploadsIndex)}`;
    }

    if (normalized.startsWith("uploads/")) {
      return `${apiOrigin}/${normalized}`;
    }

    return `${apiOrigin}${normalized.startsWith("/") ? normalized : `/${normalized}`}`;
  }, [apiOrigin, previewUrl, user?.profileImage]);

  function onPickImage(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  async function submitProfileUpdate(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    setProfileLoading(true);
    try {
      const data = await sellerApi.updateProfile({ firstName, lastName, phone });
      setUser(data?.user || user);
      setMessage(data?.message || "Profile updated.");
      await refreshAuth();
    } catch (err) {
      setError(err?.message || "Failed to update profile");
    } finally {
      setProfileLoading(false);
    }
  }

  async function submitProfilePicture(event) {
    event.preventDefault();
    if (!selectedImage) return;
    setError("");
    setMessage("");
    setPictureLoading(true);
    try {
      const data = await sellerApi.uploadProfilePicture(selectedImage);
      if (data?.user) setUser(data.user);
      setMessage(data?.message || "Profile picture updated.");
      setSelectedImage(null);
      setPreviewUrl("");
      await refreshAuth();
    } catch (err) {
      setError(err?.message || "Failed to upload picture");
    } finally {
      setPictureLoading(false);
    }
  }

  async function submitSellerInfoUpdate(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    setSellerInfoLoading(true);
    try {
      const payload = {
        description: sellerDescription,
        address: {
          street: sellerStreet,
          city: sellerCity,
          zip: sellerZip,
          country: sellerCountry,
        },
        bankAccount: {
          accountHolder: sellerAccountHolder,
          iban: sellerIban.toUpperCase(),
          bankName: sellerBankName,
        },
      };
      const data = await sellerApi.updateSellerProfile(payload);
      const updatedProfile = data?.data || data?.sellerProfile || data?.profile || payload;
      setSellerProfile(updatedProfile);
      setMessage(data?.message || "Seller information updated.");
    } catch (err) {
      setError(err?.message || "Failed to update seller information");
    } finally {
      setSellerInfoLoading(false);
    }
  }

  async function submitEmailRequest(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    try {
      const data = await sellerApi.requestEmailChange(newEmail);
      setMessage(data?.message || "Email change request sent.");
      setNewEmail("");
    } catch (err) {
      setError(err?.message || "Failed to request email change");
    }
  }

  async function submitEmailConfirm(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    try {
      const data = await sellerApi.confirmEmailChange(confirmationCode);
      setMessage(data?.message || "Email updated.");
      setConfirmationCode("");
    } catch (err) {
      setError(err?.message || "Failed to confirm email");
    }
  }

  async function submitPasswordChange(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    try {
      const data = await sellerApi.changePassword({
        oldPassword,
        newPassword,
        newPasswordConfirmation,
      });
      setMessage(data?.message || "Password updated.");
      setOldPassword("");
      setNewPassword("");
      setNewPasswordConfirmation("");
    } catch (err) {
      setError(err?.message || "Failed to update password");
    }
  }

  if (loading) {
    return (
      <section className="rounded-2xl bg-white-intense p-6 shadow">
        <p className="text-green-dark">Loading profile...</p>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      {error && <div className="rounded-lg bg-red-100 text-red-700 p-3">{error}</div>}
      {message && <div className="rounded-lg bg-green-100 text-green-700 p-3">{message}</div>}

      <article className="rounded-2xl bg-white-intense p-6 shadow">
        <h2 className="text-2xl font-bold text-green-dark">Seller Profile</h2>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <p>
            <span className="font-bold text-gray-700">Name:</span> {user?.firstName} {user?.lastName}
          </p>
          <p>
            <span className="font-bold text-gray-700">Email:</span> {user?.email}
          </p>
          <p>
            <span className="font-bold text-gray-700">Role:</span>{" "}
            {Array.isArray(user?.role) ? user.role.join(", ") : user?.role || "-"}
          </p>
          <p>
            <span className="font-bold text-gray-700">Seller ID:</span> {sellerProfile?._id || "Not available"}
          </p>
        </div>
      </article>

      <article className="rounded-2xl bg-white-intense p-6 shadow">
        <h3 className="text-xl font-bold text-green-dark">Basic Information</h3>
        <form onSubmit={submitProfileUpdate} className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            required
            placeholder="First name"
            className="w-full rounded-xl border border-green-light px-3 py-2"
          />
          <input
            type="text"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            required
            placeholder="Last name"
            className="w-full rounded-xl border border-green-light px-3 py-2"
          />
          <input
            type="text"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            required
            placeholder="Phone"
            className="w-full rounded-xl border border-green-light px-3 py-2"
          />
          <div className="sm:col-span-3">
            <button
              type="submit"
              disabled={profileLoading}
              className="rounded-xl bg-green-dark text-white-intense px-4 py-2 font-bold disabled:opacity-60"
            >
              {profileLoading ? "Updating..." : "Update Profile"}
            </button>
          </div>
        </form>
      </article>

      <article className="rounded-2xl bg-white-intense p-6 shadow">
        <h3 className="text-xl font-bold text-green-dark">Profile Picture</h3>
        <div className="mt-4 flex flex-col sm:flex-row gap-4 sm:items-center">
          <div className="h-24 w-24 rounded-full overflow-hidden bg-green-light border border-green-medium">
            {currentProfileImage ? (
              <img src={currentProfileImage} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-green-dark text-xs">
                No image
              </div>
            )}
          </div>

          <form onSubmit={submitProfilePicture} className="flex-1 space-y-2">
            <input
              type="file"
              accept="image/*"
              onChange={onPickImage}
              className="w-full rounded-xl border border-green-light px-3 py-2"
            />
            <button
              type="submit"
              disabled={pictureLoading || !selectedImage}
              className="rounded-xl bg-green-medium text-white-intense px-4 py-2 font-bold disabled:opacity-60"
            >
              {pictureLoading ? "Uploading..." : "Upload Picture"}
            </button>
          </form>
        </div>
      </article>

      <article className="rounded-2xl bg-white-intense p-6 shadow">
        <h3 className="text-xl font-bold text-green-dark">Seller Information</h3>
        <p className="mt-1 text-sm text-gray-600">
          Update your business description, address, and bank account details.
        </p>
        <form onSubmit={submitSellerInfoUpdate} className="mt-4 space-y-4">
          <div>
            <label className="text-sm font-bold text-gray-700">Business Description</label>
            <textarea
              value={sellerDescription}
              onChange={(event) => setSellerDescription(event.target.value)}
              required
              minLength={50}
              rows={4}
              className="mt-2 w-full rounded-xl border border-green-light px-3 py-2"
              placeholder="Describe your business (minimum 50 characters)."
            />
          </div>

          <div>
            <label className="text-sm font-bold text-gray-700">Address</label>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={sellerStreet}
                onChange={(event) => setSellerStreet(event.target.value)}
                required
                placeholder="Street"
                className="rounded-xl border border-green-light px-3 py-2"
              />
              <input
                type="text"
                value={sellerCity}
                onChange={(event) => setSellerCity(event.target.value)}
                required
                placeholder="City"
                className="rounded-xl border border-green-light px-3 py-2"
              />
              <input
                type="text"
                value={sellerZip}
                onChange={(event) => setSellerZip(event.target.value)}
                required
                pattern="[0-9]{5}"
                placeholder="Zip (5 digits)"
                className="rounded-xl border border-green-light px-3 py-2"
              />
              <input
                type="text"
                value={sellerCountry}
                onChange={(event) => setSellerCountry(event.target.value)}
                required
                placeholder="Country"
                className="rounded-xl border border-green-light px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-bold text-gray-700">Bank Account</label>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={sellerAccountHolder}
                onChange={(event) => setSellerAccountHolder(event.target.value)}
                required
                placeholder="Account holder"
                className="rounded-xl border border-green-light px-3 py-2"
              />
              <input
                type="text"
                value={sellerBankName}
                onChange={(event) => setSellerBankName(event.target.value)}
                required
                placeholder="Bank name"
                className="rounded-xl border border-green-light px-3 py-2"
              />
              <input
                type="text"
                value={sellerIban}
                onChange={(event) => setSellerIban(event.target.value)}
                required
                placeholder="IBAN"
                className="sm:col-span-2 rounded-xl border border-green-light px-3 py-2"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={sellerInfoLoading}
            className="rounded-xl bg-green-dark text-white-intense px-4 py-2 font-bold disabled:opacity-60"
          >
            {sellerInfoLoading ? "Updating..." : "Update Seller Information"}
          </button>
        </form>
      </article>

      <article className="rounded-2xl bg-white-intense p-6 shadow">
        <h3 className="text-xl font-bold text-green-dark">Change Email</h3>
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <form onSubmit={submitEmailRequest} className="space-y-3">
            <p className="text-sm text-gray-600">Step 1: Request code to old email</p>
            <input
              type="email"
              value={newEmail}
              onChange={(event) => setNewEmail(event.target.value)}
              required
              placeholder="New email"
              className="w-full rounded-xl border border-green-light px-3 py-2"
            />
            <button
              type="submit"
              className="rounded-xl bg-green-dark text-white-intense px-4 py-2 font-bold"
            >
              Send Code
            </button>
          </form>

          <form onSubmit={submitEmailConfirm} className="space-y-3">
            <p className="text-sm text-gray-600">Step 2: Confirm code</p>
            <input
              type="text"
              value={confirmationCode}
              onChange={(event) => setConfirmationCode(event.target.value)}
              required
              placeholder="6-digit code"
              className="w-full rounded-xl border border-green-light px-3 py-2"
            />
            <button
              type="submit"
              className="rounded-xl bg-green-medium text-white-intense px-4 py-2 font-bold"
            >
              Confirm Email
            </button>
          </form>
        </div>
      </article>

      <article className="rounded-2xl bg-white-intense p-6 shadow">
        <h3 className="text-xl font-bold text-green-dark">Change Password</h3>
        <form onSubmit={submitPasswordChange} className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="password"
            value={oldPassword}
            onChange={(event) => setOldPassword(event.target.value)}
            required
            placeholder="Current password"
            className="w-full rounded-xl border border-green-light px-3 py-2"
          />
          <input
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            required
            placeholder="New password"
            className="w-full rounded-xl border border-green-light px-3 py-2"
          />
          <input
            type="password"
            value={newPasswordConfirmation}
            onChange={(event) => setNewPasswordConfirmation(event.target.value)}
            required
            placeholder="Confirm new password"
            className="w-full rounded-xl border border-green-light px-3 py-2"
          />
          <div className="sm:col-span-3">
            <button
              type="submit"
              className="rounded-xl bg-green-dark text-white-intense px-4 py-2 font-bold"
            >
              Update Password
            </button>
          </div>
        </form>
      </article>
    </section>
  );
}
