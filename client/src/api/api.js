import axios from 'axios'

const API = axios.create({ baseURL: '/api' })

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('skillswap_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Auth
export const registerUser = (data) => API.post('/auth/register', data)
export const loginUser = (data) => API.post('/auth/login', data)
export const getMe = () => API.get('/auth/me')

// Users
export const getUsers = (params) => API.get('/users', { params })
export const getUserById = (id) => API.get(`/users/${id}`)
export const updateProfile = (data) => API.put('/users/profile', data)
export const getConnections = () => API.get('/users/connections')

// Requests
export const sendRequest = (data) => API.post('/requests', data)
export const getRequests = () => API.get('/requests')
export const respondRequest = (id, status) => API.put(`/requests/${id}`, { status })
export const deleteRequest = (id) => API.delete(`/requests/${id}`)

// Messages
export const getMessages = (roomId) => API.get(`/messages/${roomId}`)