import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { QuizPlayingStatus, useQuiz } from './QuizProvider'

const FinalRoom = () => {
  const [{ quiz, status, playersCount }] = useQuiz()
  const router = useRouter()

  useEffect(() => {
    if (status === QuizPlayingStatus.ResultsAvailable) {
      router.push(`/quiz/${quiz.id}`)
    }
  }, [status, quiz.id, router])

  return (
    <>
      <div className="bg-tertiary flex flex-col gap-2 p-4 rounded-xl items-center mt-20">
        <p className="text-text-secondary">You have completed</p>
        <h1 className="text-3xl font-bold text-center">{quiz.title}</h1>
        <p className="text-3xl">🎉</p>
        <p className="mt-4">
          <span className="font-bold">{playersCount} </span>
          people have completed the quiz.
        </p>
        <p>Waiting for other users to finish...</p>
      </div>
    </>
  )
}

export default FinalRoom
