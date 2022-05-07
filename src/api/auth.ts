import ApiService from './api-service'
import { User } from './users'

interface SignResponse {
  message: string
}

interface LoginBody {
  address: string
}

interface VerifyBody {
  address: string
  signature: string
}

interface VerifyReponse {
  token: string
  user: User
}

class AuthService extends ApiService {
  // Create or get user with a given address
  async login(address: string) {
    return await this.http.post<LoginBody, User>(`${this.baseUrl}/login`, {
      address,
    })
  }

  // Get a message to sign
  async sign(address: string) {
    return await this.http.get<SignResponse>(`${this.baseUrl}/sign/${address}`)
  }

  async verify(credentials: VerifyBody) {
    const { data } = await this.http.post<VerifyBody, VerifyReponse>(
      `${this.baseUrl}/verify`,
      credentials,
    )

    const { token, user } = data

    // Save obtained token
    this.setToken(credentials.address, token)

    // Set default Auth header
    this.setAuthHeader(token)

    // Return user information
    return user
  }

  /**
   * @returns the user that is currently logged in, based on the token stored in lcaolstorage.
   *          null if no user is currently logged in
   */
  async getLoggedUser(address: string) {
    // Get the token from local storage
    const token = this.getToken(address)

    // Check is the token exists
    if (!token) {
      return null
    }

    // Save the token in the authorization header
    this.setAuthHeader(token)

    // Get user data
    try {
      const { data: user } = await this.client.users.me()
      return user
    } catch (error) {
      return null
    }
  }

  logout(address: string) {
    this.removeToken(address)
  }

  private setToken(address: string, token: string) {
    const users = localStorage.getItem('connected-users')

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

    localStorage.setItem('connected-users', JSON.stringify(updatedUsers))
  }

  private getToken(address: string) {
    try {
      const users = localStorage.getItem('connected-users')

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

  private removeToken(address: string) {
    const users = localStorage.getItem('connected-users')

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

    localStorage.setItem('connected-users', JSON.stringify(updatedUsers))
  }

  private setAuthHeader(token: string) {
    this.http.instance.defaults.headers.common['x-auth-token'] = token
  }
}

export default AuthService
