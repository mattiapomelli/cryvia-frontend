import Link from 'next/link'

import { Quiz } from '@/api/quizzes'

const truncate = (text: string, characters: number) => {
  return text.length > characters ? text.slice(0, characters - 1) + '...' : text
}

interface QuizCardProps {
  quiz: Quiz
}

const QuizCard = ({ quiz }: QuizCardProps) => {
  return (
    <Link key={quiz.id} href={`/quizzes/${quiz.id}`}>
      <a className="p-6 rounded-default bg-tertiary hover:bg-tertiary-hover relative">
        {!quiz.ended && (
          <span className="absolute bg-[#8183ff] text-white rounded-full py-1.5 px-3 text-xs -top-1.5 -right-1.5">
            Upcoming
          </span>
        )}

        <h4 className="text-xl font-bold mb-2">{quiz.title}</h4>
        <p className="text-text-secondary mb-4">
          {quiz.description && <>{truncate(quiz.description, 100)}</>}
        </p>
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
