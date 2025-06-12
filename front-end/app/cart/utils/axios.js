'use client'

import axios from 'axios'

// axios instance
const cartApi = axios.create({
  baseURL: 'http://localhost:3005/api', // back-end base url
  withCredentials: true,
  timeout: 5000,
})

// 加入token
cartApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwtToken')
  console.log('攔截到的 token:', token)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default cartApi
