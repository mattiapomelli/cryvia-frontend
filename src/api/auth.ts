import ApiService from './api-service'

interface SignResponse {
  message: string
}

interface LoginBody {
  address: string
  signature: string
}

interface TokenResponse {
  token: string
}

class AuthService extends ApiService {
  async sign(address: string) {
    // Get a message to sign
    return await this.http.get<SignResponse>(`${this.baseUrl}/sign/${address}`)
  }

  async login(credentials: LoginBody) {
    // Login and get a token
    const { data } = await this.http.post<LoginBody, TokenResponse>(
      `${this.baseUrl}/login`,
      credentials,
    )
    const { token } = data

    // Save obtained token
    this.setToken({ token })

    // Set default Auth header
    this.setAuthHeader(token)

    // Get user information
    return await this.client.users.me()
  }

  /**
   * @returns the user that is currently logged in, based on the token stored in lcaolstorage.
   *          null if no user is currently logged in
   */
  async getLoggedUser() {
    // Get the token from local storage
    const storedToken = this.getToken()

    // Check is the token exists
    if (!storedToken) {
      return null
    }

    const { token } = storedToken

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

  logout() {
    this.removeToken()
  }

  private setToken(token: TokenResponse) {
    localStorage.setItem('auth-token', JSON.stringify(token))
  }

  private getToken() {
    try {
      const token = localStorage.getItem('auth-token')

      if (!token) {
        return null
      }

      return JSON.parse(token) as TokenResponse
    } catch {
      return null
    }
  }

  private removeToken() {
    localStorage.removeItem('auth-token')
  }

  private setAuthHeader(token: string) {
    this.http.instance.defaults.headers.common['x-auth-token'] = token
  }
}

export default AuthService
