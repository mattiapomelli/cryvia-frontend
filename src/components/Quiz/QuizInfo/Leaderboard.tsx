import { useQuery } from 'react-query'
import Link from 'next/link'
import classNames from 'classnames'

import { Quiz } from '@/api/quizzes'
import { Submission } from '@/api/submissions'
import Address from '@/components/Address'
import AddressAvatar from '@/components/AddressAvatar'
import { useApiClient, useUser } from '@/contexts/AuthProvider'

interface LeadeboardCardProps {
  submission: Omit<Submission, 'quiz'>
  position: number
}

const LeaderboardCard = ({ submission, position }: LeadeboardCardProps) => {
  const { user } = useUser()

  return (
    <Link href={`/${submission.user.address}`} key={submission.id}>
      <a
        className={classNames(
          'p-4 rounded-default flex items-center gap-2',
          submission.user.address === user?.address
            ? 'bg-secondary hover:bg-secondary-hover'
            : 'bg-gray-100 hover:bg-gray-200',
        )}
      >
        <span
          className={classNames(
            'font-bold w-6 h-6 inline-flex items-center justify-center mr-2 rounded-full',
            {
              'text-[#eac533] bg-white': position === 1,
            },
            {
              'text-[#ababab] bg-white': position === 2,
            },
            {
              'text-[#CD7F32] bg-white': position === 3,
            },
          )}
        >
          {position}
        </span>
        <AddressAvatar address={submission.user.address} size={26} />
        <Address address={submission.user.address} className="font-medium" />
        <span className="font-bold ml-auto">{submission.score}</span>
      </a>
    </Link>
  )
}

interface LeaderboardProps {
  quiz: Quiz
}

const Leaderboard = ({ quiz }: LeaderboardProps) => {
  const apiClient = useApiClient()
  const { data: submissions } = useQuery(['quiz-submissions', quiz.id], () =>
    apiClient.quizzes.submissions(quiz.id).then((data) => data.data),
  )

  return (
    <div>
      <h4 className="font-bold text-lg mb-4">
        Leaderboard ({submissions?.length} submissions)
      </h4>
      <div className="grid grid-cols-autofill gap-4">
        {submissions?.map((submission, index) => (
          <LeaderboardCard
            key={submission.id}
            submission={submission}
            position={index + 1}
          />
        ))}
      </div>
    </div>
  )
}

export default Leaderboard
