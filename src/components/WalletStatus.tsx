import Link from 'next/link'
import { useAccount, useConnect, useNetwork, useSwitchNetwork } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'

import Address from '@/components/Address'
import Button from '@/components/Button'
import { CHAIN } from '@/constants/chains'
import { UserStatus, useUser } from '@/contexts/AuthProvider'
import useTokenBalance from '@/hooks/useTokenBalance'
import AddressAvatar from './AddressAvatar'

const WalletStatus = () => {
  const { address } = useAccount()
  const { connect } = useConnect({
    connector: new InjectedConnector({ chains: [CHAIN] }),
  })

  const { chain } = useNetwork()
  const { balance } = useTokenBalance()
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
      <Link href={`/${address}`}>
        <a>
          <div className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 py-1.5 px-2 rounded-full">
            <span>
              {balance?.formatted} {balance?.symbol}
            </span>
            <span>
              <Address address={address} className="font-semibold" />
            </span>
            <AddressAvatar address={address} />
          </div>
        </a>
      </Link>
    )
  }

  // Disconnected
  return <Button onClick={() => connect()}>Connect</Button>
}

export default WalletStatus
