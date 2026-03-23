const BASE = '/api'

const headers = (token) => ({
  'Content-Type': 'application/json',
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
})

const handle = async (res) => {
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Request failed')
  return data
}

export const authApi = {
  register: (body) =>
    fetch(`${BASE}/users`, { method: 'POST', headers: headers(), body: JSON.stringify(body) }).then(handle),

  login: (body) =>
    fetch(`${BASE}/users/login`, { method: 'POST', headers: headers(), body: JSON.stringify(body) }).then(handle),

  me: (token) =>
    fetch(`${BASE}/users/me`, { headers: headers(token) }).then(handle),
}

export const goalsApi = {
  getAll: (token) =>
    fetch(`${BASE}/goals`, { headers: headers(token) }).then(handle),

  create: (token, body) =>
    fetch(`${BASE}/goals`, { method: 'POST', headers: headers(token), body: JSON.stringify(body) }).then(handle),

  update: (token, id, body) =>
    fetch(`${BASE}/goals/${id}`, { method: 'PUT', headers: headers(token), body: JSON.stringify(body) }).then(handle),

  remove: (token, id) =>
    fetch(`${BASE}/goals/${id}`, { method: 'DELETE', headers: headers(token) }).then(handle),
}
