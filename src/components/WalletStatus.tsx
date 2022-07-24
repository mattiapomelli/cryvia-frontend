// import Link from 'next/link'
import {
  useAccount,
  useBalance,
  useConnect,
  useNetwork,
  useSwitchNetwork,
} from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'

import Address from '@components/Address'
import { useUser, UserStatus } from '@contexts/AuthProvider'
import Button from '@components/Button'
import AddressAvatar from './AddressAvatar'
import { TOKEN_ADDRESS } from '@constants/addresses'
import { CHAIN } from '@constants/chains'

const WalletStatus = () => {
  const { address } = useAccount()
  const { connect } = useConnect({
    connector: new InjectedConnector({ chains: [CHAIN] }),
  })

  const { chain } = useNetwork()
  const { data: balance } = useBalance({
    addressOrName: address,
    token: TOKEN_ADDRESS[CHAIN.id],
    enabled: chain !== undefined,
  })
  const { switchNetwork } = useSwitchNetwork()

  const { status, verifyAddress } = useUser()

  // Wrong network
  if (chain?.unsupported) {
    return (
      <Button
        variant="danger"
        size="small"
        onClick={() => switchNetwork?.(CHAIN.id)}
      >
        Switch to {CHAIN.name}
      </Button>
    )
  }

  // Needs verification
  if (status === UserStatus.Connected && address) {
    return (
      <div className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 py-1.5 px-2 rounded-full cursor-pointer">
        <span>
          {balance?.formatted} {balance?.symbol}
        </span>
        <span>
          <Address address={address} className="font-semibold" />
          <button className="ml-2 text-sm font-medium" onClick={verifyAddress}>
            Verify address
          </button>
        </span>
        <AddressAvatar address={address} />
      </div>
    )
  }

  // Logged in
  if (status === UserStatus.Logged && address) {
    return (
      // <Link href="/profile">
      <div className="flex items-center gap-2 bg-gray-200 py-1.5 px-2 rounded-full">
        <span>
          {balance?.formatted} {balance?.symbol}
        </span>
        <span>
          <Address address={address} className="font-semibold" />
        </span>
        <AddressAvatar address={address} />
      </div>
      // </Link>
    )
  }

  // Disconnected
  return <Button onClick={() => connect()}>Connect</Button>
}

export default WalletStatus
