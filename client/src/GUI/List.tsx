import { useEffect, useState } from 'react';
import '../index.css';
import axios from 'axios';

type Board = number[][]

export default function List({isLogin}: {isLogin: string}) {
    const [list, setList] = useState<Board[] | string>([]);

    useEffect(() => {
        async function waitAxios() {
            await axios.get('/api/get-board', {
                params: {
                    name: isLogin
                }
            }).then(
                r => {
                    if(r.data.isSuc) {
                        console.log(typeof(r.data.board[0][0][0]))
                    } else {
                        setList("you don't have any history");
                    }
                }
            )
        }

        //waitAxios();
        setList([[
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, -1, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ]])
    }, [])

    const printList = (r: Board, idx: number):JSX.Element => {
        const pList: JSX.Element[] = [];
        const tmp: Board = r.map((v) => [...v])
        console.log(tmp);
        const pr: string[][] = Array.from({ length: 15 }, () => Array(15).fill(''));
        for(let i = 0; i < 15; i++) {
            for(let j = 0; j < 15; j++) {
                console.log(tmp[i][j])
                if(tmp[i][j] == -1) {
                    console.log("hi")
                    pr[i][j] = 'X ';
                } else if(tmp[i][j] == 0) {
                    pr[i][j] = '. ';
                } else if(tmp[i][j] == 1) {
                    pr[i][j] = 'O ';
                }
            }
        }

        pr.map((v, i) => {
            console.log(v);
            pList.push(<li key={i} className='flex flex-row'>{v.map(s => <p className='text-center px-2 m-1 p-1'>{s}</p>)}</li>)
        });
        let to = <ul className='text-white' key={idx}>{pList}</ul>;

        return to;
    }

    return (
        <div className="w-full h-full flex flex-col justify-center items-center">
            <div className="text-white cutefont text-center">Your play history <p className='text-xs'> name: {isLogin}</p> </div>
            <ul className='my-3 border-1.5 border-gray-300/35 rounded-md'>
                {
                    typeof(list) === "string" ? <div className='text-gray-400/75 cutefont p-5 my-10 text-sm'> {list} </div> : 
                    list.map((r, idx) => printList(r, idx))
                }
            </ul>
        </div>
    )
}