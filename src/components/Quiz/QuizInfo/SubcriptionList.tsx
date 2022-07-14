import { Quiz } from '@api/quizzes'
import { useApiClient } from '@contexts/AuthProvider'
import { useQuery } from 'react-query'

interface SubscriptionListProps {
  quiz: Quiz
}

const SubscriptionList = ({ quiz }: SubscriptionListProps) => {
  const apiClient = useApiClient()
  const { data: subscriptions } = useQuery(
    `quiz-${quiz.id}-subscriptions`,
    () => apiClient.quizzes.subscriptions(quiz.id).then((data) => data.data),
  )

  return (
    <div>
      <h4 className="font-bold">
        Subscriptions - ({subscriptions?.length} people subscribed)
      </h4>
      {subscriptions?.map(({ user }) => (
        <div key={user.id}>{user.address}</div>
      ))}
    </div>
  )
}

export default SubscriptionList
