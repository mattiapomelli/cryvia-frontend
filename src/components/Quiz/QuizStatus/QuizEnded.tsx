import { BigNumber } from 'ethers'
import Link from 'next/link'
import { useAccount, useBalance, useNetwork } from 'wagmi'

import { Quiz } from '@api/quizzes'
import Button from '@components/Button'
import { TOKEN_ADDRESS } from '@constants/addresses'
import { useQuizContractRead } from '@hooks/useContractRead'
import { useQuizContractWrite } from '@hooks/useContractWriteAndWait'
import { formatAmount } from '@utils/math'

interface QuizEndedProps {
  quiz: Quiz
}

const QuizEnded = ({ quiz }: QuizEndedProps) => {
  const { address } = useAccount()
  const { chain } = useNetwork()
  const { refetch: refetchBalance, data } = useBalance({
    addressOrName: address,
    token: chain ? TOKEN_ADDRESS[chain.id] : undefined,
    enabled: chain !== undefined,
  })

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
      <div className="bg-tertiary flex flex-col gap-2 p-4 rounded-xl items-center">
        Quiz ended!
        <Link href={`/quiz/${quiz.id}/play`}>
          <a>
            <Button>Take for free</Button>
          </a>
        </Link>
      </div>
      {winBalance?.gt(0) && (
        <div className="bg-[#fdf9f1] flex flex-col gap-2 p-4 rounded-xl items-center">
          You won 🏆! You can redeem {formatAmount(winBalance)} {data?.symbol}
          <Button onClick={redeem} loading={status === 'loading'}>
            Redeem
          </Button>
        </div>
      )}
    </div>
  )
}

export default QuizEnded
