import ApiService from './apiService'
import { Submission } from './submissions'
import { Id } from './types'

export interface User {
  id: Id
  address: string
  username: string | null
  createdAt: string
}

type UserCreateBody = Pick<User, 'address'>

type UserUpdateBody = Pick<User, 'username'>

class UserService extends ApiService {
  async create(data: UserCreateBody) {
    return await this.http.post<UserCreateBody, User>(this.baseUrl, data)
  }

  async me() {
    return await this.http.get<User>(`${this.baseUrl}/me`)
  }

  async list() {
    return await this.http.get<User[]>(this.baseUrl)
  }

  async update(data: UserUpdateBody) {
    return await this.http.put<UserUpdateBody, User>(`${this.baseUrl}/me`, data)
  }

  async submissions(id: Id) {
    return await this.http.get<Omit<Submission, 'user'>[]>(
      `${this.baseUrl}/${id}/submissions`,
    )
  }

  async getByAddress(address: string) {
    return await this.http.get<User>(`${this.baseUrl}/address/${address}`)
  }
}

export default UserService
