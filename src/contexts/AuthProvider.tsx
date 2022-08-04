import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useAccount, useSignMessage } from 'wagmi'

import ApiClient from '@/api/client'
import { ForbiddenError } from '@/api/errors'
import { User } from '@/api/users'
import ConnectModal from '@/components/Wallet/ConnectModal'
import VerifyAddressModal from '@/components/Wallet/VerifyAddressModal'

const ApiClientContext = createContext<ApiClient | undefined>(undefined)

export enum UserStatus {
  Loading, // Either loading the account from wallet or the user from api
  Disconnected, // Account loaded and wallett is not connected
  Connected, // Wallet connected but address not verified
  Logged, // Wallet connected and address verified, properly logged in the application
}

interface UserContextValue {
  user: User | null
  setUser: Dispatch<SetStateAction<User | null>>
  status: UserStatus
  verifyAddress: () => void
  openConnectModal: () => void
  openVerifyModal: () => void
}

const UserContext = createContext<UserContextValue | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [status, setStatus] = useState(UserStatus.Loading)
  const [showConnectModal, setShowConnectModal] = useState(false)
  const [showVerifyModal, setShowVerifyModal] = useState(false)

  const { address, isConnected, isConnecting, isReconnecting } = useAccount()
  const { signMessageAsync } = useSignMessage()

  const handleUnauthorizedError = async () => {
    setUser(null)
  }

  const handleForbiddenError = (error: ForbiddenError) => {
    console.log(error)
  }

  const apiClientRef = useRef(
    new ApiClient({
      handleUnauthorizedError,
      handleForbiddenError,
    }),
  )

  useEffect(() => {
    if (isReconnecting || isConnecting) {
      // TEMPORARY FIX for a Metamask bug (?) Should just return instead when its solved
      setStatus(UserStatus.Disconnected)
      return
    }

    if (!isConnected || !address) {
      setStatus(UserStatus.Disconnected)
      return
    }

    const getUser = async () => {
      try {
        // Get logged user
        const user = await apiClientRef.current.auth.getLoggedUser(address)

        if (user) {
          setUser(user)
          setStatus(UserStatus.Logged)
          return
        }

        // Create user if doesn't exist
        await apiClientRef.current.auth.login(address)
        setStatus(UserStatus.Connected)
      } catch (error) {
        setStatus(UserStatus.Connected)
      }
    }

    getUser()
  }, [address, isConnected, isReconnecting, isConnecting])

  const verifyAddress = async () => {
    if (!address) return

    try {
      // Request message to sign
      const { data } = await apiClientRef.current.auth.sign(address)

      // Sign message
      const signature = await signMessageAsync({
        message: data.message,
      })

      // Verify signature
      const user = await apiClientRef.current.auth.verify({
        address,
        signature,
      })

      setUser(user)
      setStatus(UserStatus.Logged)
    } catch (error) {
      console.log('Error while trying to sign message')
    }
  }

  return (
    <ApiClientContext.Provider value={apiClientRef.current}>
      <UserContext.Provider
        value={{
          user,
          setUser,
          status,
          verifyAddress,
          openConnectModal: () => setShowConnectModal(true),
          openVerifyModal: () => setShowVerifyModal(true),
        }}
      >
        {children}
        <ConnectModal
          show={showConnectModal}
          onClose={() => setShowConnectModal(false)}
        />
        <VerifyAddressModal
          show={showVerifyModal}
          onClose={() => setShowVerifyModal(false)}
        />
      </UserContext.Provider>
    </ApiClientContext.Provider>
  )
}

export const useApiClient = () => {
  const context = useContext(ApiClientContext)

  if (context === undefined) {
    throw new Error('useApiClient must be used within an AuthProvider')
  }

  return context
}

export const useUser = () => {
  const context = useContext(UserContext)

  if (context === undefined) {
    throw new Error('useUser must be used within an AuthProvider')
  }

  return context
}

export default AuthProvider
