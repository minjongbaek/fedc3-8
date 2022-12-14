const API_END_POINT = import.meta.env.VITE_API_END_POINT
const API_KEY = import.meta.env.VITE_API_KEY

export const request = async (path, queryString) => {
  try {
    const params = new URLSearchParams({ ...queryString })
    let url = `/api/${path}?${params}`

    if (import.meta.env.DEV) {
      params.append('apikey', API_KEY)
      url = `${API_END_POINT}?${params}`
    }

    const res = await fetch(url)

    if (!res.ok) {
      throw new Error('API Call Error')
    }

    return await res.json()
  } catch (error) {
    console.error(error)
  }
}
