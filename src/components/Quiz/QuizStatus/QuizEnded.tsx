import Link from 'next/link'
import { BigNumber } from 'ethers'
import { useAccount } from 'wagmi'

import { Quiz } from '@/api/quizzes'
import Button from '@/components/Button'
import { useQuizContractRead } from '@/hooks/useContractRead'
import { useQuizContractWrite } from '@/hooks/useContractWriteAndWait'
import useTokenBalance from '@/hooks/useTokenBalance'
import { formatAmount } from '@/utils/math'

interface QuizEndedProps {
  quiz: Quiz
}

const QuizEnded = ({ quiz }: QuizEndedProps) => {
  const { address } = useAccount()
  const { balance, refetch: refetchBalance } = useTokenBalance()

  const { data: winBalance, refetch: refetchWinBalance } =
    useQuizContractRead<BigNumber>({
      functionName: 'winBalance',
      args: [quiz.id, address],
    })

  const { write, status } = useQuizContractWrite({
    functionName: 'redeem',
    onSuccess() {
      refetchBalance()
      refetchWinBalance()
    },
  })

  const redeem = () => {
    write({ args: quiz.id })
  }

  return (
    <div className="flex flex-col gap-4 mb-10">
      <div className="bg-tertiary flex flex-col gap-2 p-4 rounded-default items-center">
        Quiz ended!
        <Link href={`/quizzes/${quiz.id}/play`}>
          <a>
            <Button>Take for free</Button>
          </a>
        </Link>
      </div>
      {winBalance?.gt(0) && (
        <div className="bg-[#fdf9f1] flex flex-col gap-2 p-4 rounded-default items-center">
          You won 🏆! You can redeem {formatAmount(winBalance)}{' '}
          {balance?.symbol}
          <Button onClick={redeem} loading={status === 'loading'}>
            Redeem
          </Button>
        </div>
      )}
    </div>
  )
}

export default QuizEnded
