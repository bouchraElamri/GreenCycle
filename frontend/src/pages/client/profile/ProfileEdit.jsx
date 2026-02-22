import Navbar from '../../../components/layouts/Navbar'
import useProfileEdit from '../../../hooks/useProfileEdit'

export default function ProfileEdit() {

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
    handleSendCode,
    handleConfirmEmail,
    handleUpdatePassword,
  } = useProfileEdit()

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className='max-w-7xl mx-auto px-4 py-8 mt-24'>
        <div className='flex flex-col md:flex-row gap-10'>

          <aside className='md:w-64 ms-8'>
            <div className='flex flex-col gap-4 bg-gray-100'>
              <button className='w-full text-center text-white-intense bg-green-600 rounded-full px-2 py-2 font-medium'>
                Edit Info
              </button>
              <button className='w-full text-center bg-green-600 text-white-intense rounded-full px-2 py-2 font-medium'>
                My Orders
              </button>
            </div>
          </aside>

          <div className='flex-1'>
            <div className='bg-white rounded-lg shadow-md p-6'>
              <h1 className='text-2xl font-bold text-green-700 mb-6'>Edit your infos</h1>

              {/* ── EMAIL SECTION ── */}
              <h2 className='text-xl font-semibold text-gray-500 mb-4'>Changing Email Address</h2>

              {emailError   && <p className='text-red-500 text-sm mb-3'>{emailError}</p>}
              {emailSuccess && <p className='text-green-600 text-sm mb-3'>{emailSuccess}</p>}

              <div className='space-y-4 mb-10'>
                <label className="block text-sm font-medium text-gray-600">Edit email</label>

                <div className='w-2/3 flex flex-row gap-5 bg-gray-50 p-4'>
                  <input
                    type="email"
                    placeholder='New email address'
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className='w-2/3 px-3 py-2'
                  />
                  <button
                    onClick={handleSendCode}
                    disabled={loading}
                    className='px-4 py-2 bg-green-700 text-white rounded-full disabled:opacity-50'
                  >
                    {loading ? 'Sending...' : 'Send code'}
                  </button>
                </div>

                {codeSent && (
                  <div className='w-2/3 flex flex-row gap-5 bg-gray-50 p-4'>
                    <input
                      type="number"
                      placeholder='Confirmation code'
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className='w-2/3 px-3 py-2'
                    />
                    <button
                      onClick={handleConfirmEmail}
                      disabled={loading}
                      className='px-4 py-2 bg-green-700 text-white rounded-full disabled:opacity-50'
                    >
                      Confirm
                    </button>
                  </div>
                )}
              </div>

              {/* ── PASSWORD SECTION ── */}
              <h2 className='text-xl font-semibold text-gray-500 mb-4'>Change your password</h2>

              {passwordError   && <p className='text-red-500 text-sm mb-3'>{passwordError}</p>}
              {passwordSuccess && <p className='text-green-600 text-sm mb-3'>{passwordSuccess}</p>}

              <div className='flex flex-col gap-5 bg-gray-50 p-4'>
                <input
                  type="password"
                  placeholder='Current password'
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className='w-2/3 px-3 py-2'
                />
                <input
                  type="password"
                  placeholder='New password'
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className='w-2/3 px-3 py-2'
                />
                <input
                  type="password"
                  placeholder='Confirm new password'
                  value={newPasswordConfirmation}
                  onChange={(e) => setNewPasswordConfirmation(e.target.value)}
                  className='w-2/3 px-3 py-2'
                />
                <button
                  onClick={handleUpdatePassword}
                  disabled={loading}
                  className='w-1/3 px-4 py-2 bg-green-700 text-white rounded-full disabled:opacity-50'
                >
                  {loading ? 'Updating...' : 'Change Password'}
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}