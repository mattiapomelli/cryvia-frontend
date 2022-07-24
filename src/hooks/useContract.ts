import { useContract, useProvider, useSigner } from 'wagmi'

import { Quiz, MyToken } from '@abis/types'
import QuizContractAbi from '@abis/contracts/Quiz.json'
import MyTokenAbi from '@abis/contracts/MyToken.json'
import { QUIZ_CONTRACT_ADDRESS, TOKEN_ADDRESS } from '@constants/addresses'
import { CHAIN } from '@constants/chains'

export const useQuizContract = (withSigner = true) => {
  const { data: signer } = useSigner()
  const provider = useProvider()

  const contract = useContract<Quiz>({
    addressOrName: QUIZ_CONTRACT_ADDRESS[CHAIN.id],
    contractInterface: QuizContractAbi.abi,
    signerOrProvider: withSigner ? signer : provider,
  })

  return contract
}

export const useTokenContract = (withSigner = true) => {
  const { data: signer } = useSigner()
  const provider = useProvider()

  // TODO: replace with ERC20 for production
  const contract = useContract<MyToken>({
    addressOrName: TOKEN_ADDRESS[CHAIN.id],
    contractInterface: MyTokenAbi.abi,
    signerOrProvider: withSigner ? signer : provider,
  })

  return contract
}
