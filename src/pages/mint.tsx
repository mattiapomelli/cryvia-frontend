import { ethers } from 'ethers'

import Button from '@/components/Button'
import Container from '@/components/Layout/Container'
import { UserStatus, useUser } from '@/contexts/AuthProvider'
import { useTokenContractWrite } from '@/hooks/useContractWriteAndWait'
import useTokenBalance from '@/hooks/useTokenBalance'
import { getDefaultLayout } from '@/layouts/DefaultLayout'
import { PageWithLayout } from '@/types'

const MintPage: PageWithLayout = () => {
  const { refetch } = useTokenBalance()
  const { status: userStatus, openConnectModal, openVerifyModal } = useUser()

  const { write, status, error } = useTokenContractWrite({
    functionName: 'mint',
    onSuccess() {
      refetch()
    },
  })

  const onMint = () => {
    if (userStatus === UserStatus.Logged) {
      write({ args: [ethers.utils.parseEther('20')] })
    } else if (userStatus === UserStatus.Connected) {
      openVerifyModal()
    } else {
      openConnectModal()
    }
  }

  return (
    <Container className="mt-10 flex justify-center">
      <div className="flex flex-col gap-4 items-center max-w-sm text-center">
        <h2 className="text-xl font-bold">Mint free tokens</h2>
        <p>
          Here you can mint some free MTK tokens so you can test the platform.
          You will receive 20 MTK
        </p>
        {status === 'success' ? (
          <div>
            <p className="font-bold text-green-500">
              Successfully minted 20 MTK! ✔️
            </p>
          </div>
        ) : (
          <Button loading={status === 'loading'} onClick={onMint}>
            Mint
          </Button>
        )}
        {status === 'error' && (
          <p className="text-red-500">Error: {error?.message}</p>
        )}
      </div>
    </Container>
  )
}

MintPage.getLayout = getDefaultLayout

export default MintPage
