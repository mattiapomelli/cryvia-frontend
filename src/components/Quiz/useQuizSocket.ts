import { useEffect, useRef } from 'react'
import { QuizPlayingStatus, useQuiz } from './QuizProvider'

const useQuizSocket = () => {
  const [{ currentQuestion, status, answers, time }, dispatch] = useQuiz()
  const ws = useRef<WebSocket>()

  useEffect(() => {
    ws.current = new WebSocket(
      `${process.env.NEXT_PUBLIC_WS_URL}?userId=${Math.random()}`,
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
  }, [dispatch])

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
          type: 'finishedQuiz',
          payload: {
            answers,
            time,
          },
        }),
      )
    }
  }, [status, answers, time])
}

export default useQuizSocket
