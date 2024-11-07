import { useState } from 'react'

import './App.css'
import Uploader  from './components/Uploader/Uploader'
import ImageGallery from './components/ImagesList/ImagesList'
import CelebrityRecognition from './components/CelebrityRecognition'

function App() {

  return (
    <>
      <Uploader/>
      {/* <ImageGallery/> */}
      <CelebrityRecognition/>
    </>
  )
}

export default App
