import { useUser } from '@contexts/AuthProvider'
import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'
import { QuizPlayingStatus, useQuiz } from './QuizProvider'

enum InputMessageType {
  QuizFinished = 'quizFinished',
  RoomSize = 'roomSize',
}

enum OutputMessageType {
  EnterQuestion = 'enterQuestion',
  SubmitQuiz = 'submitQuiz',
}

const useQuizSocket = () => {
  const { user } = useUser()
  const [{ currentQuestion, status, answers }, dispatch] = useQuiz()
  const ws = useRef<WebSocket>()

  const router = useRouter()

  useEffect(() => {
    // if (!user) return
    if (!router.query.id) return

    ws.current = new WebSocket(
      `${process.env.NEXT_PUBLIC_WS_URL}?userId=${router.query.id}`,
    )

    ws.current.onmessage = (message: MessageEvent) => {
      const messageData = JSON.parse(message.data.toString())
      console.log('From server: ', messageData)

      if (messageData.type === InputMessageType.RoomSize) {
        dispatch({ type: 'SET_PLAYERS_COUNT', count: messageData.payload })
      }

      if (messageData.type === InputMessageType.QuizFinished) {
        dispatch({ type: 'SET_RESULTS_AVAILABLE' })
      }
    }
  }, [
    dispatch,
    // user,
    router.query.id,
  ])

  useEffect(() => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      // Update server on current question room
      ws.current.send(
        JSON.stringify({
          type: OutputMessageType.EnterQuestion,
          payload: currentQuestion,
        }),
      )
    }
  }, [currentQuestion])

  useEffect(() => {
    if (
      status === QuizPlayingStatus.Ended &&
      ws.current?.readyState === WebSocket.OPEN
    ) {
      // Tell server the user has finished the quiz
      ws.current.send(
        JSON.stringify({
          type: OutputMessageType.SubmitQuiz,
          payload: {
            answers,
          },
        }),
      )
    }
  }, [status, answers])
}

export default useQuizSocket
