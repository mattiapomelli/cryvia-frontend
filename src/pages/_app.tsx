import '../styles/globals.css'

import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import type { AppProps } from 'next/app'
import { configureChains, createClient, WagmiConfig } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'

import { CHAIN } from '@/constants/chains'
import AuthProvider from '@/contexts/AuthProvider'
import { PageWithLayout } from '@/types'

const { chains, provider } = configureChains(
  [CHAIN],
  [
    alchemyProvider({ alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_KEY }),
    publicProvider(),
  ],
)

const wagmiClient = createClient({
  autoConnect: true,
  connectors: [
    new InjectedConnector({
      chains,
    }),
  ],
  provider,
})

const queryClient = new QueryClient()

function MyApp({ Component, pageProps }: AppProps) {
  const getLayout = (Component as PageWithLayout).getLayout || ((page) => page)

  return (
    <WagmiConfig client={wagmiClient}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>{getLayout(<Component {...pageProps} />)}</AuthProvider>
      </QueryClientProvider>
    </WagmiConfig>
  )
}

export default MyApp
