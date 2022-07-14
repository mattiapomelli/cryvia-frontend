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

const SECONDS_PER_QUESTION = 20

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
  answers: {
    id: number | null
    time: number
  }[]
  playersCount: number
  questions: QuizQuestion[]
  isLive: boolean
  previousTime: number
}

type QuizAction =
  | { type: 'INIT' }
  | { type: 'NEXT_QUESTION'; answer?: number }
  | { type: 'SET_PLAYERS_COUNT'; count: number }
  | { type: 'SET_QUESTIONS'; questions: QuizQuestion[] }
  | { type: 'SET_RESULTS_AVAILABLE' }

const quizReducer = (state: QuizState, action: QuizAction): QuizState => {
  switch (action.type) {
    case 'INIT':
      return {
        ...state,
        currentQuestion: 0,
        questionDeadline: Date.now() + SECONDS_PER_QUESTION * 1000,
        status: QuizPlayingStatus.Started,
        previousTime: Date.now(),
      }
    case 'NEXT_QUESTION': {
      const answer = {
        id: action.answer || null,
        time: Date.now() - state.previousTime,
      }
      const newAnswers = [...state.answers, answer]

      // Quiz has finished
      if (state.currentQuestion === state.questions.length - 1) {
        return {
          ...state,
          status: QuizPlayingStatus.Ended,
          questionDeadline: 0,
          answers: newAnswers,
          previousTime: 0,
        }
      }

      return {
        ...state,
        currentQuestion: state.currentQuestion + 1,
        questionDeadline: Date.now() + SECONDS_PER_QUESTION * 1000,
        answers: newAnswers,
        previousTime: Date.now(),
      }
    }
    case 'SET_PLAYERS_COUNT':
      return {
        ...state,
        playersCount: action.count,
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
    questionDeadline: 0,
    answers: [],
    playersCount: 0,
    questions: [],
    isLive,
    previousTime: 0,
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