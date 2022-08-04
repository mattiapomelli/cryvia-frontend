import { useState } from 'react'
import Countdown from 'react-countdown'
import Link from 'next/link'

import { getQuizStatus, Quiz, QuizStatus } from '@/api/quizzes'
import QuizEnded from '@/components/Quiz/QuizStatus/QuizEnded'
import QuizSubscription from '@/components/Quiz/QuizStatus/QuizSubscription'
import Button from '@/components/UI/Button'
import useMounted from '@/hooks/useMounted'
import useSubscriptionStatus, {
  SubscriptionStatus,
} from '@/hooks/useSubscriptionStatus'
import QuizStatusCard from './QuizStatusCard'

interface QuizStatusSectionProps {
  quiz: Quiz
}

const QuizStatusSection = ({ quiz }: QuizStatusSectionProps) => {
  const [status, setStatus] = useState(getQuizStatus(quiz))
  const { status: subscriptionStatus } = useSubscriptionStatus(quiz)
  const mounted = useMounted()

  const onSubscriptionCountdownComplete = () => {
    setStatus(QuizStatus.WaitingStart)
  }

  const onCountdownComplete = () => {
    setStatus(QuizStatus.Playing)
  }

  if (status === QuizStatus.Subscription) {
    return (
      <QuizSubscription
        quiz={quiz}
        onCountdownComplete={onSubscriptionCountdownComplete}
      />
    )
  }

  if (status === QuizStatus.WaitingStart) {
    return (
      <QuizStatusCard>
        Quiz starts in:
        <div className="h-[1.875rem]">
          {mounted && (
            <Countdown
              date={quiz.startTime}
              onComplete={onCountdownComplete}
              className="font-bold text-2xl"
            />
          )}
        </div>
        {subscriptionStatus === SubscriptionStatus.Subscribed && (
          <Link href="/quizzes/live">
            <a className="mt-2">
              <Button>Go to waiting room</Button>
            </a>
          </Link>
        )}
      </QuizStatusCard>
    )
  }

  if (status === QuizStatus.Playing) {
    return (
      <QuizStatusCard>
        <p className="font-bold text-primary text-xl my-2">
          In live right now...
        </p>
      </QuizStatusCard>
    )
  }

  if (status === QuizStatus.Ended) {
    return <QuizEnded quiz={quiz} />
  }

  return null
}

export default QuizStatusSection
