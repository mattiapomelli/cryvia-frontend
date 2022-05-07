import Container from '@components/Layout/Container'
import { getDefaultLayout } from '@layouts/DefaultLayout'
import { PageWithLayout } from 'types'

const HomePage: PageWithLayout = () => {
  return <Container>Home</Container>
}

HomePage.getLayout = getDefaultLayout

export default HomePage
