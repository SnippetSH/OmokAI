type TurnMap<T extends boolean> = T extends true ? "Black" : "White";
const SIZE = 15

const isValid = (x: number, y: number): boolean => {
    if (x >= 0 && x < SIZE && y >= 0 && y < SIZE)
        return true;
    return false;
}

/** Check 33 */
const is33 = (_x: number, _y: number, board: number[][], isBlack: TurnMap<boolean>): boolean => {
    // 흰색 턴이면 체크하지 마셈.
    if (isBlack === "White") {
        return true;
    }

    let hor3 = false;
    let ver3 = false;
    let downDia3 = false;
    let upDia3 = false;

    {
        //가로 방향 체크
        //놓인 곳의 좌표를 기준으로 좌우로 뻗어나가면서 검은 돌의 갯수를 셈.
        //만약 1바로 다음이 -1이라면 막힌 걸로 판별, 해당 방향(좌 또는 우) 검은돌의 갯수를 0으로 설정.
        //만약 1바로 다음이 0이고, 그 다음이 다시 1이고, 그 다음이 0이라면 열린 33의 중간 과정 만족으로 판정.
        //좌우의 검정색을 합쳐서 정확히 3개라면 3이 하나 완성된 걸로 판별.
        let x = _x;
        let y = _y;
        let rightCnt = 0;
        let leftCnt = 0;

        //막혔냐?
        let isBreak = false;

        //우측
        for (let i = 1; i < 15; i++) {
            x += 1;
            if (isValid(x, y)) {
                if (board[y][x] === 1) {
                    rightCnt += 1;
                    //console.log("rightCnt:", x, y)
                    if ((isValid(x + 1, y) && board[y][x + 1] === -1) || !isValid(x + 1, y)) {
                        rightCnt = 0;
                        isBreak = true;
                        break;
                    }
                } else if (board[y][x] === 0) {
                    if (isValid(x - 1, y) && board[y][x - 1] === 0) {
                        break;
                    }
                } else if (isValid(_x + 1, y) && board[y][_x + 1] === -1) {
                    isBreak = true;
                    break;
                }
            }
        }

        //좌측
        x = _x
        for (let i = 1; i < 15; i++) {
            x -= 1;
            if (isValid(x, y)) {
                if (board[y][x] === 1) {
                    leftCnt += 1;
                    //console.log("leftCnt:", x, y)
                    if ((isValid(x - 1, y) && board[y][x - 1] === -1) || !isValid(x - 1, y)) {
                        leftCnt = 0;
                        isBreak = true;
                        break;
                    }
                } else if (board[y][x] === 0) {
                    if (isValid(x + 1, y) && board[y][x + 1] === 0) {
                        break;
                    }
                } else if (isValid(_x - 1, y) && board[y][_x - 1] === -1) {
                    isBreak = true;
                    break;
                }
            }
        }

        //console.log(rightCnt, leftCnt);
        let is = board[_y][_x] === 1 ? 1 : 0;
        if (rightCnt + leftCnt + is === 3 && !isBreak) {
            //console.log("가로 3 됨");
            hor3 = true;
        }
    }

    {
        //세로 방향 체크
        let x = _x;
        let y = _y;
        let downCnt = 0;
        let upCnt = 0;

        //막혔냐?
        let isBreak = false;

        //아래
        for (let i = 1; i < 15; i++) {
            y += 1;
            if (isValid(x, y)) {
                if (board[y][x] === 1) {
                    downCnt += 1;
                    //console.log("downCnt:", x, y)
                    if ((isValid(x, y + 1) && board[y + 1][x] === -1) || !isValid(x, y + 1)) {
                        downCnt = 0;
                        isBreak = true;
                        break;
                    }
                } else if (board[y][x] === 0) {
                    if (isValid(x, y - 1) && board[y - 1][x] === 0) {
                        break;
                    }
                } else if (isValid(x, _y + 1) && board[_y + 1][x] === -1) {
                    isBreak = true;
                    break;
                }
            }
        }

        //위
        y = _y
        for (let i = 1; i < 15; i++) {
            y -= 1;
            if (isValid(x, y)) {
                if (board[y][x] === 1) {
                    upCnt += 1;
                    //console.log("upCnt:", x, y)
                    if ((isValid(x, y - 1) && board[y - 1][x] === -1) || !isValid(x, y - 1)) {
                        upCnt = 0;
                        isBreak = true;
                        break;
                    }
                } else if (board[y][x] === 0) {
                    if (isValid(x, y + 1) && board[y + 1][x] === 0) {
                        break;
                    }
                } else if (isValid(x, _y - 1) && board[_y - 1][x] === -1) {
                    isBreak = true;
                    break;
                }
            }
        }

        //console.log(downCnt, upCnt);
        let is = board[_y][_x] === 1 ? 1 : 0;
        if (downCnt + upCnt + is === 3 && !isBreak) {
            //console.log("세로 3 됨");
            ver3 = true;
        }
    }

    {
        //오른쪽 아래로 대각선 확인
        let x = _x; //+1
        let y = _y; //+1 
        let rightDownCnt = 0;
        let leftUpCnt = 0;

        //막혔냐?
        let isBreak = false;

        // 오른쪽 아래
        for (let i = 1; i < 15; i++) {
            x += 1;
            y += 1;
            if (isValid(x, y)) {
                if (board[y][x] === 1) {
                    rightDownCnt += 1;
                    //console.log("rightDownCnt:", x, y)
                    if ((isValid(x + 1, y + 1) && board[y + 1][x + 1] === -1) || !isValid(x + 1, y + 1)) {
                        rightDownCnt = 0;
                        isBreak = true;
                        break;
                    }
                } else if (board[y][x] === 0) {
                    if (isValid(x - 1, y - 1) && board[y - 1][x - 1] === 0) {
                        break;
                    }
                } else if (isValid(_x + 1, _y + 1) && board[_y + 1][_x + 1] === -1) {
                    isBreak = true;
                    break;
                }
            }
        }

        // 왼쪽 위
        x = _x
        y = _y
        for (let i = 1; i < 15; i++) {
            x -= 1;
            y -= 1;
            if (isValid(x, y)) {
                if (board[y][x] === 1) {
                    leftUpCnt += 1;
                    //console.log("leftUpCnt:", x, y)
                    if ((isValid(x - 1, y - 1) && board[y - 1][x - 1] === -1) || !isValid(x - 1, y - 1)) {
                        leftUpCnt = 0;
                        isBreak = true;
                        break;
                    }
                } else if (board[y][x] === 0) {
                    if (isValid(x + 1, y + 1) && board[y + 1][x + 1] === 0) {
                        break;
                    }
                } else if (isValid(_x - 1, _y - 1) && board[_y - 1][_x - 1] === -1) {
                    isBreak = true;
                    break;
                }
            }
        }

        //console.log(rightDownCnt, leftUpCnt);
        let is = board[_y][_x] === 1 ? 1 : 0;
        if (rightDownCnt + leftUpCnt + is === 3 && !isBreak) {
            //console.log("오른쪽 아래로 대각선 3 됨");
            downDia3 = true;
        }
    }

    {
        //오른쪽 위로 대각선 확인 (왼쪽 아래로)
        let x = _x; // +1, -1
        let y = _y; // -1, +1  
        let rightUpCnt = 0;
        let leftDownCnt = 0;

        //막혔냐?
        let isBreak = false;

        //오른쪽 위
        for (let i = 1; i < 15; i++) {
            x += 1;
            y -= 1;
            if (isValid(x, y)) {
                if (board[y][x] === 1) {
                    rightUpCnt += 1;
                    //console.log("rightUpCnt:", x, y)
                    if ((isValid(x + 1, y - 1) && board[y - 1][x + 1] === -1) || !isValid(x + 1, y - 1)) {
                        rightUpCnt = 0;
                        isBreak = true;
                        break;
                    }
                } else if (board[y][x] === 0) {
                    if (isValid(x - 1, y + 1) && board[y + 1][x - 1] === 0) {
                        break;
                    }
                } else if (isValid(_x + 1, _y - 1) && board[_y - 1][_x + 1] === -1) {
                    isBreak = true;
                    break;
                }
            }
        }

        //왼쪽 아래
        x = _x
        y = _y
        for (let i = 1; i < 15; i++) {
            x -= 1;
            y += 1;
            if (isValid(x, y)) {
                if (board[y][x] === 1) {
                    leftDownCnt += 1;
                    //console.log("leftDownCnt:", x, y)
                    if ((isValid(x - 1, y + 1) && board[y + 1][x - 1] === -1) || !isValid(x - 1, y + 1)) {
                        leftDownCnt = 0;
                        isBreak = true;
                        break;
                    }
                } else if (board[y][x] === 0) {
                    if (isValid(x + 1, y - 1) && board[y - 1][x + 1] === 0) {
                        break;
                    }
                } else if (isValid(_x - 1, _y + 1) && board[_y + 1][_x - 1] === -1) {
                    isBreak = true;
                    break;
                }
            }
        }

        //console.log(rightUpCnt, leftDownCnt);
        let is = board[_y][_x] === 1 ? 1 : 0;
        if (rightUpCnt + leftDownCnt + is === 3 && !isBreak) {
            //console.log("오른쪽 위로 대각선 3 됨");
            upDia3 = true;
        }
    }

    if ((hor3 ? 1 : 0) + (ver3 ? 1 : 0) + (downDia3 ? 1 : 0) + (upDia3 ? 1 : 0) >= 2) {
        console.log(hor3, ver3, downDia3, upDia3)
        return false;
    }

    return true;
}

