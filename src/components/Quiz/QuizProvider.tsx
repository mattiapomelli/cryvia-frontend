import {
  createContext,
  Dispatch,
  ReactNode,
  useContext,
  useReducer,
} from 'react'

import { Quiz, QuizQuestion } from '@api/quizzes'
import useQuizSocket from './useQuizSocket'

type QuizContextValue = [QuizState, Dispatch<QuizAction>]

const QuizContext = createContext<QuizContextValue | undefined>(undefined)

export enum QuizPlayingStatus {
  Waiting, // the quiz hasn't started yet
  Started, // the quiz has started
  Ended, // the player has finished the quiz but still have to wait for other players to finish
  ResultsAvailable, // all players have finished the quiz, so results are available
}

interface QuizState {
  quiz: Quiz
  status: QuizPlayingStatus
  currentQuestion: number
  questionDeadline: number
  answers: (number | null)[]
  playersCount: number
  leaderboard: number[]
  questions: QuizQuestion[]
  isLive: boolean
  time: number | null
}

type QuizAction =
  | { type: 'INIT' }
  | { type: 'NEXT_QUESTION'; answer?: number }
  | { type: 'SET_PLAYERS_COUNT'; count: number }
  | { type: 'SET_LEADERBOARD'; leadeboard: number[] }
  | { type: 'SET_QUESTIONS'; questions: QuizQuestion[] }
  | { type: 'SET_RESULTS_AVAILABLE' }

const quizReducer = (state: QuizState, action: QuizAction): QuizState => {
  switch (action.type) {
    case 'INIT':
      return {
        ...state,
        currentQuestion: 0,
        questionDeadline: Date.now() + 10000,
        status: QuizPlayingStatus.Started,
      }
    case 'NEXT_QUESTION': {
      const answer = action.answer || null
      const newAnswers = [...state.answers, answer]

      if (state.currentQuestion === state.questions.length - 1) {
        const time = Date.now() - new Date(state.quiz.startTime).getTime()
        return {
          ...state,
          status: QuizPlayingStatus.Ended,
          questionDeadline: Date.now(),
          answers: newAnswers,
          time,
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
    case 'SET_LEADERBOARD':
      return {
        ...state,
        leaderboard: action.leadeboard,
      }
    case 'SET_QUESTIONS':
      return {
        ...state,
        questions: action.questions,
      }
    case 'SET_RESULTS_AVAILABLE':
      return {
        ...state,
        status: QuizPlayingStatus.ResultsAvailable,
      }
    default:
      return state
  }
}

interface QuizSocketConnectionProps {
  children: ReactNode
}

const QuizSocketConnection = ({ children }: QuizSocketConnectionProps) => {
  useQuizSocket()

  return <>{children}</>
}

interface QuizProviderProps {
  children: ReactNode
  quiz: Quiz
  isLive: boolean
}

const QuizProvider = ({ quiz, isLive, children }: QuizProviderProps) => {
  const [quizState, dispatch] = useReducer(quizReducer, {
    quiz,
    status: QuizPlayingStatus.Waiting,
    currentQuestion: -1,
    questionDeadline: Date.now(),
    answers: [],
    playersCount: 0,
    leaderboard: [],
    questions: [],
    isLive,
    time: null,
  })

  return (
    <QuizContext.Provider value={[quizState, dispatch]}>
      {isLive ? (
        <QuizSocketConnection>{children}</QuizSocketConnection>
      ) : (
        <>{children}</>
      )}
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
