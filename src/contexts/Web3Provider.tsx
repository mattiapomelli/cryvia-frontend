import {
  useState,
  useEffect,
  createContext,
  ReactNode,
  useContext,
  useCallback,
} from 'react'
import { BigNumber, providers } from 'ethers'
import { useWeb3React } from '@web3-react/core'

import { injected } from '@utils/connectors'
import { useTokenContract } from '@hooks/useContract'

interface Web3ContextValue {
  provider?: providers.Web3Provider
  chainId?: number
  account?: null | string
  active: boolean
  error?: Error
  balance: BigNumber
  connect: () => void
  disconnect: () => void
  updateBalance: () => void
  loading: boolean
}

const Web3Context = createContext<Web3ContextValue | undefined>(undefined)

interface Web3ProviderProps {
  children: ReactNode
}

const Web3ContextProvider = ({ children }: Web3ProviderProps) => {
  const {
    active,
    library: provider,
    activate,
    deactivate,
    account,
    chainId,
    error,
  } = useWeb3React<providers.Web3Provider>()

  const [loading, setLoading] = useState(true)
  const [disconnected, setDisconnected] = useState(false)
  const [balance, setBalance] = useState<BigNumber>(BigNumber.from(0))

  const tokenContract = useTokenContract()

  // Connect wallet on load
  useEffect(() => {
    const connectWallet = async () => {
      try {
        const isAuthorized = await injected.isAuthorized()

        if (isAuthorized && !active) {
          await activate(injected, undefined, true)
        }
        setLoading(false)
      } catch (error) {
        setLoading(false)
      }
    }

    if (!active && !disconnected) {
      connectWallet()
    }
  }, [active, activate, disconnected])

  const updateBalance = useCallback(async () => {
    if (!tokenContract || !account || !chainId) return

    try {
      const balance = await tokenContract.balanceOf(account)
      setBalance(balance)
    } catch (err) {
      console.error('Something went wrong getting user balance: ', err)
    }
  }, [account, chainId, tokenContract])

  // Get account token balance
  useEffect(() => {
    updateBalance()
  }, [updateBalance])

  // Connect to wallet
  const connect = async () => {
    await activate(injected)
  }

  // Disconnect wallet
  const disconnect = () => {
    setDisconnected(true)
    deactivate()
  }

  return (
    <Web3Context.Provider
      value={{
        active,
        provider,
        account,
        chainId,
        error,
        connect,
        disconnect,
        balance,
        loading,
        updateBalance,
      }}
    >
      {children}
    </Web3Context.Provider>
  )
}

export default Web3ContextProvider

export const useWeb3Context = () => {
  const context = useContext(Web3Context)

  if (context === undefined) {
    throw new Error('useWeb3Context must be used within an Web3Provider')
  }

  return context
}
