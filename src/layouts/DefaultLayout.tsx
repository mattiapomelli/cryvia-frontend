import React, { ReactNode } from 'react'

import Navbar from '@components/Layout/Navbar'
import Footer from '@components/Layout/Footer'
import Container from '@components/Layout/Container'
import Link from 'next/link'

interface DefaultLayoutProps {
  children: ReactNode
}

const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pb-20">
        <Container>
          <div className="mt-2 bg-blue-100 text-primary p-3 rounded-xl text-center">
            Go{' '}
            <Link href="/mint">
              <a className="underline font-bold">here</a>
            </Link>{' '}
            to mint some free tokens to test the platform
          </div>
        </Container>
        {children}
      </main>
      <Footer />
    </div>
  )
}

export const getDefaultLayout = (page: ReactNode) => {
  return <DefaultLayout>{page}</DefaultLayout>
}

export default DefaultLayout
