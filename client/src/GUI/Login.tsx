import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';
import axios from 'axios';

type Show = string | false

export default function Login({ setLogin }: { setLogin: (loginState: string) => void }) {
  const nav = useNavigate();
  const [id, setId] = useState('');
  const [pass, setPass] = useState('');
  const [name, setName] = useState('');

  const [show, setShow] = useState<Show>(false);
  const [newShow, setNewShow] = useState<Show>(false);

  const handleSignin = async () => {
    if (id === '' || pass === '') {
      setShow("Enter id and password")
      return;
    }
    await axios.get('/api/signin',
      {
        params: {
          id: id,
          password: pass
        }
      }
    ).then(
      res => {
        if (res.data.isSuc === 'Success') {
          console.log(res.data.name);
          setLogin(res.data.name);
          nav('/');
        } else {
          console.log("로그인 하지 못했습니다.")
          setShow("Invalid id or password")
        }
      }
    ).catch(
      () => console.log("정보를 보내지 못했습니다.")
    )
  }

  const handleSignup = async () => {
    if (id === '' || pass === '' || name === '') {
      setNewShow("Enter id, password and name")
      return;
    }
    await axios.post('/api/signup',
      {
        name: name,
        id: id,
        password: pass
      }
    ).then(r => {
      if (r.data.isSuc === 'Success') {
        setLogin(r.data.name);
        nav('/');
      } else {
        setNewShow(`${r.data.name} is already exists.`)
      }
    }).catch(
      () => console.log("정보를 보내지 못했습니다.")
    )
  }

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="w-1/2 h-1/2 border-1.5 border-gray-300/30 rounded-lg flex flex-row items-center justify-center">
        <div className='flex flex-col w-2/3 h-full items-center justify-center'>
          <h1 className="text-center text-white newfont text-3xl">
            Sign In
          </h1>
          <input
            type='text'
            name='id'
            placeholder='Your ID'
            autoFocus={true}
            required={true}
            onChange={(e) => setId(e.target.value)}
            className='bg-dark-indigo m-10 mb-1 p-2 border-1 border-gray-300/60 rounded-xl text-white' />
          <input
            type='text'
            name='password'
            placeholder='Your Password'
            autoFocus={false}
            required={true}
            onChange={(e) => setPass(e.target.value)}
            className='bg-dark-indigo m-5 mt-1 p-2 border-1 border-gray-300/60 rounded-xl text-white' />

          <div className='w-full flex items-center justify-center relative'>
            {show ?
              <div className='-top-1 border-red-200/55 border-b-1 text-red-700 p-2 rounded-lg text-center text-xs absolute'>
                {show}
              </div> :
              null}
            <button onClick={handleSignin} className='w-1/5 mt-9 text-white newfont text-lg border-2 border-button-border-indigo bg-button-indigo/75 hover:bg-button-indigo/90 p-2 rounded-xl'>
              Login
            </button>
          </div>
        </div>
        <div className='h-5/6 border-l-1.5 border-gray-300/30'></div>
        <div className='flex flex-col w-1/3 jusitfy-center items-center'>
          <h1 className="text-center text-white newfont text-xl">
            Sign Up
          </h1>
          <input
            type='text'
            name='name'
            placeholder='Your nickname'
            autoFocus={false}
            required={true}
            onChange={(e) => setName(e.target.value)}
            className='bg-dark-indigo m-5 mt-8 mb-2 p-2 border-1 border-gray-300/60 rounded-xl text-white' />
          <input
            type='text'
            name='id'
            placeholder='Your id'
            autoFocus={false}
            required={true}
            onChange={(e) => setId(e.target.value)}
            className='bg-dark-indigo m-5 my-2 p-2 border-1 border-gray-300/60 rounded-xl text-white' />
          <input
            type='text'
            name='password'
            placeholder='Your password'
            autoFocus={false}
            required={true}
            onChange={(e) => setPass(e.target.value)}
            className='bg-dark-indigo m-5 mt-2 p-2 border-1 border-gray-300/60 rounded-xl text-white' />

          <div className='w-full flex items-center justify-center relative'>
            {newShow ?
              <div className='-top-1 border-red-200/55 border-b-1 text-red-700 p-2 rounded-lg text-center text-xs absolute'>
                {newShow}
              </div> :
              null}
            <button onClick={handleSignup} className='w-1/3 mt-9 text-white newfont text-lg border-2 border-button-border-indigo bg-button-indigo/75 hover:bg-button-indigo/90 p-2 rounded-xl'>
              sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}