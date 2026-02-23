import { useState } from "react";
import useProfileEdit from "../../../hooks/useProfileEdit";
import Button from "../../../components/ui/Button";

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
    <section className="mx-auto max-w-5xl">
      <div className="rounded-3xl border border-green-light/70 bg-white-intense shadow-sm">
        <div className="border-b border-green-light/60 px-5 py-5 sm:px-6">
          <h1 className="text-2xl font-bold text-green-dark">Edit Your Info</h1>
          <p className="mt-1 text-sm text-gray-600">
            Update your email, profile photo, and password from one place.
          </p>
        </div>

        <div className="px-5 py-6 sm:px-6">
          <div className="rounded-2xl border border-green-light/50 bg-white p-5">
            <h2 className="text-xl font-semibold text-gray-600 mb-4">Changing Email Address</h2>

            {emailError && <p className="text-red-500 text-sm mb-3">{emailError}</p>}
            {emailSuccess && <p className="text-green-600 text-sm mb-3">{emailSuccess}</p>}

            <div className="space-y-4 mb-10">
              <label className="block text-sm font-medium text-gray-600">Edit email</label>

              <div className="w-full lg:w-2/3 flex flex-col sm:flex-row gap-4 bg-gray-50 rounded-xl p-4">
                <input
                  type="email"
                  placeholder="New email address"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full sm:flex-1 rounded-lg border border-green-light/60 px-3 py-2"
                />
                <Button
                  onClick={handleSendCode}
                  disabled={loading}
                  className="px-4 py-2 rounded-full disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send code"}
                </Button>
              </div>

              {codeSent && (
                <div className="w-full lg:w-2/3 flex flex-col sm:flex-row gap-4 bg-gray-50 rounded-xl p-4">
                  <input
                    type="number"
                    placeholder="Confirmation code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full sm:flex-1 rounded-lg border border-green-light/60 px-3 py-2"
                  />
                  <Button
                    onClick={handleConfirmEmail}
                    disabled={loading}
                    className="px-4 py-2 rounded-full disabled:opacity-50"
                  >
                    Confirm
                  </Button>
                </div>
              )}
            </div>

            <div className="w-full lg:w-2/3 flex flex-col sm:flex-row gap-4 bg-gray-50 rounded-xl p-4 mb-3">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedProfileImage(e.target.files?.[0] || null)}
                className="w-full sm:flex-1 rounded-lg border border-green-light/60 px-3 py-2"
              />
              <Button
                onClick={() => handleChangeProfilePic(selectedProfileImage)}
                disabled={profilePicLoading || !selectedProfileImage}
                className="px-4 py-2 rounded-full disabled:opacity-50"
              >
                {profilePicLoading ? "Uploading..." : "Upload"}
              </Button>
            </div>
            {profilePicError && <p className="text-red-500 text-sm mb-3">{profilePicError}</p>}
            {profilePicSuccess && <p className="text-green-600 text-sm mb-6">{profilePicSuccess}</p>}

            <h2 className="text-xl font-semibold text-gray-600 mb-4">Change your password</h2>

            {passwordError && <p className="text-red-500 text-sm mb-3">{passwordError}</p>}
            {passwordSuccess && <p className="text-green-600 text-sm mb-3">{passwordSuccess}</p>}

            <div className="flex flex-col gap-4 bg-gray-50 rounded-xl p-4">
              <input
                type="password"
                placeholder="Current password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full lg:w-2/3 rounded-lg border border-green-light/60 px-3 py-2"
              />
              <input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full lg:w-2/3 rounded-lg border border-green-light/60 px-3 py-2"
              />
              <input
                type="password"
                placeholder="Confirm new password"
                value={newPasswordConfirmation}
                onChange={(e) => setNewPasswordConfirmation(e.target.value)}
                className="w-full lg:w-2/3 rounded-lg border border-green-light/60 px-3 py-2"
              />
              <Button
                onClick={handleUpdatePassword}
                disabled={loading}
                className="w-full sm:w-auto sm:self-start px-4 py-2 rounded-full disabled:opacity-50"
              >
                {loading ? "Updating..." : "Change Password"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
