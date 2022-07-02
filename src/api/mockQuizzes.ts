import { Quiz } from './quizzes'
import { Answer, Question } from './types'

interface QuizWithQuestions extends Quiz {
  questions: {
    question: Question & {
      answers: Answer[]
    }
  }[]
}

const mockQuizzes: QuizWithQuestions[] = [
  {
    id: 5,
    title: 'DeFi',
    description: "An awesome quiz to test if you're a DeFi master",
    price: 100,
    startTime: '2022-07-12T12:40:09.568Z',
    createdAt: '2022-07-01T19:16:11.870Z',
    image: null,
    categories: [
      {
        id: 2,
        name: 'DeFi',
      },
    ],
    questions: [
      {
        question: {
          id: 10,
          text: 'What is Uniswap?',
          answers: [
            {
              id: 29,
              text: 'A centralized exchange',
              correct: false,
            },
            {
              id: 30,
              text: 'A lending protocol',
              correct: false,
            },
            {
              id: 31,
              text: 'An AMM',
              correct: true,
            },
            {
              id: 32,
              text: 'An order-book based exchange',
              correct: false,
            },
          ],
        },
      },
      {
        question: {
          id: 9,
          text: 'What is AAVE?',
          answers: [
            {
              id: 25,
              text: 'An AMM',
              correct: false,
            },
            {
              id: 26,
              text: 'A lending protocol',
              correct: true,
            },
            {
              id: 27,
              text: 'A DEX',
              correct: false,
            },
            {
              id: 28,
              text: 'A liquid staking protocol',
              correct: false,
            },
          ],
        },
      },
      {
        question: {
          id: 8,
          text: 'What is the biggest protocol by TVL?',
          answers: [
            {
              id: 21,
              text: 'AAVE',
              correct: true,
            },
            {
              id: 22,
              text: 'Maker DAO',
              correct: false,
            },
            {
              id: 23,
              text: 'Curve',
              correct: false,
            },
            {
              id: 24,
              text: 'uniswap',
              correct: false,
            },
          ],
        },
      },
    ],
  },
  {
    id: 4,
    title: 'Cryptocurrencies',
    description: "An awesome quiz to test if you're a crypto master",
    price: 100,
    startTime: '2022-07-10T12:40:09.568Z',
    createdAt: '2022-07-01T19:10:01.873Z',
    image: null,
    categories: [
      {
        id: 4,
        name: 'Crypto',
      },
    ],
    questions: [
      {
        question: {
          id: 7,
          text: 'What was the first popular cryptocurrency?',
          answers: [
            {
              id: 17,
              text: 'Ethereum (ETH)',
              correct: false,
            },
            {
              id: 18,
              text: 'Dogecoin (DOGE)',
              correct: false,
            },
            {
              id: 19,
              text: 'Bitcoin (BTC)',
              correct: true,
            },
            {
              id: 20,
              text: 'Litecoin (LTC)',
              correct: false,
            },
          ],
        },
      },
      {
        question: {
          id: 6,
          text: 'What is the biggest stablecoin by market cap?',
          answers: [
            {
              id: 13,
              text: 'USDC (USDC)',
              correct: false,
            },
            {
              id: 14,
              text: 'Binance USD (BUSD)',
              correct: false,
            },
            {
              id: 15,
              text: 'Tether (USDT)',
              correct: true,
            },
            {
              id: 16,
              text: 'Dai (DAI)',
              correct: false,
            },
          ],
        },
      },
      {
        question: {
          id: 5,
          text: 'What crypto was created by Coinbase and Circle?',
          answers: [
            {
              id: 9,
              text: 'Tether (USDT)',
              correct: false,
            },
            {
              id: 10,
              text: 'Cosmos (ATOM)',
              correct: false,
            },
            {
              id: 11,
              text: 'Cardano (ADA)',
              correct: false,
            },
            {
              id: 12,
              text: 'USDC (USDC)',
              correct: true,
            },
          ],
        },
      },
    ],
  },
]

export default mockQuizzes
