import { useState } from 'react'
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi'

import Address from '@/components/Address'
import Button from '@/components/Button'
import { CHAIN } from '@/constants/chains'
import { UserStatus, useUser } from '@/contexts/AuthProvider'
import useTokenBalance from '@/hooks/useTokenBalance'
import AddressAvatar from './AddressAvatar'
import ConnectModal from './ConnectModal'
import WalletDropdown from './WalletDropdown'

const WalletStatus = () => {
  const [showConnectModal, setShowConnectModal] = useState(false)
  const { address } = useAccount()

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
      <button
        onClick={verifyAddress}
        className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 py-1.5 px-2 rounded-full cursor-pointer"
      >
        <span>
          {balance?.formatted} {balance?.symbol}
        </span>
        <span>
          <Address address={address} className="font-bold" />
          <span className="ml-2 text-sm font-medium">Verify address</span>
        </span>
        <AddressAvatar address={address} />
      </button>
    )
  }

  // Logged in
  if (status === UserStatus.Logged && address) {
    return <WalletDropdown address={address} />
  }

  // Disconnected
  return (
    <>
      <Button onClick={() => setShowConnectModal(true)}>Connect</Button>
      <ConnectModal
        show={showConnectModal}
        onClose={() => setShowConnectModal(false)}
      />
    </>
  )
}

export default WalletStatus
