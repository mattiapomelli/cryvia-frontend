export interface Quiz {
  name: string
  startTime: string
  questions: {
    text: string
    answers: {
      text: string
    }[]
  }[]
}
