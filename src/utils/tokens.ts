const LOCAL_STORAGE_KEY = 'connected-users'

export const getToken = (address: string) => {
  try {
    const users = localStorage.getItem(LOCAL_STORAGE_KEY)

    if (!users) {
      return null
    }

    const parsedUsers = JSON.parse(users)
    const user = parsedUsers[address]

    if (!user?.token) {
      return null
    }

    return user.token
  } catch {
    return null
  }
}

export const setToken = (address: string, token: string) => {
  const users = localStorage.getItem(LOCAL_STORAGE_KEY)

  let parsedUsers: Record<string, any> = {}

  if (users) {
    try {
      parsedUsers = JSON.parse(users)
    } catch (error) {
      parsedUsers = {}
    }
  }

  const user = parsedUsers[address] || {}
  const updatedUsers = { ...parsedUsers, [address]: { ...user, token } }

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedUsers))
}

export const removeToken = (address: string) => {
  const users = localStorage.getItem(LOCAL_STORAGE_KEY)

  let parsedUsers: Record<string, any> = {}

  if (users) {
    try {
      parsedUsers = JSON.parse(users)
    } catch (error) {
      parsedUsers = {}
    }
  }

  const user = parsedUsers[address] || {}
  delete user?.token

  const updatedUsers = { ...parsedUsers, [address]: { ...user } }

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedUsers))
}
