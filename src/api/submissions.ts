import { Quiz } from 'types'
import ApiService from './api-service'
import { Answer, Id, Question } from './types'
import { User } from './users'

export interface QuizSubmission {
  id: Id
  quiz: Quiz
  user: User
  submittedAt: string
  answers: {
    question: Question
    answer: Answer
  }[]
}

interface CreateSubmissionBody {
  userId: number
  quizId: number
  answers: Id[]
  time: number
}

class SubmissionService extends ApiService {
  async read(id: Id) {
    return await this.http.get<QuizSubmission>(`${this.baseUrl}/${id}`)
  }

  async create(data: CreateSubmissionBody) {
    return await this.http.post<CreateSubmissionBody>(this.baseUrl, data)
  }
}

export default SubmissionService
