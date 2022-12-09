const API_END_POINT = process.env.API_END_POINT
const API_KEY = process.env.API_KEY

export const request = async (url) => {
  try {
    const res = await fetch(`${API_END_POINT}?apikey=${API_KEY}&${url}`)

    if (!res.ok) {
      throw new Error('API Call Error')
    }

    return await res.json()
  } catch (e) {
    alert(e.message)
  }
}
