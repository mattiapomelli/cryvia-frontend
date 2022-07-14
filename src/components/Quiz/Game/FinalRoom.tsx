import Button from '@components/Button'
import Link from 'next/link'
import { QuizPlayingStatus, useQuiz } from './QuizProvider'

const FinalRoom = () => {
  const [{ quiz, status, playersCount }] = useQuiz()

  return (
    <div className="flex flex-col items-center mt-4">
      <h2 className="text-2xl font-bold">Quiz Ended</h2>
      {/* TODO: automatically redirect to quiz page instead of show button? */}
      {status === QuizPlayingStatus.ResultsAvailable ? (
        <Link href={`/quiz/${quiz.id}`}>
          <a>
            <Button>See results</Button>
          </a>
        </Link>
      ) : (
        <div>
          {playersCount} people finished the quiz. Waiting for other users to
          finish...
        </div>
      )}
    </div>
  )
}

export default FinalRoom
