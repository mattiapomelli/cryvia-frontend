import React, { ReactNode } from 'react'
import Link from 'next/link'

import Container from '@/components/Layout/Container'
import Footer from '@/components/Layout/Footer'
import Navbar from '@/components/Layout/Navbar'

interface DefaultLayoutProps {
  children: ReactNode
}

const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pb-20">
        <Container>
          <div className="bg-blue-100 text-primary p-3 rounded-default text-center">
            Go{' '}
            <Link href="/mint">
              <a className="underline font-bold">here</a>
            </Link>{' '}
            to mint some free tokens to test the app
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
