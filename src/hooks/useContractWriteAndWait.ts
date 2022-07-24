import { useContractWrite, useWaitForTransaction } from 'wagmi'
import { providers } from 'ethers'

import MyTokenAbi from '@abis/contracts/MyToken.json'
import QuizContractAbi from '@abis/contracts/Quiz.json'
import { QUIZ_CONTRACT_ADDRESS, TOKEN_ADDRESS } from '@constants/addresses'
import { CHAIN } from '@constants/chains'
import { ContractInterface } from 'ethers'

type Status = 'error' | 'success' | 'idle' | 'loading'

// TODO: add 'waitingConfirmation' status?
const getStatus = (writeStatus: Status, confirmationStatus: Status): Status => {
  if (writeStatus === 'idle') {
    return 'idle'
  }

  if (writeStatus === 'loading' || confirmationStatus === 'loading') {
    return 'loading'
  }

  if (writeStatus === 'error' || confirmationStatus === 'error') {
    return 'error'
  }

  if (writeStatus === 'success' && confirmationStatus === 'success') {
    return 'success'
  }

  return 'idle'
}

interface BaseUseContractWriteArgs {
  functionName: string
  onSuccess?: (data: providers.TransactionReceipt) => void
}

interface UseContractWriteArgs extends BaseUseContractWriteArgs {
  addressOrName: string
  contractInterface: ContractInterface
}

const useContractWriteAndWait = ({
  addressOrName,
  contractInterface,
  functionName,
  onSuccess,
}: UseContractWriteArgs) => {
  const {
    write,
    writeAsync,
    status: writeStatus,
    error: writeError,
    data: writeData,
    isLoading: isLoadingWrite,
  } = useContractWrite({
    addressOrName,
    contractInterface,
    functionName,
  })

  const {
    data,
    status: confirmationStatus,
    error: confirmationError,
    isLoading: isLoadingConfirmation,
  } = useWaitForTransaction({
    hash: writeData?.hash,
    onSuccess,
  })

  return {
    write,
    writeAsync,
    data,
    error: writeError || confirmationError,
    status: getStatus(writeStatus, confirmationStatus),
    isLoading: isLoadingWrite || isLoadingConfirmation,
  }
}

export default useContractWriteAndWait

export const useTokenContractWrite = ({
  functionName,
  onSuccess,
}: BaseUseContractWriteArgs) => {
  return useContractWriteAndWait({
    addressOrName: TOKEN_ADDRESS[CHAIN.id],
    contractInterface: MyTokenAbi.abi,
    functionName,
    onSuccess,
  })
}

export const useQuizContractWrite = ({
  functionName,
  onSuccess,
}: BaseUseContractWriteArgs) => {
  return useContractWriteAndWait({
    addressOrName: QUIZ_CONTRACT_ADDRESS[CHAIN.id],
    contractInterface: QuizContractAbi.abi,
    functionName,
    onSuccess,
  })
}
