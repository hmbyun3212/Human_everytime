package com.human.every_human_time.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter; import lombok.NoArgsConstructor; import lombok.Setter;

@Getter @Setter @NoArgsConstructor
@Schema(description = "중고책 등록 요청 DTO")
public class BookReqDto {
    @Schema(example = "자료구조론") private String title;
    @Schema(example = "홍길동") private String author;
    @Schema(example = "깨끗하게 사용했습니다.") private String description;
    @Schema(description = "책 상태 (상/중/하)", example = "상") private String bookCondition;
    @Schema(example = "15000") private Integer price;
    @Schema(description = "책 이미지 URL") private String imageUrl;
}
