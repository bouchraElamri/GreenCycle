import React from 'react'
import MainLayout from '../../components/layouts/MainLayout'
import Hero from '../../components/LandingPage/hero'
import Categories from '../../components/LandingPage/Categories'

const HomePage = () => {
  return (
    <>
    <MainLayout>
    <div className=" min-h-screen flex flex-col">
      <Hero/>
      <Categories/>
    </div>
    </MainLayout>
    </>
  )
}

export default HomePage