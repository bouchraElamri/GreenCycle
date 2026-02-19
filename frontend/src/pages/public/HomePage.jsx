import React from 'react'
import Navbar from '../../components/layouts/Navbar';
import Footer from '../../components/layouts/Footer';
const HomePage = () => {
  return (
    <div className='min-h-screen flex flex-col'>
      <Navbar />
      <div className='flex-1'></div>
      <Footer />
    </div>
  )
}

export default HomePage