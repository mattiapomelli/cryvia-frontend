import ApiService from './api-service'
import { Submission } from './submissions'
import { Category, Id, QuestionWithAnswers } from './types'
import { User } from './users'

export interface Quiz {
  id: Id
  title: string
  description: string | null
  price: number
  startTime: string
  createdAt: string
  image: string | null
  ended: boolean
  categories: Category[]
}

export interface Subscription {
  user: Pick<User, 'id' | 'address' | 'username'>
}

export enum QuizStatus {
  Subscription,
  WaitingStart,
  Playing,
  Ended,
}

export const getQuizStatus = (quiz: Quiz) => {
  if (quiz.ended) {
    return QuizStatus.Ended
  }

  const start = new Date(quiz.startTime).getTime()
  const now = Date.now()

  if (start <= now) {
    return QuizStatus.Playing
  }

  if (start - 1000 * 60 * 10 > now) {
    return QuizStatus.Subscription
  }

  return QuizStatus.WaitingStart
}

class QuizService extends ApiService {
  async read(id: Id) {
    return await this.http.get<Quiz>(`${this.baseUrl}/${id}`)
  }

  async list() {
    return await this.http.get<Quiz[]>(this.baseUrl)
  }

  async next() {
    return await this.http.get<Quiz>(`${this.baseUrl}/next`)
  }

  async subscribe(id: Id) {
    return await this.http.post<Quiz[]>(`${this.baseUrl}/${id}/subscribe`)
  }

  async subscriptions(id: Id) {
    return await this.http.get<Subscription[]>(
      `${this.baseUrl}/${id}/subscriptions`,
    )
  }

  async submissions(id: Id) {
    return await this.http.get<Omit<Submission, 'quiz'>[]>(
      `${this.baseUrl}/${id}/submissions`,
    )
  }

  async questions(id: Id) {
    return await this.http.get<QuestionWithAnswers[]>(
      `${this.baseUrl}/${id}/questions`,
    )
  }
}

export default QuizService
