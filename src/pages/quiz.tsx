import type { NextPage } from 'next'

import QuizProvider from '@components/Quiz/QuizProvider'
import QuizContainer from '@components/Quiz/QuizContainer'
import { Quiz } from 'types'

const quiz: Quiz = {
  name: 'My Quiz Name',
  startTime: new Date(Date.now() + 3000).toISOString(),
  questions: [
    {
      text: 'Question 1',
      answers: [
        {
          text: 'Answer 1',
        },
        {
          text: 'Answer 2',
        },
        {
          text: 'Answer 3',
        },
        {
          text: 'Answer 4',
        },
      ],
    },
    {
      text: 'Question 2',
      answers: [
        {
          text: 'Answer 2.1',
        },
        {
          text: 'Answer 2.2',
        },
        {
          text: 'Answer 2.3',
        },
        {
          text: 'Answer 2.4',
        },
      ],
    },
    {
      text: 'Question 3',
      answers: [
        {
          text: 'Answer 3.1',
        },
        {
          text: 'Answer 3.2',
        },
        {
          text: 'Answer 3.3',
        },
        {
          text: 'Answer 3.4',
        },
      ],
    },
  ],
}

const QuizPage: NextPage = () => {
  return (
    <QuizProvider quiz={quiz}>
      <div className="flex justify-center mt-20">
        <QuizContainer />
      </div>
    </QuizProvider>
  )
}

export default QuizPage
