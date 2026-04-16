import React, { useState, useEffect, useCallback } from "react";
import * as S from "../style/StudyRoomStyle";
import AxiosApi from "../api/AxiosApi";

const Block = ({ seats, config, onSeatClick }) => {
  if (!config) return <></>;
  return (
    <S.Grid cols={config.c}>
      {seats.map((seat) => (
        <S.Seat
          key={seat.seatNum}
          // Styled-components에 상태 전달
          $is_occupied={seat.is_occupied}
          onClick={() => onSeatClick(seat)}
        >
          {seat.seatNum}
        </S.Seat>
      ))}
    </S.Grid>
  );
};

const StudyRoom = () => {
  // 전체 좌석(224개) 초기화
  const [allSeats, setAllSeats] = useState(
    Array.from({ length: 224 }, (_, i) => ({
      roomId: i < 112 ? 1 : 2,
      seatNum: i + 1,
      is_occupied: false,
    })),
  );

  const [currentRoom, setCurrentRoom] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [selectedTime, setSelectedTime] = useState(1);

  // 1. 서버에서 현재 열람실 좌석 현황 불러오기
  const fetchSeatStatus = useCallback(async () => {
    try {
      const response = await AxiosApi.getStudyRoomStatus(currentRoom);
      const resData = response.data;

      // 백엔드 ApiResponse 구조가 달라도 모두 통과되도록 유연한 성공 체크
      const isSuccess =
        resData.status === "SUCCESS" ||
        resData.code === 200 ||
        resData.message?.includes("불러왔습니다") ||
        Array.isArray(resData.data);

      if (isSuccess && Array.isArray(resData.data)) {
        const dbData = resData.data; // 사용 중인 좌석 리스트

        setAllSeats((prev) =>
          prev.map((seat) => {
            // DB에서 넘어온 사용 중인 좌석 번호와 일치하는지 확인
            const found = dbData.find(
              (d) => Number(d.seatNum) === Number(seat.seatNum),
            );
            if (found) return { ...seat, is_occupied: true };
            if (seat.roomId === currentRoom)
              return { ...seat, is_occupied: false };
            return seat;
          }),
        );
      }
    } catch (e) {
      console.error("데이터 로드 실패", e);
    }
  }, [currentRoom]);

  useEffect(() => {
    fetchSeatStatus();
  }, [fetchSeatStatus]);

  // ★ 실시간 카운트 동기화 로직 (allSeats 상태 변화 감지)
  const totalUsed = allSeats.filter((s) => s.is_occupied === true).length;
  const totalEmpty = 224 - totalUsed;

  const currentSeats =
    currentRoom === 1 ? allSeats.slice(0, 112) : allSeats.slice(112, 224);

  // 2. 예약 진행 및 즉각적인 UI 반영
  const handleConfirm = async () => {
    const savedData = localStorage.getItem("loginUser");

    if (!savedData) {
      alert("로그인 정보가 없습니다. 다시 로그인해주세요.");
      return;
    }

    const parsed = JSON.parse(savedData);
    const userId = parsed.userId;

    // --- 시간 포맷 수정 구간 시작 ---
    const now = new Date();
    // 로컬 시간(한국 시간)을 기준으로 ISO 문자열 생성
    const offset = now.getTimezoneOffset() * 60000;
    const localISOTime = new Date(now - offset).toISOString();

    // 백엔드 LocalDateTime 기본 인식 포맷인 "yyyy-MM-ddTHH:mm:ss" 형태로 전달
    // .split(".")[0] 까지만 하면 "2026-04-15T14:30:59" 형태가 됩니다.
    const startTime = localISOTime.split(".")[0];
    // --- 시간 포맷 수정 구간 끝 ---

    const seatData = {
      roomId: currentRoom,
      seatNum: selectedSeat,
      usageTime: parseInt(selectedTime),
      startTime: startTime,
    };

    console.log("전송 데이터 확인:", seatData); // "2026-04-15T14:24:03" 형태여야 함

    try {
      const res = await AxiosApi.assignSeat(userId, seatData);
      const resData = res.data;

      // 어떤 응답 형태든 성공으로 인식하도록 보완
      const isSuccess =
        resData.status === "SUCCESS" ||
        resData.code === 200 ||
        resData.message?.includes("완료");

      if (isSuccess) {
        // ★ 가장 중요한 핵심: 통신 성공 즉시 리액트 화면 상태를 강제로 바꿈 (DB 동기화 대기 X)
        setAllSeats((prev) =>
          prev.map((s) =>
            Number(s.seatNum) === Number(selectedSeat)
              ? { ...s, is_occupied: true } // 여기서 색상과 카운트를 바로 올림
              : s,
          ),
        );

        alert(`${selectedSeat}번 좌석 예약이 완료되었습니다.`);
        setIsModalOpen(false); // 모달 닫기
        // 주의: 여기서 fetchSeatStatus()를 부르지 않아야 이전 데이터로 덮어씌워지는 버그를 막습니다.
      } else {
        alert(resData.message || "예약에 실패했습니다.");
      }
    } catch (e) {
      console.error("통신 에러", e);
      alert("서버 통신 에러가 발생했습니다.");
    }
  };

  const openModal = (seat) => {
    if (seat.is_occupied) {
      alert("이미 사용 중인 좌석입니다.");
      return;
    }
    setSelectedSeat(seat.seatNum);
    setIsModalOpen(true);
  };

  const layout = [
    { left: { r: 2, c: 5 }, right: { r: 2, c: 4 } },
    { left: { r: 2, c: 6 }, right: { r: 2, c: 4 } },
    { left: { r: 2, c: 5 }, right: null },
    { left: { r: 2, c: 6 }, right: { r: 2, c: 5 } },
    { left: { r: 2, c: 5 }, right: { r: 2, c: 5 } },
    { left: { r: 2, c: 6 }, right: { r: 2, c: 5 } },
  ];

  let blockPointer = 0;

  return (
    <S.PageWrapper>
      <S.StatusBoard>
        <S.BoardTitle>전체 좌석현황</S.BoardTitle>
        <S.StatusItem color="#389e0d">
          {totalEmpty}
          <small>전체 빈 좌석</small>
        </S.StatusItem>
        <S.StatusItem color="#cf1322">
          {totalUsed}
          <small>전체 이용 중</small>
        </S.StatusItem>
        <S.StatusItem color="#333">
          224<small>전체 좌석 수</small>
        </S.StatusItem>
      </S.StatusBoard>

      <S.ContentCard>
        <S.TabGroup>
          <S.Tab active={currentRoom === 1} onClick={() => setCurrentRoom(1)}>
            제1 열람실
          </S.Tab>
          <S.Tab active={currentRoom === 2} onClick={() => setCurrentRoom(2)}>
            제2 열람실
          </S.Tab>
        </S.TabGroup>

        <S.SeatLayout>
          {layout.map((row, idx) => {
            const leftCount = row.left ? row.left.r * row.left.c : 0;
            const rightCount = row.right ? row.right.r * row.right.c : 0;

            const leftSeats = currentSeats.slice(
              blockPointer,
              blockPointer + leftCount,
            );
            blockPointer += leftCount;

            const rightSeats = currentSeats.slice(
              blockPointer,
              blockPointer + rightCount,
            );
            blockPointer += rightCount;

            return (
              <S.Row key={idx}>
                <Block
                  seats={leftSeats}
                  config={row.left}
                  onSeatClick={openModal}
                />
                <Block
                  seats={rightSeats}
                  config={row.right}
                  onSeatClick={openModal}
                />
              </S.Row>
            );
          })}
        </S.SeatLayout>
      </S.ContentCard>

      {isModalOpen && (
        <S.ModalOverlay>
          <S.ModalContent>
            <h3 style={{ marginTop: 0 }}>좌석 배정</h3>
            <p>
              선택하신 좌석: <strong>{selectedSeat}번</strong>
            </p>
            <S.Select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
            >
              <option value={1}>1시간</option>
              <option value={2}>2시간</option>
              <option value={3}>3시간</option>
            </S.Select>
            <S.ButtonGroup>
              <S.Button onClick={() => setIsModalOpen(false)}>취소</S.Button>
              <S.Button primary onClick={handleConfirm}>
                배정 확인
              </S.Button>
            </S.ButtonGroup>
          </S.ModalContent>
        </S.ModalOverlay>
      )}
    </S.PageWrapper>
  );
};

export default StudyRoom;
