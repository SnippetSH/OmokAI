import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react";
import github from '../assets/github_logo.png';
import '../index.css';

export default function Main({ setWB, setDiff }: { setWB: (x: boolean) => void, setDiff: (x: boolean) => void }) {
  const navigate = useNavigate();
  const [warning, setWarning] = useState(false);
  const NavAndsetWB = (x: boolean) => {
    setWB(x)
    navigate('/board')
  }

  useEffect(() => {
    if (window.innerWidth <= 900) {
      setWarning(true)
    }
  }, [])

  return (
    <div className="w-full h-full flex flex-col justify-center items-center relative">
      {
        warning ?
          <div className='text-white absolute top-16 left-1/2 transform -translate-x-1/2 w-1/3 bg-red-300/75 p-2 rounded-lg'>
            <h1 className='text-lg text-center onefont text-stroke text-pretty break-keep'>주의: 화면 가로 크기가 너무 작을 경우 게임이 올바르게 동작하지 않을 수 있습니다.</h1>
            <p className='text-xs text-center mt-3 onefont s-text-stroke text-pretty'>화면 크기에 따른 버그 제보의 경우, gccs457@naver.com으로 제보해주세요.</p>
          </div> : null
      }
      <div className="absolute top-3 right-5 flex flex-col h-1/2 items-center justify-center">
        <button className="h-1/2 flex items-start">
          <a className="flex items-center" href="https://github.com/SnippetSH/OmokAI.git">
            <img src={github} width={'40px'} className="rounded-full mx-3"/>
            <h1 className="text-2xl pt-1 text-white text-center newfont"> SnippetSH.io </h1>
          </a>
        </button>
        <div className="h-1/2 flex flex-col justify-start items-center">
          <button onClick={() => setDiff(true) } className="text-white p-10">
            78%
          </button>
          <button onClick={() => setDiff(false)} className="text-white p-10">
            64%
          </button>
        </div>
      </div>
      <h1 className="text-center text-4xl text-white w-1/5 my-10 px-3 py-3 border-2 border-gray-300/35 rounded-xl newfont"> OMOK </h1>
      <div className="mb-5 w-1/6 flex justify-center text-xl bg-gray-400/30 text-nowrap text-white rounded-lg items-center">
        <p className="text-black p-2 pb-1 yangfont text-center">흑</p>
        <p className="text-black py-2 pb-1 yangfont text-center">/</p>
        <p className="text-white p-2 pb-1 yangfont text-center">백</p>
      </div>
      <div>
        <button onClick={() => NavAndsetWB(true)} className="text-white m-5 p-5 pb-4 bg-black/70 w-24 h-24 rounded-full text-xl yangfont">흑</button>
        <button onClick={() => NavAndsetWB(false)} className="text-black m-5 p-5 pb-4 bg-white/90 w-24 h-24 rounded-full text-xl yangfont">백</button>
      </div>
    </div>
  )
}