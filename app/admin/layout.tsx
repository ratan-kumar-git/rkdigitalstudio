import Footer from '@/components/layout/Footer'
import Navbar from '@/components/layout/Navbar'
import React from 'react'

const AdminLayout = ({ children } : { children: React.ReactNode}) => {
  return (
    <>
        <Navbar />
        <main className="pt-[69px]">{children}</main>
        <Footer />

    </>
  )
}

export default AdminLayout