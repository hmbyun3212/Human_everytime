import "./App.css";
import GlobalStyle from "./style/GlobalStyle";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/signup/Login";
import Signup from "./pages/signup/Signup";
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import Members from "./pages/member/Members";
import MemberInfo from "./pages/member/MemberInfo";
import UserStore from "./context/UserStore";
import ThemeSetting from "./pages/setting/ThemeSetting";
import Boards from "./pages/board/Boards";
import BoardWrite from "./pages/board/BoardWrite";
import BoardDetail from "./pages/board/BoardDetail";

function App() {
  return (
    <>
      <GlobalStyle />
      <UserStore>
        <Router>
          <Routes>
            {/* 인증 화면 */}
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* 로그인 이후 화면 (레이아웃 포함) */}
            <Route element={<Layout />}>
              <Route path="/home" element={<Home />} />
              <Route path="/members" element={<Members />} />
              <Route path="/memberInfo/:userId" element={<MemberInfo />} />
              <Route path="/themeSetting" element={<ThemeSetting />} />
              <Route path="/boards" element={<Boards />} />
              <Route path="/boardWrite" element={<BoardWrite />} />
              <Route path="/boardDetail/:postId" element={<BoardDetail />} />
            </Route>
          </Routes>
        </Router>
      </UserStore>
    </>
  );
}

export default App;