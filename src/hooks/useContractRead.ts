import { Contract, ContractTransaction } from 'ethers'
import { Result } from 'ethers/lib/utils'
import { useContractRead } from 'wagmi'

import MyTokenAbi from '@/abis/contracts/MyToken.json'
import QuizContractAbi from '@/abis/contracts/Quiz.json'
import { MyToken, Quiz } from '@/abis/types'
import { QUIZ_CONTRACT_ADDRESS, TOKEN_ADDRESS } from '@/constants/addresses'
import { CHAIN } from '@/constants/chains'

type ContractFunctions<T extends Contract> = T['functions']

type ContractReadFunctions<T extends Contract> = {
  [K in keyof ContractFunctions<T>]: ReturnType<
    ContractFunctions<T>[K]
  > extends Promise<ContractTransaction>
    ? never
    : K
}[keyof ContractFunctions<T>]

interface UseContractReadArgs<T extends Contract> {
  functionName: ContractReadFunctions<T>
  onSuccess?: (data: Result) => void
  args?: any | any[]
  enabled?: boolean
}

interface UseContractReadReturnType<T>
  extends Omit<ReturnType<typeof useContractRead>, 'data'> {
  data: T | undefined
}

export const useQuizContractRead = <T = Result>(
  args: UseContractReadArgs<Quiz>,
): UseContractReadReturnType<T> => {
  const { data, ...rest } = useContractRead({
    addressOrName: QUIZ_CONTRACT_ADDRESS[CHAIN.id],
    contractInterface: QuizContractAbi.abi,
    ...args,
  })

  return {
    ...rest,
    data: data as T | undefined,
  }
}

export const useTokenContractRead = <T = Result>(
  args: UseContractReadArgs<MyToken>, // TODO: replace with ERC20 for production
): UseContractReadReturnType<T> => {
  const { data, ...rest } = useContractRead({
    addressOrName: TOKEN_ADDRESS[CHAIN.id],
    contractInterface: MyTokenAbi.abi,
    ...args,
  })

  return {
    ...rest,
    data: data as T | undefined,
  }
}
