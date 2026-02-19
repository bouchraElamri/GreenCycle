import React from 'react'
import Navbar from '../../components/layouts/Navbar';
import Footer from '../../components/layouts/Footer';
const HomePage = () => {
  return (
    <div className='min-h-screen flex flex-col'>
      <Navbar />
      <button className='flex-1 lg:text-white lg:mt-28'> click here</button>
      <Footer />
    </div>
  )
}

export default HomePage