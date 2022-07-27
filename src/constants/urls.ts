import { chain } from 'wagmi'

import { CHAIN, ChainMap } from './chains'

if (!process.env.NEXT_PUBLIC_ALCHEMY_KEY) {
  throw new Error('ALCHEMY_KEY envinronment variable must be defined')
}

export const ALCHEMY_KEY = process.env.NEXT_PUBLIC_ALCHEMY_KEY

export const ALCHEMY_RPC_URL: ChainMap = {
  [chain.polygonMumbai
    .id]: `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
  [chain.polygon.id]: `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_KEY}`,
}

export const EXPLORER_URL: ChainMap = {
  [chain.polygonMumbai.id]: `https://mumbai.polygonscan.com`,
  [chain.polygon.id]: `https://polygonscan.com`,
}

export const getAddressExplorerLink = (address: string) => {
  return `${EXPLORER_URL[CHAIN.id]}/address/${address}`
}
