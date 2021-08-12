import { auth_tokenKey, myIdKey } from "../constants" 

const API_URL = process.env.NODE_ENV === "production" ? "" : "http://localhost:8000"


export async function client(endpoint, {body, ...customConfig} = {}) {

    const token = window.localStorage.getItem(auth_tokenKey)
    const headers = {'content-type': 'application/json'}
    if (token) {
      headers.Authorization = `Token ${token}`
    }
    const config = {
      method: body ? 'POST' : 'GET',
      ...customConfig,
      headers: {
        ...headers,
        ...customConfig.headers,
      },
    }
    if (body) {
      config.body = JSON.stringify(body)
    }
    return window
      .fetch(`${API_URL}/${endpoint}`, config)
      .then(async response => {
        if (response.status === 401) {
          window.localStorage.removeItem(auth_tokenKey)
          window.localStorage.removeItem(myIdKey)
          window.location.assign(window.location)
          return
        }
        else if ((!response.ok && response.status !== 400)){
            const errorMessage = await response.text()
            // можно в зависимости от параметра либо в консоль выводить ошибку, либо режектить ее для дальнейшего использования 
            console.log(new Error(errorMessage))
        }
        else {
          return response
        } 
      })
}

client.get = function (endpoint, customConfig = {}) {
    return client(endpoint, { ...customConfig, method: 'GET' })
  }
  
client.post = function (endpoint, body, customConfig = {}) {
  return client(endpoint, { ...customConfig, body, method: "POST" })
}

client.put = function (endpoint, body, customConfig = {}) {
  return client(endpoint, { ...customConfig, body, method: "PUT"})
}

client.patch = function (endpoint, body, customConfig = {}) {
  return client(endpoint, { ...customConfig, body, method: "PATCH"})
}

client.delete = function (endpoint, customConfig = {}) {
  return client(endpoint, { ...customConfig, method: "DELETE" })
}
