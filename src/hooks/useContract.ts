import { useMemo } from 'react'
import { ContractInterface, ethers } from 'ethers'
import { Contract } from '@ethersproject/contracts'

import { useWeb3Context } from '@contexts/Web3Provider'
import { Quiz } from '@abis/types'
import quizContractAbi from '@abis/contracts/Quiz.json'
import { QUIZ_CONTRACT_ADDRESS } from '@constants/addresses'

const useContract = <T extends Contract = Contract>(
  address: string,
  abi: ContractInterface,
  withSigner = true,
): T | null => {
  const { provider, account } = useWeb3Context()

  const contract = useMemo(() => {
    if (!provider) return null

    const providerOrSigner =
      withSigner && account ? provider.getSigner() : provider

    try {
      return new ethers.Contract(address, abi, providerOrSigner) as T
    } catch (error) {
      return null
    }
  }, [address, abi, provider, withSigner, account])

  return contract
}

export default useContract

export const useQuizContract = (withSigner = true) => {
  return useContract<Quiz>(
    QUIZ_CONTRACT_ADDRESS,
    quizContractAbi.abi,
    withSigner,
  )
}
