import '../styles/globals.css'

import type { AppProps } from 'next/app'
import { WagmiConfig, createClient, configureChains, chain } from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { QueryClientProvider, QueryClient } from 'react-query'

import { PageWithLayout } from 'types'
import AuthProvider from '@contexts/AuthProvider'

const { chains, provider } = configureChains(
  [chain.polygonMumbai, chain.hardhat],
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
