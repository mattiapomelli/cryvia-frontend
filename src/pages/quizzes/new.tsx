import React, { FormEvent, useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { useAccount } from 'wagmi'

import Container from '@/components/Layout/Container'
import Button from '@/components/UI/Button'
import { useQuizContractWrite } from '@/hooks/useContractWriteAndWait'
import { getDefaultLayout } from '@/layouts/DefaultLayout'
import { PageWithLayout } from '@/types'

const OWNER_ADDRESS = '0x8F255911988e25d126608b18cf1B8047D0E8878D'

const NewQuizPage: PageWithLayout = () => {
  const { address } = useAccount()

  const [quizId, setQuizId] = useState('')
  const [price, setPrice] = useState('')

  const [isOwner, setIsOwner] = useState(false)

  useEffect(() => {
    setIsOwner(address === OWNER_ADDRESS)
  }, [address])

  const { write, status, error } = useQuizContractWrite({
    functionName: 'createQuiz',
  })

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    write({ args: [Number(quizId), ethers.utils.parseEther(price)] })
  }

  return (
    <Container className="mt-10 flex justify-center">
      <div className="flex flex-col gap-4 items-center max-w-sm text-center">
        {!isOwner && (
          <div className="bg-red-200 text-red-600 p-4 rounded-default">
            You are not the owner!
          </div>
        )}
        <h3 className="text-2xl font-bold">Create Quiz</h3>
        <form onSubmit={onSubmit} className="flex flex-col gap-2 text-left">
          <div>
            <p className="font-bold">Id: </p>
            <input
              type="number"
              className="bg-gray-200 px-4 py-2 rounded-default border-none min-w-[300px] mb-4"
              value={quizId}
              onChange={(e) => setQuizId(e.target.value)}
            />
          </div>
          <div>
            <p className="font-bold">Price: </p>
            <input
              type="number"
              className="bg-gray-200 px-4 py-2 rounded-default border-none min-w-[300px] mb-4"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <Button
            type="submit"
            loading={status === 'loading'}
            disabled={!isOwner}
          >
            Create
          </Button>
        </form>
        {status === 'success' && (
          <div>
            <p className="font-bold text-green-500">
              Successfully created quiz! ✔️
            </p>
          </div>
        )}
        {status === 'error' && (
          <p className="text-red-500">Error: {error?.message}</p>
        )}
      </div>
    </Container>
  )
}

NewQuizPage.getLayout = getDefaultLayout

export default NewQuizPage
