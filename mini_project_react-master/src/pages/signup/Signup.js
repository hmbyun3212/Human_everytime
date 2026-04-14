import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AxiosApi from "../../api/AxiosApi";
import Input from "../../component/Input";
import Button from "../../component/Button";
import { Container, Items } from "../../style/LoginStyle";
import Modal from "../../component/Modal";

const Signup = () => {
  const navigate = useNavigate();

  // 기본 정보 상태
  const [inputPw, setInputPw] = useState("");
  const [inputConPw, setInputConPw] = useState("");
  const [inputName, setInputName] = useState("");
  const [inputEmail, setInputEmail] = useState("");

  // 2조 추가 필수 정보 상태
  const [inputMajor, setInputMajor] = useState(""); // 전공
  const [inputYear, setInputYear] = useState(""); // 학년

  // 메시지 및 유효성 상태
  const [pwMessage, setPwMessage] = useState("");
  const [conPwMessage, setConPwMessage] = useState("");
  const [mailMessage, setMailMessage] = useState("");
  const [isMail, setIsMail] = useState(false);
  const [isPw, setIsPw] = useState(false);
  const [isConPw, setIsConPw] = useState(false);
  const [isName, setIsName] = useState(false);
  const [isMajor, setIsMajor] = useState(false); // 전공 입력 여부
  const [isYear, setIsYear] = useState(false); // 학년 입력 여부

  const [modalOpen, setModalOpen] = useState(false);
  const [modalText, setModalText] = useState("");
  const closeModal = () => setModalOpen(false);

  // 이메일 변경 및 중복 체크
  const onChangeMail = (e) => {
    const currentEmail = e.target.value; // 현재 입력창의 값을 변수에 담기
    setInputEmail(e.target.value);
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    // inputEmail 대신 currentEmail을 검사하세요!
    if (!emailRegex.test(currentEmail)) {
      setMailMessage("이메일 형식이 올바르지 않습니다.");
      setIsMail(false);
    } else {
      setMailMessage("검사 중..."); // 중복 체크 전 메시지 초기화
      checkEmailDuplicate(currentEmail);
    }
  };

  const checkEmailDuplicate = async (email) => {
    try {
      const rsp = await AxiosApi.checkEmail(email);
      if (rsp.data.success && rsp.data.data) {
        setMailMessage("사용 가능한 이메일 입니다.");
        setIsMail(true);
      } else {
        setMailMessage("중복된 이메일 입니다.");
        setIsMail(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onChangePw = (e) => {
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{4,25}$/;
    setInputPw(e.target.value);
    if (!passwordRegex.test(e.target.value)) {
      setPwMessage("숫자+영문자 조합으로 4자리 이상 입력해주세요!");
      setIsPw(false);
    } else {
      setPwMessage("안전한 비밀번호에요 : )");
      setIsPw(true);
    }
  };

  const onChangeConPw = (e) => {
    setInputConPw(e.target.value);
    if (e.target.value !== inputPw) {
      setConPwMessage("비밀번호가 일치하지 않습니다.");
      setIsConPw(false);
    } else {
      setConPwMessage("비밀번호가 일치합니다. :)");
      setIsConPw(true);
    }
  };

  const onChangeName = (e) => {
    setInputName(e.target.value);
    setIsName(e.target.value.length > 0);
  };

  // 전공 및 학년 입력 핸들러
  const onChangeMajor = (e) => {
    setInputMajor(e.target.value);
    setIsMajor(e.target.value.length > 0);
  };

  const onChangeYear = (e) => {
    setInputYear(e.target.value);
    setIsYear(e.target.value.length > 0);
  };

  // 회원가입 버튼 클릭
  const onClickSignUp = async () => {
    try {
      // AxiosApi.signUp 함수에 major와 year도 함께 전달하도록 수정 필요
      const rsp = await AxiosApi.signUp(
        inputEmail,
        inputPw,
        inputName,
        inputMajor,
        inputYear,
      );
      if (rsp.data.success) {
        navigate("/");
      } else {
        setModalOpen(true);
        setModalText(rsp.data.message || "회원 가입에 실패 했습니다.");
      }
    } catch (e) {
      setModalOpen(true);
      setModalText("서버 연결 실패. 백엔드를 확인하세요.");
    }
  };

  return (
    <Container>
      <Items className="sign">
        <span>Sign Up</span>
      </Items>

      <Items className="item2">
        <Input
          type="email"
          placeholder="이메일"
          value={inputEmail}
          onChange={onChangeMail}
        />
      </Items>
      <Items className="hint">
        {inputEmail.length > 0 && (
          <span className={isMail ? "success" : "error"}>{mailMessage}</span>
        )}
      </Items>

      <Items className="item2">
        <Input
          type="password"
          placeholder="패스워드"
          value={inputPw}
          onChange={onChangePw}
        />
      </Items>
      <Items className="hint">
        {inputPw.length > 0 && (
          <span className={isPw ? "success" : "error"}>{pwMessage}</span>
        )}
      </Items>

      <Items className="item2">
        <Input
          type="password"
          placeholder="패스워드 확인"
          value={inputConPw}
          onChange={onChangeConPw}
        />
      </Items>
      <Items className="hint">
        {inputConPw.length > 0 && (
          <span className={isConPw ? "success" : "error"}>{conPwMessage}</span>
        )}
      </Items>

      <Items className="item2">
        <Input
          type="text"
          placeholder="이름"
          value={inputName}
          onChange={onChangeName}
        />
      </Items>

      {/* 2조 추가 필드: 전공 및 학년 */}
      <Items className="item2">
        <Input
          type="text"
          placeholder="전공"
          value={inputMajor}
          onChange={onChangeMajor}
        />
      </Items>
      <Items className="item2">
        <Input
          type="text"
          placeholder="학번 (예: 20260413)"
          value={inputYear}
          onChange={onChangeYear}
        />
      </Items>

      <Items className="item2">
        {/* 모든 필드가 유효해야 버튼 활성화 */}
        {isMail && isPw && isConPw && isName && isMajor && isYear ? (
          <Button enabled onClick={onClickSignUp}>
            NEXT
          </Button>
        ) : (
          <Button disabled>NEXT</Button>
        )}
      </Items>

      <Modal open={modalOpen} close={closeModal} header="오류">
        {modalText}
      </Modal>
    </Container>
  );
};

export default Signup;