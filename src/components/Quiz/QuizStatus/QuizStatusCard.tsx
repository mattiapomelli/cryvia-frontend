import { ReactNode } from 'react'
import classNames from 'classnames'

interface QuizStatusCardProps {
  children: ReactNode
  className?: string
}

const QuizStatusCard = ({ children, className }: QuizStatusCardProps) => {
  return (
    <div
      className={classNames(
        'flex flex-col gap-2 py-6 px-4 rounded-default items-center w-full',
        'bg-tertiary',
        className,
      )}
    >
      {children}
    </div>
  )
}

export default QuizStatusCard
