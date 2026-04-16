import React, { useState, useEffect, useCallback } from "react";
import * as S from "../style/SudokuStyle";

const Sudoku = () => {
  const [board, setBoard] = useState([]);
  const [initialBoard, setInitialBoard] = useState([]);
  const [solution, setSolution] = useState([]);
  const [selected, setSelected] = useState({ r: -1, c: -1 });
  const [hints, setHints] = useState(3);
  const [difficulty, setDifficulty] = useState("보통");

  // --- 스도쿠 생성 로직 ---
  const checkValid = (b, r, c, n) => {
    for (let i = 0; i < 9; i++)
      if (b[r][i] === n || b[i][c] === n) return false;
    let rr = Math.floor(r / 3) * 3,
      cc = Math.floor(c / 3) * 3;
    for (let i = 0; i < 3; i++)
      for (let j = 0; j < 3; j++) if (b[rr + i][cc + j] === n) return false;
    return true;
  };

  const solve = (b) => {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (b[r][c] === 0) {
          let nums = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(
            () => Math.random() - 0.5,
          );
          for (let n of nums) {
            if (checkValid(b, r, c, n)) {
              b[r][c] = n;
              if (solve(b)) return true;
              b[r][c] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  };

  const initGame = useCallback((diff = "보통") => {
    let newBoard = Array.from({ length: 9 }, () => Array(9).fill(0));
    solve(newBoard);
    const sol = newBoard.map((row) => [...row]);

    // 구멍 뚫기
    let holes = diff === "쉬움" ? 40 : diff === "보통" ? 50 : 60;
    let poked = sol.map((row) => [...row]);
    while (holes > 0) {
      let r = Math.floor(Math.random() * 9),
        c = Math.floor(Math.random() * 9);
      if (poked[r][c] !== 0) {
        poked[r][c] = 0;
        holes--;
      }
    }

    setSolution(sol);
    setInitialBoard(poked.map((row) => [...row]));
    setBoard(poked);
    setDifficulty(diff);
    setHints(3);
    setSelected({ r: -1, c: -1 });
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  // 키보드 입력 핸들러
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selected.r === -1) return;
      if (initialBoard[selected.r][selected.c] !== 0) return;

      if (e.key >= "1" && e.key <= "9") {
        updateCell(parseInt(e.key));
      } else if (e.key === "Backspace" || e.key === "Delete") {
        updateCell(0);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selected, initialBoard]);

  const updateCell = (val) => {
    const newBoard = board.map((row, rIdx) =>
      rIdx === selected.r
        ? row.map((col, cIdx) => (cIdx === selected.c ? val : col))
        : row,
    );
    setBoard(newBoard);
  };

  const handleHint = () => {
    if (
      hints > 0 &&
      selected.r !== -1 &&
      initialBoard[selected.r][selected.c] === 0
    ) {
      updateCell(solution[selected.r][selected.c]);
      setHints(hints - 1);
    }
  };

  const handleSubmit = () => {
    const isCorrect = board.every((row, r) =>
      row.every((cell, c) => cell === solution[r][c]),
    );
    alert(
      isCorrect
        ? "🎉 완벽합니다! 성공하셨어요!"
        : "❌ 틀린 부분이 있네요. 다시 확인해보세요!",
    );
  };

  return (
    <S.Container>
      <S.GameCard>
        <S.Title>스도쿠 챌린지</S.Title>

        <S.DifficultyArea>
          {["쉬움", "보통", "어려움"].map((d) => (
            <S.DiffBtn
              key={d}
              active={difficulty === d}
              onClick={() => initGame(d)}
            >
              {d}
            </S.DiffBtn>
          ))}
        </S.DifficultyArea>

        <S.SudokuGrid>
          {board.map((row, r) =>
            row.map((cell, c) => (
              <S.Cell
                key={`${r}-${c}`}
                isFixed={initialBoard[r][c] !== 0}
                isSelected={selected.r === r && selected.c === c}
                isBottomHeavy={(r + 1) % 3 === 0 && r < 8}
                isRightHeavy={(c + 1) % 3 === 0 && c < 8}
                onClick={() => setSelected({ r, c })}
              >
                {cell !== 0 ? cell : ""}
              </S.Cell>
            )),
          )}
        </S.SudokuGrid>

        <S.ActionArea>
          <S.Button onClick={handleHint}>힌트 ({hints})</S.Button>
          <S.Button onClick={handleSubmit}>정답 제출</S.Button>
          <S.Button onClick={() => initGame(difficulty)}>새 게임</S.Button>
        </S.ActionArea>
      </S.GameCard>
    </S.Container>
  );
};

export default Sudoku;
