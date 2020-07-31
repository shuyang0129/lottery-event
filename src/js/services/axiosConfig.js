import axios from 'axios'

const http = axios.create({
  method: 'POST',
  baseURL: process.env.BASE_URL,
  // timeout: 1000,
  headers: {
    'Content-Type': 'application/json',
    accessMode: 'H5',
    appKey: process.env.APP_KEY,
  },
})

// Add a request interceptor
http.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  }
)

// Add a response interceptor
http.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error)
  }
)

export default http
