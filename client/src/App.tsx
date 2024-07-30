import Main from './GUI/Main'
import './index.css'
import { Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import Board from './GUI/Board'
import Login from './GUI/Login'
import List from './GUI/List'

type Login = false | string

function App() {

  const [WB, setWB] = useState(true) //true: black, false: white
  const [diff, setDiff] = useState(0); //0: middle, 1: easy, 2: hard
  const setBlackorWhite = (x: boolean) => {
    setWB(x);
  }

  const [isLogin, setIsLogin] = useState<Login>(() => {
    const savedLogin = localStorage.getItem('isLogin');
    return savedLogin ? JSON.parse(savedLogin) : false;
  });

  const handleLogin = (loginState: string) => {
    setIsLogin(loginState);
    localStorage.setItem('isLogin', JSON.stringify(loginState));
  }

  return (
    <div className='w-screen h-screen bg-dark-indigo relative'>
      <Routes>
        <Route path='/' element={<Main setWB={setBlackorWhite} setDiff={setDiff} diff={diff} isLogin={isLogin} />} />
        <Route path='/board' element={<Board WB={WB} diff={diff} />} />
        <Route path='/login' element={<Login setLogin={handleLogin} />} />
        <Route path='/list' element={<List isLogin={isLogin ? isLogin : ''}/> } />
      </Routes>
    </div>
  )
}

export default App
