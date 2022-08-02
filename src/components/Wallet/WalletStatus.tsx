import { useState } from 'react'
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi'

import Button from '@/components/Button'
import { CHAIN } from '@/constants/chains'
import { UserStatus, useUser } from '@/contexts/AuthProvider'
import ConnectModal from './ConnectModal'
import WalletDropdown from './WalletDropdown'

const WalletStatus = () => {
  const [showConnectModal, setShowConnectModal] = useState(false)
  const { address } = useAccount()

  const { chain } = useNetwork()
  const { switchNetwork } = useSwitchNetwork()

  const { status } = useUser()

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

  // Connected (Needs verification or Logged in)
  if (
    (status === UserStatus.Logged || status === UserStatus.Connected) &&
    address
  ) {
    return (
      <WalletDropdown
        address={address}
        needsVerification={status === UserStatus.Connected}
      />
    )
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
