import Button from '@/components/UI/Button'
import Modal, { BaseModalProps } from '@/components/UI/Modal'
import { useUser } from '@/contexts/AuthProvider'

const VerifyAddressModal = ({ show, onClose }: BaseModalProps) => {
  const { verifyAddress } = useUser()

  const onVerify = async () => {
    await verifyAddress()
    onClose()
  }

  return (
    <Modal show={show} onClose={onClose}>
      <h4 className="font-bold text-xl mb-4">Verify your address</h4>
      <p className="mb-4">Please verify your address by signing a message</p>
      <div className="flex justify-end">
        <Button onClick={onVerify}>Verify</Button>
      </div>
    </Modal>
  )
}

export default VerifyAddressModal
