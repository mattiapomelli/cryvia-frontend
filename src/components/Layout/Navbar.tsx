import Container from '@components/Layout/Container'
import Logo from '@components/Logo'
import WalletStatus from '@components/WalletStatus'
import { useUser } from '@contexts/AuthProvider'

const Navbar = () => {
  const { loading } = useUser()

  return (
    <header className="py-4">
      <Container className="flex justify-between items-center w-full">
        <Logo />
        {!loading && <WalletStatus />}
      </Container>
    </header>
  )
}

export default Navbar
