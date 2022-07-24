import { useContractWrite, useWaitForTransaction } from 'wagmi'
import { Contract, ContractTransaction, providers } from 'ethers'

import MyTokenAbi from '@abis/contracts/MyToken.json'
import QuizContractAbi from '@abis/contracts/Quiz.json'
import { QUIZ_CONTRACT_ADDRESS, TOKEN_ADDRESS } from '@constants/addresses'
import { CHAIN } from '@constants/chains'
import { ContractInterface } from 'ethers'
import { MyToken, Quiz } from '@abis/types'

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

type ContractFunctions<T extends Contract> = T['functions']

type ContractWriteFunctions<T extends Contract> = {
  [K in keyof ContractFunctions<T>]: ReturnType<
    ContractFunctions<T>[K]
  > extends Promise<ContractTransaction>
    ? K
    : never
}[keyof ContractFunctions<T>]

interface BaseUseContractWriteArgs<T extends Contract> {
  functionName: ContractWriteFunctions<T>
  onSuccess?: (data: providers.TransactionReceipt) => void
  args?: any | any[]
}

interface UseContractWriteArgs<T extends Contract>
  extends BaseUseContractWriteArgs<T> {
  addressOrName: string
  contractInterface: ContractInterface
}

const useContractWriteAndWait = <T extends Contract>({
  functionName,
  onSuccess,
  ...args
}: UseContractWriteArgs<T>) => {
  const {
    write,
    writeAsync,
    status: writeStatus,
    error: writeError,
    data: writeData,
    isLoading: isLoadingWrite,
  } = useContractWrite({
    ...args,
    functionName: functionName as string,
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

export const useTokenContractWrite = (
  args: BaseUseContractWriteArgs<MyToken>,
) => {
  return useContractWriteAndWait({
    addressOrName: TOKEN_ADDRESS[CHAIN.id],
    contractInterface: MyTokenAbi.abi,
    ...args,
  })
}

export const useQuizContractWrite = (args: BaseUseContractWriteArgs<Quiz>) => {
  return useContractWriteAndWait({
    addressOrName: QUIZ_CONTRACT_ADDRESS[CHAIN.id],
    contractInterface: QuizContractAbi.abi,
    ...args,
  })
}
