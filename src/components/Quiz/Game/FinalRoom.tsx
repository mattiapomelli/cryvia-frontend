import Link from 'next/link'

import Button from '@/components/UI/Button'
import { QuizPlayingStatus, useQuiz } from './QuizProvider'

const FinalRoom = () => {
  const [{ quiz, playersCount, status }] = useQuiz()

  return (
    <>
      <div className="bg-tertiary flex flex-col gap-2 p-4 rounded-default items-center mt-20 max-w-md mx-auto">
        <p className="text-text-secondary">You have completed</p>
        <h1 className="text-3xl font-bold text-center">{quiz.title}</h1>
        <p className="text-3xl">🎉</p>
        <p className="mt-4">
          <span className="font-bold">{playersCount} </span>
          people have completed the quiz.
        </p>
        <div className="text-center flex flex-col gap-2 mt-2 mb-2">
          <p className="mb-4">Waiting for other users to finish...</p>
          {/* <p className="text-sm  bg-[#fff2ab] p-3 rounded-default">
            This may take a while, sometimes Mumbai Testnet transactions take
            several minutes to be confirmed... You can leave this page and come
            back in a while to discover if you won!
          </p> */}
        </div>
        {status === QuizPlayingStatus.ResultsAvailable && (
          <div className="text-center bg-secondary p-4 rounded-default">
            <p className="mb-2">
              Quiz is over! We&apos;re now setting winners and prizes, this may
              take a few minutes...
            </p>
            <p className="mb-2">
              You can leave and come back to the quiz page in a while to
              discover if you won!
            </p>
            <Link href={`/quizzes/${quiz.id}`}>
              <a>
                <Button>Go to quiz page</Button>
              </a>
            </Link>
          </div>
        )}
      </div>
    </>
  )
}

export default FinalRoom
