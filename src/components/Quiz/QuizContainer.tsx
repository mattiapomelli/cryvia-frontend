import Quiz from './Quiz'
import QuizEndedStage from './QuizEndedStage'
import { QuizStatus, useQuiz } from './QuizProvider'
import QuizStage from './QuizStage'

const QuizContainer = () => {
  const [{ status }] = useQuiz()

  if (status === QuizStatus.Waiting) {
    return <QuizStage />
  }

  if (status === QuizStatus.Started) {
    return <Quiz />
  }

  return <QuizEndedStage />
}

export default QuizContainer
