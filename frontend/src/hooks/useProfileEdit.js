import { useState } from 'react'
import { requestEmailChange, confirmEmailChange, updatePassword, changeProfilePic } from '../api/clientApi'

const useProfileEdit = () => {

  // ─── EMAIL STATE ───────────────────────────────────────
  const [newEmail, setNewEmail]   = useState('')
  const [code, setCode]           = useState('')
  const [codeSent, setCodeSent]   = useState(false)

  // ─── PASSWORD STATE ────────────────────────────────────
  const [oldPassword, setOldPassword]    = useState('')
  const [newPassword, setNewPassword]                   = useState('')
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState('')

  // ─── FEEDBACK STATE ────────────────────────────────────
  const [loading, setLoading]             = useState(false)
  const [emailError, setEmailError]       = useState('')
  const [emailSuccess, setEmailSuccess]   = useState('')
  const [passwordError, setPasswordError]     = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')
  const [profilePicError, setProfilePicError] = useState('')
  const [profilePicSuccess, setProfilePicSuccess] = useState('')
  const [profilePicLoading, setProfilePicLoading] = useState(false)

  // ─── HANDLERS ─────────────────────────────────────────

  const handleSendCode = async () => {
    setEmailError('')
    setEmailSuccess('')
    setLoading(true)
    try {
      await requestEmailChange(newEmail)
      setCodeSent(true)
      setEmailSuccess('Code sent! Check your inbox.')
    } catch (err) {
      setEmailError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmEmail = async () => {
    setEmailError('')
    setEmailSuccess('')
    setLoading(true)
    try {
      await confirmEmailChange(code) // only the code goes to the backend
      setEmailSuccess('Email updated successfully!')
      setNewEmail('')
      setCode('')
      setCodeSent(false)
    } catch (err) {
      setEmailError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdatePassword = async () => {
    setPasswordError('')
    setPasswordSuccess('')
    setLoading(true)
    try {
      // We send all three to the backend, it handles the validation
      await updatePassword(oldPassword, newPassword, newPasswordConfirmation)
      setPasswordSuccess('Password updated successfully!')
      setOldPassword('')
      setNewPassword('')
      setNewPasswordConfirmation('')
    } catch (err) {
      setPasswordError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChangeProfilePic = async (file) => {
    setProfilePicError('')
    setProfilePicSuccess('')

    if (!file) {
      setProfilePicError('Please select an image.')
      return
    }

    setProfilePicLoading(true)
    try {
      await changeProfilePic(file)
      setProfilePicSuccess('Profile picture updated successfully!')
    } catch (err) {
      setProfilePicError(err.message)
    } finally {
      setProfilePicLoading(false)
    }
  }

  return {
    // Email
    newEmail, setNewEmail,
    code, setCode,
    codeSent,
    // Password
    oldPassword, setOldPassword,
    newPassword, setNewPassword,
    newPasswordConfirmation, setNewPasswordConfirmation,
    // Feedback
    loading,
    emailError, emailSuccess,
    passwordError, passwordSuccess,
    profilePicError, profilePicSuccess, profilePicLoading,
    // Handlers
    handleSendCode,
    handleConfirmEmail,
    handleUpdatePassword,
    handleChangeProfilePic,
  }
}

export default useProfileEdit
