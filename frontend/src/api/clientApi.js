const BASE_URL = 'http://localhost:5000/api/client'
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5OTgzYzczNWJiMDA0NDZjYjk1YzQyZCIsImlhdCI6MTc3MTU4ODA5NSwiZXhwIjoxNzcxNjc0NDk1fQ.4SdK67RhabJTs4nPIpuSPAhmmjoXSwfODh3wo76CNjw'

// Called when user clicks "Send Code"
export const requestEmailChange = async (newEmail) => {
  const response = await fetch(`${BASE_URL}/email-change/request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json','Authorization': `Bearer ${TOKEN}` },
    credentials: 'include',
    body: JSON.stringify({ newEmail })
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || 'Failed to send code')
  return data
}

// Called when user clicks "Confirm" — only sends the code
export const confirmEmailChange = async (confirmationCode) => {
  const response = await fetch(`${BASE_URL}/email-change/confirm`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json','Authorization': `Bearer ${TOKEN}` },
    credentials: 'include',
    body: JSON.stringify({ confirmationCode })
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || 'Failed to confirm email')
  return data
}

// Called when user clicks "Change Password" — sends all three fields
export const updatePassword = async (oldPassword, newPassword, newPasswordConfirmation) => {
  const response = await fetch(`${BASE_URL}/change-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${TOKEN}` },
    credentials: 'include',
    body: JSON.stringify({ oldPassword, newPassword, newPasswordConfirmation })
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || 'Failed to update password')
  return data
}