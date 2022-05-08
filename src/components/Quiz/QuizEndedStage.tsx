import Button from '@components/Button'
import Link from 'next/link'
import { QuizPlayingStatus, useQuiz } from './QuizProvider'

const QuizEndedStage = () => {
  const [{ quiz, status, leaderboard }] = useQuiz()

  return (
    <div className="flex flex-col items-center mt-4">
      <h2 className="text-2xl font-bold">Quiz Ended</h2>
      <div className="flex flex-col gap-4">
        {leaderboard.map((user) => (
          <div key={user}>User: {user}</div>
        ))}
      </div>
      {status === QuizPlayingStatus.ResultsAvailable ? (
        <Link href={`/quiz/${quiz.id}`}>
          <a>
            <Button>See results</Button>
          </a>
        </Link>
      ) : (
        <div>Waiting for other users to finish...</div>
      )}
    </div>
  )
}

export default QuizEndedStage
