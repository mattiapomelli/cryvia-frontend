import { getQuizStatus, Quiz, QuizStatus } from '@/api/quizzes'
import Modal, { BaseModalProps } from '@/components/UI/Modal'
import { formatDateTime } from '@/utils/dates'

interface InfoModalProps extends BaseModalProps {
  quiz: Quiz
  winners: number
}

const InfoModal = ({ show, onClose, winners, quiz }: InfoModalProps) => {
  const status = getQuizStatus(quiz)

  return (
    <Modal show={show} onClose={onClose}>
      <h4 className="font-bold text-xl mb-4">How this works</h4>
      {status === QuizStatus.Subscription && (
        <>
          <div className="flex flex-col gap-2 mb-6">
            <p>
              You can subscribe to this quiz by paying{' '}
              <span className="font-bold">{quiz.price} MTK</span>.
            </p>
            <p>
              All the users who subscribed will be able to participate to the
              quiz in real time, which will start at{' '}
              <span className="font-bold">
                {formatDateTime(quiz.startTime)}
              </span>
              .
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <p>
              Each submission will get a score based on number of{' '}
              <span className="font-bold">correct answers</span> and{' '}
              <span className="font-bold">time taken</span>.
            </p>
            <p>
              If you rank among the best{' '}
              <span className="font-bold">{winners}</span>, you will share the{' '}
              <span className="font-bold">prize</span> with the other winners
              🏆!
            </p>
          </div>
        </>
      )}
      {status === QuizStatus.WaitingStart && (
        <p>
          Subscriptions are closed. Quiz will go live at{' '}
          <span className="font-bold">{formatDateTime(quiz.startTime)}</span>!
        </p>
      )}
      {status === QuizStatus.Playing && <p>This quiz is in live right now!</p>}
      {status === QuizStatus.Ended && (
        <p>
          This quiz has already gone live. You can now take it for free as many
          times as you want!
        </p>
      )}
    </Modal>
  )
}

export default InfoModal
