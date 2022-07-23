import Button from '@components/Button'
import Container from '@components/Layout/Container'
import { useWeb3Context } from '@contexts/Web3Provider'
import { useTokenContract } from '@hooks/useContract'
import useTransaction from '@hooks/useTransaction'
import { getDefaultLayout } from '@layouts/DefaultLayout'
import { ethers } from 'ethers'
import { useState } from 'react'
import { PageWithLayout } from 'types'

const MintPage: PageWithLayout = () => {
  const { updateBalance } = useWeb3Context()
  const tokenContract = useTokenContract()
  const [success, setSuccess] = useState(false)

  const { handleTransaction, pending } = useTransaction()

  const mint = async () => {
    if (!tokenContract) return

    const res = await handleTransaction(() =>
      tokenContract.mint(ethers.utils.parseEther('20')),
    )
    if (res) {
      setSuccess(true)
      updateBalance()
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
        {success ? (
          <div className="font-bold text-green-500">
            Successfully minted 20 MTK! ✔️
          </div>
        ) : (
          <Button loading={pending} onClick={mint}>
            Mint
          </Button>
        )}
      </div>
    </Container>
  )
}

MintPage.getLayout = getDefaultLayout

export default MintPage
