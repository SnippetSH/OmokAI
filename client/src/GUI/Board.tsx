import React, { useState, useRef, useEffect } from 'react';
import { is33, is44, isWin } from '../API/CurCheckAPI';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import '../index.css';

type Stone = "Black" | "White" | null;

export default function Board({ WB, diff }: { WB: boolean, diff: number }) {
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
  const [sessionID] = useState(uuidv4());
  const [stoneNumber, setStoneNumber] = useState(1);

  useEffect(() => {
    console.log("Your session ID:", sessionID);

    return () => {
      console.log('Ending session ID:', sessionID);

      axios.post('api/ai-reset', { session_id: sessionID })
        .then(res => {
          console.log('Session End:', res.data);
        })
        .catch(e => {
          console.log("Error ending session:", e);
        })
    }
  }, [sessionID]);

  const nav = useNavigate();
  useEffect(() => {
    if (win !== null) {
      //console.log("win");
      setMsg(`${win} is Win!`);
    }
  }, [win]);

  const drawStone = (ctx: CanvasRenderingContext2D, _x: number, _y: number) => {
    ctx.beginPath();
    const stone_size = (game_size / (boardSize - 1));
    // 돌 그릴 좌표에 판 여백 좌표 만큼 더하는 처리들
    
    var x = _x * stone_size + canv_mg;
    var y = _y * stone_size + canv_mg;

    if(window.innerWidth < 400) {
      x = _x * stone_size + 15;
      y = _y * stone_size + 15;
    }

    ctx.arc(x, y, stone_size / 2, 0, Math.PI * 2);
    ctx.closePath();

    // 선수 변경시 사용자에게 보이는 색깔만 변경
    if (isBlackTurn) {
      ctx.fillStyle = "#000";
    } else {
      ctx.fillStyle = "#FFFFFF";
    }

    ctx.fill();

    ctx.fillStyle = isBlackTurn ? '#FFF' : '#000';
    ctx.font = `${stone_size / 2.2}px 'oneMo`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    if(window.innerWidth > 400) {
      ctx.fillText(stoneNumber.toString(), x, y + 2);
    } else {
      ctx.fillText(stoneNumber.toString(), x, y + 0.7);
    }
  };

  const drawBoard = (canv: HTMLCanvasElement) => {
    const ctx = canv.getContext('2d') as CanvasRenderingContext2D;

    if (ctx) {
      ctx.clearRect(0, 0, canv.width, canv.height);

      ctx.fillStyle = '#D2D2D2'
      ctx.fillRect(0, 0, canv.width, canv.height);
      ctx.strokeStyle = '#000';

      console.log(canv.width, canv.height, canv_mg);
      console.log(game_size);
      console.log((game_size / (boardSize - 1)));

      if (window.innerWidth > 400) {
        const offset = canv_mg;
        for (let x = offset; x < canv.width - offset * 2; x += (game_size / (boardSize - 1))) {
          for (let y = offset; y < canv.width - offset * 2; y += (game_size / (boardSize - 1))) {
            ctx.strokeRect(x, y, ((canv.width - offset) / (boardSize - 1)), ((canv.width - offset) / (boardSize - 1)));
          }
        }
      } else {
        const offset = 15;
        for (let x = offset; x < canv.width - offset * 2; x += (game_size / (boardSize - 1))) {
          for (let y = offset; y < canv.width - offset * 2; y += (game_size / (boardSize - 1))) {
            ctx.strokeRect(x, y, ((canv.width - offset) / (boardSize - 1)), ((canv.width - offset) / (boardSize - 1)));
          }
        }
      }


      ctx.beginPath();
      ctx.closePath();
      ctx.fillStyle = "#000000";
      ctx.fill();
    }
  }

  useEffect(() => {
    console.log("diff is", diff);
    let canv: HTMLCanvasElement;
    setWin(null);
    if (canvasRef.current) {
      canv = canvasRef.current;
      if (window.innerWidth > 1280) {
        canv.width = window.innerWidth * 0.5;
      } else if (window.innerWidth > 400) {
        if (window.innerWidth > window.innerHeight) {
          canv.width = window.innerHeight * 0.8;
        } else {
          canv.width = window.innerWidth * 0.8;
        }
      } else {
        canv.width = window.innerWidth * 0.78;
      }
      canv.height = canv.width;
      setCanvTag(canv);
      if (window.innerWidth > 400) {
        setGameSize(canv.width - canv_mg * 2);
      } else {
        setGameSize(canv.width - 30);
      }
    } else {
      //console.log('Some Error is Defined')
    }
  }, [window.innerWidth]);

  const AIMove = async (again: boolean) => {
    if (win !== null) {
      return;
    }
    try {
      //console.log("get 요청")
      const res = await axios.get('api/ai-move',
        {
          params: {
            board: JSON.stringify(board),
            session_id: sessionID,
            diff: diff,
            again: again
          }
        }
      )
      //console.log(res.data);
      AIMoveHandle(res.data.output_x, res.data.output_y)
    } catch (e) {
      //console.log("Error fetching AI move:", e)
    }
  }

  useEffect(() => {
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
          AIMove(false);
        }
      }
    }
  }, [canvTag, game_size, canv_mg]);

  const [msg, setMsg] = useState('');

  const handleCanvasClick = async (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (canvTag && win === null) { // dev 모드 아니면 && isBlackTurn == WB 추가
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

      if (window.innerWidth <= 751) {
        x -= 1;
        y -= 1;
      }

      //console.log("x:", x, "\ny:", y);
      //console.log(board[y][x])
      const tmpBoard = board.map(v => [...v]);
      if (tmpBoard[y][x] === 0) {
        tmpBoard[y][x] = isBlackTurn ? 1 : -1;

        let resultWin = isWin(x, y, tmpBoard, isBlackTurn);
        let result33 = is33(x, y, tmpBoard, isBlackTurn ? "Black" : "White");
        let result44 = is44(x, y, tmpBoard, isBlackTurn ? "Black" : "White");
        if (resultWin) {
          setIsBlackTurn(!isBlackTurn);
          setBoard(tmpBoard);
          drawStone(ctx, x, y);

          setTimeout(() => { setWin(isBlackTurn ? "Black" : "White"); }, 0);
        } else {
          if (result33 && result44) {
            setIsBlackTurn(!isBlackTurn);
            setStoneNumber(stoneNumber + 1);
            setBoard(tmpBoard);
            drawStone(ctx, x, y);
          } else {
            if (!result33) {
              setMsg(`(${x}, ${y}) is Invaild, It is 33`);
            } else if (!result44) {
              setMsg(`(${x}, ${y}) is Invaild, It is 44`);
            }
          }
        }

        // if (result === true) {
        //   setTimeout(() => { setWin(isBlackTurn ? "Black" : "White"); }, 0);
        // }
      }
    }
  };

  useEffect(() => {
    //console.log(isBlackTurn);
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
      if(win === null) {
        if((WB && !isBlackTurn) || (!WB && isBlackTurn)) {
          AIMove(false)
        }
      }
    }
  }, [isBlackTurn])

  const AIMoveHandle = async (x: number, y: number) => {
    const tmpBoard = board.map(v => [...v]);

    if (canvTag && isBlackTurn !== WB) {
      const ctx = canvTag.getContext('2d') as CanvasRenderingContext2D;
      if (tmpBoard[y][x] === 0) {
        tmpBoard[y][x] = isBlackTurn ? 1 : -1;

        let resultWin = isWin(x, y, tmpBoard, isBlackTurn);
        let result33 = is33(x, y, tmpBoard, isBlackTurn ? "Black" : "White");
        let result44 = is44(x, y, tmpBoard, isBlackTurn ? "Black" : "White");
        if (resultWin) {
          setIsBlackTurn(!isBlackTurn);
          setBoard(tmpBoard);
          drawStone(ctx, x, y);

          setTimeout(() => { setWin(isBlackTurn ? "Black" : "White"); }, 0);
        } else {
          if (result33 && result44) {
            setIsBlackTurn(!isBlackTurn);
            setBoard(tmpBoard);
            drawStone(ctx, x, y);
            setStoneNumber(stoneNumber + 1);
          } else {
            AIMove(true);
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
      <div className="flex flex-col justify-center items-center relative">
        <canvas ref={canvasRef} onClick={handleCanvasClick} className="mt-10 xl:mt-0"></canvas>
        <div className="info-panel xl:absolute xl:-left-36 xl:top-auto top-full mt-4 xl:mt-0">
          <div className="cur-p max-xl:w-1/3 bg-blue-200/65 text-center my-5 py-1 rounded-lg text-white">
            <p className={`${WB ? 'text-black' : 'text-white'} font-bold text-center`}>{WB ? "Black" : "White"}</p>
          </div>
          <div className="max-xl:w-1/4 text-center text-white w-28 h-1/2 border-white/75 border-1 rounded-md">
            <h3 className="text-lg my-1 mx-2 border-b-0.5 border-white/45 font-extrabold">Log</h3>
            <p className="text-sm my-2 max-xl:h-16 xl:h-28 px-1 text-red-400" dangerouslySetInnerHTML={{ __html: msg }}></p>
          </div>
          <button onClick={() => nav('/')} className="max-xl:w-1/4 newfont max-xl:text-sm xl:text-lg text-white text-center w-28 my-8 py-3 bg-red-300/95 border-2 border-red-300/85 rounded-lg hover:bg-red-400 hover:border-red-500/55">Return to Main</button>
        </div>
      </div>
    </div>
  );
}