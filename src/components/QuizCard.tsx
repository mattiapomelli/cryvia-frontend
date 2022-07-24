import Link from 'next/link'

import { Quiz } from '@/api/quizzes'

interface QuizCardProps {
  quiz: Quiz
}

const QuizCard = ({ quiz }: QuizCardProps) => {
  return (
    <Link key={quiz.id} href={`/quiz/${quiz.id}`}>
      <a className="p-6 rounded-lg bg-tertiary">
        <h4 className="text-xl font-bold mb-2">{quiz.title}</h4>
        <p className="text-text-secondary mb-4">{quiz.description}</p>
        <div>
          {quiz.categories.map((category) => (
            <span
              className="bg-[#0B0E11] text-white rounded-full py-1.5 px-3 text-sm"
              key={category.id}
            >
              {category.name}{' '}
            </span>
          ))}
        </div>
      </a>
    </Link>
  )
}

export default QuizCard
