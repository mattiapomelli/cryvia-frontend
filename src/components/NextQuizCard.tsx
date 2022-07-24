import Countdown, { CountdownRenderProps } from 'react-countdown'
import Image from 'next/image'
import Link from 'next/link'

import { Quiz } from '@/api/quizzes'
import Button from './Button'

interface NextQuizCardProps {
  quiz: Quiz
}

const NextQuizCard = ({ quiz }: NextQuizCardProps) => {
  const renderer = ({
    days,
    hours,
    minutes,
    seconds,
  }: CountdownRenderProps) => {
    return (
      <span className="text-4xl font-bold mb-6 text-[#441491]">
        {days}:{hours}:{minutes}:{seconds}
      </span>
    )
  }

  return (
    <div className="z-10 relative px-6 py-10 rounded-lg  mb-10 bg-gradient-to-tr from-[#E2D3FB] via-[#d8cced] to-[#e6def4]">
      <Image
        src="/stars.png"
        alt="stars"
        layout="fill"
        className="absolute z-0"
        objectFit="contain"
      />
      <div className="relative z-10 flex flex-col items-center text-center">
        <p className="text-text-secondary text-lg uppercase mb-2">Next Quiz</p>
        <h2 className="text-5xl font-bold mb-6 max-w-[600px]">{quiz.title}</h2>
        <p className="text-text-secondary text-lg mb-2">Starts in:</p>
        <Countdown date={quiz.startTime} renderer={renderer} />
        <Link href={`/quizzes/${quiz.id}`} passHref>
          <Button className="min-w-[120px]" as="a">
            Join
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default NextQuizCard
