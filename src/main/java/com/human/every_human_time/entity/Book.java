package com.human.every_human_time.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * 중고책 마켓 엔티티
 * User(N:1) 관계
 * TODO: BookService 메서드를 구현하세요.
 */
@Entity @Table(name = "books")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder @ToString
public class Book {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "book_id") private Long bookId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;              // 판매자

    @Column(nullable = false, length = 100)
    private String title;           // 책 제목

    @Column(nullable = false, length = 100)
    private String author;          // 저자

    @Lob
    private String description;     // 책 설명

    @Column(name = "book_condition", nullable = false, length = 20)
    private String bookCondition;   // 책 상태 (예: 상/중/하)

    @Column(nullable = false)
    private Integer price;          // 판매 가격

    @Column(nullable = false, length = 20)
    @Builder.Default
    private String status = "판매중"; // 판매중 / 판매완료

    @Column(name = "image_url", length = 255)
    private String imageUrl;        // 책 이미지 URL

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist public void prePersist() { this.createdAt = LocalDateTime.now(); }
}
