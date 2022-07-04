import { useLayoutEffect, useMemo, useRef } from 'react'
import Link from 'next/link'
import { UnsupportedChainIdError } from '@web3-react/core'
import jazzicon from '@metamask/jazzicon'

import Address from '@components/Address'
import { useWeb3Context } from '@contexts/Web3Provider'
import { useUser, UserStatus } from '@contexts/AuthProvider'
import Button from '@components/Button'

const WalletStatus = () => {
  const { account, connect, error } = useWeb3Context()
  const { status, verifyAddress } = useUser()

  const iconRef = useRef<HTMLSpanElement>(null)
  const icon = useMemo(
    () => (account ? jazzicon(16, parseInt(account.slice(2, 10), 16)) : null),
    [account],
  )

  useLayoutEffect(() => {
    const current = iconRef.current
    if (
      icon &&
      (status === UserStatus.Connected || status === UserStatus.Logged)
    ) {
      current?.appendChild(icon)
    }

    return () => {
      if (icon) {
        current?.removeChild(icon)
      }
    }
  }, [icon, iconRef, status])

  // Wrong network
  if (error && error instanceof UnsupportedChainIdError) {
    return <div className="text-red-500">Wrong network (switch to Mumbai)</div>
  }

  // Needs verification
  if (status === UserStatus.Connected && account) {
    return (
      <div className="flex items-center gap-2 bg-gray-200 py-1.5 px-2 rounded-full">
        <span>
          <Address address={account} className="font-semibold" />
          <button className="ml-2 text-sm font-medium" onClick={verifyAddress}>
            Verify address
          </button>
        </span>
        <span ref={iconRef} className="inline-flex" />
      </div>
    )
  }

  // Logged in
  if (status === UserStatus.Logged && account) {
    return (
      <Link href="/profile">
        <a className="flex items-center gap-2 bg-gray-200 py-1.5 px-2 rounded-full">
          <span>
            <Address address={account} className="font-semibold" />
          </span>
          <span ref={iconRef} className="inline-flex" />
        </a>
      </Link>
    )
  }

  // Disconnected
  return <Button onClick={connect}>Connect</Button>
}

export default WalletStatus
