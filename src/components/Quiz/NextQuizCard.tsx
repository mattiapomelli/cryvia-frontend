import { useState } from 'react'
import Countdown, { CountdownRenderProps } from 'react-countdown'
import Image from 'next/image'
import Link from 'next/link'
import classNames from 'classnames'

import { getQuizStatus, Quiz, QuizStatus } from '@/api/quizzes'
import Button from '@/components/UI/Button'
import useMounted from '@/hooks/useMounted'

interface NextQuizCardProps {
  quiz: Quiz
}

const NextQuizCard = ({ quiz }: NextQuizCardProps) => {
  const mounted = useMounted()
  const [status, setStatus] = useState(getQuizStatus(quiz))

  const isWaiting =
    status === QuizStatus.WaitingStart || status === QuizStatus.Subscription

  const onCountdownComplete = () => {
    setStatus(QuizStatus.Playing)
  }

  const renderer = ({
    days,
    hours,
    minutes,
    seconds,
  }: CountdownRenderProps) => {
    return (
      <span className="text-3xl sm:text-4xl font-bold text-[#441491]">
        {days}:{hours}:{minutes}:{seconds}
      </span>
    )
  }

  return (
    <div className="z-10 relative px-6 py-10 rounded-default bg-gradient-to-tr from-[#E2D3FB] via-[#d8cced] to-[#e6def4]">
      <Image
        src="/images/stars.png"
        alt="stars"
        layout="fill"
        className="absolute z-0"
        objectFit="contain"
        priority
      />
      <div className="relative z-10 flex flex-col items-center text-center">
        <p className="text-text-secondary text-lg uppercase mb-2">
          {isWaiting ? 'Next Quiz' : 'Last Quiz'}
        </p>
        <h2 className="text-3xl sm:text-5xl font-bold mb-6 max-w-[600px]">
          {quiz.title}
        </h2>
        {isWaiting && (
          <>
            <p className="text-text-secondary text-lg mb-2">Starts in:</p>
            <div className="h-10">
              {mounted && (
                <Countdown
                  date={quiz.startTime}
                  renderer={renderer}
                  onComplete={onCountdownComplete}
                />
              )}
            </div>
          </>
        )}
        {status === QuizStatus.Playing && (
          <p className="text-primary text-2xl font-bold">
            In live right now...
          </p>
        )}
        <Link href={`/quizzes/${quiz.id}`} passHref>
          <Button className={classNames('min-w-[120px] mt-6')} as="a">
            {isWaiting && 'Join'}
            {status === QuizStatus.Playing && 'See details'}
            {status === QuizStatus.Ended && 'Take for free'}
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default NextQuizCard
