import '../styles/globals.css'

import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import type { AppProps } from 'next/app'
import { configureChains, createClient, WagmiConfig } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'

import { CHAIN } from '@/constants/chains'
import { ALCHEMY_KEY, ALCHEMY_RPC_URL } from '@/constants/urls'
import AuthProvider from '@/contexts/AuthProvider'
import { PageWithLayout } from '@/types'

const { chains, provider } = configureChains(
  [CHAIN],
  [alchemyProvider({ alchemyId: ALCHEMY_KEY }), publicProvider()],
)

const connectors = [
  new InjectedConnector({
    chains,
  }),
  new WalletConnectConnector({
    chains,
    options: {
      rpc: { [CHAIN.id]: ALCHEMY_RPC_URL[CHAIN.id] },
    },
  }),
]

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
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
