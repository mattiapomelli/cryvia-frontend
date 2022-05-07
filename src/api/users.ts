import ApiService from './api-service'

export interface User {
  id: number
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
    return await this.http.getPaginated<User[]>(this.baseUrl)
  }

  async update(data: UserUpdateBody) {
    return await this.http.put<UserUpdateBody, User>(`${this.baseUrl}/me`, data)
  }
}

export default UserService
