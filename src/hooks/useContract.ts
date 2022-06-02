import { useMemo } from 'react'
import { ContractInterface, ethers } from 'ethers'
import { Contract } from '@ethersproject/contracts'

import { useWeb3Context } from '@contexts/Web3Provider'
import { Quiz, ERC20 } from '@abis/types'
import QuizContractAbi from '@abis/contracts/Quiz.json'
import ERC20Abi from '@abis/contracts/ERC20.json'
import { QUIZ_CONTRACT_ADDRESS, TOKEN_ADDRESS } from '@constants/addresses'

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
    QuizContractAbi.abi,
    withSigner,
  )
}

export const useTokenContract = (withSigner = true) => {
  return useContract<ERC20>(TOKEN_ADDRESS, ERC20Abi.abi, withSigner)
}
