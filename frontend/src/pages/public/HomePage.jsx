import React from 'react'
import Navbar from '../../components/layouts/Navbar';
import Footer from '../../components/layouts/Footer';
import Hero from '../../components/LandingPage/hero';
const HomePage = () => {
  return (
    <div className='min-h-screen flex flex-col'>
      <Navbar />
      <Hero/>
      <Footer />
    </div>
  )
}

export default HomePage