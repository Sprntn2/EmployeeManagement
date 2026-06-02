import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://localhost:7069'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

function toErrorMessage(error) {
  if (!error) return 'Unknown error'

  // Axios error shape
  if (typeof error === 'object' && error?.isAxiosError) {
    const status = error?.response?.status
    const data = error?.response?.data

    const candidate =
      (typeof data === 'string' && data) ||
      data?.title ||
      data?.message ||
      data?.error ||
      error.message

    return status ? `${candidate ?? 'Request failed'} (HTTP ${status})` : (candidate ?? 'Request failed')
  }

  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  return 'Unknown error'
}

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(new Error(toErrorMessage(error))),
)

