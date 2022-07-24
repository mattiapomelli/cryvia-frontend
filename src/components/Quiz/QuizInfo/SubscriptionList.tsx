import { useQuery } from 'react-query'
import Link from 'next/link'

import { Quiz } from '@/api/quizzes'
import Address from '@/components/Address'
import AddressAvatar from '@/components/AddressAvatar'
import { useApiClient } from '@/contexts/AuthProvider'

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
          <Link key={user.id} href={`/${user.address}`}>
            <a className="bg-gray-100 hover:bg-gray-200 p-4 rounded-default flex items-center gap-2">
              <AddressAvatar address={user.address} size={26} />
              <Address address={user.address} className="font-medium" />
            </a>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default SubscriptionList
