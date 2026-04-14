import React, { useState, useEffect, useRef, useContext } from "react";
import AxiosApi from "../../api/AxiosApi";
import { UserContext } from "../../context/UserStore";
import "./BookMarket.css";

const BookMarket = () => {
  const { loginUser } = useContext(UserContext);
  const [books, setBooks] = useState([]);
  const [filter, setFilter] = useState("전체");
  const [selectedBook, setSelectedBook] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filePreview, setFilePreview] = useState(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    price: "",
    origPrice: "",
    cond: "S",
    desc: "",
    img: null,
  });

  const fetchBooks = async () => {
    try {
      const res = await AxiosApi.getBookList();
      console.log("서버 응답 데이터:", res.data);

      let rawData = [];
      if (Array.isArray(res.data)) {
        rawData = res.data;
      } else if (res.data && Array.isArray(res.data.data)) {
        rawData = res.data.data;
      }

      const mappedData = rawData.map((b) => ({
        ...b,
        img: b.imageUrl,
        desc: b.description,
        cond: b.bookCondition,
        sold: b.status === "판매완료",
      }));
      setBooks(mappedData);
    } catch (e) {
      console.error("데이터 로딩 실패:", e);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
        setFormData({ ...formData, img: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!loginUser) return alert("로그인 정보가 없습니다.");
    try {
      await AxiosApi.writeBook(loginUser.userId, formData);
      setIsModalOpen(false);
      setFilePreview(null);
      fetchBooks();
      alert("✅ 등록되었습니다.");
    } catch (e) {
      alert("등록 중 오류가 발생했습니다.");
    }
  };

  const filteredBooks = books.filter((b) => {
    if (filter === "판매중") return !b.sold;
    if (filter === "판매완료") return b.sold;
    return true;
  });

  return (
    <div className="market-shell">
      <div className="market-top">
        <h2>
          중고책 마켓{" "}
          <span className="m-cnt">
            {books.filter((b) => !b.sold).length}권 판매중
          </span>
        </h2>
        <div className="market-filters">
          {["전체", "판매중", "판매완료"].map((f) => (
            <div
              key={f}
              className={`mf-chip ${filter === f ? "on" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </div>
          ))}
        </div>
        <button className="btn-red" onClick={() => setIsModalOpen(true)}>
          + 책 판매하기
        </button>
      </div>

      <div className={`market-pane ${selectedBook ? "" : "no-detail"}`}>
        <div className="book-table-wrap">
          <table className="book-table">
            <thead>
              <tr>
                <th>책 제목</th>
                <th>저자/출판사</th>
                <th>상태</th>
                <th>판매가</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.length > 0 ? (
                filteredBooks.map((b) => (
                  <tr
                    key={b.bookId}
                    onClick={() => setSelectedBook(b)}
                    className={selectedBook?.bookId === b.bookId ? "sel" : ""}
                  >
                    <td className="td-title">
                      <div className="td-title-wrap">
                        {b.img ? (
                          <img src={b.img} className="td-thumb" alt="t" />
                        ) : (
                          <div className="td-thumb-ph">📚</div>
                        )}
                        <span className="td-title-text">{b.title}</span>
                      </div>
                    </td>
                    <td className="td-author">{b.author}</td>
                    <td>
                      {b.sold ? (
                        <span className="sold-b">판매완료</span>
                      ) : (
                        <span className={`bc ${b.cond?.toLowerCase()}`}>
                          {b.cond}
                        </span>
                      )}
                    </td>
                    <td className="td-price">{b.price?.toLocaleString()}원</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="empty-msg">
                    데이터가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {selectedBook && (
          <div className="bdp">
            <div className="bdp-head">
              <h3>상세 정보</h3>
              <button
                className="bdp-close"
                onClick={() => setSelectedBook(null)}
              >
                ×
              </button>
            </div>
            <div className="bdp-body">
              <div className="bdp-img">
                {selectedBook.img ? (
                  <img src={selectedBook.img} alt="p" />
                ) : (
                  "📚"
                )}
              </div>
              <div className="bdp-title">{selectedBook.title}</div>
              <div className="bdp-author">{selectedBook.author}</div>
              <div className="bdp-price-row">
                <span className="bdp-price">
                  {selectedBook.price?.toLocaleString()}원
                </span>
                <span className="bdp-orig">
                  {selectedBook.origPrice?.toLocaleString()}원
                </span>
              </div>
              <div className="bdp-desc">{selectedBook.desc}</div>
              {!selectedBook.sold && (
                <button
                  className="btn-red"
                  style={{ width: "100%", marginTop: "15px" }}
                  onClick={async () => {
                    await AxiosApi.completeBook(selectedBook.bookId);
                    fetchBooks();
                    setSelectedBook(null);
                  }}
                >
                  판매완료 처리
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-bg open">
          <div className="modal">
            <div className="modal-head">
              <h3>책 판매 등록</h3>
              <button
                className="modal-close"
                onClick={() => setIsModalOpen(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div
                className="img-upload-zone"
                onClick={() => fileInputRef.current.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  hidden
                  onChange={handleFileChange}
                />
                {filePreview ? (
                  <img src={filePreview} className="img-preview" alt="v" />
                ) : (
                  <span>📚 사진 추가</span>
                )}
              </div>
              <input
                placeholder="책 제목"
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
              <input
                placeholder="저자/출판사"
                onChange={(e) =>
                  setFormData({ ...formData, author: e.target.value })
                }
              />
              <div style={{ display: "flex", gap: "10px" }}>
                <input
                  type="number"
                  placeholder="정가"
                  style={{ flex: 1 }}
                  onChange={(e) =>
                    setFormData({ ...formData, origPrice: e.target.value })
                  }
                />
                <input
                  type="number"
                  placeholder="판매가"
                  style={{ flex: 1 }}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                />
              </div>
              <textarea
                placeholder="책 상태에 대한 설명을 적어주세요."
                onChange={(e) =>
                  setFormData({ ...formData, desc: e.target.value })
                }
              />
              <div className="form-foot">
                <button
                  className="btn-gray"
                  onClick={() => setIsModalOpen(false)}
                >
                  취소
                </button>
                <button className="btn-red" onClick={handleSubmit}>
                  등록하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookMarket;