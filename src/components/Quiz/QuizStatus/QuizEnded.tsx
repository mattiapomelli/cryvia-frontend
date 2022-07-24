import { Quiz } from '@api/quizzes'
import Button from '@components/Button'
import { TOKEN_ADDRESS } from '@constants/addresses'
import { useQuizContract } from '@hooks/useContract'
import useTransaction from '@hooks/useTransaction'
import { formatAmount } from '@utils/math'
import { BigNumber } from 'ethers'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useAccount, useBalance, useNetwork } from 'wagmi'

interface QuizEndedProps {
  quiz: Quiz
}

const QuizEnded = ({ quiz }: QuizEndedProps) => {
  const { address } = useAccount()
  const { chain } = useNetwork()
  const { refetch } = useBalance({
    addressOrName: address,
    token: chain ? TOKEN_ADDRESS[chain.id] : undefined,
    enabled: chain !== undefined,
  })

  const quizContract = useQuizContract()

  const [winBalance, setWinBalance] = useState(BigNumber.from(0))
  const { handleTransaction, pending } = useTransaction()

  useEffect(() => {
    if (!quizContract || !address) return

    const getWinBalance = async () => {
      const winBalance = await quizContract.winBalance(quiz.id, address)
      setWinBalance(winBalance)
    }

    getWinBalance()
  }, [quizContract, address, quiz.id])

  const redeem = async () => {
    if (!quizContract) return

    const res = await handleTransaction(() => quizContract.redeem(quiz.id))

    if (res) {
      refetch()
      setWinBalance(BigNumber.from(0))
    }
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
      {winBalance.gt(0) && (
        <div className="bg-[#fdf9f1] flex flex-col gap-2 p-4 rounded-xl items-center">
          You won 🏆! You can redeem {formatAmount(winBalance)} USDC
          <Button onClick={redeem} loading={pending}>
            Redeem
          </Button>
        </div>
      )}
    </div>
  )
}

export default QuizEnded
