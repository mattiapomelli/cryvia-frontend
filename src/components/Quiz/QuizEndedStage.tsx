import Button from '@components/Button'
import Link from 'next/link'
import { useQuiz } from './QuizProvider'

const QuizEndedStage = () => {
  const [{ quiz, leaderboard }] = useQuiz()

  return (
    <div className="flex flex-col items-center mt-4">
      <h2 className="text-2xl font-bold">Quiz Ended</h2>
      <div className="flex flex-col gap-4">
        {leaderboard.map((user) => (
          <div key={user}>User: {user}</div>
        ))}
      </div>
      <Link href={`/quiz/${quiz.id}`}>
        <a>
          <Button>See results</Button>
        </a>
      </Link>
    </div>
  )
}

export default QuizEndedStage
