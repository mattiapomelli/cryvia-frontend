import ApiService from './api-service'
import { QuizSubmission } from './submissions'
import { Id } from './types'

export interface User {
  id: Id
  address: string
  username: string | null
  createdAt: string
}

type UserCreateBody = Pick<User, 'address'>

type UserUpdateBody = Pick<User, 'username'>

type UserSubmission = Pick<QuizSubmission, 'id' | 'quiz' | 'submittedAt'>

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
    return await this.http.get<UserSubmission[]>(
      `${this.baseUrl}/${id}/submissions`,
    )
  }
  async userByAddress(address: string) {
    return await this.http.get<User>(`${this.baseUrl}/users/address/${address}`)
  }
}

export default UserService
