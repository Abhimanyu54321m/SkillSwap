import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentUser: JSON.parse(localStorage.getItem('skillswap_user')) || null,
  token: localStorage.getItem('skillswap_token') || null,
  loading: false,
  error: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true
      state.error = null
    },
    loginSuccess: (state, action) => {
      state.loading = false
      state.currentUser = action.payload.user
      state.token = action.payload.token
      localStorage.setItem('skillswap_user', JSON.stringify(action.payload.user))
      localStorage.setItem('skillswap_token', action.payload.token)
    },
    loginFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },
    updateUser: (state, action) => {
      state.currentUser = action.payload
      localStorage.setItem('skillswap_user', JSON.stringify(action.payload))
    },
    logout: (state) => {
      state.currentUser = null
      state.token = null
      localStorage.removeItem('skillswap_user')
      localStorage.removeItem('skillswap_token')
    },
  },
})

export const { loginStart, loginSuccess, loginFailure, updateUser, logout } = userSlice.actions
export default userSlice.reducer