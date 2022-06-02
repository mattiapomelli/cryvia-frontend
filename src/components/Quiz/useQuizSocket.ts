import { useUser } from '@contexts/AuthProvider'
import { useEffect, useRef } from 'react'
import { QuizPlayingStatus, useQuiz } from './QuizProvider'

const useQuizSocket = () => {
  const { user } = useUser()
  const [{ currentQuestion, status, answers }, dispatch] = useQuiz()
  const ws = useRef<WebSocket>()

  useEffect(() => {
    if (!user) return

    ws.current = new WebSocket(
      `${process.env.NEXT_PUBLIC_WS_URL}?userId=${user.id}`,
    )

    ws.current.onmessage = (message: MessageEvent) => {
      const messageData = JSON.parse(message.data.toString())
      console.log('From server: ', messageData)

      if (messageData.type === 'roomSize') {
        dispatch({ type: 'SET_PLAYERS_COUNT', count: messageData.payload })
      }

      if (messageData.type === 'leaderboard') {
        dispatch({ type: 'SET_LEADERBOARD', leadeboard: messageData.payload })
      }

      if (messageData.type === 'quizFinished') {
        dispatch({ type: 'SET_RESULTS_AVAILABLE' })
      }
    }
  }, [dispatch, user])

  useEffect(() => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      // Update server on current question room
      ws.current.send(
        JSON.stringify({
          type: 'questionRoom',
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
          type: 'submitQuiz',
          payload: {
            answers,
          },
        }),
      )
    }
  }, [status, answers])
}

export default useQuizSocket
