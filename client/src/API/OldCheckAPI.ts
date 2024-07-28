const isValidPos = (x: number, y: number): boolean => {
  if (x >= 0 && x < 15 && y >= 0 && y < 15) {
    return true;
  }
  return false;
}

const checkBanPut = (_x: number, _y: number, _board: number[][], isBlackTurn: boolean): boolean | null => {
  // 3x3, 4x4 판단용 boolean 변수들
  {
    let hori_33 = false;  // 가로 33
    let vert_33 = false;  // 세로 33
    let ltrb_33 = false;  // 대각선↘ 33
    let rtlb_33 = false;  // 대각선↙ 33
    let hori_44 = false;  // 가로 44
    let vert_44 = false;  // 세로 44
    let ltrb_44 = false;  // 대각선↘ 44
    let rtlb_44 = false;  // 대각선↙ 44
    let x, y;
    let count_black; // 흑돌 카운팅
    let count_none;  // 빈칸 카운팅
    let count_white; // 백돌 카운팅

    /** 33판정 */
    x = _x;
    y = _y;
    count_black = 1;
    count_none = 0;
    count_white = 0;

    // 가로 우 방향
    for (let i = 1; i < 4; i++) {
      // 게임판 탈출 방지 루틴
      if (x + i > 15 - 1)
        break;
      if (_board[_y][x + i] != -1) {
        if (_board[_y][x + i] == 1) {
          count_black++;
        } else if (_board[_y][x + i] == 0) {
          count_none++;
        }
      } else if (_board[_y][x + i] == -1) {
        count_white++;
        break;
      }
      // 기본적으로 3칸까지만 카운팅 하고, 4번째 칸이 백돌일때만 추가 카운팅
      if (i == 3 && x + i + 1 < 15)
        if (_board[_y][x + i + 1] == -1)
          count_white++;
    }
    // 가로 우 방향 열린 3 여부 체킹
    let tmp_hori_33 = true;
    if (count_none <= count_white)
      tmp_hori_33 = false;

    // 가로 좌 방향
    for (let i = 1; i < 4; i++) {
      // 게임판 탈출 방지 루틴
      if (x - i < 0)
        break;
      if (_board[_y][x - i] != -1) {
        if (_board[_y][x - i] == 1) {
          count_black++;
        } else if (_board[_y][x - i] == 0) {
          count_none++;
        }
      } else if (_board[_y][x - i] == -1) {
        count_white++;
        break;
      }
      // 기본적으로 3칸까지만 카운팅 하고, 4번째 칸이 백돌일때만 추가 카운팅
      if (i == 3 && x - i - 1 > 0)
        if (_board[_y][x - i - 1] == -1)
          count_white++;
    }
    // 둘다 열린 3이면서 흑돌이 3개인 경우
    if (count_none - count_white > 3 && tmp_hori_33 && count_black == 3)
      hori_33 = true;  // 가로 방향 3x3 판정

    // 세로 방향 카운팅
    x = _x;
    y = _y;
    count_black = 1;
    count_none = 0;
    count_white = 0;

    // 세로 하 방향
    for (let i = 1; i < 4; i++) {
      // 게임판 탈출 방지 루틴
      if (y + i > 15 - 1)
        break;
      if (_board[y + i][_x] != -1) {
        if (_board[y + i][_x] == 1) {
          count_black++;
        } else if (_board[y + i][_x] == 0) {
          count_none++;
        }
      } else if (_board[y + i][_x] == -1) {
        count_white++;
        break;
      }
      // 기본적으로 3칸까지만 카운팅 하고, 4번째 칸이 백돌일때만 추가 카운팅
      if (i == 3 && y + i + 1 < 15)
        if (_board[y + i + 1][_x] == -1)
          count_white++;
    }
    // 세로 하 방향 열린 3 여부 체킹
    let tmp_vert_33 = true;
    if (count_none <= count_white)
      tmp_vert_33 = false;

    // 세로 상 방향
    for (let i = 1; i < 4; i++) {
      // 게임판 탈출 방지 루틴
      if (y - i < 0)
        break;
      if (_board[y - i][_x] != -1) {
        if (_board[y - i][_x] == 1) {
          count_black++;
        } else if (_board[y - i][_x] == 0) {
          count_none++;
        }
      } else if (_board[y - i][_x] == -1) {
        count_white++;
        break;
      }
      // 기본적으로 3칸까지만 카운팅 하고, 4번째 칸이 백돌일때만 추가 카운팅
      if (i == 3 && y - i - 1 > 0) {
        
        if (_board[y - i - 1][_x] == -1)
          count_white++;
      }
    }
    // 둘다 열린 3면서 흑돌이 3개인 경우
    if (count_none - count_white > 3 && tmp_vert_33 && count_black == 3)
      vert_33 = true;  // 세로 방향 33 판정

    // 대각선↘
    x = _x;
    y = _y;
    count_black = 1;
    count_none = 0;
    count_white = 0;

    // 대각선 우 방향
    for (let i = 1; i < 4; i++) {
      // 게임판 탈출 방지 루틴
      if (y + i > 15 - 1 || x + i > 15 - 1)
        break;
      if (_board[y + i][x + i] != -1) {
        if (_board[y + i][x + i] == 1) {
          count_black++;
        } else if (_board[y + i][x + i] == 0) {
          count_none++;
        }
      } else if (_board[y + i][x + i] == -1) {
        count_white++;
        break;
      }
      // 기본적으로 3칸까지만 카운팅 하고, 4번째 칸이 백돌일때만 추가 카운팅
      if (i == 3 && y + i + 1 < 15 && x + i + 1 < 15)
        if (_board[y + i + 1][x + i + 1] == -1)
          count_white++;
    }
    // 대각선 우 방향 열린 3 여부 체킹
    let tmp_ltrb_33 = true;
    if (count_none <= count_white)
      tmp_ltrb_33 = false;

    // 대각선 좌 방향
    for (let i = 1; i < 4; i++) {
      // 게임판 탈출 방지 루틴
      if (y - i < 0 || x - i < 0)
        break;
      if (_board[y - i][x - i] != -1) {
        if (_board[y - i][x - i] == 1) {
          count_black++;
        } else if (_board[y - i][x - i] == 0) {
          count_none++;
        }
      } else if (_board[y - i][x - i] == -1) {
        count_white++;
        break;
      }
      // 기본적으로 3칸까지만 카운팅 하고, 4번째 칸이 백돌일때만 추가 카운팅
      if (i == 3 && y - i - 1 > 0 && x - i - 1 > 0)
        if (_board[y - i - 1][x - i - 1] == -1)
          count_white++;
    }
    // 둘다 열린 3 이면서 흑돌이 3개인 경우
    if (count_none - count_white > 3 && tmp_ltrb_33 && count_black == 3)
      ltrb_33 = true;  // 대각선↘ 방향 33 판정

    // 대각선↙
    x = _x;
    y = _y;
    count_black = 1;
    count_none = 0;
    count_white = 0;

    // 대각선 좌 방향
    for (let i = 1; i < 4; i++) {
      // 게임판 탈출 방지 루틴
      if (y + i > 15 - 1 || x - i < 0)
        break;
      if (_board[y + i][x - i] != -1) {
        if (_board[y + i][x - i] == 1) {
          count_black++;
        } else if (_board[y + i][x - i] == 0) {
          count_none++;
        }
      } else if (_board[y + i][x - i] == -1) {
        count_white++;
        break;
      }
      // 기본적으로 3칸까지만 카운팅 하고, 4번째 칸이 백돌일때만 추가 카운팅
      if (i == 3 && y + i + 1 < 15 && x - i - 1 > 0)
        if (_board[y + i + 1][x - i - 1] == -1)
          count_white++;
    }
    // 대각선 좌 방향 열린 3 여부 체킹
    let tmp_rtlb_33 = true;
    if (count_none <= count_white)
      tmp_rtlb_33 = false;

    // 대각선 우 방향
    for (let i = 1; i < 4; i++) {
      // 게임판 탈출 방지 루틴
      if (y - i < 0 || x + i > 15 - 1)
        break;
      if (_board[y - i][x + i] != -1) {
        if (_board[y - i][x + i] == 1) {
          count_black++;
        } else if (_board[y - i][x + i] == 0) {
          count_none++;
        }
      } else if (_board[y - i][x + i] == -1) {
        count_white++;
        break;
      }
      // 기본적으로 3칸까지만 카운팅 하고, 4번째 칸이 백돌일때만 추가 카운팅
      if (i == 3 && y - i - 1 > 0 && x + i + 1 < 15)
        if (_board[y - i - 1][x + i + 1] == -1)
          count_white++;
    }
    // 둘다 열린 3 이면서 흑돌이 3개인 경우
    if (count_none - count_white > 3 && tmp_rtlb_33 && count_black == 3)
      rtlb_33 = true;  // 대각선↙ 방향 33 판정


    /*      4*4 판별 로직      */
    // 가로
    x = _x;
    y = _y;
    count_black = 1;
    count_none = 0;
    count_white = 0;

    for (let i = 1; i < 5; i++) {
      if (x + i > 15 - 1)
        break;
      if (_board[_y][x + i] != -1) {
        if (_board[_y][x + i] == 1) {
          count_black++;
        } else if (_board[_y][x + i] == 0) {
          count_none++;
        }
      } else if (_board[_y][x + i] == -1) {
        count_white++;
        break;
      }
    }

    for (let i = 1; i < 5; i++) {
      if (x - i < 0)
        break;
      if (_board[_y][x - i] != -1) {
        if (_board[_y][x - i] == 1) {
          count_black++;
        } else if (_board[_y][x - i] == 0) {
          count_none++;
        }
      } else if (_board[_y][x - i] == -1) {
        count_white++;
        break;
      }
    }

    // 둘다 열린 4 이면서 흑돌이 4개인 경우
    if (count_none >= count_white && count_black == 4)
      hori_44 = true;  // 가로 방향 44 판정

    // 세로
    x = _x;
    y = _y;
    count_black = 1;
    count_none = 0;
    count_white = 0;

    for (let i = 1; i < 5; i++) {
      if (y + i > 15 - 1)
        break;
      if (_board[y + i][_x] != -1) {
        if (_board[y + i][_x] == 1) {
          count_black++;
        } else if (_board[y + i][_x] == 0) {
          count_none++;
        }
      } else if (_board[y + i][_x] == -1) {
        count_white++;
        break;
      }
    }

    for (let i = 1; i < 5; i++) {
      if (y - i < 0)
        break;
      if (_board[y - i][_x] != -1) {
        if (_board[y - i][_x] == 1) {
          count_black++;
        } else if (_board[y - i][_x] == 0) {
          count_none++;
        }
      } else if (_board[y - i][_x] == -1) {
        count_white++;
        break;
      }
    }

    // 둘다 열린 4 이면서 흑돌이 4개인 경우
    if (count_none >= count_white && count_black == 4)
      vert_44 = true; // 세로 방향 44 판정

    // 대각선↘
    x = _x;
    y = _y;
    count_black = 1;
    count_none = 0;
    count_white = 0;

    for (let i = 1; i < 5; i++) {
      if (y + i > 15 - 1 || x + i > 15 - 1)
        break;
      if (_board[y + i][x + i] != -1) {
        if (_board[y + i][x + i] == 1) {
          count_black++;
        } else if (_board[y + i][x + i] == 0) {
          count_none++;
        }
      } else if (_board[y + i][x + i] == -1) {
        count_white++;
        break;
      }
    }

    for (let i = 1; i < 5; i++) {
      if (y - i < 0 || x - i < 0)
        break;
      if (_board[y - i][x - i] != -1) {
        if (_board[y - i][x - i] == 1) {
          count_black++;
        } else if (_board[y - i][x - i] == 0) {
          count_none++;
        }
      } else if (_board[y - i][x - i] == -1) {
        count_white++;
        break;
      }
    }

    // 둘다 열린 4 이면서 흑돌이 4개인 경우
    if (count_none >= count_white && count_black == 4)
      ltrb_44 = true;  // 대각선↘ 방향 44 판정

    // 대각선↙ new
    x = _x;
    y = _y;
    count_black = 1;
    count_none = 0;
    count_white = 0;

    for (let i = 1; i < 5; i++) {
      if (y + i > 15 - 1 || x - i < 0)
        break;
      if (_board[y + i][x - i] != -1) {
        if (_board[y + i][x - i] == 1) {
          count_black++;
        } else if (_board[y + i][x - i] == 0) {
          count_none++;
        }
      } else if (_board[y + i][x - i] == -1) {
        count_white++;
        break;
      }
    }

    for (let i = 1; i < 5; i++) {
      if (y - i < 0 || x + i > 15 - 1)
        break;
      if (_board[y - i][x + i] != -1) {
        if (_board[y - i][x + i] == 1) {
          count_black++;
        } else if (_board[y - i][x + i] == 0) {
          count_none++;
        }
      } else if (_board[y - i][x + i] == -1) {
        count_white++;
        break;
      }
    }

    // 둘다 열린 4 이면서 흑돌이 4개인 경우
    if (count_none >= count_white && count_black == 4)
      rtlb_44 = true;  // 대각선↙ 방향 44 판정

    // 3*3 판정 결과중 가로,세로,대각선 2개방향 중 2개이상이 해당될 경우(3*3 인 상황)
    if ((hori_33 ? 1 : 0) + (vert_33 ? 1 : 0) + (ltrb_33 ? 1 : 0) + (rtlb_33 ? 1 : 0) >= 2) { // 33 판정 결과 먼저 확인
      return false;  // 금수 처리
    }
    // 4*4 판정 결과중 가로,세로,대각선 2개방향 중 2개이상이 해당될 경우(4*4 인 상황)
    else if ((hori_44 ? 1 : 0) + (vert_44 ? 1 : 0) + (ltrb_44 ? 1 : 0) + (rtlb_44 ? 1 : 0) >= 2) {
      return false;  // 금수 처리
    }
  }


  /*      4*4 예외 판별 로직      */
  /* 위의 4*4 판별 로직에서 걸러낼수 없는 동일 축 내에서 2개의 44가 발생하는 경우 */
  /* ●●빈●●빈●● 이거랑 ●빈●●●빈● 패턴 찾아내기 */
  // 패턴 문자열 변수들


  let hori_44 = '';
  let vert_44 = '';
  let ltrb_44 = '';
  let rtlb_44 = '';

  // 가로
  // 모든 가로축에 돌들에 대해 수집
  for (let i = 0; i < 15; i++) {
    hori_44 = hori_44.concat(_board[_y][i].toString());
  }

  // 세로
  // 모든 세로축에 돌들에 대해 수집
  for (let i = 0; i < 15; i++) {
    vert_44 = vert_44.concat(_board[i][_x].toString());
  }

  // 대각선 ↘
  // 모든 대각선 ↘에 돌들에 대해 수집
  let x = _x;
  let y = _y;

  // 대각선 끝점 찾기
  while (y > 0 && x > 0) {
    y--;
    x--;
  }

  do {
    ltrb_44 = ltrb_44.concat(_board[y][x].toString());
  } while (++y < 15 && ++x < 15)

  // 대각선 ↙
  // 모든 대각선 ↙의 돌들에 대해 수집
  x = _x;
  y = _y;

  // 대각선 끝점 찾기
  while (y > 0 && x < 14) {
    y--;
    x++;
  }

  do {
    rtlb_44 = rtlb_44.concat(_board[y][x].toString());
  } while (++y < 15 && --x > 0)

  // 찾아낼 착수 패턴 문자열 변수들
  let pt1 = ('' + 1)
    + ('' + 1)
    + ('' + 0)
    + ('' + 1)
    + ('' + 1)
    + ('' + 0)
    + ('' + 1)
    + ('' + 1);

  let pt2 = ('' + 1)
    + ('' + 0)
    + ('' + 1)
    + ('' + 1)
    + ('' + 1)
    + ('' + 0)
    + ('' + 1);

  // 가로,세로,대각선2방향의 돌 정보중 패턴이 하나라도 포함될 경우, 44 예외 판정
  if (hori_44.includes(pt1) || hori_44.includes(pt2)) // 가로
    return false;  // 금수 처리
  else if (vert_44.includes(pt1) || vert_44.includes(pt2)) // 세로
    return false;
  else if (ltrb_44.includes(pt1) || ltrb_44.includes(pt2)) // 대각선↘
    return false;
  else if (rtlb_44.includes(pt1) || rtlb_44.includes(pt2)) // 대각선↙
    return false;

  /* 5,6목 이상 판별 로직 */
  // 가로
  x = _x;
  y = _y;
  let count = 0;
  // 카운팅 시작점 찾기
  while (x-- > 0 && _board[_y][x] == 1);
  // 카운팅
  while (++x < 15 && _board[_y][x] == 1)
    count++;

  // 6목 이상일 경우
  if (count > 5)
    return false;  // 금수 처리
  // 정확히 5목 일 경우
  else if (count == 5)
    return true;  // 승리 처리

  // 세로
  x = _x;
  y = _y;
  count = 0;
  // 카운팅 시작점 찾기
  while (y-- > 0 && _board[y][_x] == 1);
  // 카운팅
  while (++y < 15 && _board[y][_x] == 1)
    count++;

  if (count > 5)
    return false;
  else if (count == 5)
    return true;

  // 대각선 ↘
  x = _x;
  y = _y;
  count = 0;
  // 카운팅 시작점 찾기
  while (x-- > 0 && y-- > 0 && _board[y][x] == 1);
  // 카운팅
  while (++x < 15 && ++y < 15 && _board[y][x] == 1)
    count++;

  if (count > 5)
    return false;
  else if (count == 5)
    return true;

  // 대각선 ↙
  x = _x;
  y = _y;
  count = 0;
  // 카운팅 시작점 찾기
  while (x++ < 15 && y-- > 0 && _board[y][x] == 1);
  // 카운팅
  while (--x > 0 && ++y < 15 && _board[y][x] == 1)
    count++;

  if (count > 5)
    return false;
  else if (count == 5)
    return true;
  else if (!isBlackTurn) {
    /*      백 승리 판별 로직      */
    /* 백(후수)은 모든 금수 처리에 대해 예외이기 때문에 승리 조건만 검사 */
    // 백 승리 검사용 문자열 변수들
    let hori_win = '';
    let vert_win = '';
    let ltrb_win = '';
    let rtlb_win = '';

    // 가로
    // 가로 방향에 대해 모든 돌 정보 수집
    for (let i = 0; i < 15; i++) {
      hori_win = hori_win.concat(_board[_y][i].toString());
    }

    // 세로
    for (let i = 0; i < 15; i++) {
      vert_win = vert_win.concat(_board[i][_x].toString());
    }

    // 대각선 ↘
    x = _x;
    y = _y;

    // 대각선 끝점 선정
    while (y > 0 && x > 0) {
      y--;
      x--;
    }
    do {
      ltrb_win = ltrb_win.concat(_board[y][x].toString());
    } while (++y < 15 && ++x < 15)

    // 대각선 ↙
    x = _x;
    y = _y;

    // 대각선 끝점 선정
    while (y > 0 && x < 14) {
      y--;
      x++;
    }
    do {
      rtlb_win = rtlb_win.concat(_board[y][x].toString());
    } while (++y < 15 && --x > 0)

    // 찾아낼 착수 패턴
    let pt = ('' + -1)
      + ('' + -1)
      + ('' + -1)
      + ('' + -1)
      + ('' + -1);

    // 가로,세로,대각선2 방향 중 패턴과 하나라도 일치할 경우, 백 승리 판정
    if (hori_win.includes(pt))
      return true;
    else if (vert_win.includes(pt))
      return true;
    else if (ltrb_win.includes(pt))
      return true;
    else if (rtlb_win.includes(pt))
      return true;
  }
  // 모든 금수 로직에 걸리지 않았을 경우
  return null;  // 정상 착수 처리
}

const check_Win = (_x: number, _y: number, board: number[][], isBlackTurn: boolean): boolean => {
  const dx = [-1, 0, 1, -1, 1, -1, 0, 1];
  const dy = [-1, -1, -1, 0, 0, 1, 1, 1];
  const isWhat = isBlackTurn ? 1 : -1;

  for (let i = 0; i < 8; i++) {
    let x = _x;
    let y = _y;
    let cnt = 0;
    while (isWhat === board[y][x]) {
      cnt += 1;
      if (cnt === 5) {
        return true;
      }

      x += dx[i];
      y += dy[i];
      if (!isValidPos(x, y)) {
        break;
      }
    }
  }

  return false;
}

export { checkBanPut, check_Win };