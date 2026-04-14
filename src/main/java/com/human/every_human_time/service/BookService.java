package com.human.every_human_time.service;

import com.human.every_human_time.dto.request.BookReqDto;
import com.human.every_human_time.dto.response.BookResDto;
import com.human.every_human_time.entity.Book;
import com.human.every_human_time.entity.User;
import com.human.every_human_time.repository.BookRepository;
import com.human.every_human_time.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Slf4j @Service @RequiredArgsConstructor @Transactional
public class BookService {

    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    /** TODO: 책 등록 */
    public BookResDto saveBook(Long userId, BookReqDto dto) {
        // TODO: 유저 조회 →
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));
        //  Book 엔티티 생성 →
        Book book = Book.builder()
                .user(user)
                .title(dto.getTitle())
                .author(dto.getAuthor())
                .description(dto.getDescription())
                .bookCondition(dto.getBookCondition())
                .price(dto.getPrice())
                .imageUrl(dto.getImageUrl())
                .status("판매중")
                .build();

        //  저장 →
        Book saved = bookRepository.save(book);
        //  BookResDto 반환
        log.info("책 등록 완료: bookId={}, userId={}",
                saved.getBookId(), userId);

        return BookResDto.from(saved);
    }

    /** TODO: 판매 중인 책 목록 조회 */
    @Transactional(readOnly = true)
    public List<BookResDto> getBookList() {
        // TODO: findByStatusOrderByCreatedAtDesc("판매중") 사용
        return bookRepository.findByStatusOrderByCreatedAtDesc("판매중")
                .stream()
                .map(BookResDto::from)
                .toList();
    }

    /** TODO: 책 상세 조회 */
    @Transactional(readOnly = true)
    public BookResDto getBook(Long bookId) {
        // TODO: findById() 사용
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new IllegalArgumentException("책이 존재하지 않습니다."));

        return BookResDto.from(book);
    }

    /** TODO: 제목 검색 */
    @Transactional(readOnly = true)
    public List<BookResDto> searchBook(String keyword) {
        // TODO: findByTitleContainingOrderByCreatedAtDesc() 사용
        return bookRepository.findByTitleContainingOrderByCreatedAtDesc(keyword)
                .stream()
                .map(BookResDto::from)
                .toList();
    }

    /** TODO: 판매 완료 처리 */
    public BookResDto completeBook(Long bookId, Long userId) {
        // TODO: findById() →
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new IllegalArgumentException("책이 존재하지 않습니다."));
        //  userId 검증 →
        if (!book.getUser().getUserId().equals(userId)) {
            throw new IllegalArgumentException("판매 완료 권한이 없습니다.");
        }
        //  status = "판매완료" →
        book.setStatus("판매완료");
        //  저장
        Book saved = bookRepository.save(book);
        log.info("판매 완료 처리: bookId={}", bookId);
        return BookResDto.from(saved);
    }

    /** TODO: 책 삭제 */
    public void deleteBook(Long bookId, Long userId) {
        // TODO: findById() →
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new IllegalArgumentException("책이 존재하지 않습니다."));
        //  userId 검증 →
        if (!book.getUser().getUserId().equals(userId)) {
            throw new IllegalArgumentException("삭제 권한이 없습니다.");
        }
        //  delete()
            bookRepository.delete(book);
            log.info("책 삭제 완료: bookId={}", bookId);
    }
}
