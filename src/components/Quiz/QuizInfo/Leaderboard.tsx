import { Quiz } from '@api/quizzes'
import Address from '@components/Address'
import AddressAvatar from '@components/AddressAvatar'
import { useApiClient } from '@contexts/AuthProvider'
import { useQuery } from 'react-query'

interface LeaderboardProps {
  quiz: Quiz
}

const Leaderboard = ({ quiz }: LeaderboardProps) => {
  const apiClient = useApiClient()
  const { data: submissions } = useQuery(`quiz-${quiz.id}-submissions`, () =>
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
            <span className="font-bold ml-auto">{submission.score}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Leaderboard
