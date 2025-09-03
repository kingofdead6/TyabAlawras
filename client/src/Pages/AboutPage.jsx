import React from 'react'
import AboutIntro from '../components/AboutUs/About'
import AboutTimeline from '../components/AboutUs/AboutTimeline'
import ShopLocationPage from '../components/AboutUs/ShopLocation'

const AboutPage = () => {
  return (
    <div>
        <AboutIntro />
        <AboutTimeline />
        <ShopLocationPage />
    </div>
  )
}

export default AboutPage