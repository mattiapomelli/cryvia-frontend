import { useMemo } from 'react'
import { ContractInterface, ethers, providers } from 'ethers'
import { Contract } from '@ethersproject/contracts'

import { Quiz, MyToken } from '@abis/types'
import QuizContractAbi from '@abis/contracts/Quiz.json'
import MyTokenAbi from '@abis/contracts/MyToken.json'
import {
  AddressMap,
  QUIZ_CONTRACT_ADDRESS,
  TOKEN_ADDRESS,
} from '@constants/addresses'
import { useWeb3React } from '@web3-react/core'

const useContract = <T extends Contract = Contract>(
  addressOrAddressMap: string | AddressMap,
  abi: ContractInterface,
  withSigner = true,
): T | null => {
  const {
    library: provider,
    account,
    chainId,
  } = useWeb3React<providers.Web3Provider>()

  const contract = useMemo(() => {
    if (!provider || !chainId) return null

    const address =
      typeof addressOrAddressMap === 'string'
        ? addressOrAddressMap
        : addressOrAddressMap[chainId]

    const providerOrSigner =
      withSigner && account ? provider.getSigner() : provider

    try {
      return new ethers.Contract(address, abi, providerOrSigner) as T
    } catch (error) {
      return null
    }
  }, [addressOrAddressMap, abi, provider, withSigner, account, chainId])

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
  return useContract<MyToken>(TOKEN_ADDRESS, MyTokenAbi.abi, withSigner)
}
