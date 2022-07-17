export interface ApiResponse<T> {
  data: T
}

export interface PaginatedApiResponse<T> extends ApiResponse<T> {
  pagination: {
    total: number
    perPage: number
    page: number
  }
}

export interface ApiErrorResponse {
  status: number
  data: {
    code: number
    data: Record<string, string>
    message: string
  }
}

export type QueryParams = Record<string, string | number | boolean | undefined>

export type Id = number

// Models
export interface Question {
  id: Id
  text: string
}

export interface Answer {
  id: Id
  text: string
  correct: boolean
}

export interface Category {
  id: Id
  name: string
}

export interface GivenAnswer {
  id: number | null
  time: number
}
