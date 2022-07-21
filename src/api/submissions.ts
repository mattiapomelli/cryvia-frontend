import ApiService from './api-service'
import { Quiz } from './quizzes'
import { GivenAnswer, Id, QuestionWithAnswers } from './types'
import { User } from './users'

export interface QuizSubmission {
  id: Id
  quiz: Pick<Quiz, 'id' | 'title'>
  user: Pick<User, 'id' | 'address' | 'username'>
  submittedAt: string
  score: number
  answers: {
    question: QuestionWithAnswers
    answerId: Id | null
    time: number
  }[]
}

interface CreateSubmissionBody {
  userId: number
  quizId: number
  answers: Id[]
  time: number
}

export const countCorrectAnswers = (
  questions: QuestionWithAnswers[],
  answers: GivenAnswer['id'][],
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
    return await this.http.get<QuizSubmission>(`${this.baseUrl}/${id}`)
  }

  async create(data: CreateSubmissionBody) {
    return await this.http.post<CreateSubmissionBody>(this.baseUrl, data)
  }
}

export default SubmissionService
