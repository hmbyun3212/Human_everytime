// src/component/Layout.js
import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import {
  Header,
  LogoContainer,
  UserInfoArea,
  Wrapper,
  Sidebar,
  UniversityName,
  MenuList,
  MainContent,
  ContentCard,
} from "../style/LayoutStyle"; // 스타일 컴포넌트 import

const Layout = () => {
  const navigate = useNavigate();

  // 로그인 상태에 따라 변경될 수 있는 회원 정보
  const userName = "홍길동";

  const handleLogout = () => {
    // 로그아웃 로직 추가 (예: localStorage 삭제 등)
    navigate("/"); // 로그인 화면으로 이동
  };

  return (
    <>
      {/* 1. 상단 헤더 Area */}
      <Header>
        <LogoContainer>
          {/ 실제 로고 경로로 수정하세요 /}
          <span>에브리휴먼타임</span>
        </LogoContainer>
        <UserInfoArea>
          <span>{userName}님</span>
          <span> / </span>
          <Link to="/" onClick={handleLogout}>
            로그아웃
          </Link>
        </UserInfoArea>
      </Header>

      {/ 2. 하단 전체 Wrapper (Sidebar + Main) /}
      <Wrapper>
        {/ 3. 좌측 사이드바 Area /}
        <Sidebar>
          <UniversityName>휴먼 대학교</UniversityName>
          <MenuList>
            <li>
              <Link to="/home">시간표</Link>
            </li>
            <li>
              <Link to="/board">게시판</Link>
            </li>
            <li>
              <Link to="/calculator">학점계산기</Link>
            </li>
            <li>
              <Link to="/library">열람실 예약</Link>
            </li>
            <li>
              <Link to="/bookstore">책방</Link>
            </li>
            <li>
              <Link to="/sudoku">스도쿠</Link>
            </li>
          </MenuList>
        </Sidebar>

        {/ 4. 중앙 콘텐츠 Area /}
        <MainContent>
          <ContentCard>
            <Outlet /> {/ 라우터에 따라 실제 페이지 컴포넌트가 들어가는 곳 */}
          </ContentCard>
        </MainContent>
      </Wrapper>
    </>
  );
};

export default Layout;
