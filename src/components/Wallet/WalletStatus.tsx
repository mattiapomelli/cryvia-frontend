import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi'

import Button from '@/components/UI/Button'
import { CHAIN } from '@/constants/chains'
import { UserStatus, useUser } from '@/contexts/AuthProvider'
import WalletDropdown from './WalletDropdown'

const WalletStatus = () => {
  const { address } = useAccount()
  const { chain } = useNetwork()
  const { switchNetwork } = useSwitchNetwork()

  const { status, openConnectModal } = useUser()

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
  return <Button onClick={openConnectModal}>Connect</Button>
}

export default WalletStatus
