import Quiz from './Quiz'
import QuizEndedStage from './QuizEndedStage'
import { QuizPlayingStatus, useQuiz } from './QuizProvider'
import QuizStage from './QuizStage'

const QuizContainer = () => {
  const [{ status }] = useQuiz()

  if (status === QuizPlayingStatus.Waiting) {
    return <QuizStage />
  }

  if (status === QuizPlayingStatus.Started) {
    return <Quiz />
  }

  return <QuizEndedStage />
}

export default QuizContainer
