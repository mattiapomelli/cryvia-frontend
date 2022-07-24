import { useQuery } from 'react-query'
import Link from 'next/link'

import { Quiz } from '@/api/quizzes'
import Address from '@/components/Address'
import AddressAvatar from '@/components/AddressAvatar'
import { useApiClient, useUser } from '@/contexts/AuthProvider'

interface LeaderboardProps {
  quiz: Quiz
}

const Leaderboard = ({ quiz }: LeaderboardProps) => {
  const { user } = useUser()
  const apiClient = useApiClient()
  const { data: submissions } = useQuery(['quiz-submissions', quiz.id], () =>
    apiClient.quizzes.submissions(quiz.id).then((data) => data.data),
  )

  return (
    <div>
      <h4 className="font-bold text-lg mb-4">
        Leaderboard ({submissions?.length} submissions)
      </h4>
      <div className="flex flex-col gap-2">
        {submissions?.map((submission, index) => (
          <div
            key={submission.id}
            className="bg-gray-100 p-4 rounded-xl flex items-center gap-2"
          >
            <span className="font-bold text-center w-4 mr-2">{index + 1}</span>
            <AddressAvatar address={submission.user.address} size={26} />
            <Address
              address={submission.user.address}
              className="font-medium"
            />
            <div className="font-bold ml-auto flex">
              {submission.user.address === user?.address && (
                <Link href={`/submissions/${submission.id}`}>
                  <a className="flex justify-end underline text-primary ml-auto mr-2">
                    See your submission
                  </a>
                </Link>
              )}
              <span>{submission.score}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Leaderboard
