import ApiService from './api-service'
import { QuizSubmission } from './submissions'
import { Answer, Category, Id, Question } from './types'

export interface Quiz {
  id: Id
  title: string
  description: string | null
  price: number
  startTime: string
  createdAt: string
  image: string | null
  categories: Category[]
}

export interface QuizQuestion {
  question: Question & {
    answers: Omit<Answer, 'correct'>[]
  }
}

export enum QuizStatus {
  Subscription,
  WaitingStart,
  Ended,
}

export const getQuizStatus = (startTime: string) => {
  const start = new Date(startTime).getTime()
  const now = Date.now()

  if (start <= now) {
    return QuizStatus.Ended
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

  async suscribe(id: Id) {
    return await this.http.post<Quiz[]>(`${this.baseUrl}/${id}/suscribe`)
  }

  async submissions(id: Id) {
    return await this.http.get<Pick<QuizSubmission, 'user' | 'submittedAt'>[]>(
      `${this.baseUrl}/${id}/submissions`,
    )
  }

  async questions(id: Id) {
    return await this.http.get<QuizQuestion[]>(
      `${this.baseUrl}/${id}/questions`,
    )
  }
}

export default QuizService
