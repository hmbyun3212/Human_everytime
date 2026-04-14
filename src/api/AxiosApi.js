import axios from "axios";

// ===== 서버 주소 설정 =====
const BASE_URL = "http://192.168.0.160:8112";

const AxiosApi = {
  // ==========================================
  //  Auth - 회원가입 / 로그인
  // ==========================================
  checkEmail: async (email) => {
    return await axios.get(`${BASE_URL}/api/auth/check-email?email=${email}`);
  },

  signUp: async (email, password, name, major, year) => {
    return await axios.post(`${BASE_URL}/api/auth/signup`, {
      email, password, name, major, year,
    });
  },

  login: async (email, password) => {
    return await axios.post(`${BASE_URL}/api/auth/login`, {
      email, password,
    });
  },

  // ==========================================
  //  User - 회원 정보 조회 / 수정
  // ==========================================
  getUser: async (userId) => {
    return await axios.get(`${BASE_URL}/api/users/${userId}`);
  },

  updateUser: async (userId, name, password, major, year) => {
    return await axios.put(`${BASE_URL}/api/users/${userId}`, {
      name, password, major, year,
    });
  },

  // ==========================================
  //  Post - 게시글 CRUD
  // ==========================================
  getPostList: async () => {
    return await axios.get(`${BASE_URL}/api/posts`);
  },

  getPost: async (postId) => {
    return await axios.get(`${BASE_URL}/api/posts/${postId}`);
  },

  getMyPostList: async (userId) => {
    return await axios.get(`${BASE_URL}/api/posts/my/${userId}`);
  },

  searchPost: async (keyword) => {
    return await axios.get(`${BASE_URL}/api/posts/search?keyword=${keyword}`);
  },

  getPostListByCategory: async (category) => {
    return await axios.get(`${BASE_URL}/api/posts/category/${category}`);
  },

  writePost: async (userId, title, content, category) => {
    return await axios.post(`${BASE_URL}/api/posts`, {
      userId, title, content, category: category || null,
    });
  },

  updatePost: async (postId, userId, title, content, category) => {
    return await axios.put(`${BASE_URL}/api/posts/${postId}`, {
      userId, title, content, category: category || null,
    });
  },

  deletePost: async (postId, userId) => {
    return await axios.delete(`${BASE_URL}/api/posts/${postId}?userId=${userId}`);
  },

  // ==========================================
  //  Comment - 댓글 CRUD
  // ==========================================
  getCommentList: async (postId) => {
    return await axios.get(`${BASE_URL}/api/posts/${postId}/comments`);
  },

  writeComment: async (postId, userId, content) => {
    return await axios.post(`${BASE_URL}/api/posts/${postId}/comments`, {
      userId, content,
    });
  },

  updateComment: async (postId, commentId, userId, content) => {
    return await axios.put(`${BASE_URL}/api/posts/${postId}/comments/${commentId}`, {
      userId, content
    });
  },

  deleteComment: async (postId, commentId, userId) => {
    return await axios.delete(`${BASE_URL}/api/posts/${postId}/comments/${commentId}?userId=${userId}`);
  },

   // ==========================================
   //  Schedule - 시간표 CRUD (새로 추가됨)
   // ==========================================

   getTimetable: async (userId) => {
     return await axios.get(`${BASE_URL}/api/timetable/${userId}`);
   },
   addTimetable: async (userId, data) => {
     return await axios.post(`${BASE_URL}/api/timetable/${userId}`, data);
   },
   deleteTimetable: async (timetableId) => {
     return await axios.delete(`${BASE_URL}/api/timetable/${timetableId}`);
   },



  // ==========================================
  //  Book - 중고책 마켓 CRUD (새로 추가됨)
  // ==========================================

  // [GET] 판매 중인 책 목록 조회
  getBookList: async () => {
    return await axios.get(`${BASE_URL}/api/books`);
  },

  // [GET] 책 상세 조회
  getBookDetail: async (bookId) => {
    return await axios.get(`${BASE_URL}/api/books/${bookId}`);
  },

  // [GET] 제목으로 책 검색
  searchBooks: async (keyword) => {
    return await axios.get(`${BASE_URL}/api/books/search?keyword=${keyword}`);
  },

  // [POST] 책 등록
  writeBook: async (userId, bookData) => {
    return await axios.post(`${BASE_URL}/api/books/${userId}`, {
      title: bookData.title,
      author: bookData.author,
      description: bookData.desc,   // 화면의 desc -> 백엔드 description
      bookCondition: bookData.cond, // 화면의 cond -> 백엔드 bookCondition
      price: parseInt(bookData.price),
      origPrice: parseInt(bookData.origPrice),
      imageUrl: bookData.img,       // 화면의 img -> 백엔드 imageUrl
    });
  },

  // [PUT] 판매 완료 처리
  completeBook: async (bookId) => {
    return await axios.put(`${BASE_URL}/api/books/${bookId}/complete`);
  },

  // [DELETE] 책 삭제
  deleteBook: async (bookId) => {
    return await axios.delete(`${BASE_URL}/api/books/${bookId}`);
  },
};

export default AxiosApi;