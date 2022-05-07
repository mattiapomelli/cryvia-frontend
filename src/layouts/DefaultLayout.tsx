import React, { ReactNode } from 'react'

import Navbar from '@components/Layout/Navbar'
import Footer from '@components/Layout/Footer'

interface DefaultLayoutProps {
  children: ReactNode
}

const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  )
}

export const getDefaultLayout = (page: ReactNode) => {
  return <DefaultLayout>{page}</DefaultLayout>
}

export default DefaultLayout
