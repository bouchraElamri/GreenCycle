import React from 'react'
import MainLayout from '../../components/layouts/MainLayout'
import Hero from '../../components/LandingPage/hero'

const HomePage = () => {
  return (
    <>
    <MainLayout>
    <div className=" min-h-screen flex flex-col">
      <Hero/>
    </div>
    </MainLayout>
    </>
  )
}

export default HomePage