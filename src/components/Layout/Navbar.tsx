import { Transition } from '@headlessui/react'

import Container from '@/components/Layout/Container'
import Logo from '@/components/Logo'
import WalletStatus from '@/components/Wallet/WalletStatus'
import { UserStatus, useUser } from '@/contexts/AuthProvider'
import useTransitionControl from '@/hooks/useTransitionControl'

const Navbar = () => {
  const { status } = useUser()
  const [show] = useTransitionControl(status === UserStatus.Loading)

  return (
    <header className="flex items-center h-20">
      <Container className="flex justify-between items-center w-full">
        <Logo />
        <Transition
          show={show}
          enter="transition-opacity duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <WalletStatus />
        </Transition>
      </Container>
    </header>
  )
}

export default Navbar
