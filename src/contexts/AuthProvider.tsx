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

import ApiClient from '@api/client'
import { ForbiddenError } from '@api/errors'
import { User } from '@api/users'
import { useWeb3Context } from './Web3Provider'

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
}

const UserContext = createContext<UserContextValue | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [status, setStatus] = useState(UserStatus.Loading)

  const { account, active, loading: loadingAccount } = useWeb3Context()

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
    if (loadingAccount) return

    if (!active || !account) {
      setStatus(UserStatus.Disconnected)
      return
    }

    const getUser = async () => {
      try {
        const user = await apiClientRef.current.auth.getLoggedUser(account)

        if (user) {
          setUser(user)
          setStatus(UserStatus.Logged)
          return
        }

        // Create user if not exists
        await apiClientRef.current.auth.login(account)
        setStatus(UserStatus.Connected)
      } catch (error) {
        setStatus(UserStatus.Connected)
      }
    }

    getUser()
  }, [loadingAccount, active, account])

  useEffect(() => {
    if (user) {
      setStatus(UserStatus.Logged)
    }
  }, [user])

  return (
    <ApiClientContext.Provider value={apiClientRef.current}>
      <UserContext.Provider
        value={{
          user,
          setUser,
          status,
        }}
      >
        {children}
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
