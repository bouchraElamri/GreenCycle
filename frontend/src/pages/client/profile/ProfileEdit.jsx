import { useState } from "react";
import useProfileEdit from "../../../hooks/useProfileEdit";
import Button from "../../../components/ui/Button";
import { FiAtSign, FiImage, FiLock, FiSettings } from "react-icons/fi";

export default function ProfileEdit() {
  const [selectedProfileImage, setSelectedProfileImage] = useState(null);

  const {
    newEmail, setNewEmail,
    code, setCode,
    codeSent,
    oldPassword, setOldPassword,
    newPassword, setNewPassword,
    newPasswordConfirmation, setNewPasswordConfirmation,
    loading,
    emailError, emailSuccess,
    passwordError, passwordSuccess,
    profilePicError, profilePicSuccess, profilePicLoading,
    handleSendCode,
    handleConfirmEmail,
    handleUpdatePassword,
    handleChangeProfilePic,
  } = useProfileEdit();

  return (
    <section className="space-y-4">
      <article className="rounded-2xl bg-white-intense p-6 shadow">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-green-light p-3">
            <FiSettings className="h-5 w-5 text-green-dark" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-green-dark">Client Settings</h2>
            <p className="mt-1 text-sm text-gray-600">
              Manage your email, profile photo, and password in a clean dashboard layout.
            </p>
          </div>
        </div>
      </article>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-xl bg-green-light p-4">
          <p className="text-sm text-gray-600">Email</p>
          <p className="mt-2 text-sm font-semibold text-green-dark">Update with confirmation code</p>
        </div>
        <div className="rounded-xl bg-white-broken p-4">
          <p className="text-sm text-gray-600">Profile Photo</p>
          <p className="mt-2 text-sm font-semibold text-green-dark">Upload a new picture</p>
        </div>
        <div className="rounded-xl bg-green-100 p-4">
          <p className="text-sm text-gray-600">Security</p>
          <p className="mt-2 text-sm font-semibold text-green-dark">Change your password</p>
        </div>
      </div>

      {(emailError || passwordError || profilePicError) && (
        <div className="rounded-lg bg-red-100 text-red-700 p-3">
          {emailError || passwordError || profilePicError}
        </div>
      )}

      {(emailSuccess || passwordSuccess || profilePicSuccess) && (
        <div className="rounded-lg bg-green-100 text-green-700 p-3">
          {emailSuccess || passwordSuccess || profilePicSuccess}
        </div>
      )}

      <article className="rounded-2xl bg-white-intense p-6 shadow">
        <div className="flex items-center gap-2">
          <FiAtSign className="h-4 w-4 text-green-dark" />
          <h3 className="text-xl font-bold text-green-dark">Change Email</h3>
        </div>
        <p className="mt-1 text-sm text-gray-600">
          Request a confirmation code, then confirm the code to update your email.
        </p>

        <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-xl border border-green-light bg-white p-4 space-y-3">
            <p className="text-sm font-semibold text-gray-700">Step 1: Request code</p>
            <input
              type="email"
              placeholder="New email address"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full rounded-xl border border-green-light/70 px-3 py-2"
            />
            <Button
              onClick={handleSendCode}
              disabled={loading}
              className="px-4 py-2 rounded-full disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Code"}
            </Button>
          </div>

          <div className="rounded-xl border border-green-light bg-white p-4 space-y-3">
            <p className="text-sm font-semibold text-gray-700">Step 2: Confirm code</p>
            <input
              type="number"
              placeholder="Confirmation code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full rounded-xl border border-green-light/70 px-3 py-2"
              disabled={!codeSent}
            />
            <Button
              onClick={handleConfirmEmail}
              disabled={loading || !codeSent}
              className="px-4 py-2 rounded-full disabled:opacity-50"
            >
              Confirm Email
            </Button>
          </div>
        </div>
      </article>

      <article className="rounded-2xl bg-white-intense p-6 shadow">
        <div className="flex items-center gap-2">
          <FiImage className="h-4 w-4 text-green-dark" />
          <h3 className="text-xl font-bold text-green-dark">Profile Picture</h3>
        </div>
        <p className="mt-1 text-sm text-gray-600">
          Upload a profile image to personalize your account.
        </p>

        <div className="mt-4 rounded-xl border border-green-light bg-white p-4">
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedProfileImage(e.target.files?.[0] || null)}
              className="w-full rounded-xl border border-green-light/70 px-3 py-2"
            />
            <Button
              onClick={() => handleChangeProfilePic(selectedProfileImage)}
              disabled={profilePicLoading || !selectedProfileImage}
              className="px-4 py-2 rounded-full disabled:opacity-50"
            >
              {profilePicLoading ? "Uploading..." : "Upload Picture"}
            </Button>
          </div>
        </div>
      </article>

      <article className="rounded-2xl bg-white-intense p-6 shadow">
        <div className="flex items-center gap-2">
          <FiLock className="h-4 w-4 text-green-dark" />
          <h3 className="text-xl font-bold text-green-dark">Change Password</h3>
        </div>
        <p className="mt-1 text-sm text-gray-600">
          Keep your account secure by updating your password regularly.
        </p>

        <div className="mt-4 rounded-xl border border-green-light bg-white p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="password"
              placeholder="Current password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full rounded-xl border border-green-light/70 px-3 py-2"
            />
            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-xl border border-green-light/70 px-3 py-2"
            />
            <input
              type="password"
              placeholder="Confirm new password"
              value={newPasswordConfirmation}
              onChange={(e) => setNewPasswordConfirmation(e.target.value)}
              className="w-full rounded-xl border border-green-light/70 px-3 py-2"
            />
          </div>
          <div className="mt-4">
            <Button
              onClick={handleUpdatePassword}
              disabled={loading}
              className="px-4 py-2 rounded-full disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </div>
      </article>
    </section>
  );
}
