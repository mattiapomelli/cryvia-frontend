import { Quiz } from '@api/quizzes'
import Button from '@components/Button'
import { useWeb3Context } from '@contexts/Web3Provider'
import { useQuizContract } from '@hooks/useContract'
import useTransaction from '@hooks/useTransaction'
import { formatAmount } from '@utils/math'
import { BigNumber } from 'ethers'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface QuizEndedProps {
  quiz: Quiz
}

const QuizEnded = ({ quiz }: QuizEndedProps) => {
  const { account, updateBalance } = useWeb3Context()
  const quizContract = useQuizContract()

  const [winBalance, setWinBalance] = useState(BigNumber.from(0))
  const { handleTransaction, pending } = useTransaction()

  useEffect(() => {
    if (!quizContract || !account) return

    const getWinBalance = async () => {
      const winBalance = await quizContract.winBalance(quiz.id, account)
      setWinBalance(winBalance)
    }

    getWinBalance()
  }, [quizContract, account, quiz.id])

  const redeem = async () => {
    if (!quizContract) return

    const res = await handleTransaction(() => quizContract.redeem(quiz.id))

    if (res) {
      updateBalance()
      setWinBalance(BigNumber.from(0))
    }
  }

  return (
    <div>
      {winBalance.gt(0) && (
        <div>
          You won! You can redeem: {formatAmount(winBalance)}
          <Button onClick={redeem} loading={pending}>
            Redeem
          </Button>
        </div>
      )}
      <Link href={`/quiz/${quiz.id}/play`}>
        <a>
          <Button>Take for free</Button>
        </a>
      </Link>
    </div>
  )
}

export default QuizEnded
