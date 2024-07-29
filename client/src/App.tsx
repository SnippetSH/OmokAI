import Main from './GUI/Main'
import './index.css'
import { Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import Board from './GUI/Board'

function App() {

  const [WB, setWB] = useState(true) //true: black, false: white
  const [diff, setDiff] = useState(false); //flase: easy, true: hard
  const setBlackorWhite = (x: boolean) => {
    setWB(x);
  }

  return (
    <div className='w-screen h-screen bg-dark-indigo relative'>
      <Routes>
        <Route path='/' element={<Main setWB={setBlackorWhite} setDiff={setDiff}/>} />
        <Route path='/board' element={<Board WB={WB} diff={diff} />} />
      </Routes>
    </div>
  )
}

export default App
