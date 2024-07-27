import { useNavigate } from "react-router-dom"
import github from '../assets/github_logo.png';
import '../index.css';

export default function Main({ setWB }: { setWB: (x: boolean) => void }) {
  const navigate = useNavigate();
  const NavAndsetWB = (x: boolean) => {
    setWB(x)
    navigate('/board')
  }

  return (
    <div className="w-full h-full flex flex-col justify-center items-center relative">
      <div className="absolute top-3 right-5">
        <button>
          <a className="flex items-center" href="https://github.com/SnippetSH/Calculator.git">
            <img src={github} width={'40px'} className="rounded-full mx-3"/>
            <h1 className="text-2xl pt-1 text-white text-center newfont"> SnippetSH.io </h1>
          </a>
        </button>
      </div>
      <h1 className="text-center text-4xl text-white w-1/5 my-10 px-3 py-3 border-2 border-gray-300/35 rounded-xl newfont"> OMOK </h1>
      <div className="mb-5 w-1/6 flex justify-center text-xl bg-gray-400/30 text-nowrap text-white rounded-lg">
        <p className="text-black px-2 font-bold">흑</p>
        <p className="text-black">/</p>
        <p className="text-white px-2 font-bold">백</p>
      </div>
      <div>
        <button onClick={() => NavAndsetWB(true)} className="text-white m-5 p-5 bg-black/70 w-24 h-24 rounded-full text-lg">흑</button>
        <button onClick={() => NavAndsetWB(false)} className="text-black m-5 p-5 bg-white/90 w-24 h-24 rounded-full text-lg">백</button>
      </div>
    </div>
  )
}