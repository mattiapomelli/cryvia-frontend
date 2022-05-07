import { useLayoutEffect, useMemo, useRef } from 'react'
import jazzicon from '@metamask/jazzicon'

import { useWeb3Context } from '../contexts/Web3Provider'
import { UnsupportedChainIdError } from '@web3-react/core'
import Address from './Address'
import { useApiClient, useUser } from '@contexts/AuthProvider'

const WalletStatus = () => {
  const { active, account, connect, error, provider } = useWeb3Context()
  const { user, setUser, setLoading } = useUser()
  const apiClient = useApiClient()

  const iconRef = useRef<HTMLSpanElement>(null)
  const icon = useMemo(
    () => (account ? jazzicon(16, parseInt(account.slice(2, 10), 16)) : null),
    [account],
  )

  useLayoutEffect(() => {
    const current = iconRef.current
    if (icon) {
      current?.appendChild(icon)
    }

    return () => {
      if (icon) {
        current?.removeChild(icon)
      }
    }
  }, [icon, iconRef])

  const verifyAddress = async () => {
    if (!account) return
    const { data } = await apiClient.auth.sign(account)

    const signer = provider?.getSigner()
    if (!signer) return

    const signature = await signer.signMessage(data.message)

    const user = await apiClient.auth.verify({ address: account, signature })
    setUser(user)
    setLoading(false)
  }

  if (error && error instanceof UnsupportedChainIdError) {
    return <div className="text-red-500">Wrong network</div>
  }

  if (active && account) {
    return (
      <div className="flex items-center gap-2">
        <span>
          <Address address={account} />
          {!user && (
            <button className="ml-2" onClick={verifyAddress}>
              Verify address
            </button>
          )}
        </span>
        <span ref={iconRef} className="inline-flex" />
      </div>
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
