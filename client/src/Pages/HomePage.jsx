import React from 'react'
import Hero from '../components/Home/Hero'
import Menu from '../components/Home/Menu'
import Gallery from '../components/Home/Gallery'
import Announcements from '../components/Home/Announcements'
import Contact from '../components/Home/Contact'
import OpeningTimes from '../components/Home/OpeningTimes'

const HomePage = () => {
  return (
    <div>
        <Hero />
        <Menu />
        <OpeningTimes />
        <Gallery />
        <Announcements />
        <Contact />
    </div>
  )
}

export default HomePage