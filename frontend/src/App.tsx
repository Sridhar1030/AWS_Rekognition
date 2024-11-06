import { useState } from 'react'

import './App.css'
import Uploader  from './components/Uploader/Uploader'
import ImageGallery from './components/ImagesList/ImagesList'

function App() {

  return (
    <>
      <Uploader/>
      <ImageGallery/>
    </>
  )
}

export default App
