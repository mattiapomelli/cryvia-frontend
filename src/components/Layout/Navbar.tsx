import Container from '@components/Layout/Container'
import Logo from '@components/Logo'
import WalletStatus from '@components/WalletStatus'

const Navbar = () => {
  return (
    <header className="py-4">
      <Container className="flex justify-between items-center w-full">
        <Logo />
        <WalletStatus />
      </Container>
    </header>
  )
}

export default Navbar
