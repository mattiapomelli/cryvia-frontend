import AuthService from './auth'
import { ForbiddenError, UnauthorizedError, ValidationError } from './errors'
import Http from './http'
import QuizService from './quizzes'
import SubmissionService from './submissions'
import { ApiErrorResponse } from './types'
import UserService from './users'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

interface Options {
  handleBadRequestError?: (error: ValidationError) => void
  handleUnauthorizedError?: (error: UnauthorizedError) => void
  handleForbiddenError?: (error: ForbiddenError) => void
}

class ApiClient {
  private options: Options
  http: Http

  auth: AuthService
  users: UserService
  quizzes: QuizService
  submissions: SubmissionService

  constructor(options: Options = {}) {
    this.options = options

    this.http = new Http({
      baseURL: API_BASE_URL,
      handleResponseError: this.handleResponseError.bind(this),
    })

    this.auth = new AuthService(this, '/auth')
    this.users = new UserService(this, '/users')
    this.quizzes = new QuizService(this, '/quizzes')
    this.submissions = new SubmissionService(this, '/submissions')
  }

  private handleResponseError(errorRes: ApiErrorResponse) {
    const { status, data } = errorRes
    let error

    switch (status) {
      case 400:
        error = new ValidationError(data.data)

        if (this.options.handleBadRequestError) {
          this.options.handleBadRequestError(error)
        }

        throw error
      case 401:
        error = new UnauthorizedError()

        if (this.options.handleUnauthorizedError) {
          this.options.handleUnauthorizedError(error)
        }

        throw error
      case 403:
        error = new ForbiddenError(data.message)

        if (this.options.handleForbiddenError) {
          this.options.handleForbiddenError(error)
        }

        throw error
      default:
        throw errorRes
    }
  }
}

export default ApiClient
