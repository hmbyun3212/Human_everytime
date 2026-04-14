import React, { useState, useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
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
} from "../style/LayoutStyle";
import { FaHome, FaClipboardList, FaBook, FaRegClock } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { UserContext } from "../context/UserStore";
import AxiosApi from "../api/AxiosApi";

const Layout = () => {
  const navigate = useNavigate();
  const { loginUser, handleLogout } = useContext(UserContext);
  const [member, setMember] = useState(null);

  useEffect(() => {
    if (!loginUser) {
      navigate("/");
      return;
    }
    const getMember = async () => {
      try {
        const rsp = await AxiosApi.getUser(loginUser.userId);
        if (rsp.data.success) {
          setMember(rsp.data.data);
        }
      } catch (e) {
        console.log(e);
      }
    };
    getMember();
  }, [loginUser, navigate]);

  const onClickLogout = () => {
    handleLogout();
    navigate("/");
  };

  return (
    <>
      {/* 1. 상단 헤더 */}
      <Header>
        <LogoContainer onClick={() => navigate("/home")} style={{ cursor: "pointer" }}>
          <span>에브리휴먼타임</span>
        </LogoContainer>
        <UserInfoArea>
          <span>{member?.name || loginUser?.name}님</span>
          <span style={{ margin: "0 10px", opacity: 0.5 }}>|</span>
          <span onClick={onClickLogout} style={{ cursor: "pointer" }}>로그아웃</span>
        </UserInfoArea>
      </Header>

      <Wrapper>
        {/* 2. 좌측 사이드바 */}
        <Sidebar>
          <UniversityName>휴먼 대학교</UniversityName>
          <MenuList>
            <li>
              <div onClick={() => navigate("/home")} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <FaRegClock style={{ marginLeft: "30px", marginRight: "10px" }} />
                <span>시간표</span>
              </div>
            </li>
            <li>
              <div onClick={() => navigate("/bookMarket")} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <FaBook style={{ marginLeft: "30px", marginRight: "10px" }} />
                <span>중고책 마켓</span>
              </div>
            </li>
            <li>
              <div onClick={() => navigate("/boards")} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <FaClipboardList style={{ marginLeft: "30px", marginRight: "10px" }} />
                <span>게시판</span>
              </div>
            </li>
            <li>
              <div onClick={() => navigate("/members")} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <CgProfile style={{ marginLeft: "30px", marginRight: "10px" }} />
                <span>회원목록</span>
              </div>
            </li>
          </MenuList>
        </Sidebar>

        {/* 3. 우측 메인 콘텐츠 */}
        <MainContent>
          <ContentCard>
            <Outlet />
          </ContentCard>
        </MainContent>
      </Wrapper>
    </>
  );
};

export default Layout;