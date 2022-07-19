import ApiService from './api-service'
import { Quiz } from './quizzes'
import { Answer, Id, Question } from './types'
import { User } from './users'

export interface QuizSubmission {
  id: Id
  quiz: Quiz & {
    questions: {
      question: Question & {
        answers: Answer[]
      }
    }[]
  }
  user: User
  submittedAt: string
  score: number
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