/** check 44 */
const is44 = (_x: number, _y: number, board: number[][], isBlack: TurnMap<boolean>): boolean => {
    if (isBlack === "White") {
        return true;
    }

    let hor4 = false;
    let ver4 = false;
    let downDia4 = false;
    let upDia4 = false;

    {
        // 가로
        let x = _x;
        let y = _y;
        let rightCnt = 0;
        let leftCnt = 0;

        //우측
        for (let i = 1; i < SIZE; i++) {
            x += 1;
            if (isValid(x, y)) {
                if (board[y][x] === 1) {
                    rightCnt += 1;
                    //console.log("rightCnt:", x, y)
                    if ((isValid(x + 1, y) && board[y][x + 1] === -1) || !isValid(x + 1, y)) {
                        break;
                    } else if (board[y][x] === 0) {
                        if (isValid(x - 1, y) && board[y][x - 1] === 0) {
                            break;
                        }
                    } else if (isValid(_x + 1, y) && board[y][_x + 1] === -1) {
                        break;
                    }
                }
            }
        }

        x = _x
        //좌측
        for (let i = 1; i < SIZE; i++) {
            x -= 1;
            if (isValid(x, y)) {
                if (board[y][x] === 1) {
                    leftCnt += 1;
                    //console.log("leftCnt:", x, y)
                    if ((isValid(x - 1, y) && board[y][x - 1] === -1) || !isValid(x - 1, y)) {
                        break;
                    } else if (board[y][x] === 0) {
                        if (isValid(x + 1, y) && board[y][x + 1] === 0) {
                            break;
                        }
                    } else if (isValid(_x - 1, y) && board[y][_x - 1] === -1) {
                        break;
                    }
                }
            }
        }

        //console.log(rightCnt, leftCnt);
        let is = board[_y][_x] === 1 ? 1 : 0;
        if (rightCnt + leftCnt + is === 4) {
            hor4 = true;
            //console.log("가로 4됨");
        }
    }

    {
        //세로
        let x = _x;
        let y = _y;
        let downCnt = 0;
        let upCnt = 0;

        //아래
        for (let i = 1; i < SIZE; i++) {
            y += 1;
            if (isValid(x, y)) {
                if (board[y][x] === 1) {
                    downCnt += 1;
                    //console.log("downCnt:", x, y)
                    if ((isValid(x, y + 1) && board[y + 1][x] === -1) || !isValid(x, y + 1)) {
                        break;
                    } else if (board[y][x] === 0) {
                        if (isValid(x, y - 1) && board[y - 1][x] === 0) {
                            break;
                        }
                    } else if (isValid(_x, _y + 1) && board[_y + 1][_x] === -1) {
                        break;
                    }
                }
            }
        }

        //위
        y = _y;
        for (let i = 1; i < SIZE; i++) {
            y -= 1;
            if (isValid(x, y)) {
                if (board[y][x] === 1) {
                    upCnt += 1;
                    //console.log("upCnt:", x, y)
                    if ((isValid(x, y - 1) && board[y - 1][x] === -1) || !isValid(x, y - 1)) {
                        break;
                    } else if (board[y][x] === 0) {
                        if (isValid(x, y + 1) && board[y + 1][x] === 0) {
                            break;
                        }
                    } else if (isValid(_x, _y - 1) && board[_y - 1][_x] === -1) {
                        break;
                    }
                }
            }
        }

        //console.log(downCnt, upCnt);
        let is = board[_y][_x] === 1 ? 1 : 0;
        if (downCnt + upCnt + is === 4) {
            ver4 = true;
            //console.log("세로 4됨");
        }
    }

    {
        //오른쪽 아래로 대각선 확인
        let x = _x; //+1
        let y = _y; //+1 
        let rightDownCnt = 0;
        let leftUpCnt = 0;

        // 오른쪽 아래
        for (let i = 1; i < 15; i++) {
            x += 1;
            y += 1;
            if (isValid(x, y)) {
                if (board[y][x] === 1) {
                    rightDownCnt += 1;
                    //console.log("rightDownCnt:", x, y)
                    if ((isValid(x + 1, y + 1) && board[y + 1][x + 1] === -1) || !isValid(x + 1, y + 1)) {
                        break;
                    }
                } else if (board[y][x] === 0) {
                    if (isValid(x - 1, y - 1) && board[y - 1][x - 1] === 0) {
                        break;
                    }
                } else if (isValid(_x + 1, _y + 1) && board[_y + 1][_x + 1] === -1) {
                    break;
                }
            }
        }

        // 왼쪽 위
        x = _x;
        y = _y;

        for (let i = 1; i < 15; i++) {
            x -= 1;
            y -= 1;
            if (isValid(x, y)) {
                if (board[y][x] === 1) {
                    leftUpCnt += 1;
                    //console.log("leftUpCnt:", x, y)
                    if ((isValid(x - 1, y - 1) && board[y - 1][x - 1] === -1) || !isValid(x - 1, y - 1)) {
                        break;
                    }
                } else if (board[y][x] === 0) {
                    if (isValid(x + 1, y + 1) && board[y + 1][x + 1] === 0) {
                        break;
                    }
                } else if (isValid(_x - 1, _y - 1) && board[_y - 1][_x - 1] === -1) {
                    break;
                }
            }
        }

        //console.log(rightDownCnt, leftUpCnt);
        let is = board[_y][_x] === 1 ? 1 : 0;
        if (rightDownCnt + leftUpCnt + is === 4) {
            downDia4 = true;
            //console.log("오른쪽 아래로 대각선 4 됨");
        }
    }

    {
        //오른쪽 위로 대각선 확인 (왼쪽 아래로)
        let x = _x; // +1, -1
        let y = _y; // -1, +1  
        let rightUpCnt = 0;
        let leftDownCnt = 0;

        //오른쪽 위
        for (let i = 1; i < 15; i++) {
            x += 1;
            y -= 1;
            if (isValid(x, y)) {
                if (board[y][x] === 1) {
                    rightUpCnt += 1;
                    //console.log("rightUpCnt:", x, y)
                    if ((isValid(x + 1, y - 1) && board[y - 1][x + 1] === -1) || !isValid(x + 1, y - 1)) {
                        break;
                    }
                } else if (board[y][x] === 0) {
                    if (isValid(x - 1, y + 1) && board[y + 1][x - 1] === 0) {
                        break;
                    }
                } else if (isValid(_x + 1, _y - 1) && board[_y - 1][_x + 1] === -1) {
                    break;
                }
            }
        }

        //왼쪽 아래
        x = _x
        y = _y
        for (let i = 1; i < 15; i++) {
            x -= 1;
            y += 1;
            if (isValid(x, y)) {
                if (board[y][x] === 1) {
                    leftDownCnt += 1;
                    //console.log("leftDownCnt:", x, y)
                    if ((isValid(x - 1, y + 1) && board[y + 1][x - 1] === -1) || !isValid(x - 1, y + 1)) {
                        break;
                    }
                } else if (board[y][x] === 0) {
                    if (isValid(x + 1, y - 1) && board[y - 1][x + 1] === 0) {
                        break;
                    }
                } else if (isValid(_x - 1, _y + 1) && board[_y + 1][_x - 1] === -1) {
                    break;
                }
            }
        }

        //console.log(rightUpCnt, leftDownCnt);
        let is = board[_y][_x] === 1 ? 1 : 0;
        if (rightUpCnt + leftDownCnt + is === 4) {
            //console.log("오른쪽 위로 대각선 4 됨");
            upDia4 = true;
        }
    }

    if ((hor4 ? 1 : 0) + (ver4 ? 1 : 0) + (downDia4 ? 1 : 0) + (upDia4 ? 1 : 0) >= 2) {
        console.log(hor4, ver4, downDia4, upDia4)
        return false;
    }

    return true
}

const isWin = (_x: number, _y: number, board: number[][], isBlack: boolean): boolean => {
    let curTurn = isBlack ? 1 : -1;
    let win = false;
    /**
     * 1 3 5
     * 7 * 8
     * 6 4 2
     */
    const dx = [-1, 1, 0, 0, 1, -1, -1, 1];
    const dy = [-1, 1, -1, 1, -1, 1, 0, 0];

    let curPosCnt = board[_y][_x] === curTurn ? 1 : 0
    let cnt1 = 0;
    let cnt2 = 0;
    for(let i = 0; i < 8; i++) {
        let x = _x;
        let y = _y;

        while(isValid(x, y) && board[y][x] === curTurn) {
            if(i%2 === 0) {
                cnt1 += 1;
            } else {
                cnt2 += 1;
            }

            x += dx[i];
            y += dy[i];
        }

        if(-curPosCnt + cnt1 + cnt2 === 5 || (curTurn === -1 && -curPosCnt + cnt1 + cnt2 === 6)) {
            win = true;
            break;
        }
        if(i%2 === 1) {
            cnt1 = 0;
            cnt2 = 0;
        }
    }

    if(win) {
        return true;
    }
    return false;
}

export { is33, is44, isWin };