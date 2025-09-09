import React from 'react'
import AboutIntro from '../components/AboutUs/About'
import AboutTimeline from '../components/AboutUs/AboutTimeline'
import ShopLocationPage from '../components/AboutUs/ShopLocation'
import Videos from '../components/AboutUs/Videos'

const AboutPage = () => {
  return (
    <div>
        <AboutIntro />
        <AboutTimeline />
        <Videos />
        <ShopLocationPage />
    </div>
  )
}

export default AboutPage