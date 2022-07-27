import ApiService from './apiService'
import { Quiz } from './quizzes'
import { Id, QuestionWithAnswers } from './types'
import { User } from './users'

interface SubmissionAnswer {
  question: QuestionWithAnswers
  answerId: Id | null
  time: number
}

export interface Submission {
  id: Id
  quiz: Pick<Quiz, 'id' | 'title'>
  user: Pick<User, 'id' | 'address' | 'username'>
  submittedAt: string
  score: number
}

export interface SubmissionWithAnswers extends Submission {
  answers: SubmissionAnswer[]
}

interface CreateSubmissionBody {
  userId: number
  quizId: number
  answers: Id[]
  time: number
}

export const countCorrectAnswers = (
  questions: QuestionWithAnswers[],
  answers: (Id | null)[],
) => {
  let count = 0

  for (let i = 0; i < questions.length; i++) {
    const answerId = answers[i]

    // If no answer was given, continue
    if (!answerId) continue

    const correctAnswer = questions[i].answers.find((a) => a.correct)

    // Check if answer is correct
    if (answerId === correctAnswer?.id) {
      count += 1
    }
  }

  return count
}

class SubmissionService extends ApiService {
  async read(id: Id) {
    return await this.http.get<SubmissionWithAnswers>(`${this.baseUrl}/${id}`)
  }

  async create(data: CreateSubmissionBody) {
    return await this.http.post<CreateSubmissionBody>(this.baseUrl, data)
  }
}

export default SubmissionService
