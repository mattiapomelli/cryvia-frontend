import { useAccount, useBalance } from 'wagmi'

import { TOKEN_ADDRESS } from '@/constants/addresses'
import { CHAIN } from '@/constants/chains'

const useTokenBalance = () => {
  const { address } = useAccount()

  const { data: balance, ...rest } = useBalance({
    addressOrName: address,
    token: TOKEN_ADDRESS[CHAIN.id],
  })

  return {
    balance,
    ...rest,
  }
}

export default useTokenBalance
