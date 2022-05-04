import {
  createContext,
  Dispatch,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from 'react'
import WebSocket from 'isomorphic-ws'
import { MessageEvent } from 'ws'

import { Quiz } from 'types'

type QuizContextValue = [QuizState, Dispatch<QuizAction>]

const QuizContext = createContext<QuizContextValue | undefined>(undefined)

export enum QuizStatus {
  Waiting,
  Started,
  Ended,
}

interface QuizState {
  quiz: Quiz
  status: QuizStatus
  currentQuestion: number
  questionDeadline: number
  answers: (number | null)[]
  playersCount: number
}

type QuizAction =
  | { type: 'INIT' }
  | { type: 'NEXT_QUESTION'; answer?: number }
  | { type: 'SET_PLAYERS_COUNT'; count: number }

const quizReducer = (state: QuizState, action: QuizAction): QuizState => {
  switch (action.type) {
    case 'INIT':
      return {
        ...state,
        currentQuestion: 0,
        questionDeadline: Date.now() + 10000,
        status: QuizStatus.Started,
      }
    case 'NEXT_QUESTION': {
      const answer = action.answer || null
      const newAnswers = [...state.answers, answer]

      if (state.currentQuestion === state.quiz.questions.length - 1) {
        return {
          ...state,
          status: QuizStatus.Ended,
          questionDeadline: Date.now(),
          answers: newAnswers,
        }
      }

      return {
        ...state,
        currentQuestion: state.currentQuestion + 1,
        questionDeadline: Date.now() + 10000,
        answers: newAnswers,
      }
    }
    case 'SET_PLAYERS_COUNT':
      return {
        ...state,
        playersCount: action.count,
      }
    default:
      return state
  }
}

interface QuizProviderProps {
  children: ReactNode
  quiz: Quiz
}

const QuizProvider = ({ quiz, children }: QuizProviderProps) => {
  const [quizState, dispatch] = useReducer(quizReducer, {
    quiz,
    status: QuizStatus.Waiting,
    currentQuestion: -1,
    questionDeadline: Date.now(),
    answers: [],
    playersCount: 0,
  })

  const ws = useRef<WebSocket>()

  useEffect(() => {
    ws.current = new WebSocket(
      `${process.env.NEXT_PUBLIC_WS_URL}?userId=${Math.random()}`,
    )

    ws.current.onopen = () => {
      console.log('connected')
    }

    ws.current.onmessage = (message: MessageEvent) => {
      dispatch({ type: 'SET_PLAYERS_COUNT', count: Number(message.data) })
    }
  }, [])

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
      quizState.status === QuizStatus.Ended &&
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

  return (
    <QuizContext.Provider value={[quizState, dispatch]}>
      {children}
    </QuizContext.Provider>
  )
}

export default QuizProvider

export const useQuiz = () => {
  const context = useContext(QuizContext)

  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider')
  }

  return context
}
