import { useLayoutEffect, useMemo, useRef } from 'react'
import Link from 'next/link'
import { ethers } from 'ethers'
import { UnsupportedChainIdError } from '@web3-react/core'
import jazzicon from '@metamask/jazzicon'

import Address from '@components/Address'
import { useWeb3Context } from '@contexts/Web3Provider'
import { useApiClient, UserStatus, useUser } from '@contexts/AuthProvider'

const WalletStatus = () => {
  const { account, connect, error, provider, balance } = useWeb3Context()
  const { user, setUser, status } = useUser()
  const apiClient = useApiClient()

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

  const verifyAddress = async () => {
    if (!account) return
    const { data } = await apiClient.auth.sign(account)

    const signer = provider?.getSigner()
    if (!signer) return

    const signature = await signer.signMessage(data.message)

    const user = await apiClient.auth.verify({ address: account, signature })
    setUser(user)
  }

  if (error && error instanceof UnsupportedChainIdError) {
    return <div className="text-red-500">Wrong network</div>
  }

  if (status === UserStatus.Connected && account) {
    return (
      <div className="flex items-center gap-2">
        <span>{ethers.utils.formatUnits(balance, 18)}</span>
        <span>
          <Address address={account} />
          {status === UserStatus.Connected && (
            <button className="ml-2" onClick={verifyAddress}>
              Verify address
            </button>
          )}
        </span>
        <span ref={iconRef} className="inline-flex" />
      </div>
    )
  }

  if (status === UserStatus.Logged && user) {
    return (
      <Link href="/profile">
        <a className="flex items-center gap-2">
          <span>{ethers.utils.formatUnits(balance, 18)}</span>
          <span>
            <Address address={user.address} />
          </span>
          <span ref={iconRef} className="inline-flex" />
        </a>
      </Link>
    )
  }

  return (
    <button
      onClick={connect}
      className="py-2 px-4 bg-blue-500 text-white rounded-full"
    >
      Connect
    </button>
  )
}

export default WalletStatus
