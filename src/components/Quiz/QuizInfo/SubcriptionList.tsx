import { Quiz } from '@api/quizzes'
import Address from '@components/Address'
import AddressAvatar from '@components/AddressAvatar'
import { useApiClient } from '@contexts/AuthProvider'
import { useQuery } from 'react-query'

interface SubscriptionListProps {
  quiz: Quiz
}

const SubscriptionList = ({ quiz }: SubscriptionListProps) => {
  const apiClient = useApiClient()
  const { data: subscriptions } = useQuery(
    ['quiz-subscriptions', quiz.id],
    () => apiClient.quizzes.subscriptions(quiz.id).then((data) => data.data),
  )

  return (
    <div>
      <h4 className="font-bold text-lg mb-4">
        Subscriptions ({subscriptions?.length})
      </h4>
      <div className="flex flex-col gap-2">
        {subscriptions?.map(({ user }) => (
          <div
            key={user.id}
            className="bg-gray-100 p-4 rounded-xl flex items-center gap-2"
          >
            <AddressAvatar address={user.address} size={26} />
            <Address address={user.address} className="font-medium" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default SubscriptionList
