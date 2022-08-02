import { Menu } from '@headlessui/react'

import { useUser } from '@/contexts/AuthProvider'
import useTokenBalance from '@/hooks/useTokenBalance'
import Address from '../Address'
import AddressAvatar from '../AddressAvatar'

interface WalletButtonProps {
  address: string
  needsVerification: boolean
}

const WalletButton = ({ address, needsVerification }: WalletButtonProps) => {
  const { balance } = useTokenBalance()
  const { verifyAddress } = useUser()

  if (needsVerification) {
    return (
      <button
        onClick={verifyAddress}
        className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 py-0.5 px-2 rounded-full cursor-pointer"
      >
        <span className="text-sm">
          {balance?.formatted} {balance?.symbol}
        </span>
        <div className="flex flex-col justify-center">
          <Address address={address} className="font-medium text-[12px]" />
          <span className="text-[12px] font-bold -mt-1">Verify address</span>
        </div>
        <AddressAvatar address={address} />
      </button>
    )
  }

  return (
    <Menu.Button className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 py-1.5 px-2 rounded-full">
      <span>
        {balance?.formatted} {balance?.symbol}
      </span>
      <span>
        <Address address={address} className="font-semibold" />
      </span>
      <AddressAvatar address={address} />
    </Menu.Button>
  )
}

export default WalletButton
