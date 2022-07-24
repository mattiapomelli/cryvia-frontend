import { useEffect, useRef } from 'react'

import { useUser } from '@/contexts/AuthProvider'
import { getToken } from '@/utils/tokens'
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

  useEffect(() => {
    if (!user) return

    if (!process.env.NEXT_PUBLIC_WS_URL) {
      console.error('NEXT_PUBLIC_WS_URL must be specified')
      return
    }

    ws.current = new WebSocket(
      process.env.NEXT_PUBLIC_WS_URL,
      getToken(user.address),
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

    return () => {
      ws.current?.close()
    }
  }, [dispatch, user])

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
