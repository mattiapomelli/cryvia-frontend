import MyTokenAbi from '@abis/contracts/MyToken.json'
import { TOKEN_ADDRESS } from '@constants/addresses'
import { CHAIN } from '@constants/chains'
import { TransactionReceipt } from '@ethersproject/providers'
import { useContractWrite, useWaitForTransaction } from 'wagmi'

type Status = 'error' | 'success' | 'idle' | 'loading'

// TODO: add 'waitingConfirmation' status?
const getStatus = (writeStatus: Status, confirmationStatus: Status): Status => {
  if (writeStatus === 'idle') {
    return 'idle'
  }

  if (writeStatus === 'loading' || confirmationStatus === 'loading') {
    return 'loading'
  }

  if (writeStatus === 'error' || confirmationStatus === 'error') {
    return 'error'
  }

  if (writeStatus === 'success' && confirmationStatus === 'success') {
    return 'success'
  }

  return 'idle'
}

interface UseTokenContractWriteArgs {
  functionName: string
  onSuccess?: (data: TransactionReceipt) => void
}

const useTokenContractWrite = ({
  functionName,
  onSuccess,
}: UseTokenContractWriteArgs) => {
  const {
    write,
    status: writeStatus,
    error: writeError,
    data: writeData,
  } = useContractWrite({
    addressOrName: TOKEN_ADDRESS[CHAIN],
    contractInterface: MyTokenAbi.abi,
    functionName,
  })

  const {
    data,
    status: confirmationStatus,
    error: confirmationError,
  } = useWaitForTransaction({
    hash: writeData?.hash,
    onSuccess,
  })

  return {
    write,
    data,
    error: writeError || confirmationError,
    status: getStatus(writeStatus, confirmationStatus),
  }
}

export default useTokenContractWrite
