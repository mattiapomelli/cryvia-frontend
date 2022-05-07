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

interface UserContextValue {
  user: User | null
  setUser: Dispatch<SetStateAction<User | null>>
  loading: boolean
  setLoading: Dispatch<SetStateAction<boolean>>
  redirect: string | null
  setRedirect: (redirect: string | null) => void
}

const UserContext = createContext<UserContextValue | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [redirect, setRedirect] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const { account } = useWeb3Context()

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
    setUser(null)
    if (!account) return

    const getUser = async () => {
      try {
        const user = await apiClientRef.current.auth.getLoggedUser(account)

        if (user) {
          setUser(user)
          return
        }

        // Create user if not exists
        await apiClientRef.current.auth.login(account)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    getUser()
  }, [account])

  return (
    <ApiClientContext.Provider value={apiClientRef.current}>
      <UserContext.Provider
        value={{
          user,
          setUser,
          loading,
          setLoading,
          redirect,
          setRedirect,
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
