// TODO: import this from wagmi?
export enum SupportedChainId {
  LOCAL = 31337,
  MUMBAI = 80001,
  POLYGON = 137,
}

const getChain = () => {
  if (!process.env.NEXT_PUBLIC_CHAIN) {
    throw new Error('NEXT_PUBLIC_CHAIN envinronment variable must be defined')
  }

  switch (process.env.NEXT_PUBLIC_CHAIN) {
    case 'localhost':
      return SupportedChainId.LOCAL
    case 'testnet':
      return SupportedChainId.MUMBAI
    case 'mainnet':
      return SupportedChainId.POLYGON
    default:
      throw new Error('Invalid NEXT_PUBLIC_CHAIN value')
  }
}

export const CHAIN = getChain()
