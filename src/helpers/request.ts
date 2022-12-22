import axios from 'axios'

const request = axios.create()

request.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

request.interceptors.response.use(
  (response) => {
    if (response.status >= 400) return Promise.reject(response)
    if (response.data) return response.data
    return response
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default request
