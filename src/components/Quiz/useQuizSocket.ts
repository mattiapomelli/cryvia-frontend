import { useEffect, useRef } from 'react'
import { QuizPlayingStatus, useQuiz } from './QuizProvider'

const useQuizSocket = () => {
  const [quizState, dispatch] = useQuiz()
  const ws = useRef<WebSocket>()

  useEffect(() => {
    ws.current = new WebSocket(
      `${process.env.NEXT_PUBLIC_WS_URL}?userId=${Math.random()}`,
    )

    ws.current.onmessage = (message: MessageEvent) => {
      const messageData = JSON.parse(message.data.toString())
      console.log('From server: ', messageData)

      if (messageData.type === 'roomSize') {
        dispatch({ type: 'SET_PLAYERS_COUNT', count: messageData.value })
      }

      if (messageData.type === 'leaderboard') {
        dispatch({ type: 'SET_LEADERBOARD', leadeboard: messageData.value })
      }
    }
  }, [dispatch])

  useEffect(() => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      // Update server on current question room
      ws.current.send(
        JSON.stringify({
          type: 'questionRoom',
          value: quizState.currentQuestion,
        }),
      )
    }
  }, [quizState.currentQuestion])

  useEffect(() => {
    if (
      quizState.status === QuizPlayingStatus.Ended &&
      ws.current?.readyState === WebSocket.OPEN
    ) {
      // Tell server the user has finished the quiz
      ws.current.send(
        JSON.stringify({
          type: 'finishedQuiz',
        }),
      )
    }
  }, [quizState.status])
}

export default useQuizSocket
