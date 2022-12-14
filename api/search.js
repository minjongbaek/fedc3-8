import fetch from 'node-fetch'
const API_END_POINT = process.env.API_END_POINT
const API_KEY = process.env.API_KEY

export default async function (request, response) {
  try {
    const { s, page = 1 } = (request.query)
    const params = new URLSearchParams({ apikey: API_KEY, s, page })
    const res = await fetch(`${API_END_POINT}?${params}`)
    const data = await res.json()
    return response.status(200).json(data)
  } catch (error) {
    console.error(error)
    response.status(500).json({ error: error.message })
  }
}

