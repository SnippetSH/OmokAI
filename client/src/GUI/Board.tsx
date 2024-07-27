import React, { useState, useRef, useEffect } from 'react';
import { checkBanPut } from '../API/omokCheckAPI';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../index.css';

type Stone = "Black" | "White" | null;

export default function Board({ WB }: { WB: boolean }) {
  const boardSize = 15;
  const canv_mg = 20;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvTag, setCanvTag] = useState<HTMLCanvasElement>();
  const [isBlackTurn, setIsBlackTurn] = useState(true);
  const [game_size, setGameSize] = useState<number>(0);
  const [board, setBoard] = useState<number[][]>(
    Array(boardSize).fill(0).map(() => Array(boardSize).fill(0))
  ); // 1: black, 0: none, -1: white
  const [win, setWin] = useState<Stone>(null);

  const nav = useNavigate();
  useEffect(() => {
    if (win !== null) {
      console.log("win");
      setMsg(`${win} is Win!<br/>The board will be clear.`);

      setTimeout(() => {
        nav('/');
      }, 2000)
    }
  }, [win]);

  const drawStone = (ctx: CanvasRenderingContext2D, _x: number, _y: number) => {
    ctx.beginPath();
    const stone_size = (game_size / (boardSize - 1));
    // 돌 그릴 좌표에 판 여백 좌표 만큼 더하는 처리들
    var x = _x * stone_size + canv_mg;
    var y = _y * stone_size + canv_mg;

    ctx.arc(x, y, stone_size / 2, 0, Math.PI * 2);
    ctx.closePath();

    // 선수 변경시 사용자에게 보이는 색깔만 변경
    if (isBlackTurn) {
      ctx.fillStyle = "#000";
    } else {
      ctx.fillStyle = "#FFFFFF";
    }

    ctx.fill();
  };

  const drawBoard = (canv: HTMLCanvasElement) => {
    const ctx = canv.getContext('2d') as CanvasRenderingContext2D;

    if (ctx) {
      ctx.clearRect(0, 0, canv.width, canv.height);

      ctx.fillStyle = '#D2D2D2'
      ctx.fillRect(0, 0, canv.width, canv.height);
      ctx.strokeStyle = '#000';

      for (let x = canv_mg; x <= canv.width - canv_mg * 2; x += (game_size / (boardSize - 1))) {
        for (let y = canv_mg; y <= canv.width - canv_mg * 2; y += (game_size / (boardSize - 1))) {
          ctx.strokeRect(x, y, ((canv.width - canv_mg) / (boardSize - 1)), ((canv.width - canv_mg) / (boardSize - 1)));
        }
      }

      ctx.beginPath();
      ctx.closePath();
      ctx.fillStyle = "#000000";
      ctx.fill();
    }
  }

  useEffect(() => {
    let canv: HTMLCanvasElement;
    setWin(null);
    if (canvasRef.current) {
      canv = canvasRef.current;
      canv.width = window.innerWidth * 0.5;
      canv.height = canv.width;
      setCanvTag(canv);
      setGameSize(canv.width - canv_mg * 2);
    } else {
      console.log('Some Error is Defined')
    }
  }, []);

  useEffect(() => {
    async function TMPFunc() {
      try {
        console.log("get 요청")
        const res = await axios.get('/api/ai-move',
          {
            params: {
              board: JSON.stringify(board)
            }
          }
        )
        console.log(res.data);
        AIMoveHandle(res.data.output_x, res.data.output_y)
      } catch (e) {
        console.log("Error fetching AI move:", e)
      }
    }

    if (canvTag) {
      drawBoard(canvTag);
      if (!WB) {
        let tmp = false;
        for (let i = 0; i < board.length; i++) {
          for (let j = 0; j < board.length; j++) {
            if (board[i][j] === 1 || board[i][j] === -1) {
              tmp = true;
              break;
            }
          }
          if (tmp) {
            break;
          }
        }

        if (!tmp) {
          TMPFunc();
        }
      }
    }
  }, [canvTag, game_size]);

  const [msg, setMsg] = useState('');

  const handleCanvasClick = async (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (canvTag) {
      const rect = canvTag.getBoundingClientRect();
      const ctx = canvTag.getContext('2d') as CanvasRenderingContext2D;
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;

      let x = 0, y = 0;
      const sz = (game_size / (boardSize - 1));

      let a = (offsetX - canv_mg) % sz;
      let b = (offsetY - canv_mg) % sz;

      if (a <= sz / 2) {
        x = offsetX - a;
      } else {
        x = offsetX + (sz - a);
      }

      if (b <= sz / 2) {
        y = offsetY - b;
      } else {
        y = offsetY + (sz - b);
      }

      x = Math.round(x / sz);
      y = Math.round(y / sz);

      if (x > boardSize) x = boardSize;
      if (y > boardSize) y = boardSize;

      console.log("x:", x, "\ny:", y);
      const tmpBoard = [...board];
      if (tmpBoard[y][x] === 0) {
        tmpBoard[y][x] = isBlackTurn ? 1 : -1;

        let result = checkBanPut(x, y, tmpBoard, isBlackTurn);
        if (result === false) {
          console.log("거기 안 됑.")
          setMsg(`(${x}, ${y}) is Invaild`)
          return;
        }

        setIsBlackTurn(!isBlackTurn);
        setBoard(tmpBoard);
        drawStone(ctx, x, y);

        if (result === true) {
          setTimeout(() => { setWin(isBlackTurn ? "Black" : "White"); }, 0);
        }
      }
    }
  };

  useEffect(() => {
    console.log(isBlackTurn);
    async function getAIMove() {
      if (WB && !isBlackTurn) {
        console.log(JSON.stringify(board));
        try {
          console.log("get 요청")
          const res = await axios.get('/api/ai-move',
            {
              params: {
                board: JSON.stringify(board)
              }
            }
          )
          console.log(res.data);
          AIMoveHandle(res.data.output_x, res.data.output_y)
        } catch (e) {
          console.log("Error fetching AI move:", e)
        }
      } else if (!WB && isBlackTurn) {
        console.log(JSON.stringify(board));
        try {
          console.log("get 요청")
          const res = await axios.get('/api/ai-move',
            {
              params: {
                board: JSON.stringify(board)
              }
            }
          )
          console.log(res.data);
          AIMoveHandle(res.data.output_x, res.data.output_y)
        } catch (e) {
          console.log("Error fetching AI move:", e)
        }
      }
    }

    let tmp = false;
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board.length; j++) {
        if (board[i][j] === 1 || board[i][j] === -1) {
          tmp = true;
          break;
        }
      }
      if (tmp) {
        break;
      }
    }

    if (tmp) {
      getAIMove();
    }
  }, [isBlackTurn])

  const AIMoveHandle = async (_x: number, _y: number) => {
    const tmpBoard = [...board];

    if (canvTag && isBlackTurn !== WB) {
      const ctx = canvTag.getContext('2d') as CanvasRenderingContext2D;
      if (tmpBoard[_y][_x] === 0) {
        tmpBoard[_y][_x] = isBlackTurn ? 1 : -1;

        let result = checkBanPut(_x, _y, tmpBoard, isBlackTurn);
        if (result === false) {
          try {
            console.log("get 다시 요청")
            const res = await axios.get('/api/ai-move',
              {
                params: {
                  board: JSON.stringify(tmpBoard)
                }
              }
            )
            console.log(res.data);

            AIMoveHandle(Number(res.data["output_x"]), Number(res.data["output_y"]))
          } catch (e) {
            console.log("Error fetching AI move:", e)
          }
        } else {
          drawStone(ctx, _x, _y);
          setBoard(tmpBoard);
          setIsBlackTurn(!isBlackTurn);


          if (result === true) {
            setTimeout(() => { setWin(isBlackTurn ? "Black" : "White"); }, 0);
          }
        }
      }
    }
  }

  useEffect(() => {
    let a = setTimeout(() => setMsg(''), 3000);
    return (() => clearTimeout(a));
  }, [msg])

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className='flex justify-center items-center relative'>
        <div className='absolute -left-36 h-1/3'>
          <div className='bg-blue-200/65 text-center my-5 py-1 rounded-lg text-white'> <p className={`${WB ? 'text-black' : 'text-white'} font-bold`}> {WB ? "Black" : "White"} </p> </div>
          <div className='text-center text-white w-28 h-1/2 border-white/75 border-1 rounded-md'>
            <h3 className='text-lg my-1 mx-2 border-b-0.5 border-white/45 font-extrabold'> Log </h3>
            <p className='text-sm my-2 px-1 text-red-400' dangerouslySetInnerHTML={{ __html: msg }}></p>
          </div>
          <button onClick={() => nav('/')} className='newfont text-lg text-white text-center w-28 my-8 py-3 bg-red-300/95 border-2 border-red-300/85 rounded-lg hover:bg-red-400 hover:border-red-500/55'> Return to Main </button>
        </div>
        <canvas ref={canvasRef} onClick={handleCanvasClick}></canvas>
      </div>
    </div>
  )
}