import Link from 'next/link'
import { UnsupportedChainIdError } from '@web3-react/core'

import Address from '@components/Address'
import { useWeb3Context } from '@contexts/Web3Provider'
import { useUser, UserStatus } from '@contexts/AuthProvider'
import Button from '@components/Button'
import { ethers } from 'ethers'
import AddressAvatar from './AddressAvatar'

const WalletStatus = () => {
  const { account, connect, error, balance } = useWeb3Context()
  const { status, verifyAddress } = useUser()

  // Wrong network
  if (error && error instanceof UnsupportedChainIdError) {
    return <div className="text-red-500">Wrong network (switch to Mumbai)</div>
  }

  // Needs verification
  if (status === UserStatus.Connected && account) {
    return (
      <div className="flex items-center gap-2 bg-gray-200 py-1.5 px-2 rounded-full">
        <span>{ethers.utils.formatEther(balance)}</span>
        <span>
          <Address address={account} className="font-semibold" />
          <button className="ml-2 text-sm font-medium" onClick={verifyAddress}>
            Verify address
          </button>
        </span>
        <AddressAvatar address={account} />
      </div>
    )
  }

  // Logged in
  if (status === UserStatus.Logged && account) {
    return (
      <Link href="/profile">
        <a className="flex items-center gap-2 bg-gray-200 py-1.5 px-2 rounded-full">
          <span>{ethers.utils.formatEther(balance)}</span>
          <span>
            <Address address={account} className="font-semibold" />
          </span>
          <AddressAvatar address={account} />
        </a>
      </Link>
    )
  }

  // Disconnected
  return <Button onClick={connect}>Connect</Button>
}

export default WalletStatus
