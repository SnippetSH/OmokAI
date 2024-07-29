import { useNavigate } from "react-router-dom"
import { useState, useEffect, useRef } from "react";
import github from '../assets/github_logo.png';
import '../index.css';

type Login = false | string

export default function Main({ setWB, setDiff, diff, isLogin }: { isLogin: Login, setWB: (x: boolean) => void, setDiff: (x: number) => void, diff: number }) {
  const navigate = useNavigate();
  const [warning, setWarning] = useState(false);
  const NavAndsetWB = (x: boolean) => {
    setWB(x)
    navigate('/board')
  }
  const difficultyRefs = useRef<HTMLButtonElement>(null);
  const [diffHeight, setDiffHeight] = useState(0);

  useEffect(() => {
    if (window.innerWidth <= 900) {
      setWarning(true)
    }

    if (difficultyRefs.current) {
      setDiffHeight(difficultyRefs.current.offsetHeight);
    }

    const handleResize = () => {
      if (difficultyRefs.current) {
        setDiffHeight(difficultyRefs.current.offsetHeight);
      }
    }

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [])

  const handleLogin = () => {
    navigate('/login')
  }

  return (
    <div className="w-full h-full flex flex-col justify-center items-center relative">
      {
        isLogin ? <div className='absolute top-5 left-5 text-white text-xl p-0.5 text-center newfont'> {isLogin} </div> : <div className='absolute top-5 left-5'>
          <button onClick={handleLogin} className='p-2 bg-button-indigo/75 rounded-xl border-1 border-button-border-indigo hover:bg-button-indigo/95'>
            <p className='text-white text-xl p-0.5 text-center newfont'> Sign In </p>
          </button>
        </div>
      }

      {
        warning ?
          <div className='text-white absolute top-24 left-1/2 transform -translate-x-1/2 above-450:w-1/3 under-450:w-1/2 bg-red-300/75 p-2 rounded-lg'>
            <h1 className='text-lg under-350:text-sm text-center onefont text-stroke text-pretty break-keep'>주의: 화면 가로 크기가 너무 작을 경우 게임이 올바르게 동작하지 않을 수 있습니다.</h1>
            <p className='text-xs under-350:text-xxs text-center mt-3 onefont s-text-stroke text-pretty'>화면 크기에 따른 버그 제보의 경우, gccs457@naver.com으로 제보해주세요.</p>
          </div> : null
      }
      <div className="absolute top-3 right-5">
        <button className="mb-5">
          <a className="flex items-center" href="https://github.com/SnippetSH/OmokAI.git">
            <img src={github} width={'40px'} className="rounded-full mx-3" />
            <h1 className="text-2xl pt-1 text-white text-center newfont"> SnippetSH.io </h1>
          </a>
        </button>
      </div>
      <div className="absolute xl:right-5 max-xl:bottom-6">
        <div className="flex flex-col justify-start items-center">
          <div className="text-base text-white my-3 font-bold yangfont text-center"> Choose Difficulty <br />
            <h2 className="onefont text-sm font-thin"> (Default: ★★☆) </h2>
          </div>
          <div className="flex xl:flex-col max-xl:flex-row justify-center items-center">
            <button onClick={() => setDiff(1)} ref={difficultyRefs} className="w-3/4 hover:bg-blue-400/80  flex flex-col items-center text-black p-1 py-2 my-2 rounded-xl border-0.5 border-blue-400/75 text-center max-sm:text-sm sm:text-lg bg-blue-300/80">
              <span className="text-center"> ★☆☆ </span> <span className="yangfont max-sm:text-xs sm:text-sm"> Trained Dataset: 4.3M </span>
            </button>
            <button onClick={() => setDiff(0)} style={{ 'height': diffHeight }} className="w-3/4 hover:bg-blue-400/80  flex flex-col items-center text-black p-1 py-2 my-2 rounded-xl border-0.5 border-blue-400/75 text-center max-sm:text-sm sm:text-lg bg-blue-300/80">
              <span className="text-center"> ★★☆ </span> <span className="yangfont max-sm:text-xs sm:text-sm"> Trained Dataset: 5.5M </span>
            </button>
            <button onClick={() => setDiff(2)} style={{ 'height': diffHeight }} className="w-3/4 hover:bg-blue-400/80  flex flex-col items-center text-black p-1 py-2 my-2 rounded-xl border-0.5 border-blue-400/75 text-center max-sm:text-sm sm:text-lg bg-blue-300/80">
              <span className="text-center"> ★★★ </span> <span className="yangfont max-sm:text-xs sm:text-sm"> Trained Dataset: 12M </span>
            </button>
          </div>
          <h3 className="onefont text-xs text-white text-center my-1"> Current: {diff === 0 ? "★★☆" : diff === 1 ? "★☆☆" : "★★★"} </h3>
        </div>
      </div>
      <h1 className="text-center max-sm:text-xl sm:text-4xl under-350:text-base text-white w-1/5 my-10 px-3 py-3 border-2 border-gray-300/35 rounded-xl newfont"> OMOK </h1>
      <div className="mb-5 w-1/6 flex justify-center text-xl bg-gray-400/30 text-nowrap text-white rounded-lg items-center">
        <p className="text-black p-2 pb-1 yangfont text-center under-350:text-base">흑</p>
        <p className="text-black py-2 pb-1 yangfont text-center under-350:text-base">/</p>
        <p className="text-white p-2 pb-1 yangfont text-center under-350:text-base">백</p>
      </div>
      <div>
        <button onClick={() => NavAndsetWB(true)} className="text-white m-5 p-5 pb-4 bg-black/70 w-24 h-24 rounded-full text-xl yangfont">흑</button>
        <button onClick={() => NavAndsetWB(false)} className="text-black m-5 p-5 pb-4 bg-white/90 w-24 h-24 rounded-full text-xl yangfont">백</button>
      </div>
    </div>
  )
}