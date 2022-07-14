import { Quiz } from '@api/quizzes'
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
      <h4 className="font-bold">Leadeboard</h4>
      {submissions?.map((submission) => (
        <div key={submission.id}>{submission.user.address}</div>
      ))}
    </div>
  )
}

export default Leaderboard