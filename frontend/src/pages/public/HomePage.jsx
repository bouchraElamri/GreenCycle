import React from 'react'
import MainLayout from '../../components/layouts/MainLayout'
import Hero from '../../components/LandingPage/hero'
import Categories from '../../components/LandingPage/Categories'
import Offers from '../../components/LandingPage/Offers'
import NewestProducts from '../../components/LandingPage/NewestProducts'
import Form from '../../components/LandingPage/Form'

const HomePage = () => {
  return (
    <>
    <MainLayout>
    <div className=" min-h-screen flex flex-col">
      <Hero/>
      <Categories/>
      <NewestProducts></NewestProducts>
      <Offers/>
      <Form/>
    </div>
    </MainLayout>
    </>
  )
}

export default HomePage
