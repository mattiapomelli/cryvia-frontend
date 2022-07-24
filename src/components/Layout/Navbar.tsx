import Container from '@/components/Layout/Container'
import Logo from '@/components/Logo'
import WalletStatus from '@/components/WalletStatus'
import { UserStatus, useUser } from '@/contexts/AuthProvider'

const Navbar = () => {
  const { status } = useUser()

  return (
    <header className="py-4">
      <Container className="flex justify-between items-center w-full">
        <Logo />
        {status !== UserStatus.Loading && <WalletStatus />}
      </Container>
    </header>
  )
}

export default Navbar
