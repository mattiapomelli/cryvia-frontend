import '../styles/globals.css'
import type { AppProps } from 'next/app'

import { Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { QueryClientProvider, QueryClient } from 'react-query'

import Web3ContextProvider from '@contexts/Web3Provider'
import { PageWithLayout } from 'types'
import AuthProvider from '@contexts/AuthProvider'

const getLibrary = (provider: any) => {
  return new Web3Provider(provider)
}

const queryClient = new QueryClient()

function MyApp({ Component, pageProps }: AppProps) {
  const getLayout = (Component as PageWithLayout).getLayout || ((page) => page)

  return (
    <QueryClientProvider client={queryClient}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Web3ContextProvider>
          <AuthProvider>{getLayout(<Component {...pageProps} />)}</AuthProvider>
        </Web3ContextProvider>
      </Web3ReactProvider>
    </QueryClientProvider>
  )
}

export default MyApp
